import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
        required: true, // You can make it optional if needed
    },
});

// Create a model for Article
const Article = mongoose.model('Article', articleSchema);

export default Article;
