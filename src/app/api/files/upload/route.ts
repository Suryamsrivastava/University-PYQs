import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import File from '@/models/File'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const formData = await request.formData()
        const file = formData.get('file') as File
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

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
            buffer,
            file.name,
            `${collegeName}/${courseName}/${fileType}`
        )

        // Save to database
        const newFile = new File({
            collegeName,
            courseName,
            year,
            branch,
            fileType,
            fileName: file.name,
            originalFileName: file.name,
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
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}