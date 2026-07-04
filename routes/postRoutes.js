const express = require('express');
const Post = require('../models/post');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

//Create a post 

router.post('/', protect,  async (req, res) => {
    try{
        const {title, content, author, tags } =req.body;
        const newpost = await Post.create({ title, content, author, tags });
        res.status(201).json(newpost); 
    }
    catch (err) { 
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//Get all posts 

router.get('/', async (req, res) => {
    try{
        const posts = await Post.find().populate('author', 'name email');
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//Get single post by id

router.get('/:id', async (req, res) => {
    try{
        const posts = await post.findById(req.params.id).populate('author', 'name email');
        if (!post) {
            return res.status(404).json({message: 'post not found'});
        }
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//Update a post 

router.put('/:id', protect,  async (req, res) => {
    try{
        const updatedposts = await Post.findById(req.params.id, req.body, {new: true});
        if (!updatedpost) {
            return res.status(404).json({message: 'post not found'});
        }
        res.status(200).json(updatedpost);
    }
    catch (err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//Delete a post 

router.delete('/:id', protect,  async (req, res) => {
    try{
        const posts = await Post.findById(req.params.id);
        if (!deletedpost) {
            return res.status(404).json({message: 'post not found'});
        }
        res.status(200).json({message: 'post deleted successfully'});
    }
    catch (err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//like / unlike a post

router.put('/:id/like', protect, async (req, res) => {
    try{
        const {userId} = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({message: 'post not found'});
        }
        const alreadyLiked = post.likes.includes(userId);
        if (alreadyLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.status(200).json({likescount: post.likes.length, likes: post.likes});
    }
    catch (err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
});
module.exports = router;