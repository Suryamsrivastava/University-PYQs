import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import College from '@/models/College'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const type = searchParams.get('type') || ''
        const category = searchParams.get('category') || ''
        const state = searchParams.get('state') || ''
        const isActive = searchParams.get('isActive')

        // Build filter object
        const filter: any = {}

        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { code: new RegExp(search, 'i') },
                { city: new RegExp(search, 'i') }
            ]
        }

        if (type) filter.type = type
        if (category) filter.category = new RegExp(category, 'i')
        if (state) filter.state = new RegExp(state, 'i')
        if (isActive !== null && isActive !== '') filter.isActive = isActive === 'true'

        // Calculate skip value for pagination
        const skip = (page - 1) * limit

        // Fetch colleges with filters and pagination
        const colleges = await College.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)

        // Get total count for pagination
        const totalColleges = await College.countDocuments(filter)
        const totalPages = Math.ceil(totalColleges / limit)

        return NextResponse.json({
            colleges,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalColleges,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        })
    } catch (error) {
        console.error('Fetch colleges error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch colleges' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const { name, code, address, city, state, website, establishedYear, type, affiliation } = body

        // Validate required fields
        if (!name || !code || !address || !city || !state || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if college with same name or code exists
        const existingCollege = await College.findOne({
            $or: [
                { name: { $regex: new RegExp(`^${name}$`, 'i') } },
                { code: code.toUpperCase() }
            ]
        })

        if (existingCollege) {
            return NextResponse.json(
                { error: 'College with this name or code already exists' },
                { status: 409 }
            )
        }

        const college = new College({
            name,
            code: code.toUpperCase(),
            address,
            city,
            state,
            website,
            establishedYear,
            type,
            affiliation,
            isActive: true  // Set college as active by default
        })

        console.log('🏫 COLLEGE CREATE: Saving new college:', {
            name: college.name,
            code: college.code,
            isActive: college.isActive
        })

        await college.save()
        
        console.log('✅ COLLEGE CREATE: College saved successfully with ID:', college._id)

        return NextResponse.json({
            success: true,
            college,
            message: 'College created successfully'
        })
    } catch (error: any) {
        console.error('Create college error:', error)

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'College with this name or code already exists' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create college' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json(
                { error: 'College ID is required' },
                { status: 400 }
            )
        }

        const college = await College.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!college) {
            return NextResponse.json(
                { error: 'College not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            college,
            message: 'College updated successfully'
        })
    } catch (error) {
        console.error('Update college error:', error)
        return NextResponse.json(
            { error: 'Failed to update college' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'College ID is required' },
                { status: 400 }
            )
        }

        const college = await College.findByIdAndDelete(id)

        if (!college) {
            return NextResponse.json(
                { error: 'College not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'College deleted successfully'
        })
    } catch (error) {
        console.error('Delete college error:', error)
        return NextResponse.json(
            { error: 'Failed to delete college' },
            { status: 500 }
        )
    }
}