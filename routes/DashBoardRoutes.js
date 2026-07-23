const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId });

    const totalPosts = posts.length;

    const totalLikes = posts.reduce((sum, post) => {
      return sum + post.likes.length;
    }, 0);

    const postIds = posts.map((post) => post._id);

    const totalComments = await Comment.countDocuments({
      post: { $in: postIds },
    });

    res.json({
      totalPosts,
      totalLikes,
      totalComments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;