const express = require('express')
const app = express()
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true
  }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'fawaz123',
  database: 'library'
});

app.get('/',authenticatedCheck,(req,res)=>{
    res.render('home',{body:'',title:"Home",messages:req.flash()})
})


app.get('/login',authenticatedCheck,(req,res)=>{
    res.render('login',{body:'',title:"Login",messages:req.flash()})
})

app.get('/register',authenticatedCheck,(req,res)=>{
    res.render('register',{body:"",title:"Register",messages:req.flash()})
})

app.post('/register',authenticatedCheck, (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    
    // Check if user already exists in the database
    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
          req.flash('error', 'Error Checking User');
          res.redirect('/register')
            return;
        }
        
        if (results.length > 0) {
          req.flash('error', 'User already exists!');
          res.redirect('/register')
        } else {
            // Register new user
            connection.query(sql, [first_name, last_name, email, password], (error, results) => {
                if (error) {
                  req.flash('error', 'Error Registering user, Try Again!');
                  res.redirect('/register')
                    return;
                }
                req.flash('success', 'User Registered');
                res.redirect('/login')
            });
        }
    });
});


app.post('/login',authenticatedCheck, (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  
  if(email ==='admin@gmail.com' && password==='admin'){
    req.flash('success', 'Welcome to Admin Page');
    req.session.email='admin@gmail.com';
    req.session.pass='admin';
    res.redirect('/admin/home')
  }
  else{
  // Check if user exists in the database
  connection.query(sql, [email], (error, results) => {
    if (error) {
      req.flash('error', 'Invalid email or password');
      res.redirect('/login')
      return;
    }
    
    if (results.length === 0) {
      req.flash('error', 'Invalid email or password');
      res.redirect('/login')
    } else {
      // Verify password
      if (results[0].password !== password) {
        req.flash('error', 'Invalid email or password');
        res.redirect('/login')
      } else {
        req.session.user = results[0].user_id;
        req.flash('success', 'Welcome Back!');
        res.redirect('/user/home');
      }
    }
  });
}});


app.get('/books',authenticated, (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) throw err;
    res.render('allbooks', { books: results,body:"",title:"All Books",messages:req.flash() });
  });
});

app.get('/books/:bookId/borrow',authenticated, (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.session.user;
  const borrowedDate = new Date().toISOString().slice(0, 10); // today's date
  const returnDate = null; // initially set return date to null

  // Check if the book is already borrowed by the user
  const selectBorrowSql = 'SELECT * FROM borrowed_books WHERE book_id = ? AND user_id = ?';
  connection.query(selectBorrowSql, [bookId, userId], (err, result) => {
    if (err) throw err;
    
    if (result.length > 0) {
      // If the book is already borrowed by the user, show a flash message
      req.flash('error', 'This book is already borrowed by you.');
      res.redirect('/books');
    } else {
      // Decrease the quantity of the book in the books table
      const updateQuantitySql = 'UPDATE books SET quantity = quantity - 1 WHERE book_id = ?';
      connection.query(updateQuantitySql, [bookId], (err, result) => {
        if (err) throw err;

        // Insert a new row in the borrowed_books table
        const insertBorrowSql = 'INSERT INTO borrowed_books (book_id, user_id, borrowed_date, return_date) VALUES (?, ?, ?, ?)';
        connection.query(insertBorrowSql, [bookId, userId, borrowedDate, returnDate], (err, result) => {
          if (err) throw err;

          // Set a success flash message
          req.flash('success', 'Book borrowed successfully!');
          res.redirect('/books');
        });
      });
    }
  });
});

app.get('/borrowed',authenticated, (req, res) => {
  const selectBorrowedSql = `SELECT books.title,books.book_id, borrowed_books.borrowed_date, borrowed_books.return_date FROM borrowed_books INNER JOIN books ON borrowed_books.book_id = books.book_id WHERE borrowed_books.user_id = ?`; 
    connection.query(selectBorrowedSql, [req.session.user], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      req.flash('error', 'You have not borrowed any books yet.');
    }

    res.render('mybooks', { borrowedBooks: result,body:"",title:"My Books",messages:req.flash() });
  });
});

