import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Helper to validate and get config (serverless-safe)
function getCloudinaryConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
        console.error('❌ Missing Cloudinary env vars. Check Vercel dashboard.');
        throw new Error('Cloudinary configuration incomplete');
    }

    return { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true };
}

cloudinary.config(getCloudinaryConfig());

export interface UploadResult {
    public_id: string;
    secure_url: string;
    resource_type: string;
    format: string;
    bytes: number;
}

export async function uploadToCloudinary(
    buffer: Buffer,
    originalFileName: string,
    folder: string = 'admin-panel'
): Promise<UploadResult> {
    // Re-configure for serverless
    const config = getCloudinaryConfig();
    cloudinary.config(config);

    console.log('📤 Uploading:', originalFileName, `(${Math.round(buffer.length / 1024)}KB)`);

    return new Promise((resolve, reject) => {
        // Use streaming to avoid memory doubling (no base64 conversion)
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: `${Date.now()}-${sanitizeFileName(originalFileName)}`,
                resource_type: 'raw',
                timeout: 120000,
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Upload failed:', error.message);
                    
                    if (error.http_code === 500 || error.message?.includes('invalid JSON')) {
                        reject(new Error(`Wrong CLOUDINARY_CLOUD_NAME: "${config.cloud_name}". Check https://cloudinary.com/console`));
                        return;
                    }
                    if (error.http_code === 401) {
                        reject(new Error('Invalid Cloudinary API credentials'));
                        return;
                    }
                    
                    reject(new Error(`Upload failed: ${error.message}`));
                    return;
                }
                
                if (!result) {
                    reject(new Error('No result from Cloudinary'));
                    return;
                }

                console.log('✅ Uploaded:', result.public_id);
                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                    resource_type: result.resource_type,
                    format: result.format,
                    bytes: result.bytes,
                });
            }
        );

        // Convert buffer to readable stream and pipe to upload
        const readable = Readable.from(buffer);
        readable.pipe(stream);
    });
}

// MIME type detection
function getMimeType(fileName: string): string {
    const ext = fileName.toLowerCase().split('.').pop();
    const map: Record<string, string> = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return map[ext || ''] || 'application/octet-stream';
}

// Sanitize filename
function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
}

export { cloudinary };