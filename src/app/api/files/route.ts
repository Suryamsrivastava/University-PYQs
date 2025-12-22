import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import File from '@/models/File'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const collegeName = searchParams.get('collegeName')
        const courseName = searchParams.get('courseName')
        const fileType = searchParams.get('fileType')
        const year = searchParams.get('year')
        const branch = searchParams.get('branch')
        const semester = searchParams.get('semester')
        const paperType = searchParams.get('paperType')

        // Build filter object
        const filter: any = {}
        if (collegeName) filter.collegeName = new RegExp(collegeName, 'i')
        if (courseName) filter.courseName = new RegExp(courseName, 'i')
        if (fileType) filter.fileType = fileType
        if (year) filter.year = year
        if (branch) filter.branch = new RegExp(branch, 'i')
        if (semester) filter.semester = semester
        if (paperType) filter.paperType = paperType

        // Calculate skip value for pagination
        const skip = (page - 1) * limit

        // Fetch files with filters and pagination
        const files = await File.find(filter)
            .sort({ uploadDate: -1 })
            .skip(skip)
            .limit(limit)

        // Get total count for pagination
        const totalFiles = await File.countDocuments(filter)
        const totalPages = Math.ceil(totalFiles / limit)

        return NextResponse.json({
            files,
            pagination: {
                currentPage: page,
                totalPages,
                totalFiles,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        })
    } catch (error) {
        console.error('Fetch files error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch files' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect()

        const { fileId } = await request.json()

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            )
        }

        // Find and delete the file
        const deletedFile = await File.findByIdAndDelete(fileId)

        if (!deletedFile) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        // In a real implementation, you would also delete the file from Cloudinary here
        // const cloudinary = require('cloudinary').v2
        // await cloudinary.uploader.destroy(deletedFile.cloudinaryPublicId)

        return NextResponse.json({
            success: true,
            message: 'File deleted successfully'
        })
    } catch (error) {
        console.error('Delete file error:', error)
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        )
    }
}