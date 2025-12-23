// import { v2 as cloudinary } from 'cloudinary'

// // Configure Cloudinary explicitly for each request
// export function getCloudinaryConfig() {
//     const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
//     const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
//     const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

//     const config = {
//         cloud_name: cloudName,
//         api_key: apiKey,
//         api_secret: apiSecret,
//         secure: true,
//     }

//     // Validate configuration
//     if (!config.cloud_name || !config.api_key || !config.api_secret) {
//         console.error('❌ Missing Cloudinary configuration:', {
//             cloud_name: config.cloud_name ? `✓ Set: ${config.cloud_name}` : '✗ NOT SET',
//             api_key: config.api_key ? `✓ Set: ${config.api_key.substring(0, 4)}***` : '✗ NOT SET',
//             api_secret: config.api_secret ? '✓ Set (hidden)' : '✗ NOT SET',
//         })
//         throw new Error('Cloudinary configuration is incomplete. Check environment variables in Vercel dashboard.')
//     }

//     // Log config being used (sanitized)
//     console.log('✓ Cloudinary config loaded:', {
//         cloud_name: config.cloud_name,
//         api_key: config.api_key?.substring(0, 4) + '***',
//         api_secret: '***',
//     })

//     return config
// }

// // Configure Cloudinary
// cloudinary.config(getCloudinaryConfig())

// export interface UploadResult {
//     public_id: string
//     secure_url: string
//     resource_type: string
//     format: string
//     bytes: number
// }

// export async function uploadToCloudinary(
//     file: Buffer,
//     fileName: string,
//     folder: string = 'admin-panel'
// ): Promise<UploadResult> {
//     // Reconfigure for this request (important for serverless)
//     try {
//         const config = getCloudinaryConfig()
//         cloudinary.config(config)
//     } catch (configError: any) {
//         console.error('Configuration error:', configError.message)
//         throw configError
//     }

//     console.log('Starting upload:', {
//         fileName,
//         fileSize: file.length,
//         folder,
//         cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//     })

//     // Log the API endpoint that will be used
//     const apiEndpoint = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`
//     console.log('📤 Upload endpoint:', apiEndpoint)

//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             {
//                 resource_type: 'auto',
//                 folder: folder,
//                 public_id: `${Date.now()}-${sanitizeFileName(fileName)}`,
//                 use_filename: false,
//                 unique_filename: true,
//                 overwrite: false,
//                 timeout: 60000, // 60 second timeout
//             },
//             (error, result) => {
//                 if (error) {
//                     console.error('❌ Cloudinary upload stream error:', {
//                         message: error.message,
//                         error: error.error,
//                         http_code: error.http_code,
//                         name: error.name,
//                         cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//                     })
                    
//                     // Check for specific error types
//                     if (error.http_code === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
//                         reject(new Error(`❌ AUTHENTICATION FAILED: Invalid Cloudinary API_KEY or API_SECRET. Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}. Go to https://cloudinary.com/console/settings/security and copy the correct credentials to Vercel.`))
//                         return
//                     }
                    
//                     if (error.http_code === 500 || error.message?.includes('500')) {
//                         reject(new Error(`❌ CLOUDINARY 500 ERROR for cloud "${process.env.CLOUDINARY_CLOUD_NAME}". This means: 1) Wrong CLOUD_NAME (check exact spelling at https://cloudinary.com/console/settings/account) 2) Account suspended/disabled 3) Wrong API credentials. Verify all 3 environment variables are correct.`))
//                         return
//                     }
                    
//                     if (error.message?.includes('invalid JSON') || error.message?.includes('not valid JSON')) {
//                         reject(new Error(`❌ CLOUDINARY RETURNED HTML ERROR PAGE (not JSON). Cloud name: "${process.env.CLOUDINARY_CLOUD_NAME}". This almost always means CLOUD_NAME is wrong or account is disabled. Double-check the exact cloud name at https://cloudinary.com/console/settings/account`))
//                         return
//                     }

//                     if (error.message?.includes('timeout')) {
//                         reject(new Error('❌ Upload timeout. The file may be too large or network is slow.'))
//                         return
//                     }
                    
//                     reject(new Error(`❌ Cloudinary upload failed: ${error.message || 'Unknown error'}`))
//                     return
//                 }
                
//                 if (!result) {
//                     reject(new Error('No result received from Cloudinary'))
//                     return
//                 }

//                 console.log('✓ Upload successful:', {
//                     public_id: result.public_id,
//                     secure_url: result.secure_url,
//                     format: result.format,
//                     bytes: result.bytes
//                 })

