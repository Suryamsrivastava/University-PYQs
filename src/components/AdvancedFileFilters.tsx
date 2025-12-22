'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, RotateCcw, ChevronDown, Calendar, Users, BookOpen, FileType, GraduationCap, Hash } from 'lucide-react'
import SearchableDropdown from './SearchableDropdown'

interface FilterState {
    collegeName: string
    courseName: string
    fileType: string
    year: string
    branch: string
    semester: string
    paperType: string
    page: number
}

interface AdvancedFileFiltersProps {
    filters: FilterState
    onFilterChange: (filters: FilterState) => void
    onSearch: (searchTerm: string) => void
    totalFiles?: number
    isLoading?: boolean
}

interface FilterPreset {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    filters: Partial<FilterState>
}

const filterPresets: FilterPreset[] = [
    {
        id: 'recent-pyq',
        name: 'Recent PYQs',
        description: 'Previous year question papers',
        icon: <FileType className="h-4 w-4" />,
        filters: { fileType: 'pyq' }
    },
    {
        id: 'notes-only',
        name: 'Study Notes',
        description: 'All study materials and notes',
        icon: <BookOpen className="h-4 w-4" />,
        filters: { fileType: 'notes' }
    },
    {
        id: 'engineering',
        name: 'Engineering',
        description: 'Engineering courses only',
        icon: <GraduationCap className="h-4 w-4" />,
        filters: { courseName: 'B.Tech' }
    },
    {
        id: 'back-papers',
        name: 'Back Papers',
        description: 'Supplementary examinations',
        icon: <RotateCcw className="h-4 w-4" />,
        filters: { paperType: 'back' }
    }
]

interface CollegeOption {
    value: string
    label: string
}

const defaultCollegeOptions = [
    { value: 'IIT Delhi', label: 'Indian Institute of Technology Delhi' },
    { value: 'BITS Pilani', label: 'Birla Institute of Technology and Science Pilani' },
    { value: 'IIIT Hyderabad', label: 'International Institute of Information Technology Hyderabad' },
    { value: 'VIT Vellore', label: 'Vellore Institute of Technology' },
    { value: 'SRM University', label: 'SRM Institute of Science and Technology' },
    { value: 'Manipal University', label: 'Manipal Academy of Higher Education' },
    { value: 'Delhi University', label: 'University of Delhi' },
    { value: 'Mumbai University', label: 'University of Mumbai' },
]

const courseOptions = [
    { value: 'B.Tech', label: 'Bachelor of Technology (B.Tech)' },
    { value: 'B.E', label: 'Bachelor of Engineering (B.E)' },
    { value: 'BCA', label: 'Bachelor of Computer Applications (BCA)' },
    { value: 'MCA', label: 'Master of Computer Applications (MCA)' },
    { value: 'M.Tech', label: 'Master of Technology (M.Tech)' },
    { value: 'MBA', label: 'Master of Business Administration (MBA)' },
    { value: 'B.Sc', label: 'Bachelor of Science (B.Sc)' },
    { value: 'M.Sc', label: 'Master of Science (M.Sc)' }
]

const branchOptions = [
    { value: 'Computer Science Engineering', label: 'Computer Science Engineering (CSE)' },
    { value: 'Information Technology', label: 'Information Technology (IT)' },
    { value: 'Electronics and Communication', label: 'Electronics and Communication (ECE)' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering (EE)' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering (ME)' },
    { value: 'Civil Engineering', label: 'Civil Engineering (CE)' },
    { value: 'Chemical Engineering', label: 'Chemical Engineering (CHE)' },
    { value: 'Aerospace Engineering', label: 'Aerospace Engineering (AE)' },
    { value: 'Computer Applications', label: 'Computer Applications (CA)' },
    { value: 'Business Administration', label: 'Business Administration (MBA)' }
]

