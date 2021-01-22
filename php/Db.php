<?php
declare(strict_types=1);

/**
 * Communicates with the database
 */
class Db {

    private PDO $connection;

    public function __construct() {
        // TODO: read this data from conf file
        $dbhost = "localhost";
        $dbName = "web-project";
        $userName = "root";
        $userPassword = "";

        $this->connection = new PDO("mysql:host=$dbhost;dbname=$dbName", $userName, $userPassword,
            [
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
    }

    /**
     * Gets connection object which allows database operations
     */
    public function getConnection(): PDO {
        return $this->connection;
    }
}
