import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import File from '@/models/File'
import { uploadToCloudinary } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const runtime = 'nodejs'

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const formData = await request.formData()
        const file = formData.get('file') as File | null
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

        // File size check
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 413 })
        }

        // File type validation
        const fileName = file.name || 'upload'
        const ext = '.' + fileName.split('.').pop()?.toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX are allowed' },
                { status: 415 }
            )
        }

        // Required fields check
        const required = [collegeName, courseName, year, branch, fileType, semester, paperType]
        if (required.some(f => !f)) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const uploadResult = await uploadToCloudinary(buffer, fileName, `${collegeName}/${courseName}/${fileType}`)

        const newFile = new File({
            collegeName,
            courseName,
            year,
            branch,
            fileType,
            fileName,
            originalFileName: fileName,
            fileUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            semester,
            paperType,
        })
        await newFile.save()

        return NextResponse.json({ success: true, file: newFile })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Upload failed:', message)
        return NextResponse.json({ error: 'Failed to upload file', details: message }, { status: 500 })
    }
}
