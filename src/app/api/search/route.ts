import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import File from '@/models/File'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('q') || ''
        const type = searchParams.get('type') || 'all' // all, suggestions, files

        if (type === 'suggestions') {
            // Get search suggestions for auto-complete
            if (query.length < 2) {
                return NextResponse.json({ suggestions: [] })
            }

            const [colleges, courses, branches] = await Promise.all([
                File.distinct('collegeName').then(items =>
                    items.filter(item =>
                        item.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5)
                ),
                File.distinct('courseName').then(items =>
                    items.filter(item =>
                        item.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5)
                ),
                File.distinct('branch').then(items =>
                    items.filter(item =>
                        item.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5)
                )
            ])

            const suggestions = [
                ...colleges.map(item => ({ type: 'college', value: item })),
                ...courses.map(item => ({ type: 'course', value: item })),
                ...branches.map(item => ({ type: 'branch', value: item }))
            ].slice(0, 10)

            return NextResponse.json({ suggestions })
        }

        if (type === 'global') {
            // Global search across all fields
            if (query.length < 2) {
                return NextResponse.json({ files: [], totalCount: 0 })
            }

            const searchRegex = new RegExp(query, 'i')
            const files = await File.find({
                $or: [
                    { fileName: searchRegex },
                    { originalFileName: searchRegex },
                    { collegeName: searchRegex },
                    { courseName: searchRegex },
                    { branch: searchRegex },
                    { year: searchRegex },
                    { semester: searchRegex }
                ]
            })
                .sort({ uploadDate: -1 })
                .limit(50)
                .select('fileName originalFileName collegeName courseName branch year semester fileType uploadDate')

            return NextResponse.json({
                files,
                totalCount: files.length,
                query
            })
        }

        return NextResponse.json({ error: 'Invalid search type' }, { status: 400 })

    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Failed to perform search' },
            { status: 500 }
        )
    }
}