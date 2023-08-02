const express = require('express');
const usersRouter = require('./users/users-router');
const postsRouter = require('./posts/posts-router');
const { logger } = require('./middleware/middleware');

const server = express();

// enable parsing JSON request bodies
server.use(express.json());

// custom middleware
server.use(logger);

// route handlers
server.use('/api/users', usersRouter);
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;

