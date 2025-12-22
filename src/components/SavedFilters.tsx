'use client'

import { useState, useEffect } from 'react'
import { Save, Bookmark, X, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

interface SavedFilter {
    id: string
    name: string
    filters: Record<string, string>
    createdAt: string
}

interface SavedFiltersProps {
    currentFilters: Record<string, string>
    onApplyFilter: (filters: Record<string, string>) => void
}

export default function SavedFilters({ currentFilters, onApplyFilter }: SavedFiltersProps) {
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [filterName, setFilterName] = useState('')
    const [showSaveForm, setShowSaveForm] = useState(false)

    useEffect(() => {
        loadSavedFilters()
    }, [])

    const loadSavedFilters = () => {
        const saved = localStorage.getItem('savedFilters')
        if (saved) {
            try {
                setSavedFilters(JSON.parse(saved))
            } catch (error) {
                console.error('Failed to load saved filters:', error)
            }
        }
    }

    const saveFilter = () => {
        if (!filterName.trim()) {
            toast.error('Please enter a filter name')
            return
        }

        // Check if any filters are actually set
        const hasActiveFilters = Object.values(currentFilters).some(value => value && value !== '1')
        if (!hasActiveFilters) {
            toast.error('No active filters to save')
            return
        }

        const newFilter: SavedFilter = {
            id: Date.now().toString(),
            name: filterName.trim(),
            filters: { ...currentFilters },
            createdAt: new Date().toISOString()
        }

        const updatedFilters = [...savedFilters, newFilter]
        setSavedFilters(updatedFilters)
        localStorage.setItem('savedFilters', JSON.stringify(updatedFilters))

        setFilterName('')
        setShowSaveForm(false)
        toast.success(`Filter "${newFilter.name}" saved successfully`)
    }

    const deleteFilter = (id: string) => {
        const updatedFilters = savedFilters.filter(f => f.id !== id)
        setSavedFilters(updatedFilters)
        localStorage.setItem('savedFilters', JSON.stringify(updatedFilters))
        toast.success('Filter deleted')
    }

    const applyFilter = (filter: SavedFilter) => {
        onApplyFilter(filter.filters)
        setIsOpen(false)
        toast.success(`Applied filter: ${filter.name}`)
    }

    const getActiveFiltersCount = (filters: Record<string, string>) => {
        return Object.values(filters).filter(value => value && value !== '1').length
    }

    const getFilterSummary = (filters: Record<string, string>) => {
        const activeFilters = Object.entries(filters)
            .filter(([key, value]) => value && value !== '1' && key !== 'page')
            .map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                return `${label}: ${value}`
            })

        return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters'
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
                <Bookmark className="h-4 w-4 mr-2" />
                Saved Filters
                {savedFilters.length > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {savedFilters.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Saved Filters</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Save Current Filter */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Current Filters ({getActiveFiltersCount(currentFilters)} active)
                                </span>
                                {!showSaveForm && (
                                    <button
                                        onClick={() => setShowSaveForm(true)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Save
                                    </button>
                                )}
                            </div>

                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {getFilterSummary(currentFilters)}
                            </div>

                            {showSaveForm && (
                                <div className="mt-2 space-y-2">
                                    <input
                                        type="text"
                                        value={filterName}
                                        onChange={(e) => setFilterName(e.target.value)}
                                        placeholder="Enter filter name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && saveFilter()}
                                        autoFocus
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={saveFilter}
                                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Save Filter
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowSaveForm(false)
                                                setFilterName('')
                                            }}
                                            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Saved Filters List */}
                        {savedFilters.length > 0 ? (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">
                                    Saved Filters ({savedFilters.length})
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {savedFilters.map((filter) => (
                                        <div
                                            key={filter.id}
                                            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <button
                                                        onClick={() => applyFilter(filter)}
                                                        className="text-left w-full"
                                                    >
                                                        <div className="text-sm font-medium text-gray-900 truncate">
                                                            {filter.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {getActiveFiltersCount(filter.filters)} filters • {' '}
                                                            {new Date(filter.createdAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1 truncate">
                                                            {getFilterSummary(filter.filters)}
                                                        </div>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => deleteFilter(filter.id)}
                                                    className="ml-2 text-red-400 hover:text-red-600 flex-shrink-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Filter className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">No saved filters yet</p>
                                <p className="text-xs">Apply filters and save them for quick access</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}