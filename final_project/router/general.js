const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

function filterBooksUsingTypicalLoop(isbn) {
  let foundBooks = [];
  let book;
  for (let bookId in books) {
    book = books[bookId];
    // console.log(book);
    if (book["isbn"] === isbn) {
      foundBooks.push(book);
    }
  }
  return foundBooks;
}

function filterBooksIteratingOverDictionary(fieldName, fieldValue) {
  const _books = Object.values(books);
  const foundBooks = _books.filter((book) => book[fieldName] === fieldValue);
  return foundBooks;
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // const foundBooks = filterBooksUsingTypicalLoop(isbn);
  const foundBooks = filterBooksIteratingOverDictionary("isbn", isbn);
  res.send(foundBooks);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const foundBooks = filterBooksIteratingOverDictionary("author", author);
  res.send(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const foundBooks = filterBooksIteratingOverDictionary("title", title);
  res.send(foundBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
