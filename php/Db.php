<?php
declare(strict_types=1);

/**
 * Communicates with the database
 */
class Db {
    
    private PDO $connection;

    public function __construct() {
        $config = include('config.php');

        $dbhost = $config['db_host'];
        $dbName = $config['db_name'];
        $userName = $config['db_username'];
        $userPassword = $config['db_password'];

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
