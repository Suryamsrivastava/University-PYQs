import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import College from '@/models/College'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        // Fetch all active colleges
        const colleges = await College.find({ isActive: true })
            .select('name code city state')
            .sort({ name: 1 })

        // Create a simplified list for dropdowns
        const collegeOptions = colleges.map(college => ({
            value: college.name,
            label: college.name,
            code: college.code,
            location: `${college.city}, ${college.state}`
        }))

        return NextResponse.json({
            success: true,
            colleges: collegeOptions
        })
    } catch (error) {
        console.error('Fetch colleges dropdown error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch colleges' },
            { status: 500 }
        )
    }
}