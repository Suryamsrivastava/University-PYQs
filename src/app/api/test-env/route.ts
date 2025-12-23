import { NextResponse } from 'next/server';

export async function GET() {
    console.log('🔍 ENV TEST ENDPOINT CALLED');
    
    // Get all environment variables
    const allEnvKeys = Object.keys(process.env);
    const cloudinaryKeys = allEnvKeys.filter(k => k.includes('CLOUDINARY'));
    
    const envCheck = {
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
        cloudinary: {
            CLOUDINARY_CLOUD_NAME: {
                exists: !!process.env.CLOUDINARY_CLOUD_NAME,
                value: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
                length: process.env.CLOUDINARY_CLOUD_NAME?.length || 0,
            },
            CLOUDINARY_API_KEY: {
                exists: !!process.env.CLOUDINARY_API_KEY,
                preview: process.env.CLOUDINARY_API_KEY ? 
                    `${process.env.CLOUDINARY_API_KEY.substring(0, 8)}***` : 'NOT SET',
                length: process.env.CLOUDINARY_API_KEY?.length || 0,
            },
            CLOUDINARY_API_SECRET: {
                exists: !!process.env.CLOUDINARY_API_SECRET,
                preview: process.env.CLOUDINARY_API_SECRET ? 
                    `${process.env.CLOUDINARY_API_SECRET.substring(0, 4)}***` : 'NOT SET',
                length: process.env.CLOUDINARY_API_SECRET?.length || 0,
            },
        },
        mongodb: {
            MONGODB_URI: {
                exists: !!process.env.MONGODB_URI,
                preview: process.env.MONGODB_URI ? 
                    process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT SET',
            },
        },
        allCloudinaryKeys: cloudinaryKeys,
        totalEnvVars: allEnvKeys.length,
    };

    console.log('📊 Environment Check Results:');
    console.log(JSON.stringify(envCheck, null, 2));

    // Check if all required vars are present
    const allPresent = 
        !!process.env.CLOUDINARY_CLOUD_NAME &&
        !!process.env.CLOUDINARY_API_KEY &&
        !!process.env.CLOUDINARY_API_SECRET &&
        !!process.env.MONGODB_URI;

    return NextResponse.json({
        success: allPresent,
        message: allPresent ? 
            '✅ All required environment variables are set!' : 
            '❌ Some required environment variables are missing!',
        details: envCheck,
        instructions: allPresent ? null : {
            step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
            step2: 'Add missing variables to PRODUCTION environment',
            step3: 'Click "Redeploy" button after adding variables',
            getCredentials: 'https://cloudinary.com/console/settings/security',
        }
    });
}
