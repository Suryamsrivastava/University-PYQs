'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, BookmarkPlus, Star, Clock, Archive, Eye, Download, Trash2, Edit3, Filter, Search, Grid, List } from 'lucide-react'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'

interface SavedFileData {
    _id: string
    fileId: {
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
    savedAt: string
    category: 'important' | 'to-review' | 'favorite' | 'archive'
    tags: string[]
    notes: string
}

interface CategoryCounts {
    all: number
    favorite: number
    important: number
    'to-review': number
    archive: number
}

const categories = [
    { key: 'all', label: 'All Saved', icon: BookmarkPlus, color: 'text-gray-600' },
    { key: 'favorite', label: 'Favorites', icon: Heart, color: 'text-red-500' },
    { key: 'important', label: 'Important', icon: Star, color: 'text-yellow-500' },
    { key: 'to-review', label: 'To Review', icon: Clock, color: 'text-blue-500' },
    { key: 'archive', label: 'Archive', icon: Archive, color: 'text-gray-500' }
]

export default function SavedFilesPage() {
    const [savedFiles, setSavedFiles] = useState<SavedFileData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({
        all: 0,
        favorite: 0,
        important: 0,
        'to-review': 0,
        archive: 0
    })
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [editingFile, setEditingFile] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({
        category: '',
        notes: '',
        tags: ''
    })

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(12)
    const [totalItems, setTotalItems] = useState(0)

    const userId = 'default-user' // Temporary user system

    const fetchSavedFiles = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                userId,
                category: selectedCategory,
                page: currentPage.toString(),
                limit: itemsPerPage.toString()
            })

            if (searchTerm) {
                params.append('search', searchTerm)
            }

            const response = await fetch(`/api/saved-files?${params.toString()}`)
            const data = await response.json()

            if (response.ok) {
                setSavedFiles(data.savedFiles)
                setCategoryCounts(data.categoryCounts)
                setTotalItems(data.pagination?.totalItems || data.savedFiles.length)
            } else {
                toast.error(data.error || 'Failed to fetch saved files')
            }
        } catch (error) {
            toast.error('An error occurred while fetching saved files')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSavedFiles()
    }, [selectedCategory, currentPage, itemsPerPage, searchTerm])

    const handleRemoveSaved = async (savedFileId: string) => {
        try {
            const response = await fetch(`/api/saved-files/${savedFileId}?userId=${userId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                toast.success('File removed from saved list')
                fetchSavedFiles()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to remove file')
            }
        } catch (error) {
            toast.error('An error occurred while removing file')
        }
    }

    const handleEditSaved = async (savedFileId: string) => {
        try {
            const response = await fetch(`/api/saved-files/${savedFileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    category: editForm.category,
                    notes: editForm.notes,
                    tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                })
            })

            if (response.ok) {
                toast.success('Saved file updated')
                setEditingFile(null)
                fetchSavedFiles()
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to update file')
            }
        } catch (error) {
            toast.error('An error occurred while updating file')
        }
    }

    const startEdit = (savedFile: SavedFileData) => {
        setEditingFile(savedFile._id)
        setEditForm({
            category: savedFile.category,
            notes: savedFile.notes || '',
            tags: savedFile.tags.join(', ')
        })
    }

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Reset to first page
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setCurrentPage(1) // Reset to first page when changing category
    }

    const filteredFiles = savedFiles.filter(saved => {
        if (!searchTerm) return true
        const file = saved.fileId
        return (
            file.originalFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
            saved.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    })

    const getCategoryIcon = (category: string) => {
        const cat = categories.find(c => c.key === category)
        return cat ? cat.icon : BookmarkPlus
    }

    const getCategoryColor = (category: string) => {
        const cat = categories.find(c => c.key === category)
        return cat ? cat.color : 'text-gray-600'
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
                    >
                        ← Back to Dashboard
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Files</h1>
                            <p className="text-gray-600">
                                Your bookmarked files and study materials
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search saved files..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Grid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Categories */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((category) => {
                                    const Icon = category.icon
                                    const count = categoryCounts[category.key as keyof CategoryCounts]

                                    return (
                                        <button
                                            key={category.key}
                                            onClick={() => handleCategoryChange(category.key)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${selectedCategory === category.key
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon className={`h-5 w-5 ${selectedCategory === category.key ? 'text-blue-600' : category.color}`} />
                                                <span className="font-medium">{category.label}</span>
                                            </div>
                                            <span className={`text-sm px-2 py-1 rounded-full ${selectedCategory === category.key
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {count}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Loading saved files...</span>
                            </div>
                        ) : filteredFiles.length === 0 ? (
                            <div className="text-center py-12">
                                <BookmarkPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'No matching files found' : 'No saved files yet'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm
                                        ? 'Try adjusting your search terms'
                                        : 'Start saving files to keep track of important documents'
                                    }
                                </p>
                                {!searchTerm && (
                                    <Link
                                        href="/dashboard/files"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Browse Files
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Results Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-gray-600">
                                        {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>

                                {/* Files Grid/List */}
                                <div className={viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                    : 'space-y-4'
                                }>
                                    {filteredFiles.map((saved) => {
                                        const file = saved.fileId
                                        const CategoryIcon = getCategoryIcon(saved.category)

                                        return (
                                            <div
                                                key={saved._id}
                                                className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                                                    }`}
                                            >
                                                {viewMode === 'grid' ? (
                                                    <>
                                                        {/* Grid View */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className={`p-2 rounded-lg ${saved.category === 'important' ? 'bg-yellow-100' : saved.category === 'favorite' ? 'bg-red-100' : saved.category === 'to-review' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                                <CategoryIcon className={`h-5 w-5 ${getCategoryColor(saved.category)}`} />
                                                            </div>

                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => startEdit(saved)}
                                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    <Edit3 className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveSaved(saved._id)}
                                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                                {file.originalFileName}
                                                            </h4>
                                                            <div className="space-y-1 text-sm text-gray-600">
                                                                <p><strong>College:</strong> {file.collegeName}</p>
                                                                <p><strong>Course:</strong> {file.courseName} - {file.branch}</p>
                                                                <p><strong>Year:</strong> {file.year} | <strong>Semester:</strong> {file.semester}</p>
                                                                <p><strong>Type:</strong> {file.fileType === 'pyq' ? 'Previous Year Question' : 'Notes'}</p>
                                                            </div>
                                                        </div>

                                                        {saved.notes && (
                                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                                <p className="text-sm text-gray-700 italic">"{saved.notes}"</p>
                                                            </div>
                                                        )}

                                                        {saved.tags.length > 0 && (
                                                            <div className="mb-4">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {saved.tags.map((tag, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center space-x-3">
                                                            <a
                                                                href={file.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View
                                                            </a>
                                                            <a
                                                                href={file.fileUrl}
                                                                download
                                                                className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* List View */}
                                                        <div className={`p-2 rounded-lg mr-4 ${saved.category === 'important' ? 'bg-yellow-100' : saved.category === 'favorite' ? 'bg-red-100' : saved.category === 'to-review' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                            <CategoryIcon className={`h-5 w-5 ${getCategoryColor(saved.category)}`} />
                                                        </div>

                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                                {file.originalFileName}
                                                            </h4>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                                <span>{file.collegeName}</span>
                                                                <span>{file.courseName}</span>
                                                                <span>{file.year} Year</span>
                                                                <span className="capitalize">{file.fileType}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <a
                                                                href={file.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </a>
                                                            <a
                                                                href={file.fileUrl}
                                                                download
                                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                            <button
                                                                onClick={() => startEdit(saved)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveSaved(saved._id)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {filteredFiles.length > 0 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalItems / itemsPerPage)}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            pageSizeOptions={[6, 12, 24, 48]}
                        />
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Saved File</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={editForm.category}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="favorite">Favorite</option>
                                    <option value="important">Important</option>
                                    <option value="to-review">To Review</option>
                                    <option value="archive">Archive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={editForm.notes}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Add your notes..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                <input
                                    type="text"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="Enter tags separated by commas"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-6">
                            <button
                                onClick={() => handleEditSaved(editingFile)}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingFile(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}