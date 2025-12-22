'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange?: (itemsPerPage: number) => void
    showPageSizeSelector?: boolean
    pageSizeOptions?: number[]
    className?: string
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    showPageSizeSelector = true,
    pageSizeOptions = [10, 25, 50, 100],
    className = ''
}: PaginationProps) {
    // Calculate range of items being shown
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    // Generate page numbers to display
    const getPageNumbers = () => {
        const delta = 2 // Number of pages to show on each side of current page
        const range = []
        const rangeWithDots = []

        // Always show first page
        range.push(1)

        // Add pages around current page
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        // Always show last page (if different from first)
        if (totalPages > 1) {
            range.push(totalPages)
        }

        // Add dots where there are gaps
        let prev = 0
        for (const page of range) {
            if (page - prev === 2) {
                rangeWithDots.push(prev + 1)
            } else if (page - prev !== 1) {
                rangeWithDots.push('...')
            }
            rangeWithDots.push(page)
            prev = page
        }

        return rangeWithDots
    }

    const pageNumbers = getPageNumbers()

    if (totalPages <= 1) {
        return null
    }

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Items info and page size selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
                <span>
                    Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of {totalItems.toLocaleString()} results
                </span>

                {showPageSizeSelector && onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="page-size" className="text-sm font-medium">
                            Show:
                        </label>
                        <select
                            id="page-size"
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm">per page</span>
                    </div>
                )}
            </div>

            {/* Pagination controls */}
            <nav className="flex items-center space-x-1" aria-label="Pagination">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                </button>

                {/* Page numbers */}
                <div className="hidden sm:flex">
                    {pageNumbers.map((pageNumber, index) => {
                        if (pageNumber === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </span>
                            )
                        }

                        const isCurrentPage = pageNumber === currentPage
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber as number)}
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium border-t border-b border-gray-300 ${isCurrentPage
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                                aria-current={isCurrentPage ? 'page' : undefined}
                            >
                                {pageNumber}
                            </button>
                        )
                    })}
                </div>

                {/* Mobile page indicator */}
                <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300">
                    Page {currentPage} of {totalPages}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
                    aria-label="Next page"
                >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </nav>
        </div>
    )
}