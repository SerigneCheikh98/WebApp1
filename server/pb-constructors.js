'use strict' ;

const dayjs = require('dayjs');

function Page (id, title, author, date, publicationDate) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.date = dayjs(date);
    this.publicationDate = publicationDate ;
}

function Block (id, type, content, idPage) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.idPage = idPage;
}

exports.Page = Page;
exports.Block = Block;