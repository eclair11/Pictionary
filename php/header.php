<?php
session_start();
if(isset($_SESSION['id'])) {
    echo "Bonjour ".$_SESSION['nom']." ".$_SESSION['prenom'];
    echo '<br />';
    echo '<img src="'.$_SESSION['profilepic'].'" />';
    echo '<br />';
    echo '<a href="logout.php"> Déconnexion </a>';
	echo '<br />';
	echo '<a href="paint.php"> Painture </a>';
}
else {
?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=utf-8 />
        <title>Pictionnary - Connexion</title>
        <link rel="stylesheet" media="screen" href="css/styles.css" >
    </head>
    <body>
    <form action = "req_login.php" method = "post" >
        <p>Email :<input type = "email" name = "email" /></p>
        <p>Mot de passe :<input type = "password" name = "password" /></p>
        <p><input type = "submit" value = "Valider" ></p>
    </form >
    </body>
    </html>
<?php
    echo '<a href="inscription.php"> Inscription </a>';
}