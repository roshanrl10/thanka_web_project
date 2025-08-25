const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, image, isPublished } = req.body;

    const newPost = new Post({
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      image: image || '',
      isPublished: isPublished || false,
      author: req.user.id
    });

    const post = await newPost.save();
    await post.populate('author', ['firstName', 'lastName', 'avatar']);

    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts
// @desc    Get all published posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate('author', ['firstName', 'lastName', 'avatar'])
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/user
// @desc    Get all posts by current user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', ['firstName', 'lastName', 'avatar'])
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', ['firstName', 'lastName', 'avatar'])
      .populate('comments.user', ['firstName', 'lastName', 'avatar']);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const { title, content, tags, image, isPublished } = req.body;

    const postFields = {};
    if (title) postFields.title = title;
    if (content) postFields.content = content;
    if (tags) postFields.tags = tags.split(',').map(tag => tag.trim());
    if (image !== undefined) postFields.image = image;
    if (isPublished !== undefined) postFields.isPublished = isPublished;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    ).populate('author', ['firstName', 'lastName', 'avatar']);

    res.json(updatedPost);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/like/:id
// @desc    Like or unlike a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post has already been liked
    if (post.likes.some(like => like.user.toString() === req.user.id)) {
      // Remove like
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      // Add like
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', [
  auth,
  body('text').notEmpty().withMessage('Text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      user: req.user.id
    };

    post.comments.unshift(newComment);
    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
