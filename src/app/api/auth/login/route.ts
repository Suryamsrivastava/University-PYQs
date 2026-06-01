import { NextRequest, NextResponse } from 'next/server'

const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') ?? 'local'
        const now = Date.now()
        const record = attempts.get(ip)

        if (record) {
            if (now < record.resetAt && record.count >= MAX_ATTEMPTS) {
                return NextResponse.json(
                    { error: 'Too many attempts. Try again in 15 minutes.' },
                    { status: 429 }
                )
            }
            if (now >= record.resetAt) attempts.delete(ip)
        }

        const { email, password } = await request.json()
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (email === adminEmail && password === adminPassword) {
            attempts.delete(ip)
            const res = NextResponse.json({ success: true }, { status: 200 })
            res.cookies.set('admin-session', process.env.NEXTAUTH_SECRET || 'secret', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            })
            return res
        }

        const existing = attempts.get(ip)
        if (existing && now < existing.resetAt) {
            existing.count++
        } else {
            attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
        }

        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
