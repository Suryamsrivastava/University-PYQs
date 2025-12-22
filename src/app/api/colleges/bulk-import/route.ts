import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import College from '@/models/College';

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const { colleges } = await req.json();

        if (!colleges || !Array.isArray(colleges)) {
            return NextResponse.json(
                { error: 'Invalid data format. Expected array of colleges.' },
                { status: 400 }
            );
        }

        console.log(`📝 Processing ${colleges.length} colleges for bulk import...`);

        const results = {
            inserted: 0,
            updated: 0,
            skipped: 0,
            errors: [] as { college: string; error: string }[]
        };

        for (const collegeData of colleges) {
            try {
                // Check if college already exists by code or name
                const existingCollege = await College.findOne({
                    $or: [
                        { code: collegeData.code },
                        { name: collegeData.name }
                    ]
                });

                if (existingCollege) {
                    // Update existing college
                    await College.findByIdAndUpdate(existingCollege._id, collegeData, { new: true });
                    results.updated++;
                    console.log(`✅ Updated: ${collegeData.name}`);
                } else {
                    // Insert new college
                    const newCollege = new College(collegeData);
                    await newCollege.save();
                    results.inserted++;
                    console.log(`✅ Added: ${collegeData.name}`);
                }
            } catch (error: any) {
                console.error(`❌ Error processing ${collegeData.name}:`, error.message);
                results.errors.push({
                    college: collegeData.name || collegeData.code,
                    error: error.message
                });
                results.skipped++;
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Bulk import completed',
            results
        });

    } catch (error: any) {
        console.error('❌ Bulk import error:', error);
        return NextResponse.json(
            { error: 'Failed to import colleges', details: error.message },
            { status: 500 }
        );
    }
}

// Get bulk import status or statistics
export async function GET() {
    try {
        await connectMongoDB();

        const stats = await College.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    byType: {
                        $push: {
                            type: "$type",
                            count: 1
                        }
                    },
                    byCategory: {
                        $push: {
                            category: "$category",
                            count: 1
                        }
                    },
                    byState: {
                        $push: {
                            state: "$state",
                            count: 1
                        }
                    }
                }
            }
        ]);

        const typeStats = await College.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const categoryStats = await College.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const stateStats = await College.aggregate([
            {
                $group: {
                    _id: "$state",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10 // Top 10 states
            }
        ]);

        const totalColleges = await College.countDocuments();
        const activeColleges = await College.countDocuments({ isActive: true });
        const recentlyAdded = await College.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        return NextResponse.json({
            success: true,
            statistics: {
                total: totalColleges,
                active: activeColleges,
                recentlyAdded,
                byType: typeStats,
                byCategory: categoryStats,
                byState: stateStats
            }
        });

    } catch (error: any) {
        console.error('❌ Error fetching statistics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics', details: error.message },
            { status: 500 }
        );
    }
}