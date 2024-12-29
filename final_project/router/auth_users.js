const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

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
  const match = await bcrypt.compare(password, validUser.password);
  return match;
}


const isValid = (username) => { // returns boolean
  // write code to check is the username is valid
  return username;
}

// only registered users can login
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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.hashPassword = hashPassword;
