<?php
declare(strict_types=1);

class Node implements JsonSerializable {
    
    private int $nodeId;
    private int $parentNodeId;
    private string $text;
    private bool $isLeaf;
    private string $url;
    private float $added_time;
    private string $properties;

    public function __construct(int $nodeId, int $parentNodeId, $text, $isLeaf, $url, $added_time, $properties) {
        $this->nodeId = $nodeId;
        $this->parentNodeId = $parentNodeId;
        $this->text = $text;
        $this->isLeaf = $isLeaf;
        $this->url = $url;
        $this->added_time = $added_time;
        $this->properties = $properties;
    }

    public function jsonSerialize(): array {

        $fieldsToSerialize = ['nodeId', 'parentNodeId', 'text', 'isLeaf', 'url', 'added_time', 'properties'];

        $jsonArray = [];

        foreach ($fieldsToSerialize as $fieldName) {
            $jsonArray[$fieldName] = $this->$fieldName;
        }

        return $jsonArray;
    }

    public static function createFromArray(array $dataArray): Node {
        return new Node(
            intval($dataArray['node_id']), intval($dataArray['parent_node_id']),
            $dataArray['text'],
            boolval($dataArray['is_leaf']), $dataArray['url'],
            floatval($dataArray['added_time']), $dataArray['properties']);
    }
}
