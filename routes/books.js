var express = require('express');
var router = express.Router();

/* GET books page. */
router.get('/', function(req, res, next) {
  query = '';
  if(req.query){
    query = 'SELECT * from book;'
  }
    req.app.locals.client.query(query, (err, result)=>{
      res.render('books', { title: 'Books', books: result.rows });
    })
  });

  router.get('/add', function(req, res, next){
    req.app.locals.client.query('SELECT * from genre;', (err, genres) => {
      req.app.locals.client.query('SELECT * from publisher;', (error, publishers) => {
        req.app.locals.client.query('SELECT * from author;', (error, authors) => {
          console.log('hello');
          res.render('add-book', {genres: genres.rows, publishers: publishers.rows, authors: authors.rows});
        })
      })
    })
  })

router.get('/:isbn', function(req, res, next){
  req.app.locals.client.query(`SELECT book.*, publisher.name as "publisher" from book inner join publisher on book.publisher_id = publisher.id where isbn = $1`, [req.params.isbn], (err, result)=>{
      let book = {};
      Object.assign(book, result.rows[0]);
      console.log(book)
      book["authors"] = [];
      book["genres"] = [];
      req.app.locals.client.query(`SELECT * from written_by inner join author on written_by.author_id = author.id
      where written_by.isbn = $1`, [req.params.isbn], (error, authors)=>{
        for (let a of authors.rows){
          book.authors.push(a);
        }
        req.app.locals.client.query(`SELECT * from "contains" inner join genre on "contains".genre_id = genre.id
          where "contains".isbn = $1`, [req.params.isbn], (error, genres)=>{
          for (let g of genres.rows){
           book.genres.push(g);
          } 
          res.render('book', {book: book});
        })
      })
  })  
})

router.post('/add', function(req, res, next) {
  console.log(req.body);
  const { title, author, isbn, genre, price, publisher, publishDate, edition, description, printLength, stock, publisherFee } = request.body
  pool.query('INSERT INTO books (isbn, publisher_id, title, publish_date, edition, description, price, print_length, stock, publisher_fee) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', 
    [isbn, publisher, title, Date(publishDate), Number(edition), description, Number(price), Number(printLength), Number(stock), Number(publisherFee)], (error, results) => {
    if (error) {
      console.log(err);
      throw error
    }
    response.status(201).send(`Book added with ID: ${results.insertId}`)
  })
});
module.exports = router;