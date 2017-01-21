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
            if (rows.length>0) {
                session.start = true;
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

function RequestInsertSQL(info, res) {
    connection.query("INSERT INTO users" +
        "(email,password,nom,prenom,tel,website,sexe,birthdate,ville,taille,couleur,profilepic)" +
        "VALUES ('"+info.email+"','"+info.password+"','"+info.nom+"','"+info.prenom+"','"+info.tel+"','" +
        ""+info.website+"','"+info.sexe+"','"+info.birthdate+"','"+info.ville+"','"+info.taille+"','" +
        info.couleur+"','"+info.profilepic+"')", function (err, rows, fields) {
        if(!err) {
            session.start = true;
            session.nom = info.nom;
            session.prenom = info.prenom;
            session.profilepic = info.profilepic;
            session.couleur = info.couleur;
            res.redirect('/profile');
        }
        else
            res.redirect('/inscription');
    });
}

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
    if (username != "" && password != "")
        RequestCheckSQL(username, password, res);
    else
        res.redirect('/login');
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
	if (sexe == "")
	    sexe = "T";
	var info = {email:email, password:password, nom:nom, prenom:prenom, tel:tel,
		website:website, sexe:sexe, birthdate:birthdate, ville:ville, taille:taille,
		couleur:couleur.substr(1,6), profilepic:profilepic};
	RequestInsertSQL(info, res);
});

app.get('/paint', function(req, res){
    res.render('paint',{start:session.start, couleur:session.couleur});
});

app.post('/paint', function (req, res) {

});

app.get('/profile', function(req, res){
    res.render('profile',{start:session.start, nom:session.nom, prenom:session.prenom, profilepic:session.profilepic});
});