const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');
const helpers = require('./helpers.js');

let users = [];

// Function to check if the user is authenticated
async function authenticatedUser(username, password) { // returns boolean
  // write code to check if username and password match the one we have in records.
  console.log("username", username);
  console.log("password", password);
  let validUser = users.find((user) => {
    return user.username === username;
  });
  if (!validUser) {
    console.log("user not found");
    
    return false;
  } else {
    console.log("found user", validUser);
  }
  return await bcrypt.compare(password, validUser.password);
}


const isValid = (username) => { // returns boolean
  // write code to check is the username is valid
  return username;
}

// only registered users can log in
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  console.log("Logging...");
  let authenticated;
  authenticatedUser(username, password).then(function(result) {
    console.log(result);
    authenticated = result;
  }).then(() => {
    console.log("Authenticated", authenticated);
    if (authenticated) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken, username
      };
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  });
  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Check if user is authenticated
  if (req.session.authorization) {
    console.log("logged in");
    let token = req.session.authorization['accessToken']; // Access Token
    
    // Verify JWT token for user authentication
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        const isbn = req.params.isbn;
        const book = helpers.findBookByISBN(isbn);
        if (book === undefined) {
          return res.status(200).json({ message: `Book with ISBN: ${isbn} not found.`});
        }
        // Set authenticated user data on the request object
        req.user = user;
        const username = req.session.authorization['username'];
    
        const result = deleteMyReview(username, book);
        return res.status(200).json(result);
      } else {
        // Return error if token verification fails
        return res.status(403).json({ message: "User not authenticated" }); 
      }
    });
  // Return error if no access token is found in the session
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Check if user is authenticated
  if (req.session.authorization) {
    console.log("logged in");
    let token = req.session.authorization['accessToken']; // Access Token
    
    // Verify JWT token for user authentication
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        const isbn = req.params.isbn;
        const book = helpers.findBookByISBN(isbn);
        if (book === undefined) {
          return res.status(200).json({ message: `Book with ISBN: ${isbn} not found.`});
        }
        req.user = user; // Set authenticated user data on the request object
        console.log("Add or update the review");
        const username = req.session.authorization['username'];
        const reviewHeadline = req.body.headline;
        const reviewerName = req.body.reviewer;
        const reviewContent = req.body.content;
        const review = {
          "headline": reviewHeadline,
          "content": reviewContent,
          "reviewer": reviewerName,
          "username": username
        }
        const result = addOrUpdateReview(username, isbn, review);
        const data = { message: `Your review has been ${result['action']}.`};
        return res.status(200).json(data);
      } else {
        // Return error if token verification fails
        return res.status(403).json({ message: "User not authenticated" }); 
      }
    });
  // Return error if no access token is found in the session
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

function addOrUpdateReview(username, isbn, review) {
  const reviews = helpers.findBookReviewsByISBN(isbn);
  const _reviews = Object.values(reviews);
  const existed = _reviews.find((r) => r.username === username);
  console.log("existed", existed);
  if (existed === undefined) {
    const count = Object.keys(reviews).length;
    reviews[(count + 1).toString()] = review;
    // console.log(reviews);
    console.log("add");
    return {action: "added", reviews: reviews};
  } else {
    for (const [key, value] of Object.entries(reviews)) {
      if (value['username'] === username) {
        reviews[key] = review;
        break;
      }
    }
    console.log(reviews);
    console.log("update");
    return {action: "updated", reviews: reviews};
  }
}

function deleteMyReview(username, book) {
  const reviews = book["reviews"];
  let found = false;
  for (const [key, value] of Object.entries(reviews)) {
    if (value['username'] === username) {
      found = true;
      delete reviews[key];
      break;
    }
  }
  let message = 
    `Your review for this book (ISBN: ${book['isbn']}) has been deleted.`;
  if (!found) {
    message = `You haven't made any review for this book (ISBN: ${book['isbn']}).`;
  }
  return {message: message};
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.hashPassword = hashPassword;
