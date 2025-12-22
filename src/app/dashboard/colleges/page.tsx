'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MapPin,
    Calendar,
    ExternalLink,
    Building,
    GraduationCap,
    Users,
    BookOpen,
    BarChart3,
    Plus,
    X
} from 'lucide-react';

// Simple UI Components
const Card = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string;[key: string]: any }) => (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string;[key: string]: any }) => (
    <div className={`p-6 pb-4 ${className}`} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string;[key: string]: any }) => (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props}>
        {children}
    </h3>
);

const CardContent = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string;[key: string]: any }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
        {children}
    </div>
);

const Badge = ({ children, variant = 'default', className = '', ...props }: {
    children: React.ReactNode;
    variant?: 'default' | 'secondary' | 'outline';
    className?: string;
    [key: string]: any
}) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    const variants = {
        default: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        outline: 'border border-gray-200 text-gray-600'
    };

    return (
        <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
};

const Input = ({ className = '', ...props }: { className?: string;[key: string]: any }) => (
    <input
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Button = ({ children, variant = 'default', className = '', ...props }: {
    children: React.ReactNode;
    variant?: 'default' | 'outline';
    className?: string;
    [key: string]: any
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    };

    return (
        <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

interface College {
    _id: string;
    name: string;
    shortName?: string;
    code: string;
    location?: string;
    city: string;
    state: string;
    type: string;
    category?: string;
    establishedYear?: number;
    affiliation?: string;
    courses?: string[];
    branches?: string[];
    website?: string;
    status: string;
}

interface Statistics {
    total: number;
    active: number;
    recentlyAdded: number;
    byType: { _id: string; count: number }[];
    byCategory: { _id: string; count: number }[];
    byState: { _id: string; count: number }[];
}

export default function CollegeManagementPage() {
    const [colleges, setColleges] = useState<College[]>([]);
    const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [addingCollege, setAddingCollege] = useState(false);
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
    });
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        fetchColleges();
        fetchStatistics();
    }, []);

    useEffect(() => {
        filterColleges();
    }, [colleges, searchTerm, selectedType, selectedCategory, selectedState]);

    const fetchColleges = async () => {
        try {
            const response = await fetch('/api/colleges');
            const data = await response.json();
            if (data.success) {
                setColleges(data.colleges);
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/api/colleges/bulk-import');
            const data = await response.json();
            if (data.success) {
                setStatistics(data.statistics);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const filterColleges = () => {
        let filtered = colleges;

        if (searchTerm) {
            filtered = filtered.filter(college =>
                college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                college.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                college.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                college.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                college.state.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedType) {
            filtered = filtered.filter(college =>
                college.type.toLowerCase() === selectedType.toLowerCase()
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(college =>
                college.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (selectedState) {
            filtered = filtered.filter(college =>
                college.state === selectedState
            );
        }

        setFilteredColleges(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedCategory('');
        setSelectedState('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!formData.name.trim()) errors.name = 'College name is required';
        if (!formData.code.trim()) errors.code = 'College code is required';
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.state.trim()) errors.state = 'State is required';
        if (!formData.type) errors.type = 'Type is required';
        
        if (formData.establishedYear && !/^\d{4}$/.test(formData.establishedYear)) {
            errors.establishedYear = 'Please enter a valid 4-digit year';
        }
        
        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            errors.website = 'Please enter a valid URL starting with http:// or https://';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCollege = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setAddingCollege(true);
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
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success - refresh data and close modal
                await fetchColleges();
                await fetchStatistics();
                setShowAddModal(false);
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
                });
                setFormErrors({});
            } else {
                // Handle server errors
                if (data.error) {
                    if (data.error.includes('already exists')) {
                        setFormErrors({ submit: 'College with this name or code already exists' });
                    } else {
                        setFormErrors({ submit: data.error });
                    }
                } else {
                    setFormErrors({ submit: 'Failed to add college. Please try again.' });
                }
            }
        } catch (error) {
            console.error('Error adding college:', error);
            setFormErrors({ submit: 'Network error. Please check your connection and try again.' });
        } finally {
            setAddingCollege(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'government': return 'bg-blue-100 text-blue-800';
            case 'private': return 'bg-green-100 text-green-800';
            case 'autonomous': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'Technical': return 'bg-orange-100 text-orange-800';
            case 'Medical': return 'bg-red-100 text-red-800';
            case 'Management': return 'bg-yellow-100 text-yellow-800';
            case 'University': return 'bg-indigo-100 text-indigo-800';
            case 'Research Institute': return 'bg-pink-100 text-pink-800';
            case 'Design': return 'bg-teal-100 text-teal-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">College Database</h1>
                    <p className="text-gray-600 mt-1">Manage and explore college information</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                        {filteredColleges.length} of {colleges.length} colleges
                    </Badge>
                    <Button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add New College
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Colleges</CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{statistics.recentlyAdded}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.byCategory.length}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, code, city, or state..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <select
                            value={selectedType}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="government">Government</option>
                            <option value="private">Private</option>
                            <option value="autonomous">Autonomous</option>
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
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
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedState(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All States</option>
                            {statistics?.byState.slice(0, 10).map(state => (
                                <option key={state._id} value={state._id}>{state._id}</option>
                            ))}
                        </select>

                        <Button variant="outline" onClick={clearFilters}>
                            <Filter className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* College Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredColleges.map((college) => (
                    <Card key={college._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg leading-tight">
                                        {college.name}
                                    </CardTitle>
                                    {college.shortName && (
                                        <p className="text-sm text-gray-600 mt-1">{college.shortName}</p>
                                    )}
                                </div>
                                <Badge className={`ml-2 ${getTypeColor(college.type)}`}>
                                    {college.type}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Basic Info */}
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{college.location || `${college.city}, ${college.state}`}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    {college.code}
                                </Badge>
                                {college.category && (
                                    <Badge className={`text-xs ${getCategoryColor(college.category)}`}>
                                        {college.category}
                                    </Badge>
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
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {course}
                                            </Badge>
                                        ))}
                                        {college.courses.length > 4 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{college.courses.length - 4} more
                                            </Badge>
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
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {branch}
                                            </Badge>
                                        ))}
                                        {college.branches.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{college.branches.length - 3} more
                                            </Badge>
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
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredColleges.length === 0 && (
                <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No colleges found</h3>
                    <p className="mt-2 text-gray-600">
                        Try adjusting your search criteria or clear the filters.
                    </p>
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
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={formErrors.name ? 'border-red-500' : ''}
                                            placeholder="Enter college name"
                                        />
                                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                    </div>

                                    {/* College Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            College Code *
                                        </label>
                                        <Input
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            className={formErrors.code ? 'border-red-500' : ''}
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
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={formErrors.city ? 'border-red-500' : ''}
                                            placeholder="Enter city"
                                        />
                                        {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State *
                                        </label>
                                        <Input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={formErrors.state ? 'border-red-500' : ''}
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
                                        <Input
                                            name="establishedYear"
                                            value={formData.establishedYear}
                                            onChange={handleInputChange}
                                            className={formErrors.establishedYear ? 'border-red-500' : ''}
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
                                        <Input
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            className={formErrors.website ? 'border-red-500' : ''}
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
                                    <Input
                                        name="affiliation"
                                        value={formData.affiliation}
                                        onChange={handleInputChange}
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={addingCollege}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={addingCollege}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {addingCollege ? 'Adding...' : 'Add College'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}