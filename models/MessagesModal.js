import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Create Message Schema
const messageSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId, // Reference to User
            ref: 'Users',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId, // Reference to User
            ref: 'Users',
            required: false
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },

    },

);

// Export Message Model
const Message = model('Messages', messageSchema);

export default Message;
