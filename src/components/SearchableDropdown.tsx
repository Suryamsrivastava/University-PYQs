'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, Check, Plus } from 'lucide-react'

interface Option {
    value: string
    label: string
    code?: string
    location?: string
}

interface SearchableDropdownProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    emptyMessage?: string
    onAddNew?: () => void
    addNewLabel?: string
    className?: string
    required?: boolean
}

export default function SearchableDropdown({
    options,
    value,
    onChange,
    placeholder = "Select an option...",
    emptyMessage = "No options found",
    onAddNew,
    addNewLabel = "Add New",
    className = "",
    required = false
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(-1)

    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setIsOpen(true)
                e.preventDefault()
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighlightedIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
                break
            case 'Enter':
                e.preventDefault()
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    selectOption(filteredOptions[highlightedIndex])
                } else if (searchTerm && filteredOptions.length === 0 && onAddNew) {
                    onAddNew()
                }
                break
            case 'Escape':
                setIsOpen(false)
                inputRef.current?.blur()
                break
        }
    }

    const selectOption = (option: Option) => {
        onChange(option.value)
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
    }

    const handleInputClick = () => {
        setIsOpen(true)
        setSearchTerm('')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSearchTerm(newValue)
        onChange(newValue) // Allow free text input
        setHighlightedIndex(-1)

        if (!isOpen) {
            setIsOpen(true)
        }
    }

    // Get display value for the input
    const displayValue = isOpen ? searchTerm : value

    // Find selected option for display info
    const selectedOption = options.find(opt => opt.value === value)

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Input Field */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={displayValue}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Selected Option Info */}
            {selectedOption && selectedOption.location && !isOpen && (
                <div className="mt-1 text-xs text-gray-500">
                    {selectedOption.code && `${selectedOption.code} • `}{selectedOption.location}
                </div>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {/* Search Header */}
                    {options.length > 5 && (
                        <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-8 pr-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options */}
                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => selectOption(option)}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 focus:outline-none focus:bg-blue-50 ${index === highlightedIndex ? 'bg-blue-50' : ''
                                        } ${option.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{option.label}</div>
                                            {option.location && (
                                                <div className="text-xs text-gray-500">
                                                    {option.code && `${option.code} • `}{option.location}
                                                </div>
                                            )}
                                        </div>
                                        {option.value === value && (
                                            <Check className="h-4 w-4 text-blue-600" />
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                {emptyMessage}
                            </div>
                        )}

                        {/* Add New Option */}
                        {onAddNew && (searchTerm || filteredOptions.length === 0) && (
                            <div className="border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={onAddNew}
                                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {addNewLabel}
                                    {searchTerm && ` "${searchTerm}"`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}