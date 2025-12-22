import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import File from '@/models/File'
import { uploadToCloudinary } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Max duration in seconds

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const formData = await request.formData()
        const file = formData.get('file') as Blob
        const collegeName = formData.get('collegeName') as string
        const courseName = formData.get('courseName') as string
        const year = formData.get('year') as string
        const branch = formData.get('branch') as string
        const fileType = formData.get('fileType') as string
        const semester = formData.get('semester') as string
        const paperType = formData.get('paperType') as string

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate required fields
        const requiredFields = [collegeName, courseName, year, branch, fileType, semester, paperType]
        if (requiredFields.some(field => !field)) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }

        // Get file name
        const fileName = (file as any).name || 'upload'

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary with error handling
        let uploadResult
        try {
            uploadResult = await uploadToCloudinary(
                buffer,
                fileName,
                `${collegeName}/${courseName}/${fileType}`
            )
        } catch (cloudinaryError: any) {
            console.error('Cloudinary upload error:', cloudinaryError)
            return NextResponse.json(
                { 
                    error: 'Failed to upload file to cloud storage',
                    details: cloudinaryError.message || 'Unknown cloudinary error'
                },
                { status: 500 }
            )
        }

        // Save to database
        const newFile = new File({
            collegeName,
            courseName,
            year,
            branch,
            fileType,
            fileName: fileName,
            originalFileName: fileName,
            fileUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            semester,
            paperType,
        })

        await newFile.save()

        return NextResponse.json({
            success: true,
            file: newFile,
        })
    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { 
                error: 'Failed to upload file',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        )
    }
}