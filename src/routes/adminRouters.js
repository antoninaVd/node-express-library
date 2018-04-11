var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Tolstoy',
        bookId: 656,
        read: false
    },
    {
        title: 'Anna Karenina',
        genre: 'Roman',
        author: 'Lev Tolstoy',
        bookId: 160,
        read: false
    }
];

var router = function(nav) {

    adminRouter.route('/addBooks')
        .get(function(req, res) {
            var url = 'mongodb://localhost:27017';
            var dbName = 'libraryApp';

            mongodb.connect(url, function(err, client) {
                const db = client.db(dbName);
                const collection = db.collection('books');
                collection.insertMany(books, function(err, results) {
                    res.send(results);
                    client.close();
                });
            });
        });
    return adminRouter;
};

module.exports = router;