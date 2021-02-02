<?php
declare(strict_types=1);

class User implements JsonSerializable {
    
    private string $username;
    private string $name;
    private string $role;
    private int $root_node_id;

    public function __construct(string $username, string $name, string $role, int $root_node_id) {
        $this->username = $username;
        $this->name = $name;
        $this->role = $role;
        $this->root_node_id = $root_node_id;
    }

    public function getUsername(): string {
        return $this->username;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getRole(): string {
        return $this->role;
    }
    
    public function getRootNodeId(): int {
        return $this->root_node_id;
    }

    public function jsonSerialize(): array {

        $fieldsToSerialize = ['username', 'name', 'role', 'root_node_id'];

        $jsonArray = [];

        foreach ($fieldsToSerialize as $fieldName) {
            $jsonArray[$fieldName] = $this->$fieldName;
        }

        return $jsonArray;
    }

    public static function createFromArray(array $userArray): User {
        return new User($userArray['username'], $userArray['name'], 
                        $userArray['role'], intval($userArray['root_node_id'])
                       );
    }
}
