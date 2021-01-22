<?php
declare(strict_types=1);

class UserController {

    public function getAllUsers(): array {

        $users = [];

        $query = (new Db())->getConnection()->query("SELECT * FROM `users`") or die("failed!");

        while ($user = $query->fetch()) {
            $users[] = User::createFromArray($user);
        }
        
        return $users;

    }

    public function registerUser(NewUserRequest $newUserRequest): bool {
        
        try {
            $connection = (new Db())->getConnection();

            $insertStatement = $connection->prepare("
                INSERT INTO `users` (username, password, role)
                    VALUES (:username, :password, :role)
            ");
            var_dump($newUserRequest->toArray());
            $result = $insertStatement->execute($newUserRequest->toArray());
        
            if ($result === false) {
                var_dump($insertStatement->errorInfo());
            }
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return false;
        }

        if ($result === false) {
            var_dump($insertStatement->errorInfo());
        }

        return $result;
    }

}