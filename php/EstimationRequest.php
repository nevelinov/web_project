<?php
declare(strict_types=1);

/**
 * Request for creation and modification of Estimations
 */
class EstimationRequest {

    private int $userId;
    private int $nodeId;
    private string $estimationText;
    private float $estimationValue;

    /**
     * Constructs a request object from associative array
     */
    public function __construct(array $estimationData) {
    
        $this->userId = isset($estimationData["user_id"]) ? intval($estimationData["user_id"]) : -1;
        $this->nodeId = isset($estimationData["node_id"]) ? intval($estimationData["node_id"]) : -1;
        $this->estimationText = isset($estimationData["estimation_text"]) ? $estimationData["estimation_text"] : "";
        $this->estimationValue = isset($estimationData["estimation_value"]) ? floatval($estimationData["estimation_value"]) : -1;
    }

    /**
     * Validates the request object
     * 
     * @throws Exception when the request object is not valid
     */
    public function validate(): void {

        $errors = [];

        $this->validateNonEmpty('userId', $errors);
        $this->validateNonEmpty('nodeId', $errors);
        $this->validateNonEmpty('estimationValue', $errors);

        if ($errors) {
            throw new RequestValidationException($errors);
        }
    }

    private function validateNonEmpty($fieldName, &$errors) {

        if (!$this->$fieldName) {
            $errors[$fieldName] = 'Field should not be empty';
        }
    }

    /**
     * Exports the request object to associative array.
     * Can be used for serialization.
     */
    public function toArray(): array {
        return [
            'user_id' => $this->userId,
            'node_id' => $this->nodeId,
            'estimation_text' => $this->estimationText,
            'estimation_value' => $this->estimationValue
        ];
    }

}