app.get('/books/:bookId/return',authenticated, (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.session.user;
  const returnDate = new Date().toISOString().slice(0, 10); // today's date

  // Update the return date for the book in the borrowed_books table
  const updateReturnSql = 'UPDATE borrowed_books SET return_date = ? WHERE book_id = ? AND user_id = ?';
  connection.query(updateReturnSql, [returnDate, bookId, userId], (err, result) => {
    if (err) throw err;

    if (result.affectedRows === 0) {
      req.flash('error', 'This book was not borrowed by you.');
      res.redirect('/books');
    } else {
      // Increase the quantity of the book in the books table
      const updateQuantitySql = 'UPDATE books SET quantity = quantity + 1 WHERE book_id = ?';
      connection.query(updateQuantitySql, [bookId], (err, result) => {
        if (err) throw err;

        req.flash('success', 'You have successfully returned the book.');
        res.redirect('/books');
      });
    }
  });
});

app.get('/profile',authenticated,(req,res)=>{
  let userId = req.session.user;
  connection.query(`SELECT * FROM users where user_id=${userId}`, (err, results) => {
    if (err) throw err;
    res.render('profile',{user:results[0],body:'',title:"Profile",messages:req.flash()})
  });
  })



app.get('/user/home',authenticated,(req,res)=>{
    res.render('userHome',{body:'',title:"Home",messages:req.flash()})
})


app.get('/admin/home',isAdmin,(req,res)=>{
  res.render('adminHome',{body:'',title:"Admin Home",messages:req.flash()})
})

