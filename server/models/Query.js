const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    status: {
        type: String,
        // Added 'ESCALATED' to your enum as it is used in your controllers
        enum: ['UNASSIGNED', 'ASSIGNED', 'RESOLVED', 'ESCALATED', 'DISMANTLED'],
        default: 'UNASSIGNED'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    answer: {
        type: String,
        default: ''
    },
    
    // --- UPDATED CHAT HISTORY ---
    history: [{
        sender: { type: String },         // e.g. "Vipin Raj" or "Admin"
        senderRole: { 
            type: String, 
            enum: ['USER', 'ADMIN', 'HEAD'], 
            required: true 
        },                                // <--- CRITICAL: Determines Bubble Color
        message: { type: String },        // The actual chat message
        action: { type: String },         // "RESOLVED", "REOPENED", "COMMENT"
        date: { type: Date, default: Date.now }
    }],

}, { timestamps: true });

module.exports = mongoose.model('Query', QuerySchema);