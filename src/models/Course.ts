import mongoose, { Document, Schema } from 'mongoose'

export interface ICourse extends Document {
    name: string
    code: string
    duration: number // in years
    type: 'undergraduate' | 'postgraduate' | 'diploma' | 'certificate'
    category: 'engineering' | 'medical' | 'commerce' | 'arts' | 'science' | 'management' | 'law' | 'other'
    description?: string
    eligibility?: string
    totalSemesters: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const CourseSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Course code is required'],
        trim: true,
        unique: true,
        uppercase: true
    },
    duration: {
        type: Number,
        required: [true, 'Course duration is required'],
        min: 1,
        max: 10
    },
    type: {
        type: String,
        enum: ['undergraduate', 'postgraduate', 'diploma', 'certificate'],
        required: [true, 'Course type is required']
    },
    category: {
        type: String,
        enum: ['engineering', 'medical', 'commerce', 'arts', 'science', 'management', 'law', 'other'],
        required: [true, 'Course category is required']
    },
    description: {
        type: String,
        trim: true
    },
    eligibility: {
        type: String,
        trim: true
    },
    totalSemesters: {
        type: Number,
        required: [true, 'Total semesters is required'],
        min: 1,
        max: 20
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// Create indexes for better search performance
CourseSchema.index({ name: 'text', description: 'text' })
CourseSchema.index({ isActive: 1 })
CourseSchema.index({ type: 1, category: 1 })

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)