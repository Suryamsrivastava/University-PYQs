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

    try {
        // Convert buffer to base64 data URI
        const base64Data = file.toString('base64')
        const mimeType = getMimeType(fileName)
        const dataURI = `data:${mimeType};base64,${base64Data}`
        
        console.log('Uploading to Cloudinary with data URI method...')
        
        // Upload using data URI (most reliable for serverless)
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: folder,
            public_id: `${Date.now()}-${sanitizeFileName(fileName)}`,
            use_filename: false,
            unique_filename: true,
            overwrite: false,
        })

        console.log('✓ Upload successful:', {
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            bytes: result.bytes
        })

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
        }
    } catch (error: any) {
        console.error('✗ Cloudinary upload error:', {
            message: error.message,
            error: error.error,
            http_code: error.http_code,
            name: error.name,
            stack: error.stack?.split('\n').slice(0, 3)
        })
        
        // Check for specific error types
        if (error.http_code === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            throw new Error('Invalid Cloudinary credentials. Verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Vercel environment variables.')
        } 
        
        if (error.http_code === 500 || error.message?.includes('500')) {
            throw new Error('Cloudinary server error. Your account may have reached its limit or there is a service issue. Check your Cloudinary dashboard.')
        }
        
        if (error.message?.includes('invalid JSON')) {
            throw new Error('Cloudinary API returned invalid response. Check if your account is active and credentials are correct.')
        }
        
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`)
    }
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