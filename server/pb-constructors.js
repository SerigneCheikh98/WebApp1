'use strict' ;

const dayjs = require('dayjs');

function Page (id, title, author, date, publication_date) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.date = dayjs(date).format('YYYY-MM-DD');
    this.publication_date = publication_date ;
}

function Block (id, type, content, idPage, position) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.idPage = idPage;
    this.position = position;
}

exports.Page = Page;
exports.Block = Block;