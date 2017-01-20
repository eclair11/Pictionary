<?php

// récupérer les éléments du formulaire
// et se protéger contre l'injection MySQL (plus de détails ici: http://us.php.net/mysql_real_escape_string)
$email=stripslashes($_POST['email']);
$password=stripslashes($_POST['password']);
$nom=stripslashes($_POST['nom']);
$prenom=stripslashes($_POST['prenom']);
$tel=stripslashes($_POST['tel']);
$website=stripslashes($_POST['website']);
$sexe='';
if (array_key_exists('sexe',$_POST)) {
    $sexe=stripslashes($_POST['sexe']);
}
$birthdate=stripslashes($_POST['birthdate']);
$ville=stripslashes($_POST['ville']);
$taille=stripslashes($_POST['taille']);
$couleur=stripslashes($_POST['couleur']);
$profilepic=stripslashes($_POST['profilepic']);

try {
    // Connect to server and select database.
    $dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');

    // Vérifier si un utilisateur avec cette adresse email existe dans la table.
    // En SQL: sélectionner tous les tuples de la table USERS tels que l'email est égal à $email.
    $sql = $dbh->query("SELECT COUNT(*) FROM users WHERE email='$email'");
    if ($sql->fetchColumn() > 0) {
        header('Location: http://localhost/inscription.php');
        exit();
        // rediriger l'utilisateur ici, avec tous les paramètres du formulaire plus le message d'erreur
        // utiliser à bon escient la méthode htmlspecialchars http://www.php.net/manual/fr/function.htmlspecialchars.php          // et/ou la méthode urlencode http://php.net/manual/fr/function.urlencode.php
    }
    else {
        // Tenter d'inscrire l'utilisateur dans la base
        $sql = $dbh->prepare("INSERT INTO users (email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic) "
            . "VALUES (:email, :password, :nom, :prenom, :tel, :website, :sexe, :birthdate, :ville, :taille, :couleur, :profilepic)");
        $sql->bindValue(":email", $email);
        $sql->bindValue(":password", $password);
        $sql->bindValue(":nom", $nom);
        $sql->bindValue(":birthdate", $birthdate);
        $sql->bindValue(":taille", $taille);
        $sql->bindValue(":couleur", substr($couleur,1,6));
        $sql->bindValue(":prenom", $prenom);
        $sql->bindValue(":tel", $tel);
        $sql->bindValue(":website", $website);
        $sql->bindValue(":ville", $ville);
        $sql->bindValue(":sexe", $sexe);
        $sql->bindValue(":profilepic", $profilepic);
        // de même, lier la valeur pour le mot de passe
        // lier la valeur pour le nom, attention le nom peut être nul, il faut alors lier avec NULL, ou DEFAULT
        // idem pour le prenom, tel, website, birthdate, ville, taille, profilepic
        // n.b., notez: birthdate est au bon format ici, ce serait pas le cas pour un SGBD Oracle par exemple
        // idem pour la couleur, attention au format ici (7 caractères, 6 caractères attendus seulement)
        // idem pour le prenom, tel, website
        // idem pour le sexe, attention il faut être sûr que c'est bien 'H', 'F', ou ''

        // on tente d'exécuter la requête SQL, si la méthode renvoie faux alors une erreur a été rencontrée.
        if (!$sql->execute()) {
            echo "PDO::errorInfo():<br/>";
            $err = $sql->errorInfo();
            print_r($err);
        } else {

            // ici démarrer une session
            session_start();

            // ensuite on requête à nouveau la base pour l'utilisateur qui vient d'être inscrit, et
            $sql = $dbh->query("SELECT u.id, u.email, u.nom, u.prenom, u.couleur, u.profilepic FROM USERS u WHERE u.email='".$email."'", PDO::FETCH_OBJ);
            if ($sql->rowCount()<1) {
                header("Location: main.php?erreur=".urlencode("un problème est survenu"));
            }
            else {
                // on récupère la ligne qui nous intéresse avec $sql->fetch(),
                // et on enregistre les données dans la session avec $_SESSION["..."]=...
                foreach($sql as $res) {
                    $_SESSION["id"]=$res->id;
                    $_SESSION["nom"]=$res->nom;
                    $_SESSION["prenom"]=$res->prenom;
                    $_SESSION["profilepic"]=$res->profilepic;
                }
            }

            // ici,  rediriger vers la page main.php
            header('Location: http://localhost/main.php');
            exit();
        }
        $dbh = null;
    }
} catch (PDOException $e) {
    print "Erreur !: " . $e->getMessage() . "<br/>";
    $dbh = null;
    die();
}