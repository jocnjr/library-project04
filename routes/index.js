const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const ensureLogin = require('connect-ensure-login');

router.get('/', (req, res) => {
  res.redirect('/books');
});

router.get('/books', (req, res) => {
  Book.find()
    .then(books => {
      // checking if owner is user logged in
      books.forEach(book => {
        if (req.isAuthenticated() && book.owner && book.owner.equals(req.user._id)) book.isOwner = true;
      });
      res.render('books', {
        books,
        user: req.user,
        GMAPS: process.env.GMAPS
      });
    })
    .catch(err => console.log(err));
});

router.get('/book/:bookID', (req, res) => {
  const book = req.params.bookID;
  Book.findById(book)
    .populate('author')
    .then(book => {
      res.render('book-details', {
        book,
        user: req.user,
        GMAPS: process.env.GMAPS
      });
    })
    .catch(err => console.log(err));
});

router.get('/books/add', ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  Author.find({}, null, { sort: { name: 1 } })
    .then(authors => {
      res.render('book-add', { authors, user: req.user });
    })
    .catch(err => console.log(err));

});

router.post('/books/add', (req, res, next) => {
  const { title, author, description, rating, owner, latitude, longitude } = req.body;

  const location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
  const newBook = new Book({ title, author, description, rating, owner, location });

  newBook.save()
    .then((book) => {
      res.redirect('/books');
    })
    .catch((error) => {
      console.log(error);
    })
});

router.get('/books/edit/:bookID', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  Book.findById(req.params.bookID)
    .then((book) => {
      res.render("book-edit", { book });
    })
    .catch((error) => {
      console.log(error);
    })
});

router.post('/books/edit/:bookID', (req, res, next) => {
  const { title, author, description, rating, latitude, longitude } = req.body;

  const location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };

  Book.update({ _id: req.params.bookID }, { $set: { title, author, description, rating, location } })
    .then((book) => {
      res.redirect('/books/edit/' + req.params.bookID);
    })
    .catch((error) => {
      console.log(error);
    })
});

router.get('/authors/add', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render("author-add")
});

router.post('/authors/add', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl })
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

  Book.update({ _id: req.params.bookID }, { $push: { reviews: { user, comments } } })
    .then(book => {
      res.redirect('/book/' + req.params.bookID)
    })
    .catch((error) => {
      console.log(error)
    })
});

const checkRoles = role => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      next();
    } else {
      res.redirect('/auth/login');
    }
  }
}

const isAdmin = checkRoles('ADMIN');
const isEditor = checkRoles('EDITOR');
const isGuest = checkRoles('GUEST');

router.get('/dashboard', isAdmin, (req, res) => {
  res.render('dashboard');
});

router.get('/api/books', (req, res, next) => {
  Book.find()
    .then(books => {
      res.status(200).json({ books });
    })
    .catch(error => console.log(error))
});


router.get('/api/:id', (req, res, next) => {
  let bookId = req.params.id;
  Book.findOne({ _id: bookId })
    .then(book => {
      res.status(200).json({ book });

    })
});

module.exports = router;