<?php
declare(strict_types=1);

/**
 * Request for creation and modification of Estimations
 */
class EstimationRequest {

    private int $estimationId;
    private int $userId;
    private int $nodeId;
    private string $estimationText;
    private string $estimationValue;

    private bool isCreateRequest;

    /**
     * Constructs a request object from associative array
     */
    public function __construct(array $estimationData) {

        if (isset($estimationData['estimation_id'])) {
            $this->isCreateRequest = false;
            $this->estimationId = $estimationData['estimation_id'];
        } else {
            $this->isCreateRequest = true;
            $this->estimationId = -1;
        }

        $this->userId = isset($estimationData["user_id"]) ? intval($estimationData["user_id"]) : -1;
        $this->nodeId = isset($estimationData["node_id"]) ? intval($estimationData["node_id"]) : -1;
        
        $this->estimationText = isset($estimationData["estimation_text"]) ? $estimationData["estimation_text"] : "";
        $this->estimationValue = isset($estimationData["estimation_value"]) ? boolval($estimationData["estimation_value"]) : -1;
        $this->properties = isset($estimationData["properties"]) ? $estimationData["properties"] : "";
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
            'se_id' => $this->estimationId,
            'user_id' => $this->userId,
            'node_id' => $this->nodeId,
            'estimation_text' => $this->estimationText,
            'estimation_value' => $this->estimationValue
        ];
    }

}
