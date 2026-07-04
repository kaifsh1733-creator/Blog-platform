const express = require('express');
const Comment = require('../models/Comment');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

//Add a comment 

router.post('/', protect,  async (req, res) => {
    try{
        const {text, author, post } = req.body;
        const newComment = await 
        Comment.create({ text, author, post });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: "Server eror", error: err.message });
    }
});

//set all comments for a specific post 

router.get('/:postId', async (req, res) => {
    try{
        const comments = await 
        comment.find({post: req.params.postId }).populate('author', 'name email');
        res.status(200).json(Comments);
    } catch (err) {
        res.status(500).json({ message: "Server eror", error: err.message });
    }
});

//Delete a comment 

router.delete('/:Id', protect,  async (req, res) => {
    try{
        const deletedComment = await 
        Comment.findbyIdAndDelete(req.params.id );
        if (!deletedComment) {
            res.status(404).json({ message: 'comment not found'});
        }
             res.status(200).json({ message: 'comment deleted successfully'});
    } catch (err) {
        res.status(500).json({ message: "Server eror", error: err.message });
    }
});

module.exports = router;   