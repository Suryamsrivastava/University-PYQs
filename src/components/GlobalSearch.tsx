'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, Building, BookOpen, User, FileText } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
    _id: string
    fileName: string
    originalFileName: string
    collegeName: string
    courseName: string
    branch: string
    year: string
    semester: string
    fileType: 'notes' | 'pyq'
    uploadDate: string
}

interface SearchSuggestion {
    type: 'college' | 'course' | 'branch'
    value: string
}

interface GlobalSearchProps {
    placeholder?: string
    className?: string
}

export default function GlobalSearch({ placeholder = "Search files, colleges, courses...", className = "" }: GlobalSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches')
        if (saved) {
            setRecentSearches(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (query.length >= 2) {
                performSearch()
                getSuggestions()
            } else {
                setResults([])
                setSuggestions([])
            }
        }, 300)

        return () => clearTimeout(delayedSearch)
    }, [query])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const performSearch = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=global`)
            const data = await response.json()

            if (response.ok) {
                setResults(data.files || [])
            }
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const getSuggestions = async () => {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=suggestions`)
            const data = await response.json()

            if (response.ok) {
                setSuggestions(data.suggestions || [])
            }
        } catch (error) {
            console.error('Suggestions failed:', error)
        }
    }

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery)

        // Add to recent searches
        const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(newRecentSearches)
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))

        setIsOpen(true)
        inputRef.current?.focus()
    }

    const clearSearch = () => {
        setQuery('')
        setResults([])
        setSuggestions([])
        setIsOpen(false)
    }

    const getSuggestionIcon = (type: string) => {
        switch (type) {
            case 'college': return <Building className="h-4 w-4 text-blue-500" />
            case 'course': return <BookOpen className="h-4 w-4 text-green-500" />
            case 'branch': return <User className="h-4 w-4 text-purple-500" />
            default: return <Search className="h-4 w-4 text-gray-500" />
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {query.length < 2 ? (
                        <div className="p-4">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Recent Searches
                                    </h4>
                                    <div className="space-y-1">
                                        {recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSearch(search)}
                                                className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-sm text-gray-500 text-center py-4">
                                Start typing to search files, colleges, and courses...
                            </div>
                        </div>
                    ) : (
                        <div>
                            {loading && (
                                <div className="p-4 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                    <div className="text-sm text-gray-500 mt-2">Searching...</div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="p-2 border-b border-gray-100">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
                                        Suggestions
                                    </h4>
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSearch(suggestion.value)}
                                            className="w-full flex items-center px-2 py-2 text-sm hover:bg-gray-50 rounded"
                                        >
                                            {getSuggestionIcon(suggestion.type)}
                                            <span className="ml-2">{suggestion.value}</span>
                                            <span className="ml-auto text-xs text-gray-400 capitalize">
                                                {suggestion.type}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Search Results */}
                            {results.length > 0 && (
                                <div className="p-2">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
                                        Files ({results.length})
                                    </h4>
                                    {results.map((file) => (
                                        <Link
                                            key={file._id}
                                            href={`/dashboard/files?search=${encodeURIComponent(file.originalFileName)}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-2 py-2 hover:bg-gray-50 rounded"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <FileText className={`h-4 w-4 ${file.fileType === 'pyq' ? 'text-blue-500' : 'text-green-500'
                                                        }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {file.originalFileName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {file.collegeName} • {file.courseName}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {file.year} {file.branch} • {formatDate(file.uploadDate)}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${file.fileType === 'notes'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {file.fileType === 'notes' ? 'Notes' : 'PYQ'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {!loading && query.length >= 2 && results.length === 0 && suggestions.length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                    No results found for "{query}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}