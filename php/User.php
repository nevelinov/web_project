<?php

class User implements JsonSerializable {
    
    private string $username;
    private string $role;

    public function __construct(string $username, string $role) {
        $this->username = $username;
        $this->role = $role;
    }

    public function getUsername(): string {
        return $this->username;
    }

    public function getRole(): string {
        return $this->role;
    }

    public function jsonSerialize(): array {

        $fieldsToSerialize = ['username', 'role'];

        $jsonArray = [];

        foreach ($fieldsToSerialize as $fieldName) {
            $jsonArray[$fieldName] = $this->$fieldName;
        }

        return $jsonArray;
    }

    public static function createFromArray(array $userArray): User {

        return new User($userArray['username'], $userArray['role']);
    }
}
