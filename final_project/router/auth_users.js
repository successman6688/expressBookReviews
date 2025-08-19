const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) =>{
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request's URL parameters
  const isbn = req.params.isbn;
  // Retrieve the review text from the request's query parameters
  const reviewText = req.query.review;
  // Retrieve the username from the session
  const username = req.session.authorization['username'];

  // Check if the book exists in the database
  if (books[isbn]) {
    // Check if review text was provided
    if(reviewText) {
        // Access the reviews for the specific book
        let bookReviews = books[isbn].reviews;
        // Add or update the review using the username as the key
        bookReviews[username] = reviewText;
        // Send a success response
        return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated.` });
    } else {
        // Send an error if no review text is provided
        return res.status(400).json({ message: "Review text is required." });
    }
  } else {
    // Send an error if the book is not found
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
