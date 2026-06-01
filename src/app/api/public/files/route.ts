import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import File from '@/models/File'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
        const college = searchParams.get('college')
        const course = searchParams.get('course')
        const year = searchParams.get('year')
        const branch = searchParams.get('branch')
        const semester = searchParams.get('semester')
        const type = searchParams.get('type')
        const search = searchParams.get('search')

        const filter: Record<string, unknown> = {}
        if (college) filter.collegeName = new RegExp(college, 'i')
        if (course) filter.courseName = new RegExp(course, 'i')
        if (year) filter.year = year
        if (branch) filter.branch = new RegExp(branch, 'i')
        if (semester) filter.semester = semester
        if (type) filter.fileType = type
        if (search) {
            filter.$or = [
                { collegeName: new RegExp(search, 'i') },
                { courseName: new RegExp(search, 'i') },
                { branch: new RegExp(search, 'i') },
                { fileName: new RegExp(search, 'i') },
            ]
        }

        const skip = (page - 1) * limit
        const [files, total] = await Promise.all([
            File.find(filter)
                .select('collegeName courseName year branch fileType fileName fileUrl semester paperType uploadDate')
                .sort({ uploadDate: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            File.countDocuments(filter),
        ])

        return NextResponse.json(
            {
                success: true,
                data: files,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
            { headers: CORS_HEADERS }
        )
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch files' },
            { status: 500, headers: CORS_HEADERS }
        )
    }
}
