import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary explicitly for each request
export function getCloudinaryConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

    const config = {
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    }

    // Validate configuration
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        console.error('❌ Missing Cloudinary configuration:', {
            cloud_name: config.cloud_name ? `✓ Set: ${config.cloud_name}` : '✗ NOT SET',
            api_key: config.api_key ? `✓ Set: ${config.api_key.substring(0, 4)}***` : '✗ NOT SET',
            api_secret: config.api_secret ? '✓ Set (hidden)' : '✗ NOT SET',
        })
        throw new Error('Cloudinary configuration is incomplete. Check environment variables in Vercel dashboard.')
    }

    // Log config being used (sanitized)
    console.log('✓ Cloudinary config loaded:', {
        cloud_name: config.cloud_name,
        api_key: config.api_key?.substring(0, 4) + '***',
        api_secret: '***',
    })

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

    // Log the API endpoint that will be used
    const apiEndpoint = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`
    console.log('📤 Upload endpoint:', apiEndpoint)

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
                    console.error('❌ Cloudinary upload stream error:', {
                        message: error.message,
                        error: error.error,
                        http_code: error.http_code,
                        name: error.name,
                        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                    })
                    
                    // Check for specific error types
                    if (error.http_code === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                        reject(new Error(`❌ AUTHENTICATION FAILED: Invalid Cloudinary API_KEY or API_SECRET. Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}. Go to https://cloudinary.com/console/settings/security and copy the correct credentials to Vercel.`))
                        return
                    }
                    
                    if (error.http_code === 500 || error.message?.includes('500')) {
                        reject(new Error(`❌ CLOUDINARY 500 ERROR for cloud "${process.env.CLOUDINARY_CLOUD_NAME}". This means: 1) Wrong CLOUD_NAME (check exact spelling at https://cloudinary.com/console/settings/account) 2) Account suspended/disabled 3) Wrong API credentials. Verify all 3 environment variables are correct.`))
                        return
                    }
                    
                    if (error.message?.includes('invalid JSON') || error.message?.includes('not valid JSON')) {
                        reject(new Error(`❌ CLOUDINARY RETURNED HTML ERROR PAGE (not JSON). Cloud name: "${process.env.CLOUDINARY_CLOUD_NAME}". This almost always means CLOUD_NAME is wrong or account is disabled. Double-check the exact cloud name at https://cloudinary.com/console/settings/account`))
                        return
                    }

                    if (error.message?.includes('timeout')) {
                        reject(new Error('❌ Upload timeout. The file may be too large or network is slow.'))
                        return
                    }
                    
                    reject(new Error(`❌ Cloudinary upload failed: ${error.message || 'Unknown error'}`))
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