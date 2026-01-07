'use client'

import { Settings, Bell } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'
import GlobalSearch from '@/components/GlobalSearch'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, isAuthenticated } = useAuth(true)

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null // useAuth will redirect to login
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
                            {/* User Info */}
                            {user && (
                                <div className="hidden sm:flex items-center space-x-3">
                                    {user.image && (
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={user.image}
                                            alt={user.name || 'User'}
                                        />
                                    )}
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-700">
                                            {user.name || user.email}
                                        </div>
                                        {user.role && (
                                            <div className="text-gray-500 capitalize">
                                                {user.role}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

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