'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const savedBookTitles = [];
// const limit = 10;

app.use(express.static('public')); // loads the public folder (css)
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs'); //tell express to load ejs this unlocks the response render

app.get('/', getBooks);
app.get('/searches/new', makeBookSearch);
app.post('/searches', getResults);

app.post('/save-book', saveBook);

function getBooks(req, res){ //home page
  res.render('pages/index');
}
function makeBookSearch(req, res){ // search for book
  res.render('pages/searches/new.ejs');
}
function getResults(req, res){
  const title = req.body.title;
  const url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${title}`;

  superagent(url)
    .then(books => {
      const titles = books.body.items.map( book => new Book(book.volumeInfo));
      console.log(titles);
      res.render('pages/searches/show', {titles: titles});
    });
}

function saveBook(req, res){
  savedBookTitles.push(req.body.title);
  res.redirect('/');
}

// Need Constructor function for titles | image, title, author, and desc
function Book(bookObject){
  this.img = bookObject.imageLinks.medium || `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = bookObject.title ? bookObject.title : 'Title not found';
  this.author = bookObject.authors || 'Author not found';
  this.desc = bookObject.description || 'No description provided';
}




// ====== PORT Listener ======
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