//                 resolve({
//                     public_id: result.public_id,
//                     secure_url: result.secure_url,
//                     resource_type: result.resource_type,
//                     format: result.format,
//                     bytes: result.bytes,
//                 })
//             }
//         )

//         // Write buffer to stream
//         uploadStream.end(file)
//     })
// }

// // Helper function to get MIME type from filename
// function getMimeType(fileName: string): string {
//     const ext = fileName.toLowerCase().split('.').pop()
//     const mimeTypes: Record<string, string> = {
//         'pdf': 'application/pdf',
//         'doc': 'application/msword',
//         'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'xls': 'application/vnd.ms-excel',
//         'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     }
//     return mimeTypes[ext || ''] || 'application/octet-stream'
// }

// // Helper function to sanitize filename
// function sanitizeFileName(fileName: string): string {
//     return fileName
//         .replace(/[^a-zA-Z0-9.-]/g, '_')
//         .replace(/_{2,}/g, '_')
//         .substring(0, 100)
// }

// export async function deleteFromCloudinary(publicId: string): Promise<void> {
//     try {
//         await cloudinary.uploader.destroy(publicId)
//     } catch (error) {
//         console.error('Error deleting file from Cloudinary:', error)
//         throw error
//     }
// }

// export { cloudinary }/

import { v2 as cloudinary } from 'cloudinary';

