import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SavedFile from '@/models/SavedFile'
import File from '@/models/File'

// GET /api/saved-files - Get user's saved files
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId') || 'default-user' // Temporary user system
        const category = searchParams.get('category')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = (page - 1) * limit

        // Build query
        const query: any = { userId }
        if (category && category !== 'all') {
            query.category = category
        }

        // Get saved files with populated file data
        const savedFiles = await SavedFile.find(query)
            .populate('fileId')
            .sort({ savedAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec()

        // Filter out saved files where the actual file was deleted
        const validSavedFiles = savedFiles.filter(saved => saved.fileId)

        const totalSaved = await SavedFile.countDocuments(query)

        // Get category counts for the user
        const categoryCounts = await SavedFile.aggregate([
            { $match: { userId } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ])

        const counts = {
            all: totalSaved,
            favorite: 0,
            important: 0,
            'to-review': 0,
            archive: 0
        }

        categoryCounts.forEach(item => {
            counts[item._id as keyof typeof counts] = item.count
        })

        return NextResponse.json({
            savedFiles: validSavedFiles,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalSaved / limit),
                totalSaved,
                hasNext: page * limit < totalSaved,
                hasPrev: page > 1
            },
            categoryCounts: counts
        })

    } catch (error) {
        console.error('Error fetching saved files:', error)
        return NextResponse.json(
            { error: 'Failed to fetch saved files' },
            { status: 500 }
        )
    }
}

// POST /api/saved-files - Save a file
export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { fileId, userId = 'default-user', category = 'favorite', tags = [], notes = '' } = body

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            )
        }

        // Check if file exists
        const fileExists = await File.findById(fileId)
        if (!fileExists) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        // Check if already saved
        const existingSaved = await SavedFile.findOne({ fileId, userId })
        if (existingSaved) {
            return NextResponse.json(
                { error: 'File already saved' },
                { status: 409 }
            )
        }

        // Create saved file record
        const savedFile = new SavedFile({
            fileId,
            userId,
            category,
            tags,
            notes
        })

        await savedFile.save()
        await savedFile.populate('fileId')

        return NextResponse.json({
            message: 'File saved successfully',
            savedFile
        }, { status: 201 })

    } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json(
            { error: 'Failed to save file' },
            { status: 500 }
        )
    }
}

// DELETE /api/saved-files - Remove a saved file
export async function DELETE(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const fileId = searchParams.get('fileId')
        const userId = searchParams.get('userId') || 'default-user'

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            )
        }

        const deletedSaved = await SavedFile.findOneAndDelete({ fileId, userId })

        if (!deletedSaved) {
            return NextResponse.json(
                { error: 'Saved file not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: 'File removed from saved list'
        })

    } catch (error) {
        console.error('Error removing saved file:', error)
        return NextResponse.json(
            { error: 'Failed to remove saved file' },
            { status: 500 }
        )
    }
}