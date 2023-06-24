'use strict';

const PORT = 3000;

const express = require('express');
const dayjs = require('dayjs');
const { check, validationResult, } = require('express-validator');


// Get modules accessing the DB and Model
const usersDao = require('./dao-users');
const pagesDao = require('./dao-pages'); 
const webNameDao = require('./dao-name');
const {Page, Block} = require('./pb-constructors');

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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(session({
    secret: "Deboli o forti, intelligenti o semplici, noi simo tutti fratelli...Good luck with this secret!",
    resave: false,
    saveUninitialized: false,
}));

// Set up authentication strategy to search in the DB a user with a matching password.
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await usersDao.getUser(username, password)
  if(!user){
    const errMessage = {message: 'Invalid username or password'};
    return callback(null, false, errMessage);  
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

// Authorship checker middleware
const isAuthor = async (req, res, next) => {
    const pageId = req.params.pageId;
    try {
        const p = await pagesDao.getPage(pageId);
        if (p.error) {
            return res.status(404).json(page);
        }
        if (p.page.author !== req.user.username && req.user.role !== 'admin') {
            return res.status(401).json({ error: "Unauthorized: Author mismatch" });
        }
        return next();
    } catch (err) {
        res.status(503).json({ error: `Database error ${req.params.id}: ${err} ` });
    }
}

// Admin role checker middleware
const isAdmin = async (req, res, next) => {
    try {
        const user = await usersDao.getUserById(req.user.id);
        if (user.error) {
            return res.status(404).json(user);
        }
        if (user.username !== req.user.username) {
            return res.status(401).json({ error: "Unauthorized!" });
        }
        if(user.role !== 'admin'){
            return res.status(401).json({ error: "Unauthorized: only Admin!" });
        }
        return next();
    } catch (err) {
        res.status(503).json({ error: `Database error ${req.params.id}: ${err} ` });
    }
}

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};
  
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
app.post('/api/logout', logout);


/******************** Front-office APIs ********************/