// Helper to validate and get config (serverless-safe)
function getCloudinaryConfig() {
    console.log('\n🔧 getCloudinaryConfig() called');
    console.log('📍 Reading environment variables...');
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    console.log('\n📊 Environment Variables Status:');
    console.log('  CLOUDINARY_CLOUD_NAME:', cloudName ? `✓ "${cloudName}"` : '❌ UNDEFINED OR EMPTY');
    console.log('  CLOUDINARY_API_KEY:', apiKey ? `✓ Starts with "${apiKey.substring(0, 6)}..." (length: ${apiKey.length})` : '❌ UNDEFINED OR EMPTY');
    console.log('  CLOUDINARY_API_SECRET:', apiSecret ? `✓ Starts with "${apiSecret.substring(0, 4)}..." (length: ${apiSecret.length})` : '❌ UNDEFINED OR EMPTY');

    // Check if any are missing
    if (!cloudName || !apiKey || !apiSecret) {
        console.error('\n🚨🚨🚨 CRITICAL ERROR 🚨🚨🚨');
        console.error('Cloudinary environment variables are MISSING on Vercel!');
        console.error('\n📋 What to do:');
        console.error('1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
        console.error('2. Add these THREE variables to the PRODUCTION environment:');
        console.error('   - CLOUDINARY_CLOUD_NAME = [your cloud name]');
        console.error('   - CLOUDINARY_API_KEY = [your api key]');
        console.error('   - CLOUDINARY_API_SECRET = [your api secret]');
        console.error('3. Get values from: https://cloudinary.com/console/settings/security');
        console.error('4. After adding, click "Redeploy" button in Vercel');
        console.error('\n🔍 Current values:');
        console.error('   cloudName:', cloudName || '❌ NOT SET');
        console.error('   apiKey:', apiKey ? 'SET' : '❌ NOT SET');
        console.error('   apiSecret:', apiSecret ? 'SET' : '❌ NOT SET');
        throw new Error('❌ Cloudinary env vars not configured in Vercel. See logs above for fix.');
    }

    console.log('✅ All Cloudinary environment variables are present');

    const config = { 
        cloud_name: cloudName, 
        api_key: apiKey, 
        api_secret: apiSecret, 
        secure: true 
    };
    
    console.log('✅ Config object created successfully');
    return config;
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
    console.log('\n┌─────────────────────────────────────');
    console.log('│ 🚀 uploadToCloudinary() called');
    console.log('└─────────────────────────────────────');
    
    // Re-configure for safety in serverless
    console.log('\n🔄 Re-configuring Cloudinary for serverless...');
    const config = getCloudinaryConfig();
    cloudinary.config(config);
    console.log('✅ Cloudinary reconfigured with fresh config');

    const mimeType = getMimeType(originalFileName);
    console.log('\n📄 File details:');
    console.log('  Original name:', originalFileName);
    console.log('  MIME type:', mimeType);
    console.log('  Buffer size:', buffer.length, 'bytes');
    console.log('  Size in KB:', (buffer.length / 1024).toFixed(2));
    console.log('  Size in MB:', (buffer.length / 1024 / 1024).toFixed(2));

    console.log('\n🔄 Converting to base64...');
    const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
    console.log('✅ Base64 conversion complete');
    console.log('  Base64 length:', base64.length);

    // Show the exact API endpoint that will be called
    const apiUrl = `https://api.cloudinary.com/v1_1/${config.cloud_name}/raw/upload`;
    console.log('\n🌐 Cloudinary API Details:');
    console.log('  Endpoint:', apiUrl);
    console.log('  Cloud Name:', config.cloud_name);
    console.log('  API Key (first 6):', config.api_key.substring(0, 6) + '***');
    console.log('  Folder:', folder);
    console.log('  Resource Type: raw (for PDFs)');

    console.log('\n⏳ Making upload request to Cloudinary...');
    console.log('   (This may take a few seconds for large files)');

    try {
        const uploadOptions = {
            folder,
            public_id: `${Date.now()}-${sanitizeFileName(originalFileName)}`,
            resource_type: 'raw' as const,
            use_filename: false,
            unique_filename: true,
            overwrite: false,
            timeout: 120000,
        };
        
        console.log('\n📋 Upload options:', JSON.stringify(uploadOptions, null, 2));
        
        const result = await cloudinary.uploader.upload(base64, uploadOptions);

        console.log('\n✅✅✅ CLOUDINARY UPLOAD SUCCESS! ✅✅✅');
        console.log('📊 Upload result:');
        console.log('  Public ID:', result.public_id);
        console.log('  Secure URL:', result.secure_url);
        console.log('  Format:', result.format);
        console.log('  Size (bytes):', result.bytes);
        console.log('  Size (KB):', Math.round(result.bytes / 1024));
        console.log('  Resource Type:', result.resource_type);
        console.log('└─────────────────────────────────────\n');

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
        };
    } catch (error: any) {
        console.error('\n❌❌❌ CLOUDINARY UPLOAD FAILED! ❌❌❌');
        console.error('┌─────────────────────────────────────');
        console.error('│ Error Details:');
        console.error('├─────────────────────────────────────');
        console.error('│ Message:', error.message);
        console.error('│ HTTP Code:', error.http_code);
        console.error('│ Error Object:', error.error);
        console.error('│ Name:', error.name);
        console.error('└─────────────────────────────────────');
        
        console.error('\n📍 Configuration used:');
        console.error('  Cloud Name:', config.cloud_name);
        console.error('  API URL:', `https://api.cloudinary.com/v1_1/${config.cloud_name}/raw/upload`);

        // HTML response (500) = wrong cloud name or account issue
        if (error.http_code === 500 || error.message?.includes('500') || error.message?.includes('invalid JSON') || error.message?.includes('<!DOCTYPE')) {
            console.error('\n🚨 DIAGNOSIS: Cloudinary returned HTML error page (not JSON)');
            console.error('This means ONE of these problems:');
            console.error('');
            console.error('1. ❌ WRONG CLOUD_NAME (most likely!)');
            console.error(`   - You used: "${config.cloud_name}"`);
            console.error('   - This name does NOT exist on Cloudinary');
            console.error('   ✅ FIX: Go to https://cloudinary.com/console');
            console.error('   - Look at top-left corner for EXACT cloud name');
            console.error('   - Update CLOUDINARY_CLOUD_NAME in Vercel (case-sensitive!)');
            console.error('');
            console.error('2. ❌ Account suspended/disabled');
            console.error('   ✅ FIX: Check https://cloudinary.com/console for account status');
            console.error('');
            console.error('3. ❌ Wrong API credentials');
            console.error('   ✅ FIX: Get fresh credentials from https://cloudinary.com/console/settings/security');
            
            throw new Error(`❌ WRONG CLOUDINARY_CLOUD_NAME: "${config.cloud_name}" does not exist. Check https://cloudinary.com/console (top-left corner) for the correct name.`);
        }
        
        if (error.http_code === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            console.error('🔑 Authentication failed - API_KEY or API_SECRET is wrong');
            throw new Error('❌ Invalid CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET. Get correct values from https://cloudinary.com/console/settings/security');
        }
        
        if (error.http_code === 400 || error.message?.includes('cloud_name')) {
            throw new Error(`❌ Invalid cloud_name: "${config.cloud_name}". Verify exact spelling at https://cloudinary.com/console/settings/account`);
        }
        
        if (error.message?.includes('timeout')) {
            throw new Error('❌ Upload timeout. File may be too large or connection is slow.');
        }

        throw new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`);
    }
}

// MIME type detection
function getMimeType(fileName: string): string {
    const ext = fileName.toLowerCase().split('.').pop();
    const map: Record<string, string> = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        txt: 'text/plain',
    };
    return map[ext || ''] || 'application/octet-stream';
}

// Sanitize filename
function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .substring(0, 100);
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
}

export { cloudinary };