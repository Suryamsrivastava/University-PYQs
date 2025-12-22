'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Files, FileText, Upload, TrendingUp, Database, Clock, Building, Bookmark } from 'lucide-react'
import StatCard from '@/components/StatCard'
import FileTypeChart from '@/components/FileTypeChart'
import TopItemsChart from '@/components/TopItemsChart'
import RecentActivity from '@/components/RecentActivity'

interface DashboardStats {
    overview: {
        totalFiles: number
        recentUploads: number
        todayUploads: number
        totalStorageUsed: number
    }
    filesByType: Array<{
        type: string
        count: number
    }>
    topColleges: Array<{
        name: string
        count: number
    }>
    topCourses: Array<{
        name: string
        count: number
    }>
    filesByYear: Array<{
        year: string
        count: number
    }>
    recentFiles: Array<{
        id: string
        fileName: string
        collegeName: string
        courseName: string
        fileType: 'notes' | 'pyq'
        uploadDate: string
    }>
}

export default function DashboardHome() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('/api/dashboard/stats')
            const data = await response.json()

            if (data.success) {
                setStats(data.data)
            } else {
                setError(data.error || 'Failed to fetch dashboard statistics')
            }
        } catch (error) {
            setError('An error occurred while fetching statistics')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="px-4 py-6 sm:px-0">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="px-4 py-6 sm:px-0">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={fetchDashboardStats}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 py-6 sm:px-0 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Overview of your educational platform analytics
                </p>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Files"
                            value={stats.overview.totalFiles.toLocaleString()}
                            icon={Files}
                            color="blue"
                            subtitle="All uploaded files"
                        />
                        <StatCard
                            title="Today's Uploads"
                            value={stats.overview.todayUploads}
                            icon={Upload}
                            color="green"
                            subtitle="Files uploaded today"
                        />
                        <StatCard
                            title="Recent Activity"
                            value={stats.overview.recentUploads}
                            icon={TrendingUp}
                            color="yellow"
                            subtitle="Last 7 days"
                        />
                        <StatCard
                            title="Storage Used"
                            value={`${stats.overview.totalStorageUsed} MB`}
                            icon={Database}
                            color="purple"
                            subtitle="Estimated usage"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                        <Link
                            href="/dashboard/upload"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-6 px-8 rounded-lg transition duration-300 block group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl mb-2 flex items-center">
                                        <Upload className="h-6 w-6 mr-3" />
                                        Upload Files
                                    </div>
                                    <div className="text-sm opacity-90">
                                        Upload new question papers or notes
                                    </div>
                                </div>
                                <div className="transform group-hover:translate-x-1 transition-transform">
                                    →
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/files"
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-6 px-8 rounded-lg transition duration-300 block group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl mb-2 flex items-center">
                                        <FileText className="h-6 w-6 mr-3" />
                                        Manage Files
                                    </div>
                                    <div className="text-sm opacity-90">
                                        View and filter uploaded files
                                    </div>
                                </div>
                                <div className="transform group-hover:translate-x-1 transition-transform">
                                    →
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/saved-files"
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-6 px-8 rounded-lg transition duration-300 block group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl mb-2 flex items-center">
                                        <Bookmark className="h-6 w-6 mr-3" />
                                        Saved Files
                                    </div>
                                    <div className="text-sm opacity-90">
                                        Your bookmarked files
                                    </div>
                                </div>
                                <div className="transform group-hover:translate-x-1 transition-transform">
                                    →
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/institutions"
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-6 px-8 rounded-lg transition duration-300 block group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl mb-2 flex items-center">
                                        <Building className="h-6 w-6 mr-3" />
                                        Institutions
                                    </div>
                                    <div className="text-sm opacity-90">
                                        Manage colleges and courses
                                    </div>
                                </div>
                                <div className="transform group-hover:translate-x-1 transition-transform">
                                    →
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Charts and Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FileTypeChart data={stats.filesByType} />
                        <TopItemsChart
                            title="Top Colleges"
                            data={stats.topColleges}
                            color="#10B981"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TopItemsChart
                            title="Popular Courses"
                            data={stats.topCourses}
                            color="#F59E0B"
                        />
                        <RecentActivity files={stats.recentFiles} />
                    </div>
                </>
            )}
        </div>
    )
}