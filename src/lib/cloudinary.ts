import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary explicitly for each request
export function getCloudinaryConfig() {
    const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    }

    // Validate configuration
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        console.error('Missing Cloudinary configuration:', {
            cloud_name: !!config.cloud_name,
            api_key: !!config.api_key,
            api_secret: !!config.api_secret,
        })
        throw new Error('Cloudinary configuration is incomplete. Check environment variables.')
    }

    return config
}

// Configure Cloudinary
cloudinary.config(getCloudinaryConfig())

export interface UploadResult {
    public_id: string
    secure_url: string
    resource_type: string
    format: string
    bytes: number
}

export async function uploadToCloudinary(
    file: Buffer,
    fileName: string,
    folder: string = 'admin-panel'
): Promise<UploadResult> {
    // Reconfigure for this request (important for serverless)
    try {
        const config = getCloudinaryConfig()
        cloudinary.config(config)
    } catch (configError: any) {
        console.error('Configuration error:', configError.message)
        throw configError
    }

    console.log('Starting upload:', {
        fileName,
        fileSize: file.length,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    })

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: folder,
                public_id: `${Date.now()}-${sanitizeFileName(fileName)}`,
                use_filename: false,
                unique_filename: true,
                overwrite: false,
                timeout: 60000, // 60 second timeout
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload stream error:', {
                        message: error.message,
                        error: error.error,
                        http_code: error.http_code,
                        name: error.name,
                    })
                    
                    // Check for specific error types
                    if (error.http_code === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                        reject(new Error('Invalid Cloudinary credentials. Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Vercel environment variables.'))
                        return
                    }
                    
                    if (error.http_code === 500 || error.message?.includes('500')) {
                        reject(new Error('Cloudinary server error (500). Possible causes: 1) Account limits reached 2) Invalid credentials 3) Service issue. Check your Cloudinary dashboard at https://cloudinary.com/console'))
                        return
                    }
                    
                    if (error.message?.includes('invalid JSON') || error.message?.includes('not valid JSON')) {
                        reject(new Error('Cloudinary API returned invalid response (HTML instead of JSON). This usually means: 1) Invalid API credentials 2) Account suspended/expired 3) Incorrect cloud_name. Verify your Cloudinary account status.'))
                        return
                    }

                    if (error.message?.includes('timeout')) {
                        reject(new Error('Upload timeout. The file may be too large or network is slow.'))
                        return
                    }
                    
                    reject(new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`))
                    return
                }
                
                if (!result) {
                    reject(new Error('No result received from Cloudinary'))
                    return
                }

                console.log('✓ Upload successful:', {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                    format: result.format,
                    bytes: result.bytes
                })

                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                    resource_type: result.resource_type,
                    format: result.format,
                    bytes: result.bytes,
                })
            }
        )

        // Write buffer to stream
        uploadStream.end(file)
    })
}

// Helper function to get MIME type from filename
function getMimeType(fileName: string): string {
    const ext = fileName.toLowerCase().split('.').pop()
    const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    return mimeTypes[ext || ''] || 'application/octet-stream'
}

// Helper function to sanitize filename
function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .substring(0, 100)
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error)
        throw error
    }
}

export { cloudinary }