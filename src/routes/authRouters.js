var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function(nav) {
    authRouter.route('/signup')
        .post(function(req, res) {
            var url = 'mongodb://localhost:27017';
            var dbName = 'libraryApp';
            mongodb.connect(url, function(err, client) {
                var db = client.db(dbName);
                var collection = db.collection('users');

                var user = {
                    username: req.body.userName,
                    password: req.body.password
                };
                collection.insert(user, function(err, result) {
                    req.login(result.ops[0], function() {
                        res.redirect('/auth/profile');
                    });
                    client.close();
                });
            });
            console.log(req.body);
        });

    authRouter.route('/signin')
        .post(passport.authenticate('local', {
            failureRedirect: '/'
        }), function(req, res) {
            res.redirect('/auth/profile');
        });

    authRouter.route('/profile')
        .all(function(req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }
            next();
        })
        .get(function(req, res) {
            res.json(req.user);
        });

    return authRouter;
};

module.exports = router;