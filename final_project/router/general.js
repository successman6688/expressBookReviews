const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fetchAllBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(books), 100);
    });
};
public_users.get('/', function (req, res) {
  fetchAllBooks()
    .then(
      // 成功时的回调函数
      (allBooks) => {
        return res.status(200).json(allBooks);
      }
    )
    .catch(
      // 失败时的回调函数
      (error) => {
        return res.status(500).json({ message: "An error occurred while fetching books." });
      }
    );
});

// Get book details based on ISBN (Promise Chain)
const fetchBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject({ status: 404, message: "Book not found" });
            }
        }, 100);
    });
};
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  fetchBookByIsbn(isbn)
    .then(
      // 成功时的回调函数，接收找到的书籍
      (book) => {
        return res.status(200).json(book);
      }
    )
    .catch(
      // 失败时的回调函数，接收 reject 时的错误对象
      (error) => {
        return res.status(error.status || 500).json({ message: error.message });
      }
    );
});

// Get book details based on Author (Promise Chain)
const fetchBooksByAuthor = (author) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const matchingBooks = [];
            for (const key in books) {
                if (books[key].author === author) {
                    matchingBooks.push(books[key]);
                }
            }
            resolve(matchingBooks);
        }, 100);
    });
}
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  fetchBooksByAuthor(author)
    .then(
      // 成功时的回调函数，接收匹配的书籍数组
      (authorBooks) => {
        if (authorBooks.length > 0) {
          return res.status(200).json(authorBooks);
        } else {
          // 注意：没有找到结果不是一个程序错误，所以在这里处理
          return res.status(404).json({ message: "No books found by this author" });
        }
      }
    )
    .catch(
      // 失败时的回调函数，处理意外的程序错误
      (error) => {
        return res.status(500).json({ message: "An error occurred while searching by author." });
      }
    );
});

// Get all books based on Title (Promise Chain)
const fetchBooksByTitle = (title) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const matchingBooks = [];
            for (const key in books) {
                if (books[key].title === title) {
                    matchingBooks.push(books[key]);
                }
            }
            resolve(matchingBooks);
        }, 100);
    });
};
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  fetchBooksByTitle(title)
    .then(
      // 成功时的回调函数
      (titleBooks) => {
        if (titleBooks.length > 0) {
          return res.status(200).json(titleBooks);
        } else {
          return res.status(404).json({ message: "No books found with this title" });
        }
      }
    )
    .catch(
      // 失败时的回调函数
      (error) => {
        return res.status(500).json({ message: "An error occurred while searching by title." });
      }
    );
});

module.exports.general = public_users;
