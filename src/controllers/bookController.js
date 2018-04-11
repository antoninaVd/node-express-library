var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var bookController = function(bookService, nav) {
    var middleware = function(req, res, next) {
        if (!req.user) {
            //res.redirect('/');
        }
        next();
    };

    var getIndex = function(req, res) {
        var url = 'mongodb://localhost:27017';
        var dbName = 'libraryApp';

        mongodb.connect(url, function(err, client) {
            const db = client.db(dbName);
            const collection = db.collection('books');

            collection.find({}).toArray(function(err, results) {
                res.render('bookListView', {
                    title: 'Books',
                    nav: nav,
                    books: results
                });
                client.close();
            });
        });
    };

    var getById = function(req, res) {
        var id = new objectId(req.params.id);
        var url = 'mongodb://localhost:27017';
        var dbName = 'libraryApp';

        mongodb.connect(url, function(err, client) {
            const db = client.db(dbName);
            const collection = db.collection('books');

            collection.findOne({'_id':id},function(err, results) {
                bookService.getBookById(results.bookId, function(err, book) {
                    results.book = book;
                    res.render('bookView', {
                        title: 'Books',
                        nav: nav,
                        book: results
                    });
                });

                client.close();
            });
        });
    };

    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware
    };
};

module.exports = bookController;