var express = require('express');
var app = express();

var bodyparser = require('body-parser');
app.use(bodyparser());

var sessions = require('express-session');
var session;
app.use(sessions({
    secret:'bsh5wh82bsihs89'
}))

var handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use('/mycss', express.static(__dirname+'/views/css'));

app.get('/', function(req, res){
    session=req.session;
    
    if(session.session_user){
        res.render('studentList');
    } else {
        res.render('login');
    }
});

app.post('/dash', function(req, res){
    var user = req.body.username;
    var pwd = req.body.password;

    console.log(user+' '+pwd);

    if(user=='admin' && pwd=='admin'){
        session=req.session;
        session.session_user=user;
        res.render('studentList');
    } else {
        res.redirect('/')
    }
});

app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

app.listen('3000', function(){
    console.log('Server is running on port 3000');
});