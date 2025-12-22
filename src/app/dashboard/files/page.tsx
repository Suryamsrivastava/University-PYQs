'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Trash2, FileText, BookOpen, Download, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import FilePreviewModal from '@/components/FilePreviewModal'
import BulkActions from '@/components/BulkActions'
import SavedFilters from '@/components/SavedFilters'
import AdvancedFileFilters from '@/components/AdvancedFileFilters'
import SaveButton from '@/components/SaveButton'
import Pagination from '@/components/Pagination'

interface FileData {
    _id: string
    collegeName: string
    courseName: string
    year: string
    branch: string
    fileType: 'notes' | 'pyq'
    fileName: string
    originalFileName: string
    fileUrl: string
    semester: string
    paperType: 'normal' | 'back'
    uploadDate: string
}

interface Pagination {
    currentPage: number
    totalPages: number
    totalFiles: number
    hasNext: boolean
    hasPrev: boolean
}

export default function FilesPage() {
    const [files, setFiles] = useState<FileData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [pagination, setPagination] = useState<Pagination | null>(null)

    // Enhanced features state
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [previewFile, setPreviewFile] = useState<FileData | null>(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Pagination state
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Filter states
    const [filters, setFilters] = useState({
        collegeName: '',
        courseName: '',
        fileType: '',
        year: '',
        branch: '',
        semester: '',
        paperType: '',
        page: 1,
    })

    const fetchFiles = async () => {
        setLoading(true)
        try {
            const queryParams = new URLSearchParams()
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value.toString())
            })
            queryParams.append('limit', itemsPerPage.toString())

            const response = await fetch(`/api/files?${queryParams}`)
            const data = await response.json()

            if (response.ok) {
                setFiles(data.files)
                setPagination(data.pagination)
            } else {
                setError(data.error || 'Failed to fetch files')
            }
        } catch (error) {
            setError('An error occurred while fetching files')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [filters, itemsPerPage])

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1, // Reset to first page when filtering
        }))
    }

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }))
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setFilters(prev => ({ ...prev, page: 1 })) // Reset to first page
    }

    const clearFilters = () => {
        setFilters({
            collegeName: '',
            courseName: '',
            fileType: '',
            year: '',
            branch: '',
            semester: '',
            paperType: '',
            page: 1,
        })
        setSearchTerm('')
    }

    const applyFilters = (newFilters: Record<string, string>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1
        }))
    }

    // Enhanced functions
    const handleFileSelection = (fileId: string) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        )
    }

    const handleSelectAll = () => {
        if (selectedFiles.length === files.length) {
            setSelectedFiles([])
        } else {
            setSelectedFiles(files.map(file => file._id))
        }
    }

    const handlePreview = (file: FileData) => {
        setPreviewFile(file)
        setIsPreviewOpen(true)
    }

    const handleDelete = async (fileId: string) => {
        if (!window.confirm('Are you sure you want to delete this file?')) {
            return
        }

        try {
            const response = await fetch('/api/files', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId })
            })

            if (response.ok) {
                toast.success('File deleted successfully')
                fetchFiles()
                setSelectedFiles(prev => prev.filter(id => id !== fileId))
            } else {
                toast.error('Failed to delete file')
            }
        } catch (error) {
            toast.error('An error occurred while deleting the file')
        }
    }

    const getFileIcon = (fileType: string, fileName: string) => {
        if (fileType === 'pyq') {
            return <FileText className="h-5 w-5 text-blue-500" />
        } else {
            return <BookOpen className="h-5 w-5 text-green-500" />
        }
    }

    const filteredFiles = files.filter(file => {
        if (!searchTerm) return true
        return (
            file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.branch.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
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
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Files</h1>
                        <p className="text-gray-600 mt-1">
                            Organize and manage your educational resources
                        </p>
                    </div>
                    <Link
                        href="/dashboard/upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                    </Link>
                </div>

                {/* Enhanced Filter Section */}
                <AdvancedFileFilters
                    filters={filters}
                    onFilterChange={(newFilters) => setFilters(newFilters)}
                    onSearch={(searchTerm) => {
                        setSearchTerm(searchTerm)
                        // Add search functionality here if needed
                    }}
                    totalFiles={pagination?.totalFiles}
                    isLoading={loading}
                />

                {/* Saved Filters Section */}
                <SavedFilters
                    currentFilters={{ ...filters, page: filters.page.toString() }}
                    onApplyFilter={applyFilters}
                />

                {/* Bulk Actions */}
                <BulkActions
                    selectedFiles={selectedFiles}
                    onClearSelection={() => setSelectedFiles([])}
                    onRefresh={fetchFiles}
                />

                {/* Files Display */}
                <div className="bg-white rounded-lg shadow-sm">
                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-400">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <div className="text-gray-600 mt-4">Loading files...</div>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-600 mb-4">
                                {searchTerm ? 'No files found matching your search.' : 'No files found matching your criteria.'}
                            </div>
                            <Link
                                href="/dashboard/upload"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload First File
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Files Grid */}
                            <div className="p-6">
                                {/* Bulk Select */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <label className="ml-2 text-sm text-gray-700">
                                            Select all ({filteredFiles.length})
                                        </label>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {selectedFiles.length} selected
                                    </div>
                                </div>

                                {/* Files Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredFiles.map((file) => (
                                        <div
                                            key={file._id}
                                            className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${selectedFiles.includes(file._id)
                                                ? 'border-blue-300 bg-blue-50'
                                                : 'border-gray-200 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFiles.includes(file._id)}
                                                        onChange={() => handleFileSelection(file._id)}
                                                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            {getFileIcon(file.fileType, file.fileName)}
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${file.fileType === 'notes'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {file.fileType === 'notes' ? 'Notes' : 'PYQ'}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-sm font-medium text-gray-900 truncate" title={file.originalFileName}>
                                                            {file.originalFileName}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {file.collegeName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {file.courseName} • {file.year} • {file.branch}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            {formatDate(file.uploadDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handlePreview(file)}
                                                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        Preview
                                                    </button>
                                                    <a
                                                        href={file.fileUrl}
                                                        download={file.originalFileName}
                                                        className="inline-flex items-center text-xs text-green-600 hover:text-green-800"
                                                    >
                                                        <Download className="h-3 w-3 mr-1" />
                                                        Download
                                                    </a>
                                                    <SaveButton
                                                        fileId={file._id}
                                                        showText={false}
                                                        className="text-xs"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(file._id)}
                                                    className="inline-flex items-center text-xs text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <Pagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        totalItems={pagination.totalFiles}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        pageSizeOptions={[5, 10, 25, 50]}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* File Preview Modal */}
            <FilePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                file={previewFile}
            />
        </div>
    )
}