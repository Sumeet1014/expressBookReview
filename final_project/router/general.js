const express = require('express');
const axios = require('axios');

let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: 'User already exists.'
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: 'User successfully registered. You can now log in.'
  });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).json(book);
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );

  return res.status(200).json(result);
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const result = Object.values(books).filter(
    book => book.title.toLowerCase().includes(title)
  );

  return res.status(200).json(result);
});

// Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).json(book.reviews);
});


// ======================================================
// TASK 11 - Axios + Promise / Async-Await implementations
// ======================================================

// Get all books using Promise callback
function getAllBooks(callback) {
  axios
    .get(`${BASE_URL}/`)
    .then(response => {
      callback(null, response.data);
    })
    .catch(error => {
      callback(error, null);
    });
}

// Get book by ISBN using Promise
function getBooksByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/isbn/${isbn}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Get books by author using async/await
async function getBooksByAuthor(author) {
  const response = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );

  return response.data;
}

// Get books by title using async/await
async function getBooksByTitle(title) {
  const response = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`
  );

  return response.data;
}

// Get book review using async/await
async function getBookReview(isbn) {
  const response = await axios.get(
    `${BASE_URL}/review/${isbn}`
  );

  return response.data;
}

module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
module.exports.getBookReview = getBookReview;