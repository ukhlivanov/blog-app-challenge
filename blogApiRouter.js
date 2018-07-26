const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./model');

BlogPosts.create('News1', 'Content1Content1Content1', 'Author1','05-24-2018' );
BlogPosts.create('News2', 'Content2Content2Content2', 'Author2','06-24-2018' );
BlogPosts.create('News3', 'Content3Content3Content3', 'Author3','07-24-2018' );

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.delete('/:id', (req, res) => {
  console.log(req.params);
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog list item \`${req.params.ID}\``);
  res.status(204).end();
});

router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  console.log(req.body);
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog list item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title:req.body.title,
    author:req.body.author,
    content:req.body.content,
    publishDate:req.body.publishDate
  });
  res.status(204).end();
})

module.exports = router;
