<?php
declare(strict_types=1);

/**
 * Request for creation of new User
 */
class NewUserRequest {

    private string $username;
    private string $password;
    private string $name;
    private string $role;
    private int $root_node_id;

    /**
     * Constructs a request object from associative array
     */
    public function __construct(array $userData) {
        
        $this->username = isset($userData["username"]) ? $userData["username"] : "";
        $this->password = isset($userData["password"]) ? $userData["password"] : "";
        $this->name = isset($userData["name"]) ? $userData["name"] : "";
        $this->role = isset($userData["role"]) ? $userData["role"] : "";
        $this->root_node_id = isset($userData["root_node_id"]) ? $userData["root_node_id"] : "";
    }

    /**
     * Validates the request object
     * 
     * @throws Exception when the request object is not valid
     */
    public function validate(): void {

        $errors = [];

        $this->validateNonEmpty('username', $errors);
        $this->validateNonEmpty('password', $errors);
        $this->validateNonEmpty('name', $errors);
        $this->validateNonEmpty('role', $errors);

        if ($errors) {
            throw new RequestValidationException($errors);
        }
    }

    private function validateNonEmpty($fieldName, &$errors) {

        if (!$this->$fieldName) {
            $errors[$fieldName] = 'Field should not be empty';
        }

    }

    private function generateHashedPassword(): string {
        return password_hash($this->password, PASSWORD_DEFAULT);
    }

    /**
     * Exports the request object to associative array.
     * Can be used for serialization
     */
    public function toArray(): array {
        return [
            'username' => $this->username,
            'password' => $this->generateHashedPassword(),
            'name' => $this->name,
            'role' => $this->role,
            'root_node_id' => $this->root_node_id
        ];
    }

}
