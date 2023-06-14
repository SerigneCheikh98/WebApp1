'use strict';

const PORT = 3000;

const express = require('express');

// Get modules accessing the DB
const usersDao = require('./dao-users');
const pagesDao = require('./dao-pages'); 

// Middlewares
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();
// Register middlewares
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.use(session({
    secret: "Deboli o forti, intelligenti o semplici, noi simo tutti fratelli...Good luck with this secret!",
    resave: false,
    saveUninitialized: false,
}));

// Set up authentication strategy to search in the DB a user with a matching password.
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await usersDao.getUser(username, password)
  if(!user){
    return callback(null, false, 'Invalid username or password');  
  }
  return callback(null, user);
}));

app.use(passport.authenticate('session'));

// Serializing user in the session
passport.serializeUser((user, callback) => {
    callback(null, { id: user.id, username: user.username });
});
// Deserializing user from the session
passport.deserializeUser((user, callback) => {
    callback(null, user);
});

// Login status checker middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

/******************** Authentication APIs ********************/

const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json({ error: info });
        }
        // success, perform the login and extablish session
        req.login(user, (err) => {
            if (err)
                return next(err);

            return res.json(req.user);
        });
    })(req, res, next);
}

const logout = (req, res) => {
    req.logout(() => {
        res.status(200).json({message: "User logged out"});
    });
}

const verifyAuth = (req, res) => {
    if(req.isAuthenticated()){
        res.status(200).json(req.user);
    }
    else{
        res.status(401).json({error: 'Not authenticated'});
    }
}

app.post('/api/login', login);
app.get('/api/verifyAuth', verifyAuth);
app.delete('/api/logout', logout);


/******************** Front-office and Back-office APIs ********************/

const getAllPages = async (req, res) => {
    res.status(200).json("Hello World!")
}

const getPage = async (req, res) => {
}

const createPage = async (req, res) => {
}

const editPage = async (req, res) => {
}

const deletePage = async (req, res) => {
}

const getAllBlocks = async (req, res) => {
}

const createBlock = async (req, res) => {
}

const editBlock = async (req, res) => {
}

const deleteBlock = async (req, res) => {
}

app.get('/api/pages', getAllPages)
app.get('/api/pages/:id', getPage)
app.post('/api/pages', createPage)
app.put('/api/pages/:id', editPage)
app.delete('/api/pages/:id/', deletePage)
app.get('/api/pages/:id/blocks', getAllBlocks)
app.post('/api/pages/:id/blocks/:id', createBlock)
app.put('/api/pages/:id/blocks/:id', editBlock)
app.delete('/api/pages/:id/blocks/:id', deleteBlock)

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });