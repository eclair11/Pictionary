<?php
session_start();
$id = $_SESSION["id"];
$commands = $_POST["drawingCommands"];
$picture = $_POST["picture"];
echo($id);
echo($commands);
echo($picture);
$dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');

$sql = $dbh->query("INSERT INTO drawings(id,commands,picture) VALUES ('$id','$commands','$picture')");