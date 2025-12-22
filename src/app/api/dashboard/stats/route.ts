import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import File from '@/models/File'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        // Get total files count
        const totalFiles = await File.countDocuments()

        // Get files by type
        const filesByType = await File.aggregate([
            {
                $group: {
                    _id: '$fileType',
                    count: { $sum: 1 }
                }
            }
        ])

        // Get files uploaded in the last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const recentUploads = await File.countDocuments({
            uploadDate: { $gte: sevenDaysAgo }
        })

        // Get files uploaded today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todayUploads = await File.countDocuments({
            uploadDate: { $gte: today, $lt: tomorrow }
        })

        // Get top colleges by file count
        const topColleges = await File.aggregate([
            {
                $group: {
                    _id: '$collegeName',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ])

        // Get top courses by file count
        const topCourses = await File.aggregate([
            {
                $group: {
                    _id: '$courseName',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ])

        // Get files by year distribution
        const filesByYear = await File.aggregate([
            {
                $group: {
                    _id: '$year',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        // Get recent uploads with details
        const recentFiles = await File.find()
            .sort({ uploadDate: -1 })
            .limit(10)
            .select('fileName collegeName courseName fileType uploadDate')

        // Calculate storage usage (estimated)
        const avgFileSize = 2 // MB (estimated average)
        const totalStorageUsed = totalFiles * avgFileSize

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    totalFiles,
                    recentUploads,
                    todayUploads,
                    totalStorageUsed
                },
                filesByType: filesByType.map(item => ({
                    type: item._id,
                    count: item.count
                })),
                topColleges: topColleges.map(item => ({
                    name: item._id,
                    count: item.count
                })),
                topCourses: topCourses.map(item => ({
                    name: item._id,
                    count: item.count
                })),
                filesByYear: filesByYear.map(item => ({
                    year: item._id,
                    count: item.count
                })),
                recentFiles: recentFiles.map(file => ({
                    id: file._id,
                    fileName: file.fileName,
                    collegeName: file.collegeName,
                    courseName: file.courseName,
                    fileType: file.fileType,
                    uploadDate: file.uploadDate
                }))
            }
        })

    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        )
    }
}