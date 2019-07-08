const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const ensureLogin = require("connect-ensure-login");

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/books', ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  Book.find()
  .then(books => {
    res.render('books', { books });
  })
  .catch(err => console.log(err));
});

router.get('/book/:bookID', (req, res) => {
  const book = req.params.bookID;
  Book.findById(book)
  .populate('author')
  .then(book => {
    console.log(book)
    res.render('book-details', book);
  })
  .catch(err => console.log(err));
});

router.get('/books/add', (req, res) => {
  res.render('book-add');
});

router.post('/books/add', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  const newBook = new Book({ title, author, description, rating});

  newBook.save()
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/books/edit/:bookID', (req, res, next) => {
  Book.findById(req.params.bookID)
  .then((book) => {
    res.render("book-edit", {book});
  })
  .catch((error) => {
    console.log(error);
  })
});

router.post('/books/edit/:bookID', (req, res, next) => {
  const { title, author, description, rating } = req.body;

  Book.update({_id: req.params.bookID}, { $set: {title, author, description, rating }})
  .then((book) => {
    res.redirect('/books/edit/' + req.params.bookID);
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/authors/add', (req, res, next) => {
  res.render("author-add")
});

router.post('/authors/add', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl})
  newAuthor.save()
  .then((book) => {
    res.redirect('/books')
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post('/reviews/add/:bookID', (req, res, next) => {
  const { user, comments } = req.body;

  Book.update({ _id: req.params.bookID }, { $push: { reviews: { user, comments }}})
  .then(book => {
    res.redirect('/book/' + req.params.bookID)
  })
  .catch((error) => {
    console.log(error)
  })
});

module.exports = router;