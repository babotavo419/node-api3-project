const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const { 
  validateUserId, 
  validateUser, 
  validatePost 
} = require('../middleware/middleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await Users.get();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});

router.post('/', validateUser, async (req, res, next) => {
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  try {
    const updatedUser = await Users.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await Users.remove(req.params.id);
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const newPost = await Posts.insert({
      ...req.body,
      user_id: req.params.id,
    });
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// POST route for creating a new post for a specific user
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  Posts.insert({ user_id: req.params.id, ...req.body })
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error creating the post' });
    });
});

// GET route for fetching all posts of a specific user
router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error fetching the posts' });
    });
});

module.exports = router;

