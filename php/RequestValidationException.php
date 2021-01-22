<?php

class RequestValidationException extends Exception {

    private array $errors;

    public function __construct(array $errors, $message = "Invalid request") {
        
        $this->errors = $errors;

        parent::__construct($message);
    }

    public function getErrors(): array {
        return $this->errors;
    }

}