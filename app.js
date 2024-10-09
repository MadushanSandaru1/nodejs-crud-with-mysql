var express = require('express');
var app = express();

var bodyparser = require('body-parser');
app.use(bodyparser());

// session
var sessions = require('express-session');
var session;

// session encryption secret set
app.use(sessions({
    secret:'bsh5wh82bsihs89'    // we can use any code for secret
}))

// mysql
var mysql = require('mysql');
var con;

// handlebars template engine 
var handlebars = require('express-handlebars');
const { connect } = require('http2');
app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// set external css path
app.use('/mycss', express.static(__dirname+'/views/css'));

// user login page
app.get('/', function(req, res){
    session=req.session;
    
    if(session.session_user){
        con.query(`SELECT * FROM student`, function(err, result){
            if(err) throw err;
            res.render('studentList', {
                result: result
            });
        });
    } else {
        res.render('login');
    }
});

// user login and list student page route
app.post('/dash', function(req, res){
    var user = req.body.username;
    var pwd = req.body.password;

    con.query(`SELECT * FROM user WHERE name='${user}' AND password='${pwd}' LIMIT 1`, function(err, result){
        if(err) throw err;
        if(result.length==1){
            session=req.session;
            session.session_user=user;

            res.redirect('/liststudent');
        } else {
            res.redirect('/');
        }
    });
});

// add student page route
app.get('/liststudent', function(req, res){
    con.query(`SELECT * FROM student`, function(err, result){
        if(err) throw err;
        res.render('studentList', {
            result: result
        });
    });
});

// add student page route
app.get('/addstudent', function(req, res){
    res.render('studentAdd');
});

// add student
app.post('/add', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;

    con.query(`INSERT INTO student(name, email, phone) VALUES ('${name}', '${email}', '${phone}')`, function(err, result){
        if(err) throw err;
        res.redirect('/liststudent');
    });
});

// delete student
app.post('/deletestudent', function(req, res){
    var row_id = req.body.id;

    con.query(`DELETE FROM student WHERE id='${row_id}'`, function(err, result){
        if(err) throw err;
    });
});

// user logout
app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

// server and mysql connection
app.listen('3000', function(){
    con = mysql.createConnection({
        socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
        host: '127.0.0.1',
        user:'root',
        password:'root',
        database:'studentms'
    });

    con.connect(function(err){
        if(err){
            console.log("Error connecting database...");  
        } else {
            console.log("Database is connected...!");  
        }
    });
    console.log('Server is running on port 8000...');
});