app.get('/addauthors',isAdmin,(req,res)=>{
  res.render('addauthor',{body:'',title:"Add Author",messages:req.flash()})
})

  app.post('/addauthors',isAdmin, (req, res) => {
    const {first_name, last_name, email } = req.body;
    const sql = 'INSERT INTO authors (first_name, last_name, email) VALUES (?, ?, ?)';
    connection.query(sql, [first_name, last_name, email], (error, results, fields) => {
      if (error) {
        req.flash('error', 'Error Adding New Author');
        return;
      }
      req.flash('success', 'Author added successfully');
      res.redirect('/addauthors')
    });
  });


  app.get('/manage/books',isAdmin, (req, res) => {
    connection.query('SELECT * FROM books', (err, results) => {
      if (err) throw err;
      res.render('managebooks', { books: results,body:"",title:"Manage Books",messages:req.flash() });
    });
  });

  app.get('/manage/users',isAdmin, (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('manageusers', { users: results,body:"",title:"Manage Users",messages:req.flash() });
    });
  });

  app.get('/manage/authors',isAdmin, (req, res) => {
    connection.query('SELECT * FROM authors', (err, results) => {
      if (err) throw err;
      res.render('manageauthors', { authors: results,body:"",title:"Manage Authors",messages:req.flash() });
    });
  });

  app.get('/authors/:authorId/delete',isAdmin, (req, res) => {
    const authorId = req.params.authorId;
  

    const selectBorrowSql = 'DELETE FROM authors WHERE author_id = ?';
    connection.query(selectBorrowSql, [authorId], (err, result) => {
      if (err) throw err;
      
      if (result.length > 0) {
        // If the book is already borrowed by the user, show a flash message
        req.flash('error', 'Error while deleting');
        res.redirect('/manage/authors');
      } else {
        // Decrease the quantity of the book in the books table
        req.flash('success', 'Author Deleted Successfully');
        res.redirect('/manage/authors');
      }
    });
  });

  app.get('/authors/:authorId/update',isAdmin, (req, res) => {
    const authorId = req.params.authorId;
  
    const selectBorrowSql = 'SELECt * FROM authors WHERE author_id = ?';
    connection.query(selectBorrowSql, [authorId], (err, result) => {
      if (err) throw err;
      res.render('updateAuthor', { authors: result[0],body:"",title:"Update Author",messages:req.flash() })
    });
  });

  app.post('/authors/:authorId/update',isAdmin, (req, res) => {
    const authorId = req.params.authorId;
    const {first_name,last_name,email} = req.body
    
    const selectBorrowSql = `UPDATE authors SET first_name='${first_name}',last_name='${last_name}',email='${email}' WHERE author_id=${authorId}`;
    connection.query(selectBorrowSql, (err, result) => {
      if (err) throw err;
        req.flash('success', 'Author Updated Successfully');
        res.redirect('/manage/authors');
      
    });
  });


  app.get('/user/:userId/delete',isAdmin, (req, res) => {
    const userId = req.params.userId;
  

    const selectBorrowSql = 'DELETE FROM users WHERE user_id = ?';
    connection.query(selectBorrowSql, [userId], (err, result) => {
      if (err) throw err;
      
      if (result.length > 0) {
        // If the book is already borrowed by the user, show a flash message
        req.flash('error', 'Error while deleting');
        res.redirect('/manage/usres');
      } else {
        // Decrease the quantity of the book in the books table
        req.flash('success', 'User Deleted Successfully');
        res.redirect('/manage/users');
      }
    });
  });

  app.get('/books/:bookId/delete',isAdmin, (req, res) => {
    const bookId = req.params.bookId;
  

    const selectBorrowSql = 'DELETE FROM books WHERE book_id = ?';
    connection.query(selectBorrowSql, [bookId], (err, result) => {
      if (err) throw err;
      
      if (result.length > 0) {
        // If the book is already borrowed by the user, show a flash message
        req.flash('error', 'Error while deleting');
        res.redirect('/manage/books');
      } else {
        // Decrease the quantity of the book in the books table
        req.flash('success', 'Book Deleted Successfully');
        res.redirect('/manage/books');
      }
    });
  });

  app.get('/books/:bookId/update',isAdmin, (req, res) => {
    const bookId = req.params.bookId;
  
    const selectBorrowSql = 'SELECt * FROM books WHERE book_id = ?';
    connection.query(selectBorrowSql, [bookId], (err, result) => {
      if (err) throw err;
      res.render('updateBook', { books: result[0],body:"",title:"Update Book",messages:req.flash() })
    });
  });

  app.post('/books/:bookId/update',isAdmin, (req, res) => {
    const bookId = req.params.bookId;
    const title = req.body.title;
    const publisher = req.body.publisher
    const publish_date = req.body.publish_date
    const quantity = req.body.quantity
    const author_id = req.body.author_id
  
    
    const selectBorrowSql = `UPDATE books SET title='${title}',publisher='${publisher}',publish_date='${publish_date}',quantity=${quantity},author_id=${author_id} where book_id=${bookId}`;
    connection.query(selectBorrowSql, (err, result) => {
      if (err) throw err;
        req.flash('success', 'Book Updated Successfully');
        res.redirect('/manage/books');
      
    });
  });


  app.get('/addbooks',isAdmin, (req, res) => {
      res.render('addbooks', {body:"",title:"Add Books",messages:req.flash() });
  });

  app.post('/addbooks',isAdmin, (req, res) => {
    const bookId = req.params.bookId;
    const title = req.body.title;
    const publisher = req.body.publisher
    const publish_date = req.body.publish_date
    const quantity = req.body.quantity
    const author_id = req.body.author_id
  
    
    const selectBorrowSql = `INSERT INTO books(title,publisher,publish_date,quantity,author_id) VALUES('${title}','${publisher}','${publish_date}',${quantity},${author_id});`;
    connection.query(selectBorrowSql, (err, result) => {
      if (err) throw err;
        req.flash('success', 'Book Added Successfully');
        res.redirect('/addbooks');
      
    });
  });



connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as ID ' + connection.threadId);
});

function isAdmin(req, res, next){
  if (req.session.email==='admin@gmail.com') {
    // User is logged in, proceed to the next middleware or route handler
    next();
  } else {
    // User is not logged in, redirect to login page or send an error response
    res.redirect('/login');
  }
};

function authenticated(req, res, next){
    if (req.session.user) {
      // User is logged in, proceed to the next middleware or route handler
      next();
    } else {
      // User is not logged in, redirect to login page or send an error response
      res.redirect('/login');
    }
  };

  function authenticatedCheck(req, res, next){
    if (!req.session.user) {
      // User is logged in, proceed to the next middleware or route handler
      next();
    } else {
      // User is not logged in, redirect to login page or send an error response
      res.redirect('/user/home');
    }
  };



app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/');
      }
    });
  });




app.listen(3000,(req,res)=>{
    console.log("listening of port 3000")
})