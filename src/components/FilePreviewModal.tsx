'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Download, ExternalLink, FileText, FileImage, File as FileIcon } from 'lucide-react'

interface FilePreviewModalProps {
    isOpen: boolean
    onClose: () => void
    file: {
        _id: string
        fileName: string
        originalFileName: string
        fileUrl: string
        collegeName: string
        courseName: string
        year: string
        branch: string
        semester: string
        fileType: 'notes' | 'pyq'
        paperType: 'normal' | 'back'
        uploadDate: string
    } | null
}

export default function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
    const [imageError, setImageError] = useState(false)

    if (!file) return null

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()

        switch (extension) {
            case 'pdf':
                return <FileText className="h-8 w-8 text-red-500" />
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FileImage className="h-8 w-8 text-blue-500" />
            default:
                return <FileIcon className="h-8 w-8 text-gray-500" />
        }
    }

    const isImage = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
    }

    const isPDF = (fileName: string) => {
        return fileName.toLowerCase().endsWith('.pdf')
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b">
                                    <div className="flex items-center space-x-3">
                                        {getFileIcon(file.fileName)}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {file.originalFileName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {file.collegeName} • {file.courseName}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* File Preview */}
                                <div className="p-6">
                                    {isImage(file.fileName) && !imageError ? (
                                        <div className="max-h-96 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={file.fileUrl}
                                                alt={file.originalFileName}
                                                className="max-h-96 max-w-full object-contain"
                                                onError={() => setImageError(true)}
                                            />
                                        </div>
                                    ) : isPDF(file.fileName) ? (
                                        <div className="h-96 rounded-lg border">
                                            <iframe
                                                src={`${file.fileUrl}#toolbar=0`}
                                                className="w-full h-full rounded-lg"
                                                title={file.originalFileName}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center flex-col space-y-4">
                                            {getFileIcon(file.fileName)}
                                            <p className="text-gray-500 text-center">
                                                Preview not available for this file type
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* File Details */}
                                <div className="px-6 pb-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Type:</span>
                                            <p className="text-gray-600 mt-1">
                                                {file.fileType === 'pyq' ? 'Question Paper' : 'Notes'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Year:</span>
                                            <p className="text-gray-600 mt-1">{file.year}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Branch:</span>
                                            <p className="text-gray-600 mt-1">{file.branch}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Semester:</span>
                                            <p className="text-gray-600 mt-1">{file.semester}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-sm">
                                        <span className="font-medium text-gray-700">Uploaded:</span>
                                        <p className="text-gray-600 mt-1">{formatDate(file.uploadDate)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
                                    <a
                                        href={file.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Open in New Tab
                                    </a>
                                    <a
                                        href={file.fileUrl}
                                        download={file.originalFileName}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </a>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}