var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan'); // Charge le middleware de logging
var app = express();
var logger = require('log4js').getLogger('Server');
var mysql = require('mysql');
var session = require('express-session');

app.listen(1313);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging

var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});

function RequestCheckSQL(username, password, res) {
    connection.query("SELECT * FROM users WHERE email='"+username+"' AND password='"+password+"'",
        function (err, rows, fields) {
        if(!err)
            if (rows.length > 0) {
                session.id = rows[0].id;
                session.nom = rows[0].nom;
                session.prenom = rows[0].prenom;
                session.profilepic = rows[0].profilepic;
                session.couleur = rows[0].couleur;
                res.redirect('/profile');
            }
            else
                res.redirect('/login');
        else
            logger.error(err);
    });
}

function RequestSubscribeSQL(info, res) {
    connection.query("INSERT INTO users" +
        "(email,password,nom,prenom,tel,website,sexe,birthdate,ville,taille,couleur,profilepic)" +
        "VALUES ('"+info.email+"','"+info.password+"','"+info.nom+"','"+info.prenom+"','"+info.tel+"','" +
        ""+info.website+"','"+info.sexe+"','"+info.birthdate+"','"+info.ville+"','"+info.taille+"','" +
        info.couleur+"','"+info.profilepic+"')", function (err, rows, fields) {
        if(!err) {
            connection.query("SELECT * FROM users WHERE email='"+info.email+"' AND password='"+info.password+"'",
                function (err, rows, fields) {
                session.id = rows[0].id;
                session.nom = rows[0].nom;
                session.prenom = rows[0].prenom;
                session.profilepic = rows[0].profilepic;
                session.couleur = rows[0].couleur;
                res.redirect('/profile');
            });
        }
        else {
            logger.error(err);
            res.redirect('/inscription');
        }
    });
}

function RecordDraw(id, commands, picture, res) {
    connection.query("INSERT INTO drawings (id,commands,picture) VALUES" +
        "("+id+",'"+commands+"','"+picture+"')", function (err, rows, fields) {
        if(!err)
            res.redirect('/profile');
        else
            logger.error(err);
    });
}

logger.info('server start');

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username != null && password != null)
        RequestCheckSQL(username, password, res);
    else
        res.redirect('/login');
});

app.get('/inscription', function(req, res){
    res.render('inscription');
});

app.post('/inscription', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var nom = req.body.nom;
	var prenom = req.body.prenom;
	var tel = req.body.tel;
	var website = req.body.website;
	var sexe = req.body.sexe;
	var birthdate = req.body.birthdate;
	var ville = req.body.ville;
	var taille = req.body.taille;
	var couleur = req.body.couleur;
	var profilepic = req.body.profilepic;
	if (sexe == null)
	    sexe = "T";
	var info = {email:email, password:password, nom:nom, prenom:prenom, tel:tel,
		website:website, sexe:sexe, birthdate:birthdate, ville:ville, taille:taille,
		couleur:couleur.substr(1,6), profilepic:profilepic};
    RequestSubscribeSQL(info, res);
});

app.get('/paint', function(req, res){
    res.render('paint',{id:session.id, couleur:session.couleur});
});

app.post('/paint', function(req, res) {
    var id = session.id;
    var commands = req.body.drawingCommands;
    var picture = req.body.picture;
    RecordDraw(id, commands, picture, res);
});

app.get('/profile', function(req, res){
    res.render('profile',{id:session.id, nom:session.nom, prenom:session.prenom, profilepic:session.profilepic});
});

app.get('/guess', function(req, res){
    connection.query("SELECT commands FROM drawings WHERE id='"+session.id+"'", function (err, rows, fields) {
        if (!err)
            if (rows.length > 0) {
                session.commands = rows[0].commands;
                res.render('guess', {commands: session.commands});
            }
        else
            logger.error(err);
    });
});

app.get('/logout', function(req, res){
    session.id = null;
    session.nom = null;
    session.prenom = null;
    session.profilepic = null;
    session.couleur = null;
    session.commands = null;
    res.render('logout');
});