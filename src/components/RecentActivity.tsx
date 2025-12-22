'use client'

import { FileText, BookOpen, Clock } from 'lucide-react'

interface RecentFile {
    id: string
    fileName: string
    collegeName: string
    courseName: string
    fileType: 'notes' | 'pyq'
    uploadDate: string
}

interface RecentActivityProps {
    files: RecentFile[]
}

export default function RecentActivity({ files }: RecentActivityProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) {
            return 'Just now'
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Clock className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
                {files.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                    files.map((file) => (
                        <div key={file.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className={`p-2 rounded-lg ${file.fileType === 'pyq'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                {file.fileType === 'pyq' ? (
                                    <FileText className="h-4 w-4" />
                                ) : (
                                    <BookOpen className="h-4 w-4" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.fileName}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {file.collegeName} • {file.courseName}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(file.uploadDate)}
                                </p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${file.fileType === 'pyq'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                {file.fileType === 'pyq' ? 'PYQ' : 'Notes'}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {files.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all activity →
                    </button>
                </div>
            )}
        </div>
    )
}