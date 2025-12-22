import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with timeout settings
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    // Add timeout and retry settings
    timeout: 120000, // 120 seconds
}

cloudinary.config(cloudinaryConfig)

// Validate configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary configuration. Please check your environment variables.')
    console.error('Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET')
}

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
    // Validate configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary configuration is missing. Please check your environment variables.')
    }

    // Log configuration (without sensitive data)
    console.log('Cloudinary Config:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key_present: !!process.env.CLOUDINARY_API_KEY,
        api_secret_present: !!process.env.CLOUDINARY_API_SECRET,
        file_size: file.length,
        folder: folder
    })

    // Try data URI upload method as fallback (more reliable on serverless)
    try {
        const base64Data = file.toString('base64')
        const dataURI = `data:application/octet-stream;base64,${base64Data}`
        
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: folder,
            public_id: `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
            use_filename: true,
            unique_filename: true,
            timeout: 120000,
        })

        console.log('Upload successful:', result.public_id)

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
        }
    } catch (error: any) {
        console.error('Cloudinary upload error:', {
            message: error.message,
            error: error.error,
            http_code: error.http_code,
            name: error.name
        })
        
        // Provide more specific error message
        if (error.http_code === 401 || error.message?.includes('401')) {
            throw new Error('Invalid Cloudinary credentials. Please check your API key and secret.')
        } else if (error.http_code === 500 || error.message?.includes('500')) {
            throw new Error('Cloudinary server error. Please try again or check your account status.')
        } else {
            throw new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`)
        }
    }
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