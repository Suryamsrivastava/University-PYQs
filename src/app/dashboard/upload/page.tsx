'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, FileText, Loader2, Building, CheckCircle, AlertCircle, Info, BookOpen, GraduationCap, Calendar, Hash, FileType, Users, Cloud, ArrowRight, Zap, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import SearchableDropdown from '../../../components/SearchableDropdown'

interface CollegeOption {
    value: string
    label: string
    code?: string
    location?: string
}

export default function UploadPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        collegeName: '',
        courseName: '',
        year: '',
        branch: '',
        fileType: 'notes',
        semester: '',
        paperType: 'normal',
    })
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // New state for dropdown data
    const [colleges, setColleges] = useState<CollegeOption[]>([])
    const [loadingColleges, setLoadingColleges] = useState(true)

    // Fetch registered colleges on component mount
    useEffect(() => {
        fetchColleges()
    }, [])

    const fetchColleges = async () => {
        console.log('📚 UPLOAD PAGE: Starting to fetch colleges for dropdown')
        try {
            setLoadingColleges(true)
            console.log('🌐 UPLOAD PAGE: Making API call to /api/colleges/dropdown')
            const response = await fetch('/api/colleges/dropdown')
            console.log('📡 UPLOAD PAGE: API response status:', response.status)
            
            const data = await response.json()
            console.log('📦 UPLOAD PAGE: API response data:', data)

            if (data.success) {
                console.log('✅ UPLOAD PAGE: Successfully received colleges:', data.colleges.length)
                console.log('📋 UPLOAD PAGE: Colleges list:', data.colleges)
                setColleges(data.colleges)
            } else {
                console.error('❌ UPLOAD PAGE: Failed to fetch colleges:', data.error)
                // Still allow manual input if API fails
                setColleges([])
            }
        } catch (error) {
            console.error('💥 UPLOAD PAGE: Error fetching colleges:', error)
            // Still allow manual input if fetch fails
            setColleges([])
        } finally {
            setLoadingColleges(false)
            console.log('🏁 UPLOAD PAGE: Finished fetching colleges. Final count:', colleges.length)
        }
    }

    const handleAddNewCollege = () => {
        // Open institutions page in new tab
        window.open('/dashboard/institutions', '_blank')
        toast('Add colleges in the Institution Management page, then refresh this form', {
            icon: '💡',
        })
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        if (!file) {
            setError('Please select a file to upload')
            setLoading(false)
            return
        }

        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('collegeName', formData.collegeName)
        uploadFormData.append('courseName', formData.courseName)
        uploadFormData.append('year', formData.year)
        uploadFormData.append('branch', formData.branch)
        uploadFormData.append('fileType', formData.fileType)
        uploadFormData.append('semester', formData.semester)
        uploadFormData.append('paperType', formData.paperType)

        try {
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: uploadFormData,
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('File uploaded successfully!')
                toast.success('File uploaded successfully!')
                setFormData({
                    collegeName: '',
                    courseName: '',
                    year: '',
                    branch: '',
                    fileType: 'notes',
                    semester: '',
                    paperType: 'normal',
                })
                setFile(null)
                const fileInput = document.getElementById('file') as HTMLInputElement
                if (fileInput) fileInput.value = ''
            } else {
                setError(data.error || 'Failed to upload file')
                toast.error(data.error || 'Failed to upload file')
            }
        } catch (error) {
            setError('An error occurred while uploading')
            toast.error('An error occurred while uploading')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        ← Back to Dashboard
                    </Link>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Cloud className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Educational Content</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Share your study materials, notes, and previous year question papers to help fellow students
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Upload Tips */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Upload Statistics */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                                Upload Tips
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">High Quality Files</p>
                                        <p className="text-xs text-gray-500">Upload clear, readable documents</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Accurate Information</p>
                                        <p className="text-xs text-gray-500">Fill all details correctly</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Proper Naming</p>
                                        <p className="text-xs text-gray-500">Use descriptive file names</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Format Guide */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileType className="h-5 w-5 text-blue-500 mr-2" />
                                Supported Formats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-red-600">PDF</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">PDF Documents</p>
                                        <p className="text-xs text-gray-500">Best for question papers</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600">DOC</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Word Documents</p>
                                        <p className="text-xs text-gray-500">Great for notes and text</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-green-600">XLS</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Excel Sheets</p>
                                        <p className="text-xs text-gray-500">Perfect for data tables</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-sm p-6 text-white">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Star className="h-5 w-5 mr-2" />
                                Need Help?
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={fetchColleges}
                                    disabled={loadingColleges}
                                    className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <span className="text-sm font-medium">Refresh College List</span>
                                    <Building className="h-4 w-4" />
                                </button>
                                <Link
                                    href="/dashboard/institutions"
                                    className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <span className="text-sm font-medium">Add New College</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Upload Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Upload New File</h2>
                                        <p className="text-blue-100">Fill in the details below to upload your file</p>
                                    </div>
                                    <Upload className="h-8 w-8 text-blue-200" />
                                </div>
                            </div>

                            <div className="p-8">

                                {/* Progress Steps */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                            <span className="text-sm font-medium text-gray-900">Institution Details</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                            <span className="text-sm font-medium text-gray-500">Course Information</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                            <span className="text-sm font-medium text-gray-500">File Upload</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Success/Error Messages */}
                                {message && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                                        <p className="text-green-700">{message}</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Institution Details Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Users className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Institution Details</h3>
                                                <p className="text-sm text-gray-500">Select your college and course information</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                    <Building className="h-4 w-4 mr-2 text-blue-500" />
                                                    College Name *
                                                    {loadingColleges && (
                                                        <span className="ml-2 text-xs text-blue-600">Loading...</span>
                                                    )}
                                                </label>
                                                <SearchableDropdown
                                                    options={colleges}
                                                    value={formData.collegeName}
                                                    onChange={(value: string) => setFormData(prev => ({ ...prev, collegeName: value }))}
                                                    placeholder="Select or enter college name"
                                                    emptyMessage={loadingColleges ? "Loading colleges..." : "No registered colleges found"}
                                                    onAddNew={handleAddNewCollege}
                                                    addNewLabel="Add New College"
                                                    required
                                                />
                                                {!loadingColleges && colleges.length === 0 && (
                                                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-xs text-amber-600">
                                                        <Info className="h-4 w-4 mr-2" />
                                                        <span>No colleges registered yet.</span>
                                                        <Link
                                                            href="/dashboard/institutions"
                                                            className="ml-1 text-blue-600 hover:text-blue-800 underline font-medium"
                                                        >
                                                            Add colleges here
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                    <GraduationCap className="h-4 w-4 mr-2 text-purple-500" />
                                                    Course Name *
                                                </label>
                                                <SearchableDropdown
                                                    options={[
                                                        { value: 'B.Tech', label: 'B.Tech (Bachelor of Technology)' },
                                                        { value: 'B.E', label: 'B.E (Bachelor of Engineering)' },
                                                        { value: 'BCA', label: 'BCA (Bachelor of Computer Applications)' },
                                                        { value: 'MCA', label: 'MCA (Master of Computer Applications)' },
                                                        { value: 'M.Tech', label: 'M.Tech (Master of Technology)' },
                                                        { value: 'B.Sc', label: 'B.Sc (Bachelor of Science)' },
                                                        { value: 'M.Sc', label: 'M.Sc (Master of Science)' },
                                                        { value: 'MBA', label: 'MBA (Master of Business Administration)' },
                                                        { value: 'BBA', label: 'BBA (Bachelor of Business Administration)' },
                                                        { value: 'B.Com', label: 'B.Com (Bachelor of Commerce)' },
                                                        { value: 'M.Com', label: 'M.Com (Master of Commerce)' },
                                                        { value: 'BA', label: 'BA (Bachelor of Arts)' },
                                                        { value: 'MA', label: 'MA (Master of Arts)' }
                                                    ]}
                                                    value={formData.courseName}
                                                    onChange={(value: string) => setFormData(prev => ({ ...prev, courseName: value }))}
                                                    placeholder="Select or enter course name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic Details Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <BookOpen className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Academic Details</h3>
                                                <p className="text-sm text-gray-500">Specify the academic year, branch, and semester</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                    <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                                                    Academic Year *
                                                </label>
                                                <select
                                                    name="year"
                                                    value={formData.year}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                                                >
                                                    <option value="">Choose academic year</option>
                                                    <option value="1st">🎯 1st Year</option>
                                                    <option value="2nd">🎯 2nd Year</option>
                                                    <option value="3rd">🎯 3rd Year</option>
                                                    <option value="4th">🎯 4th Year</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                    <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                                                    Branch/Department *
                                                </label>
                                                <SearchableDropdown
                                                    options={[
                                                        { value: 'Computer Science Engineering', label: 'Computer Science Engineering (CSE)' },
                                                        { value: 'Information Technology', label: 'Information Technology (IT)' },
                                                        { value: 'Electronics and Communication', label: 'Electronics and Communication (ECE)' },
                                                        { value: 'Electrical Engineering', label: 'Electrical Engineering (EE)' },
                                                        { value: 'Mechanical Engineering', label: 'Mechanical Engineering (ME)' },
                                                        { value: 'Civil Engineering', label: 'Civil Engineering (CE)' },
                                                        { value: 'Chemical Engineering', label: 'Chemical Engineering (CHE)' },
                                                        { value: 'Aerospace Engineering', label: 'Aerospace Engineering (AE)' },
                                                        { value: 'Biotechnology', label: 'Biotechnology (BT)' },
                                                        { value: 'Computer Applications', label: 'Computer Applications (CA)' },
                                                        { value: 'Business Administration', label: 'Business Administration (BA)' },
                                                        { value: 'Commerce', label: 'Commerce' },
                                                        { value: 'Mathematics', label: 'Mathematics' },
                                                        { value: 'Physics', label: 'Physics' },
                                                        { value: 'Chemistry', label: 'Chemistry' },
                                                        { value: 'English', label: 'English' },
                                                        { value: 'Economics', label: 'Economics' },
                                                        { value: 'History', label: 'History' },
                                                        { value: 'Political Science', label: 'Political Science' },
                                                        { value: 'Psychology', label: 'Psychology' }
                                                    ]}
                                                    value={formData.branch}
                                                    onChange={(value: string) => setFormData(prev => ({ ...prev, branch: value }))}
                                                    placeholder="Select or enter branch/department"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                    <Hash className="h-4 w-4 mr-2 text-teal-500" />
                                                    Semester *
                                                </label>
                                                <select
                                                    name="semester"
                                                    value={formData.semester}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                                                >
                                                    <option value="">Choose semester</option>
                                                    <option value="1">📚 1st Semester</option>
                                                    <option value="2">📚 2nd Semester</option>
                                                    <option value="3">📚 3rd Semester</option>
                                                    <option value="4">📚 4th Semester</option>
                                                    <option value="5">📚 5th Semester</option>
                                                    <option value="6">📚 6th Semester</option>
                                                    <option value="7">📚 7th Semester</option>
                                                    <option value="8">📚 8th Semester</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* File Details Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">File Details</h3>
                                                <p className="text-sm text-gray-500">Upload your document and specify its type</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                            <div className="space-y-2">
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                    <FileText className="h-4 w-4 mr-2 text-pink-500" />
                                                    File Type *
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, fileType: 'notes' }))}
                                                        className={`p-4 rounded-lg border-2 transition-all ${formData.fileType === 'notes'
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        <BookOpen className="h-6 w-6 mx-auto mb-2" />
                                                        <p className="text-sm font-medium">Study Notes</p>
                                                        <p className="text-xs text-gray-500 mt-1">Lecture notes, summaries</p>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, fileType: 'pyq' }))}
                                                        className={`p-4 rounded-lg border-2 transition-all ${formData.fileType === 'pyq'
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        <FileText className="h-6 w-6 mx-auto mb-2" />
                                                        <p className="text-sm font-medium">Previous Year Questions</p>
                                                        <p className="text-xs text-gray-500 mt-1">Question papers, exams</p>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                                    <Calendar className="h-4 w-4 mr-2 text-red-500" />
                                                    Paper Type *
                                                </label>
                                                <select
                                                    name="paperType"
                                                    value={formData.paperType}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                                                >
                                                    <option value="normal">📝 Regular Paper</option>
                                                    <option value="back">🔄 Back Paper (Supplementary)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* File Upload Area */}
                                        <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                                            <div className="text-center">
                                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <label className="cursor-pointer">
                                                    <span className="text-lg font-medium text-gray-700 mb-2 block">
                                                        Choose File to Upload
                                                    </span>
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        onChange={handleFileChange}
                                                        required
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                        className="hidden"
                                                    />
                                                    <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Browse Files
                                                    </span>
                                                </label>
                                                {file && (
                                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                            <span className="text-sm text-green-700 font-medium">
                                                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-500 mt-3">
                                                    Supported formats: PDF, DOC, DOCX, XLS, XLSX • Max size: 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload File
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}