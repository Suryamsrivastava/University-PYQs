'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Bell } from 'lucide-react'
import GlobalSearch from '@/components/GlobalSearch'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated')
        if (!auth) {
            router.push('/login')
        } else {
            setIsAuthenticated(true)
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated')
        router.push('/login')
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center flex-1">
                            <h1 className="text-xl font-semibold text-gray-900 mr-8">
                                Admin Panel
                            </h1>

                            {/* Global Search */}
                            <div className="hidden md:block flex-1 max-w-lg">
                                <GlobalSearch className="w-full" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Mobile search icon */}
                            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600">
                                <Settings className="h-5 w-5" />
                            </button>

                            {/* Notifications */}
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* Settings */}
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <Settings className="h-5 w-5" />
                            </button>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden px-4 pb-4">
                    <GlobalSearch className="w-full" />
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    )
}