import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        // Get credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        // Validate credentials
        if (email === adminEmail && password === adminPassword) {
            return NextResponse.json({ success: true }, { status: 200 })
        } else {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}