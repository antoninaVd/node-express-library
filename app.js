var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();
var port = process.env.PORT || 3000;
var nav = [{
    link:'/books',
    text:'Books'
},
{
    link: '/authors',
    text:'Authors'
}];

var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRouters')(nav);
var authRouter = require('./src/routes/authRouters')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'library'}));
require('./src/config/passport')(app);

app.set('views','./src/views');

//for jade template engine
//app.set('view engine', 'jade');

//for handlebars template engine
/*var handlebars = require('express-handlebars');
app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');*/

//for EJS template engine
app.set('view engine', 'ejs');

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', function(req, res) {
    res.render('index', {title: 'Hello from render', nav: nav});
});

app.listen(port, function(err) {
    console.log('running server on port ' + port);
});
