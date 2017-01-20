<?php
session_start();
$id = $_SESSION["id"];
$commands = $_POST["drawingCommands"];
$picture = $_POST["picture"];
$dbh = new PDO('mysql:host=localhost;dbname=pictionnary', 'test', 'test');

$sql = $dbh->query("INSERT INTO drawings(id,commands,picture) VALUES ($id,'$commands','$picture')");