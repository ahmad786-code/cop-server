import Article from '../models/ArticleModel.js';

// Create an article
export const createArticle = async (req, res) => {
    try {
        const { title, description, image } = req.body;

        if (!title || !description || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newArticle = new Article({
            title,
            description,
            image,
        });

        const savedArticle = await newArticle.save();
        return res.status(201).json(savedArticle);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Get all articles
export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        return res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Get article by ID
export const getArticleById = async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        return res.status(200).json(article);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Update article
export const updateArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const { title, description, image } = req.body;

        const updatedArticle = await Article.findByIdAndUpdate(
            articleId,
            { title, description, image },
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: "Article not found" });
        }

        return res.status(200).json(updatedArticle);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Delete article
export const deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const deletedArticle = await Article.findByIdAndDelete(articleId);

        if (!deletedArticle) {
            return res.status(404).json({ message: "Article not found" });
        }

        return res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
