<?php
declare(strict_types=1);

/**
 * Logs users in, registers users?
 */
class AuthenticateController {
    // perform login
    public static function login(array $loginData): ?array {

        try {
            $connection = (new Db())->getConnection();

            $selectStatement = $connection->prepare("
                SELECT * 
                FROM `users`
                WHERE username=:username
            ");

            $result = $selectStatement->execute(['username' => $loginData['username']]);
            if (!$result) {
                // no user with that username
                return null;
            }

            $user = $selectStatement->fetch();
            
            // check password
            if (password_verify($loginData['password'], $user['password'])) {
                return $user;
            }
            
            return null;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return null;
        }

        return null;
    }

    // perform register
    public static function register(array $registerData): void {

    }
}
