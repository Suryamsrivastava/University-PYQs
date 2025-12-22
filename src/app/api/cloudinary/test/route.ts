import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET() {
    try {
        // Check if environment variables are set
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME
        const apiKey = process.env.CLOUDINARY_API_KEY
        const apiSecret = process.env.CLOUDINARY_API_SECRET

        if (!cloudName || !apiKey || !apiSecret) {
            return NextResponse.json({
                success: false,
                error: 'Missing Cloudinary credentials',
                details: {
                    CLOUDINARY_CLOUD_NAME: cloudName ? '✓ Set' : '✗ Missing',
                    CLOUDINARY_API_KEY: apiKey ? '✓ Set' : '✗ Missing',
                    CLOUDINARY_API_SECRET: apiSecret ? '✓ Set' : '✗ Missing',
                },
                hint: 'Add missing variables to Vercel environment variables and redeploy'
            }, { status: 500 })
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        })

        // Test the connection by calling the API
        const result = await cloudinary.api.ping()

        return NextResponse.json({
            success: true,
            message: 'Cloudinary credentials are valid and working!',
            cloudName: cloudName,
            status: result.status,
            timestamp: new Date().toISOString()
        })

    } catch (error: any) {
        console.error('Cloudinary test error:', error)

        let errorMessage = 'Failed to connect to Cloudinary'
        let hint = 'Unknown error'

        if (error.error?.http_code === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            errorMessage = 'Invalid Cloudinary credentials'
            hint = 'Your API_KEY or API_SECRET is incorrect. Get correct credentials from https://cloudinary.com/console/settings/security'
        } else if (error.message?.includes('Account') || error.message?.includes('disabled')) {
            errorMessage = 'Cloudinary account issue'
            hint = 'Your account may be suspended or disabled. Check https://cloudinary.com/console'
        } else if (error.message?.includes('cloud_name')) {
            errorMessage = 'Invalid cloud name'
            hint = 'CLOUDINARY_CLOUD_NAME is incorrect. Check https://cloudinary.com/console/settings/account'
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: error.message || 'Unknown error',
            hint: hint,
            environment: {
                CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
                CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'NOT SET',
                CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'NOT SET',
            }
        }, { status: 500 })
    }
}
