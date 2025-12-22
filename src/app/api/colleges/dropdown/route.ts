import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import College from '@/models/College'

export async function GET(request: NextRequest) {
    console.log('🔍 DROPDOWN API: Starting colleges dropdown fetch')
    try {
        console.log('🔗 DROPDOWN API: Connecting to database')
        await dbConnect()
        console.log('✅ DROPDOWN API: Database connected successfully')

        console.log('📚 DROPDOWN API: Fetching colleges from database')
        console.log('🔍 DROPDOWN API: Query filter: { isActive: true }')
        
        // First, let's see all colleges in database
        const allColleges = await College.find({})
        console.log('📊 DROPDOWN API: Total colleges in database:', allColleges.length)
        console.log('📋 DROPDOWN API: All colleges:', allColleges.map(c => ({ name: c.name, isActive: c.isActive })))
        
        // Fetch all active colleges
        const colleges = await College.find({ isActive: true })
            .select('name code city state')
            .sort({ name: 1 })

        console.log('📊 DROPDOWN API: Active colleges found:', colleges.length)
        console.log('📋 DROPDOWN API: Active colleges data:', colleges)

        // Create a simplified list for dropdowns
        const collegeOptions = colleges.map(college => ({
            value: college.name,
            label: college.name,
            code: college.code,
            location: `${college.city}, ${college.state}`
        }))

        console.log('📦 DROPDOWN API: Prepared college options:', collegeOptions)
        console.log('📤 DROPDOWN API: Sending response with', collegeOptions.length, 'colleges')

        return NextResponse.json({
            success: true,
            colleges: collegeOptions
        })
    } catch (error) {
        console.error('💥 DROPDOWN API: Error occurred:', error)
        console.error('💥 DROPDOWN API: Error stack:', error instanceof Error ? error.stack : 'No stack')
        return NextResponse.json(
            { success: false, error: 'Failed to fetch colleges' },
            { status: 500 }
        )
    }
}