'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building, BookOpen, Users, Settings } from 'lucide-react'
import CollegeManagement from '@/components/CollegeManagement'

type TabType = 'colleges' | 'courses' | 'subjects' | 'settings'

export default function InstitutionsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('colleges')

    const tabs = [
        { id: 'colleges' as TabType, label: 'Colleges', icon: Building, description: 'Manage educational institutions' },
        { id: 'courses' as TabType, label: 'Courses', icon: BookOpen, description: 'Manage degree programs' },
        { id: 'subjects' as TabType, label: 'Subjects', icon: Users, description: 'Manage course subjects' },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings, description: 'Configuration options' }
    ]

    const renderContent = () => {
        switch (activeTab) {
            case 'colleges':
                return <CollegeManagement />
            case 'courses':
                return (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Management</h2>
                        <p className="text-gray-600 mb-4">Course management system coming soon.</p>
                        <p className="text-sm text-gray-500">
                            This will allow you to create and manage degree programs, set duration, categories, and more.
                        </p>
                    </div>
                )
            case 'subjects':
                return (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Subject Management</h2>
                        <p className="text-gray-600 mb-4">Subject management system coming soon.</p>
                        <p className="text-sm text-gray-500">
                            This will allow you to create subjects, assign them to courses, set credits, and manage syllabi.
                        </p>
                    </div>
                )
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h2>
                        <p className="text-gray-600 mb-4">Configuration settings coming soon.</p>
                        <p className="text-sm text-gray-500">
                            This will allow you to configure system-wide settings, academic calendars, and more.
                        </p>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
                <Link
                    href="/dashboard"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Institution Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage colleges, courses, subjects, and system settings
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } transition-colors`}
                                >
                                    <Icon className={`mr-2 h-4 w-4 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                                        }`} />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-96">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}