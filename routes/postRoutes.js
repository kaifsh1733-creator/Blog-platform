const express = require('express');
const Post = require('../models/Post');
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
                console.log(err);
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//Get all posts 

router.get('/', async (req, res) => {
  try {
    const search = req.query.search || "";

    const posts = await Post.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    }).populate("author", "name email");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//My Posts

router.get("/myposts", protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//Get single post by id

router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id).populate('author', 'name email');
        if (!post) {
            return res.status(404).json({message: 'post not found'});
        }
        res.status(200).json(post);
    }
    catch (err) {
                console.log(err);
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//Update a post 

router.put('/:id', protect,  async (req, res) => {
    try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedPost) {
            return res.status(404).json({message: 'post not found'});
        }
        res.status(200).json(updatedPost);
    }
    catch (err) {
                console.log(err);
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//Delete a post 

router.delete('/:id', protect,  async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({message: 'post not found'});
        }
        await post.deleteOne();
        
        res.status(200).json({message: 'post deleted successfully'});
    }
    catch (err) {
                console.log(err);
        res.status(500).json({message: 'server error', error: err.message});
    }
});

//like / unlike a post

router.put("/:id/like", protect, async (req, res) => {
  try {
    const userId = req.userId;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let updatedPost;

    if (post.likes.some(id => id.toString() === userId)) {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    return res.status(200).json(updatedPost);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;