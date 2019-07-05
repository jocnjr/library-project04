const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/books', (req, res) => {
  Book.find()
  .then(books => {
    res.render('books', { books });
  })
  .catch(err => console.log(err));
});

router.get('/book/:bookID', (req, res) => {
  const book = req.params.bookID;
  Book.findById(book)
  .then(book => {
    console.log(book)
    res.render('book-details', book);
  })
  .catch(err => console.log(err));
});



module.exports = router;