'use strict';

const PORT = 3000;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.get('/guess', (req, res) => {
    const n = Math.floor(Math.random()*100) ;
    res.send(String(n)) ;
}) ;

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });