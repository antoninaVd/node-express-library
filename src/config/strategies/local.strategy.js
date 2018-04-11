var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb').MongoClient;

module.exports = function() {
    passport.use(new localStrategy({
        usernameField: 'userName',
        passwordField: 'password'
    },
    function(username, password, done) {
        var url = 'mongodb://localhost:27017';
        var dbName = 'libraryApp';
        mongodb.connect(url, function(err, client) {
            var db = client.db(dbName);
            var collection = db.collection('users');

            collection.findOne({username: username}, function(err, result) {
                if (result === null) {
                    done(null, false);
                } else {
                    if (result.password === password) {
                        var user = result;
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                }
                client.close();
            });
        });
    }));
};