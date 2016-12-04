<?php
session_start();
if(isset($_SESSION['id'])) {
    echo "Bonjour " . $_SESSION['nom'] . " " . $_SESSION['prenom'];
    echo '<a href="logout.php" > Déconnexion </a>';
}
else {
?>
    <form action = "req_login.php" method = "post" >
        <p>Email :<input type = "email" name = "email" /></p>
        <p>Mot de passe :<input type = "password" name = "password" /></p>
        <p><input type = "submit" value = "Valider" ></p>
    </form >
<?php
    echo '<a href="inscription.php" > Inscription </a>';
}