import mongoose, { Document, Schema } from 'mongoose'

export interface ICollege extends Document {
    name: string
    shortName?: string
    code: string
    address?: string
    location?: string
    city: string
    state: string
    website?: string
    establishedYear?: number
    type: 'Government' | 'Private' | 'Autonomous' | 'government' | 'private' | 'autonomous'
    category?: 'Technical' | 'Medical' | 'Management' | 'University' | 'Research Institute' | 'Design' | 'Fashion/Design'
    affiliation?: string
    courses?: string[]
    branches?: string[]
    status?: 'active' | 'inactive'
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const CollegeSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'College name is required'],
        trim: true,
        unique: true
    },
    shortName: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'College code is required'],
        trim: true,
        unique: true,
        uppercase: true
    },
    address: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    establishedYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
    },
    type: {
        type: String,
        enum: ['Government', 'Private', 'Autonomous', 'government', 'private', 'autonomous'],
        required: [true, 'College type is required']
    },
    category: {
        type: String,
        enum: ['Technical', 'Medical', 'Management', 'University', 'Research Institute', 'Design', 'Fashion/Design'],
        trim: true
    },
    affiliation: {
        type: String,
        trim: true
    },
    courses: [{
        type: String,
        trim: true
    }],
    branches: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// Create indexes for better search performance
CollegeSchema.index({ name: 'text', city: 'text', state: 'text' })
CollegeSchema.index({ isActive: 1 })
CollegeSchema.index({ type: 1 })

export default mongoose.models.College || mongoose.model<ICollege>('College', CollegeSchema)