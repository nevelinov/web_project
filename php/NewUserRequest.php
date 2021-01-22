<?php

/**
 * Request for creation of new User
 */
class NewUserRequest {

    private string $username;

    private string $password;

    private string $role;

    /**
     * Constructs a request object from associative array
     * 
     * @param $residentData user input with register resident data
     */
    public function __construct(array $userData) {
        
        $this->username = isset($userData['username']) ? $userData['username'] : "";
        $this->password = isset($userData['password']) ? $userData['password'] : "";
        $this->role = isset($userData['role']) ? $userData['role'] : "";
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
            'role' => $this->role,
        ];
    }

}
