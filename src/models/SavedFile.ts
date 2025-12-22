import mongoose from 'mongoose'

const savedFileSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true
    },
    userId: {
        type: String,
        required: true, // For now using email/session ID, later can be user ObjectId
        index: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String,
        trim: true
    }],
    notes: {
        type: String,
        trim: true,
        maxLength: 500
    },
    category: {
        type: String,
        enum: ['important', 'to-review', 'favorite', 'archive'],
        default: 'favorite'
    }
}, {
    timestamps: true
})

// Compound index to ensure a user can't save the same file twice
savedFileSchema.index({ fileId: 1, userId: 1 }, { unique: true })

// Index for efficient queries
savedFileSchema.index({ userId: 1, savedAt: -1 })
savedFileSchema.index({ userId: 1, category: 1 })

export default mongoose.models.SavedFile || mongoose.model('SavedFile', savedFileSchema)