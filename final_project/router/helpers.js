import books from "./booksdb.js";

// Function to check if the user exists
export function doesExist(users, username) {
  let foundUser = users.filter((user) => {
    return user.username === username;
  });
  return foundUser.length > 0;
}

export function filterBooksUsingTypicalLoop(isbn) {
  let foundBooks = [];
  let book;
  for (let bookId in books) {
    book = books[bookId];
    if (book["isbn"] === isbn) {
      foundBooks.push(book);
    }
  }
  return foundBooks;
}

export function filterBooksIteratingOverDictionary(fieldName, fieldValue) {
  const _books = Object.values(books);
    return _books.filter((book) => book[fieldName] === fieldValue);
}

export function findBookByISBN(isbn) {
    const _books = Object.values(books);
    // https://stackoverflow.com/a/6072687/865603
    // return Object.keys(foundBook).length !== 0 ? foundBook.reviews : {}
    return _books.find((book) => book["isbn"] === isbn);
}

export function findBookReviewsByISBN(isbn) {
    const foundBook = findBookByISBN(isbn);
    console.log("Found:", foundBook);
    // https://stackoverflow.com/a/6072687/865603
    // return Object.keys(foundBook).length !== 0 ? foundBook.reviews : {}
    return foundBook !== undefined ? foundBook.reviews : {};
}