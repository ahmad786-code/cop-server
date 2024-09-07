import express from 'express';
import { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle } from '../controllers/ArticleController.js';

const router = express.Router();

// Article routes
router.post('/articles', createArticle); // Create article
router.get('/articles', getAllArticles); // Get all articles
router.get('/articles/:id', getArticleById); // Get article by ID
router.put('/articles/:id', updateArticle); // Update article
router.delete('/articles/:id', deleteArticle); // Delete article

export default router;
