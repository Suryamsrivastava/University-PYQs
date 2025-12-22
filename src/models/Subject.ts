import mongoose, { Document, Schema } from 'mongoose'

export interface ISubject extends Document {
    name: string
    code: string
    courseId: mongoose.Types.ObjectId
    semester: number
    credits: number
    type: 'core' | 'elective' | 'practical' | 'project'
    description?: string
    syllabus?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const SubjectSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Subject code is required'],
        trim: true,
        uppercase: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    semester: {
        type: Number,
        required: [true, 'Semester is required'],
        min: 1,
        max: 20
    },
    credits: {
        type: Number,
        required: [true, 'Credits are required'],
        min: 1,
        max: 10
    },
    type: {
        type: String,
        enum: ['core', 'elective', 'practical', 'project'],
        required: [true, 'Subject type is required']
    },
    description: {
        type: String,
        trim: true
    },
    syllabus: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// Create compound index to ensure unique subject code per course
SubjectSchema.index({ code: 1, courseId: 1 }, { unique: true })

// Create indexes for better search performance
SubjectSchema.index({ name: 'text', description: 'text' })
SubjectSchema.index({ isActive: 1 })
SubjectSchema.index({ courseId: 1, semester: 1 })

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema)