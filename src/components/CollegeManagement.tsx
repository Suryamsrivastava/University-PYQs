'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Calendar, ExternalLink, Building, GraduationCap, Users, BookOpen, BarChart3, Plus, X } from 'lucide-react'
import Pagination from './Pagination'

interface College {
    _id: string
    name: string
    shortName?: string
    code: string
    address?: string
    location?: string
    city: string
    state: string
    website?: string
    establishedYear?: number
    type: string
    category?: string
    affiliation?: string
    courses?: string[]
    branches?: string[]
    status?: 'active' | 'inactive'
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface Statistics {
    total: number
    active: number
    recentlyAdded: number
    byType: { _id: string; count: number }[]
    byCategory: { _id: string; count: number }[]
    byState: { _id: string; count: number }[]
}

export default function CollegeManagement() {
    const [colleges, setColleges] = useState<College[]>([])
    const [filteredColleges, setFilteredColleges] = useState<College[]>([])
    const [statistics, setStatistics] = useState<Statistics | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedState, setSelectedState] = useState('')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(12)
    const [totalItems, setTotalItems] = useState(0)

    // Add College Modal state
    const [showAddModal, setShowAddModal] = useState(false)
    const [addingCollege, setAddingCollege] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        city: '',
        state: '',
        website: '',
        establishedYear: '',
        type: 'government',
        category: '',
        affiliation: ''
    })
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

    useEffect(() => {
        fetchColleges()
        fetchStatistics()
    }, [])

    useEffect(() => {
        fetchColleges()
    }, [currentPage, itemsPerPage, searchTerm, selectedType, selectedCategory, selectedState])

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Reset to first page when changing page size
    }

    const fetchColleges = async () => {
        try {
            setLoading(true)

            // Build query parameters
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString()
            })

            if (searchTerm) params.append('search', searchTerm)
            if (selectedType) params.append('type', selectedType)
            if (selectedCategory) params.append('category', selectedCategory)
            if (selectedState) params.append('state', selectedState)

            const response = await fetch(`/api/colleges?${params.toString()}`)
            const data = await response.json()
            if (data.colleges) {
                setColleges(data.colleges)
                setFilteredColleges(data.colleges) // Since filtering is server-side now
                setTotalItems(data.pagination?.totalItems || data.colleges.length)
            } else {
                setColleges([])
                setFilteredColleges([])
                setTotalItems(0)
            }
        } catch (error) {
            console.error('Error fetching colleges:', error)
            setColleges([])
            setFilteredColleges([])
            setTotalItems(0)
        } finally {
            setLoading(false)
        }
    }

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/api/colleges/bulk-import')
            const data = await response.json()
            if (data.success) {
                setStatistics(data.statistics)
            }
        } catch (error) {
            console.error('Error fetching statistics:', error)
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedType('')
        setSelectedCategory('')
        setSelectedState('')
        setCurrentPage(1) // Reset to first page when clearing filters
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const errors: {[key: string]: string} = {}
        
        if (!formData.name.trim()) errors.name = 'College name is required'
        if (!formData.code.trim()) errors.code = 'College code is required'
        if (!formData.address.trim()) errors.address = 'Address is required'
        if (!formData.city.trim()) errors.city = 'City is required'
        if (!formData.state.trim()) errors.state = 'State is required'
        if (!formData.type) errors.type = 'Type is required'
        
        if (formData.establishedYear && !/^\d{4}$/.test(formData.establishedYear)) {
            errors.establishedYear = 'Please enter a valid 4-digit year'
        }
        
        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            errors.website = 'Please enter a valid URL starting with http:// or https://'
        }
        
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleAddCollege = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) return
        
        setAddingCollege(true)
        try {
            const response = await fetch('/api/colleges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined
                }),
            })
            
            const data = await response.json()
            
            if (response.ok) {
                // Success - refresh data and close modal
                await fetchColleges()
                await fetchStatistics()
                setShowAddModal(false)
                // Reset form
                setFormData({
                    name: '',
                    code: '',
                    address: '',
                    city: '',
                    state: '',
                    website: '',
                    establishedYear: '',
                    type: 'government',
                    category: '',
                    affiliation: ''
                })
                setFormErrors({})
            } else {
                // Handle server errors
                if (data.error) {
                    if (data.error.includes('already exists')) {
                        setFormErrors({ submit: 'College with this name or code already exists' })
                    } else {
                        setFormErrors({ submit: data.error })
                    }
                } else {
                    setFormErrors({ submit: 'Failed to add college. Please try again.' })
                }
            }
        } catch (error) {
            console.error('Error adding college:', error)
            setFormErrors({ submit: 'Network error. Please check your connection and try again.' })
        } finally {
            setAddingCollege(false)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'government': return 'bg-blue-100 text-blue-800'
            case 'private': return 'bg-green-100 text-green-800'
            case 'autonomous': return 'bg-purple-100 text-purple-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'Technical': return 'bg-orange-100 text-orange-800'
            case 'Medical': return 'bg-red-100 text-red-800'
            case 'Management': return 'bg-yellow-100 text-yellow-800'
            case 'University': return 'bg-indigo-100 text-indigo-800'
            case 'Research Institute': return 'bg-pink-100 text-pink-800'
            case 'Design': return 'bg-teal-100 text-teal-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">College Database</h2>
                    <p className="text-gray-600 mt-1">Comprehensive database of Indian educational institutions</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800">
                        {filteredColleges.length} of {totalItems} colleges
                    </span>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add New College
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-6 pb-4 flex flex-row items-center justify-between space-y-0">
                            <h3 className="text-sm font-medium">Total Colleges</h3>
                            <Building className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.total}</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-6 pb-4 flex flex-row items-center justify-between space-y-0">
                            <h3 className="text-sm font-medium">Active Colleges</h3>
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-6 pb-4 flex flex-row items-center justify-between space-y-0">
                            <h3 className="text-sm font-medium">Recently Added</h3>
                            <Calendar className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold text-blue-600">{statistics.recentlyAdded}</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-6 pb-4 flex flex-row items-center justify-between space-y-0">
                            <h3 className="text-sm font-medium">Categories</h3>
                            <BarChart3 className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statistics.byCategory.length}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                placeholder="Search by name, code, city, or state..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="government">Government</option>
                            <option value="private">Private</option>
                            <option value="autonomous">Autonomous</option>
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            <option value="technical">Technical</option>
                            <option value="medical">Medical</option>
                            <option value="management">Management</option>
                            <option value="university">University</option>
                            <option value="research institute">Research Institute</option>
                        </select>

                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All States</option>
                            {statistics?.byState.slice(0, 15).map(state => (
                                <option key={state._id} value={state._id}>{state._id}</option>
                            ))}
                        </select>

                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* College Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredColleges.map((college) => (
                    <div key={college._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="p-6 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold leading-tight">
                                        {college.name}
                                    </h3>
                                    {college.shortName && (
                                        <p className="text-sm text-gray-600 mt-1">{college.shortName}</p>
                                    )}
                                </div>
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(college.type)}`}>
                                    {college.type}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 pt-0 space-y-4">
                            {/* Basic Info */}
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{college.location || `${college.city}, ${college.state}`}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600">
                                    {college.code}
                                </span>
                                {college.category && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(college.category)}`}>
                                        {college.category}
                                    </span>
                                )}
                            </div>

                            {college.establishedYear && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>Established {college.establishedYear}</span>
                                </div>
                            )}

                            {college.affiliation && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Affiliation:</span> {college.affiliation}
                                </div>
                            )}

                            {/* Courses */}
                            {college.courses && college.courses.length > 0 && (
                                <div>
                                    <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Courses
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {college.courses.slice(0, 4).map((course, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {course}
                                            </span>
                                        ))}
                                        {college.courses.length > 4 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                +{college.courses.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Branches */}
                            {college.branches && college.branches.length > 0 && (
                                <div>
                                    <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Users className="h-4 w-4 mr-2" />
                                        Branches/Departments
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {college.branches.slice(0, 3).map((branch, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600">
                                                {branch}
                                            </span>
                                        ))}
                                        {college.branches.length > 3 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600">
                                                +{college.branches.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Website */}
                            {college.website && (
                                <div className="pt-2 border-t">
                                    <a
                                        href={college.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        Visit Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredColleges.length === 0 && !loading && (
                <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No colleges found</h3>
                    <p className="mt-2 text-gray-600">
                        Try adjusting your search criteria or clear the filters.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {filteredColleges.length > 0 && (
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

            {/* Add College Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleAddCollege}>
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-semibold">Add New College</h2>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* College Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            College Name *
                                        </label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter college name"
                                        />
                                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                    </div>

                                    {/* College Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            College Code *
                                        </label>
                                        <input
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.code ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter college code (e.g., IIT001)"
                                        />
                                        {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter full address"
                                        rows={2}
                                    />
                                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter city"
                                        />
                                        {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State *
                                        </label>
                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter state"
                                        />
                                        {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type *
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.type ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="government">Government</option>
                                            <option value="private">Private</option>
                                            <option value="autonomous">Autonomous</option>
                                        </select>
                                        {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="technical">Technical</option>
                                            <option value="medical">Medical</option>
                                            <option value="management">Management</option>
                                            <option value="university">University</option>
                                            <option value="research institute">Research Institute</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Established Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Established Year
                                        </label>
                                        <input
                                            name="establishedYear"
                                            value={formData.establishedYear}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.establishedYear ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g., 1990"
                                            type="number"
                                            min="1800"
                                            max={new Date().getFullYear()}
                                        />
                                        {formErrors.establishedYear && <p className="text-red-500 text-xs mt-1">{formErrors.establishedYear}</p>}
                                    </div>

                                    {/* Website */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Website
                                        </label>
                                        <input
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.website ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="https://example.com"
                                            type="url"
                                        />
                                        {formErrors.website && <p className="text-red-500 text-xs mt-1">{formErrors.website}</p>}
                                    </div>
                                </div>

                                {/* Affiliation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Affiliation
                                    </label>
                                    <input
                                        name="affiliation"
                                        value={formData.affiliation}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., University of Delhi, AICTE"
                                    />
                                </div>

                                {/* Error Message */}
                                {formErrors.submit && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-red-600 text-sm">{formErrors.submit}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={addingCollege}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingCollege}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {addingCollege ? 'Adding...' : 'Add College'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
