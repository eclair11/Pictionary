var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session')

function RequestCheckSQL(username, password, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});

    connection.connect();

    connection.query("SELECT * FROM users WHERE email='"+username+"' AND password='"+password+"'", function (err, rows, fields) {
        if(!err)
            if (rows.length>0)
                res.redirect('/inscription');
            else
                res.redirect('/login');
        else
            logger.error(err);
    });

    connection.end();
}

function RequestInsertSQL(info, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({host:'localhost',user:'root',password:'',database:'pictionnary'});

    connection.connect();

    connection.query("INSERT INTO users (email,password,nom,prenom,tel,website,sexe,birthdate,ville,taille,couleur,profilepic) VALUES ('"+info.email+"','"+info.password+"','"+info.nom+"','"+info.prenom+"','"+info.tel+"','"+info.website+"','"+info.sexe+"','"+info.birthdate+"','"+info.ville+"','"+info.taille+"','"+info.couleur+"','"+info.profilepic+"')", function (err, rows, fields) {
        if(!err) {
            session.start = true;
            session.nom = info.nom;
            session.prenom = info.prenom;
            session.profilepic = info.profilepic;
            res.redirect('/profile');
        }
        else
            res.redirect('/inscription');
    });

    connection.end();
}

// config

app.listen(1313);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

logger.info('server start');

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    RequestCheckSQL(username, password, res);
});

app.get('/inscription', function(req, res){
    res.render('inscription');
});

app.post('/inscription', function (req, res) {
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
	var info = {email:email, password:password, nom:nom, prenom:prenom, tel:tel,
		website:website, sexe:sexe, birthdate:birthdate, ville:ville, taille:taille,
		couleur:couleur.substr(1,6), profilepic:profilepic};
	RequestInsertSQL(info, res);
});

app.get('/profile', function(req, res){
    res.render('profile',{start:session.start, nom:session.nom, prenom:session.prenom, profilepic:session.profilepic});
});