import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SavedFile from '@/models/SavedFile'

// PUT /api/saved-files/[id] - Update saved file details
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()

        const { id } = params
        const body = await request.json()
        const { category, tags, notes, userId = 'default-user' } = body

        const updatedSaved = await SavedFile.findOneAndUpdate(
            { _id: id, userId }, // Ensure user can only update their own saved files
            {
                ...(category && { category }),
                ...(tags !== undefined && { tags }),
                ...(notes !== undefined && { notes })
            },
            { new: true }
        ).populate('fileId')

        if (!updatedSaved) {
            return NextResponse.json(
                { error: 'Saved file not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: 'Saved file updated successfully',
            savedFile: updatedSaved
        })

    } catch (error) {
        console.error('Error updating saved file:', error)
        return NextResponse.json(
            { error: 'Failed to update saved file' },
            { status: 500 }
        )
    }
}

// DELETE /api/saved-files/[id] - Remove saved file by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()

        const { id } = params
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId') || 'default-user'

        const deletedSaved = await SavedFile.findOneAndDelete({
            _id: id,
            userId
        })

        if (!deletedSaved) {
            return NextResponse.json(
                { error: 'Saved file not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: 'Saved file removed successfully'
        })

    } catch (error) {
        console.error('Error removing saved file:', error)
        return NextResponse.json(
            { error: 'Failed to remove saved file' },
            { status: 500 }
        )
    }
}