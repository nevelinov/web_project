<?php
declare(strict_types=1);

/**
 * Request for creation and modification of Nodes
 */
class NodeRequest {

    private int $nodeId;
    private int $parentNodeId;
    private string $text;
    private bool $isLeaf;
    private string $url;
    private float $addedTime;
    private string $properties;


    /**
     * Constructs a request object from associative array
     */
    public function __construct(array $nodeData) {
        $this->nodeId = isset($nodeData["node_id"]) ? intval($nodeData["node_id"]) : "";
        $this->parentNodeId = isset($nodeData["parent_node_id"]) ? intval($nodeData["parent_node_id"]) : -1;
        $this->text = isset($nodeData["text"]) ? $nodeData["text"] : "";
        $this->isLeaf = isset($nodeData["is_leaf"]) ? boolval($nodeData["is_leaf"]) : false;
        $this->url = isset($nodeData["url"]) ? $nodeData["url"] : "";
        $this->addedTime = isset($nodeData["added_time"]) ? floatval($nodeData["added_time"]) : 0;
        $this->properties = isset($nodeData["properties"]) ? $nodeData["properties"] : "";
    }

    /**
     * Validates the request object
     * 
     * @throws Exception when the request object is not valid
     */
    public function validate(): void {

        $errors = [];

        $this->validateNonEmpty('nodeId', $errors);

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
            'node_id' => $this->nodeId,
            'parent_node_id' => $this->parentNodeId,
            'text' => $this->text,
            'is_leaf' => $this->isLeaf,
            'url' => $this->url,
            'added_time' => $this->addedTime,
            'properties' => $this->properties
        ];
    }

}
