import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/public']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    const session = request.cookies.get('admin-session')
    const secret = process.env.NEXTAUTH_SECRET

    if (!session || session.value !== secret) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*'],
}