const getAllPages = async (req, res) => {
    try {
        const pages = await pagesDao.getAllPages();
        
        res.status(200).json(pages);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getAllBlocks = async (req, res) => {
    const pageId = req.params.pageId;

    try {
        const blocks = await pagesDao.getAllBlocksByPage(pageId);

        res.status(200).json(blocks);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// returns a Page with all related blocks
const getPage = async (req, res) => {
    // check for validation error
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") });
    }
    
    const pageId = req.params.pageId;

    try {
        const pageWithBlocks = await pagesDao.getPage(pageId);

        res.status(200).json(pageWithBlocks);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// returns the name of the website
const getName = async (req, res) => {
    try {
        const webName = await webNameDao.getName();
        if(webName.error){
            return res.status(404).json({ error: webName.error});
        }
        res.status(200).json(webName);
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
}

app.get('/api/pages', getAllPages)
app.get('/api/pages/:pageId', [ check('pageId').isInt() ], getPage)
app.get('/api/pages/:pageId/blocks', getAllBlocks)
app.get('/api/websiteName', getName)
/******************** Back-office APIs ********************/
// middleware for the APIs below
app.use(isLoggedIn);  

// Create a new Page 
const createPage = async (req, res) => {
    // check for validation error
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") });
    }
    
    let haveHeaderBlock = false;
    let haveParagraphOrImage = false;
    const blocks = req.body.blocks;
    blocks.forEach( b => {
        if(b.type === 'Header'){
            haveHeaderBlock = true;
        }
        if(b.type === 'Paragraph' || b.type === 'Image'){
            haveParagraphOrImage = true;
        }
    });

    // Check if there is at leat one Header block and one block of other type
    if( !haveHeaderBlock || !haveParagraphOrImage ){
        return res.status(422).json({ 
            error: "Page must have at least one block of type \"Header\" and one other block of type \"Paragraph\" or \"Image\""
        });
    }

    const page = new Page(
        null, 
        req.body.title,
        req.user.username,
        dayjs(), //get current date
        req.body.publication_date,
    )

    try {
        // Create new Page
        const data = await pagesDao.createPage(page);
        
        let newBlock;

        /*blocks.forEach( b => {
            newBlock = new Block(
                null,
                b.type,
                b.content,
                data.id,
            );
            pagesDao.createBlock(newBlock).then((blockId) =>{
                console.log(blockId);
                blockIds.push({ id: blockId });
            }).catch((err) => {
                // TODO do i have to revert the work done to this point? 
                res.status(503).json({ error: `Database error during the creation of new Block: ${err}` });
            });
        });*/
        const blockIds = await Promise.all(blocks.map(async (b) => {
            newBlock = new Block(
                null,
                b.type,
                b.content,
                data.id,
                b.position,
            );
            try {
                const blockId = await pagesDao.createBlock(newBlock);
                return { id: blockId };
            } catch (err) {
                res.status(503).json({ error: `Database error during the creation of new Block: ${err}` });
            };
        }));
        // returns created page and an array of block ids 
        res.status(200).json({page: data, blockIds: blockIds});
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of new Page: ${err}` }); 
    }
}

// Edit a page which user is author
const editPage = async (req, res) => {
    // check for validation error
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") });
    }

    const pageId = req.params.pageId;
    try {
        const page = new Page(pageId, req.body.title, req.user.username, null, req.body.publication_date);
        //delete page
        await pagesDao.updatePage(pageId, page, req.body.updateBlocks, req.body.deleteBlocks, req.body.addBlocks);
        
        res.status(200).json({message: "Success"});
    } catch (err) {
        res.status(503).json({ error: `Database error during edit of page${req.params.id}: ${err} ` });
    }
}

// Delete a page which user is author
const deletePage = async (req, res) => {
    // check for validation error
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") });
    }
    
    const pageId = req.params.pageId;
    try {
        //delete page
        const result = await pagesDao.deletePage(pageId);
        if (result === null)
            return res.status(200).json({message: "Success"});
        else
            return res.status(404).json(result);
    } catch (err) {
        res.status(503).json({ error: `Database error during the deletion of page ${req.params.id}: ${err} ` });
    }
}

const updateName = async (req, res) => {
    // check for validation error
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") });
    }

    try {
        await webNameDao.updateName(req.body.name);
        res.status(200).json({message: "Success"});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const updateAuthor = async (req, res) => {
    // check for validation error
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") });
    }
    const author = req.body.author;
    const pageId = req.params.pageId;
    try {
        //check if author exist
        const user = await usersDao.getUserByUsername(author);
        if(user.error){
            return res.status(404).json({error: user.error});
        }

        //chek if page exist
        const page = await pagesDao.getPageInfo(pageId)
        if(page.error){
            return res.status(404).json({error: page.error});
        }

        await pagesDao.updateAuthor(pageId, author);
        res.status(200).json({message: "Success"});
    } catch (error) {
        res.status(500).send(error.message);
    }

}

const getBlock = async (req, res) => {
}

const createBlock = async (req, res) => {
}

const editBlock = async (req, res) => {
}

const deleteBlock = async (req, res) => {
}


app.post('/api/pages', [
    check('title').isLength({ min: 1, max: 160 }),
    // date in the YYYY-MM-DD format
    check('publication_date').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }).optional({ checkFalsy: true }),
    check('blocks').custom((b) => {
        if (Array.isArray(b) && b.length >= 2) {
            b.forEach((b) => {
                if (!b.type || b.type.trim().length === 0) {
                    throw new Error('blocks: invalid type');
                }
                if (b.type !== 'Header' && b.type !== 'Paragraph' && b.type !== 'Image') {
                    throw new Error('blocks: invalid type value');
                }
                if (!b.content || b.content.trim().length === 0) {
                    throw new Error('blocks: invalid content');
                }
                if(isNaN(Number(b.position))){
                    throw new Error('blocks: invalid position');
                }
            })
            return true;
        }
        throw new Error('blocks must be at least two');
    }),
], createPage);
app.put('/api/pages/:pageId',isAuthor, [
    check('title').isLength({min: 1, max:160}),
    // date in the YYYY-MM-DD format
    check('publication_date').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('updateBlocks').custom((b) => {
        // cannot change block type
        if (Array.isArray(b)) {
            b.forEach((b) => {
                if(!b.id || isNaN(Number(b.id))){
                    throw new Error('updateBlocks: invalid id');
                }
                if(!b.content || b.content.trim().length === 0){
                    throw new Error('updateBlocks: invalid content');
                }
            })
            return true;
        }
        throw new Error('Invalid updateBlocks');
    }),
    check('deleteBlocks').custom((b) => {
        if (Array.isArray(b)) {
            b.forEach((b) => {
                if(!b.id || isNaN(Number(b.id))){
                    throw new Error('deleteBlocks: invalid id');
                }
            })
            return true;
        }
        throw new Error('Invalid deleteBlocks');
    }),
    check('addBlocks').custom((b) => {
        if (Array.isArray(b)) {
            b.forEach((b) => {
                if(!b.type || !b.type.trim().length === 0){
                    throw new Error('addBlocks: invalid type');
                }
                if(b.type !== 'Header' && b.type !== 'Paragraph' && b.type !== 'Image'){
                    throw new Error('addBlocks: invalid type value');
                }
                if(!b.content || b.content.trim().length === 0){
                    throw new Error('addBlocks: invalid content');
                }
            })
            return true;
        }
        throw new Error('Invalid addBlocks');
    }),
], editPage);
app.delete('/api/pages/:pageId', isAuthor, [ check('pageId').isInt() ], deletePage)
app.get('/api/pages/:pageId/blocks/:blockId', getBlock)
app.post('/api/pages/:pageId/blocks', createBlock)
app.put('/api/pages/:pageId/blocks/:blockId', editBlock)
app.delete('/api/pages/:pageId/blocks/:blockId', deleteBlock)
app.put('/api/websiteName', isAdmin, [ check('name').isLength({min: 1, max:160}) ], updateName)
app.put('/api/pages/:pageId/admin', isAdmin, [ check('author').isLength({min: 1, max:160}) ], updateAuthor)

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });