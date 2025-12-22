'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: LucideIcon
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo'
    trend?: {
        value: number
        label: string
        isPositive: boolean
    }
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-500',
        bgLight: 'bg-blue-50',
        text: 'text-blue-600',
        textDark: 'text-blue-900'
    },
    green: {
        bg: 'bg-green-500',
        bgLight: 'bg-green-50',
        text: 'text-green-600',
        textDark: 'text-green-900'
    },
    yellow: {
        bg: 'bg-yellow-500',
        bgLight: 'bg-yellow-50',
        text: 'text-yellow-600',
        textDark: 'text-yellow-900'
    },
    purple: {
        bg: 'bg-purple-500',
        bgLight: 'bg-purple-50',
        text: 'text-purple-600',
        textDark: 'text-purple-900'
    },
    red: {
        bg: 'bg-red-500',
        bgLight: 'bg-red-50',
        text: 'text-red-600',
        textDark: 'text-red-900'
    },
    indigo: {
        bg: 'bg-indigo-500',
        bgLight: 'bg-indigo-50',
        text: 'text-indigo-600',
        textDark: 'text-indigo-900'
    }
}

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
    const colors = colorClasses[color]

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? '↗' : '↘'} {trend.value}%
                            </span>
                            <span className="text-sm text-gray-500 ml-2">{trend.label}</span>
                        </div>
                    )}
                </div>
                <div className={`${colors.bgLight} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
            </div>
        </div>
    )
}