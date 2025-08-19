const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) =>  {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // The JSON.stringify method converts the 'books' JavaScript object into a JSON string.
  // The arguments (null, 4) format the JSON string with an indentation of 4 spaces for readability.
  res.status(200).send(JSON.stringify(books, null, 4));
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from the request's URL parameters
  const isbn = req.params.isbn;

  // Check if a book exists with the given ISBN as a key
  if (books[isbn]) {
    // If the book is found, send its details as a JSON response with a 200 OK status
    return res.status(200).json(books[isbn]);
  } else {
    // If the book is not found, send a 404 Not Found status with an error message
    return res.status(404).json({ message: "Book not found" });
  }
});
// Get book details based on ISBN
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = [];
  // Get all the keys for the 'books' object
  const bookKeys = Object.keys(books);
  // Iterate through the 'books' array & check if the author matches
  for (const key of bookKeys) {
    if (books[key].author === author) {
      // If a match is found, add the book to the results
      authorBooks.push(books[key]);
    }
  }
  // If books by the author are found, send the list; otherwise, send a not found message
  if (authorBooks.length > 0) {
    res.status(200).json(authorBooks);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = [];
  const bookKeys = Object.keys(books);
  // Iterate through the 'books' array & check if the title matches
  for (const key of bookKeys) {
    if (books[key].title === title) {
      titleBooks.push(books[key]);
    }
  }
  // If books with the title are found, send the list; otherwise, send a not found message
  if (titleBooks.length > 0) {
    res.status(200).json(titleBooks);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Check if a book with the given ISBN exists
  if (books[isbn]) {
    // If the book is found, send its reviews with a 200 OK status
    res.status(200).json(books[isbn].reviews);
  } else {
    // If no book is found for the ISBN, send a 404 Not Found status
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
