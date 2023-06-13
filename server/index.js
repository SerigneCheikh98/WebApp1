'use strict';

const PORT = 3000;

// Get modules accessing the DB
const usersDao = require('./dao-users');
const pagesDao = require('./dao-pages'); 

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

/**
 * Authentication APIs
 */
const login = async (req, res) => {
}

const logout = async (req, res) => {
}

const verifyAuth = async (req, res) => {
}

app.post('/api/login', login);
app.get('/api/verifyAuth', verifyAuth);
app.delete('/api/logout', logout);


/**
 * Front-office and Back-office APIs
 */

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