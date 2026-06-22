const express = require('express');
const Post = require('../models/post');

const router = express.Router();

//Create a post 

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
module.exports = router;