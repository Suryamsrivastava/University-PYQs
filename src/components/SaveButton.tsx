'use client'

import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface SaveButtonProps {
    fileId: string
    userId?: string
    className?: string
    showText?: boolean
    onSaveChange?: (isSaved: boolean) => void
}

export default function SaveButton({
    fileId,
    userId = 'default-user',
    className = '',
    showText = true,
    onSaveChange
}: SaveButtonProps) {
    const [isSaved, setIsSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [saveForm, setSaveForm] = useState({
        category: 'favorite',
        notes: '',
        tags: ''
    })

    // Check if file is already saved
    useEffect(() => {
        const checkSavedStatus = async () => {
            try {
                const response = await fetch(`/api/saved-files?userId=${userId}`)
                if (response.ok) {
                    const data = await response.json()
                    const saved = data.savedFiles.some((saved: any) => saved.fileId._id === fileId)
                    setIsSaved(saved)
                }
            } catch (error) {
                console.error('Error checking saved status:', error)
            }
        }

        checkSavedStatus()
    }, [fileId, userId])

    const handleSaveFile = async () => {
        if (isSaved) {
            // Unsave file
            setLoading(true)
            try {
                const response = await fetch(`/api/saved-files?fileId=${fileId}&userId=${userId}`, {
                    method: 'DELETE'
                })

                if (response.ok) {
                    setIsSaved(false)
                    toast.success('File removed from saved list')
                    onSaveChange?.(false)
                } else {
                    const data = await response.json()
                    toast.error(data.error || 'Failed to remove file')
                }
            } catch (error) {
                toast.error('An error occurred while removing file')
            } finally {
                setLoading(false)
            }
        } else {
            // Show save modal for new save
            setShowSaveModal(true)
        }
    }

    const handleSaveWithDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/saved-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileId,
                    userId,
                    category: saveForm.category,
                    notes: saveForm.notes,
                    tags: saveForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                })
            })

            if (response.ok) {
                setIsSaved(true)
                setShowSaveModal(false)
                setSaveForm({ category: 'favorite', notes: '', tags: '' })
                toast.success('File saved successfully')
                onSaveChange?.(true)
            } else {
                const data = await response.json()
                if (response.status === 409) {
                    setIsSaved(true) // File was already saved
                    setShowSaveModal(false)
                    toast.success('File is already in your saved list')
                } else {
                    toast.error(data.error || 'Failed to save file')
                }
            }
        } catch (error) {
            toast.error('An error occurred while saving file')
        } finally {
            setLoading(false)
        }
    }

    const buttonClass = `inline-flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isSaved
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`

    return (
        <>
            <button
                onClick={handleSaveFile}
                disabled={loading}
                className={buttonClass}
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : isSaved ? (
                    <BookmarkCheck className="h-4 w-4" />
                ) : (
                    <Bookmark className="h-4 w-4" />
                )}
                {showText && (
                    <span className="text-sm font-medium">
                        {isSaved ? 'Saved' : 'Save'}
                    </span>
                )}
            </button>

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Plus className="h-5 w-5 mr-2 text-blue-600" />
                            Save File
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={saveForm.category}
                                    onChange={(e) => setSaveForm(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="favorite">❤️ Favorite</option>
                                    <option value="important">⭐ Important</option>
                                    <option value="to-review">🕒 To Review</option>
                                    <option value="archive">📁 Archive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                <textarea
                                    value={saveForm.notes}
                                    onChange={(e) => setSaveForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Add personal notes about this file..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {saveForm.notes.length}/500 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Optional)</label>
                                <input
                                    type="text"
                                    value={saveForm.tags}
                                    onChange={(e) => setSaveForm(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="exam, important, chapter1 (separated by commas)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Use tags to organize and search your saved files
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-6">
                            <button
                                onClick={handleSaveWithDetails}
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </span>
                                ) : (
                                    'Save File'
                                )}
                            </button>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}