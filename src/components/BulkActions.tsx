'use client'

import { useState } from 'react'
import { Trash2, Download, Archive, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

interface BulkActionsProps {
    selectedFiles: string[]
    onClearSelection: () => void
    onRefresh: () => void
}

export default function BulkActions({ selectedFiles, onClearSelection, onRefresh }: BulkActionsProps) {
    const [isProcessing, setIsProcessing] = useState(false)

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)? This action cannot be undone.`)) {
            return
        }

        setIsProcessing(true)
        try {
            const deletePromises = selectedFiles.map(fileId =>
                fetch('/api/files', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileId })
                })
            )

            const results = await Promise.allSettled(deletePromises)
            const successful = results.filter(result => result.status === 'fulfilled').length
            const failed = results.length - successful

            if (successful > 0) {
                toast.success(`Successfully deleted ${successful} file(s)`)
            }
            if (failed > 0) {
                toast.error(`Failed to delete ${failed} file(s)`)
            }

            onClearSelection()
            onRefresh()
        } catch (error) {
            toast.error('An error occurred during bulk delete')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleBulkDownload = () => {
        toast.success(`Starting download for ${selectedFiles.length} file(s)`)
        // Note: In a real implementation, you'd create a zip file or download files one by one
        selectedFiles.forEach((fileId, index) => {
            setTimeout(() => {
                // Trigger individual file downloads
                console.log(`Downloading file ${fileId}`)
            }, index * 1000) // Stagger downloads
        })
    }

    if (selectedFiles.length === 0) {
        return null
    }

    return (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="bg-blue-100 rounded-full p-2">
                            <Tag className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleBulkDownload}
                        disabled={isProcessing}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                    </button>

                    <button
                        onClick={handleBulkDelete}
                        disabled={isProcessing}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {isProcessing ? 'Deleting...' : 'Delete'}
                    </button>

                    <button
                        onClick={onClearSelection}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}