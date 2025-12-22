import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

// Validate configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary configuration. Please check your environment variables.')
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

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: folder,
                public_id: `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
                use_filename: true,
                unique_filename: true,
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload stream error:', error)
                    reject(new Error(`Cloudinary upload failed: ${error.message}`))
                } else if (result) {
                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        resource_type: result.resource_type,
                        format: result.format,
                        bytes: result.bytes,
                    })
                } else {
                    reject(new Error('Upload failed - no result returned from Cloudinary'))
                }
            }
        )
        
        uploadStream.end(file)
    })
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