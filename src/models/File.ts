import mongoose, { Document, Schema } from 'mongoose'

export interface IFile extends Document {
    collegeName: string
    courseName: string
    year: string
    branch: string
    fileType: 'notes' | 'pyq' // notes or previous year question papers
    fileName: string
    originalFileName: string
    fileUrl: string
    cloudinaryPublicId: string
    semester: string
    paperType: 'normal' | 'back' // normal paper or back paper
    uploadDate: Date
}

const FileSchema: Schema = new Schema({
    collegeName: {
        type: String,
        required: [true, 'College name is required'],
        trim: true,
    },
    courseName: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true,
    },
    year: {
        type: String,
        required: [true, 'Year is required'],
        trim: true,
    },
    branch: {
        type: String,
        required: [true, 'Branch is required'],
        trim: true,
    },
    fileType: {
        type: String,
        enum: ['notes', 'pyq'],
        required: [true, 'File type is required'],
    },
    fileName: {
        type: String,
        required: [true, 'File name is required'],
        trim: true,
    },
    originalFileName: {
        type: String,
        required: [true, 'Original file name is required'],
        trim: true,
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required'],
    },
    cloudinaryPublicId: {
        type: String,
        required: [true, 'Cloudinary public ID is required'],
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        trim: true,
    },
    paperType: {
        type: String,
        enum: ['normal', 'back'],
        required: [true, 'Paper type is required'],
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.File || mongoose.model<IFile>('File', FileSchema)