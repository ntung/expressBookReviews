const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let hashPassword = require("./auth_users.js").hashPassword;
const public_users = express.Router();


// Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};


// Route to handle user registration
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const data = {};
  if ((username === undefined) || (password === undefined)) {
    data["status_code"] = 400; 
    data["error"] = "username and/or password are not provided.";
  } else if (username && password) {
    // check the username whether it exists or not
    if (!doesExist(username)) {
      const encryptedPassword = hashPassword(password);
      users.push({"username": username, "password": encryptedPassword});
      data["status_code"] = 200;
      data["message"] = "User successfully registered. Now you can login.";
    } else {
      data["status_code"] = 404;
      data["error"] = "User already exists!";
    }
  } else {
    data["status_code"] = 404;
    data["error"] = "Unable to register user.";
  }

  res.status(data["status_code"]).json(data);
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


function findBookReviewsByISBN(isbn) {
  const _books = Object.values(books);
  const foundBook =_books.find((book) => book["isbn"] === isbn);
  console.log("Found:", foundBook);
  // https://stackoverflow.com/a/6072687/865603
  // return Object.keys(foundBook).length !== 0 ? foundBook.reviews : {}
  return foundBook !== undefined ? foundBook.reviews : {}
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
  const isbn = req.params.isbn;
  const reviews = findBookReviewsByISBN(isbn);
  res.send(reviews);
});

module.exports.general = public_users;
