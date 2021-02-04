<?php
declare(strict_types=1);

class Estimation implements JsonSerializable {
    
    private int $estimationId;
    private int $userId;
    private int $nodeId;
    private string $estimationText;
    private float $estimationValue;
    private float $estimationPriority;
    private bool $prioritySet;

    public function __construct(int $estimationId, int $userId, int $nodeId, string $estimationText, float $estimationValue, float $estimationPriority, bool $prioritySet) {
        $this->estimationId = $estimationId;
        $this->userId = $userId;
        $this->nodeId = $nodeId;
        $this->estimationText = $estimationText;
        $this->estimationValue = $estimationValue;
        $this->estimationPriority = $estimationPriority;
        $this->prioritySet = $prioritySet;
    }

    public function jsonSerialize(): array {

        $fieldsToSerialize = ['estimationId', 'userId', 'nodeId', 'estimationText', 'estimationValue', 'estimationPriority', 'prioritySet'];

        $jsonArray = [];

        foreach ($fieldsToSerialize as $fieldName) {
            $jsonArray[$fieldName] = $this->$fieldName;
        }

        return $jsonArray;
    }
    
    public static function createFromArray(array $dataArray): Estimation {
        return new Estimation(
            intval($dataArray['se_id']), intval($dataArray['user_id']),
            intval($dataArray['node_id']), $dataArray['estimation_text'],
            floatval($dataArray['estimation_value']),
            floatval($dataArray['estimation_priority']), boolval($dataArray['priority_set'])
        );
    }
}
