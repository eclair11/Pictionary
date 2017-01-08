<?php
$email = $_POST['email'];
$password = $_POST['password'];

$dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');

$sql = $dbh->query("SELECT id, nom, prenom, profilepic FROM users WHERE email='$email' AND password='$password'", PDO::FETCH_OBJ);
if ($sql->rowCount() > 0) {
    session_start();
    foreach($sql as $res) {
        $_SESSION["id"]=$res->id;
        $_SESSION["nom"]=$res->nom;
        $_SESSION["prenom"]=$res->prenom;
        $_SESSION["profilepic"]=$res->profilepic;
    }
}
header('Location: http://localhost/main.php');
exit();