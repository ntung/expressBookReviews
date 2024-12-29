const express = require('express');
let books = require("./booksdb.js");
const { hash } = require('bcrypt');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const helpers = require('./helpers.js');
const public_users = express.Router();
const bcrypt = require('bcrypt');


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
    if (!helpers.doesExist(users, username)) {
      bcrypt.hash(password, 10, function(error, hash) {
        users.push({"username": username, "password": hash});
      });
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
  console.log(data);
  res.status(data["status_code"]).json(data);
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });
  getBooks.then(() => 
    console.log("All books were retried and responded to the client!"))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // const foundBooks = helpers.filterBooksUsingTypicalLoop(isbn);
  const foundBooks = helpers.filterBooksIteratingOverDictionary("isbn", isbn);
  const getBookDetails = new Promise((resolve, reject) => {
    resolve(res.send(foundBooks));
  });
  getBookDetails.then(() => {
    console.log("The details of the book ISBN " + isbn + " have been returned!");
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const foundBooks = helpers.filterBooksIteratingOverDictionary("author", author);
  const getBookDetails = new Promise((resolve, reject) => {
    resolve(res.send(foundBooks));
  });
  getBookDetails.then(() => {
    console.log("The details of the book writed by the author " + author + 
      " have been returned!");
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const foundBooks = helpers.filterBooksIteratingOverDictionary("title", title);
  const getBookDetails = new Promise((resolve, reject) => {
    resolve(res.send(foundBooks));
  });
  getBookDetails.then(() => {
    console.log("List of books by the title `" + title + 
      "` have been returned!");
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = helpers.findBookReviewsByISBN(isbn);
  res.send(reviews);
});

module.exports.general = public_users;