export default function AdvancedFileFilters({
    filters,
    onFilterChange,
    onSearch,
    totalFiles = 0,
    isLoading = false
}: AdvancedFileFiltersProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [activeFiltersCount, setActiveFiltersCount] = useState(0)
    const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>(defaultCollegeOptions)

    // Calculate active filters count
    useEffect(() => {
        const activeCount = Object.entries(filters).filter(([key, value]) =>
            key !== 'page' && value && value !== ''
        ).length
        setActiveFiltersCount(activeCount)
    }, [filters])

    // Fetch colleges from API
    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const response = await fetch('/api/colleges/dropdown')
                if (response.ok) {
                    const data = await response.json()
                    setCollegeOptions([...defaultCollegeOptions, ...data])
                }
            } catch (error) {
                console.error('Failed to fetch colleges:', error)
                // Use default options if API fails
            }
        }

        fetchColleges()
    }, [])

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        onSearch(value)
    }

    const handleFilterUpdate = (key: keyof FilterState, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
            page: 1 // Reset to first page when filtering
        })
    }

    const applyPreset = (preset: FilterPreset) => {
        onFilterChange({
            ...filters,
            ...preset.filters,
            page: 1
        })
    }

    const clearAllFilters = () => {
        onFilterChange({
            collegeName: '',
            courseName: '',
            fileType: '',
            year: '',
            branch: '',
            semester: '',
            paperType: '',
            page: 1
        })
        setSearchTerm('')
        onSearch('')
    }

    const hasActiveFilters = activeFiltersCount > 0 || searchTerm.length > 0

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Filter Files</h3>
                        </div>
                        {totalFiles > 0 && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                    {totalFiles} files
                                </span>
                                {activeFiltersCount > 0 && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                        {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Advanced Filters
                            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4">
                    <div className="relative max-w-md">
                        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search files by name, college, course..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Filter Presets */}
            <div className="p-6 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {filterPresets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => applyPreset(preset)}
                            className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="text-gray-600 group-hover:text-blue-600">
                                    {preset.icon}
                                </div>
                                <span className="font-medium text-sm text-gray-900">{preset.name}</span>
                            </div>
                            <p className="text-xs text-gray-500">{preset.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="p-6 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Advanced Filters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* College Filter */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Users className="h-4 w-4 mr-2 text-gray-500" />
                                College/University
                            </label>
                            <SearchableDropdown
                                options={collegeOptions}
                                value={filters.collegeName}
                                onChange={(value: string) => handleFilterUpdate('collegeName', value)}
                                placeholder="Select college..."
                            />
                        </div>

                        {/* Course Filter */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                                Course
                            </label>
                            <SearchableDropdown
                                options={courseOptions}
                                value={filters.courseName}
                                onChange={(value: string) => handleFilterUpdate('courseName', value)}
                                placeholder="Select course..."
                            />
                        </div>

                        {/* Branch Filter */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                                Branch/Department
                            </label>
                            <SearchableDropdown
                                options={branchOptions}
                                value={filters.branch}
                                onChange={(value: string) => handleFilterUpdate('branch', value)}
                                placeholder="Select branch..."
                            />
                        </div>

                        {/* File Type Filter */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FileType className="h-4 w-4 mr-2 text-gray-500" />
                                File Type
                            </label>
                            <select
                                value={filters.fileType}
                                onChange={(e) => handleFilterUpdate('fileType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">All File Types</option>
                                <option value="notes">📚 Study Notes</option>
                                <option value="pyq">📄 Previous Year Questions</option>
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                Academic Year
                            </label>
                            <select
                                value={filters.year}
                                onChange={(e) => handleFilterUpdate('year', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">All Years</option>
                                <option value="1st">🎯 1st Year</option>
                                <option value="2nd">🎯 2nd Year</option>
                                <option value="3rd">🎯 3rd Year</option>
                                <option value="4th">🎯 4th Year</option>
                            </select>
                        </div>

                        {/* Semester Filter */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Hash className="h-4 w-4 mr-2 text-gray-500" />
                                Semester
                            </label>
                            <select
                                value={filters.semester}
                                onChange={(e) => handleFilterUpdate('semester', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">All Semesters</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem.toString()}>
                                        Semester {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Paper Type Filter */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FileType className="h-4 w-4 mr-2 text-gray-500" />
                                Paper Type
                            </label>
                            <select
                                value={filters.paperType}
                                onChange={(e) => handleFilterUpdate('paperType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">All Paper Types</option>
                                <option value="normal">📝 Regular Paper</option>
                                <option value="back">🔄 Back Paper (Supplementary)</option>
                            </select>
                        </div>

                        {/* Active Filters Display */}
                        {activeFiltersCount > 0 && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Active Filters ({activeFiltersCount})
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(filters).map(([key, value]) => {
                                        if (key === 'page' || !value) return null

                                        return (
                                            <span
                                                key={key}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {key}: {value}
                                                <button
                                                    onClick={() => handleFilterUpdate(key as keyof FilterState, '')}
                                                    className="ml-2 h-4 w-4 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Filtering files...
                    </div>
                </div>
            )}
        </div>
    )
}