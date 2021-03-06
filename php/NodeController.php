<?php
declare(strict_types=1);

class NodeController {

    public function getAllNodes(): array {
        
        $nodes = [];

        $query = (new Db())->getConnection()->query("SELECT * FROM `nodes`") or die("failed!");
        
        while ($node = $query->fetch()) {
            $nodes[] = Node::createFromArray($node);
        }

        return $nodes;
    }

    public function addNode(NodeRequest $newNodeRequest): bool {
        
        try {
            $connection = (new Db())->getConnection();

            $insertStatement = $connection->prepare("
                INSERT INTO `nodes` (node_id, parent_node_id, text, is_leaf, url, added_time, properties)
                    VALUES (:node_id, :parent_node_id, :text, :is_leaf, :url, :added_time, :properties)
            ");
            
            $result = $insertStatement->execute($newNodeRequest->toArray());

            if ($result === false) {
                //die(json_encode($insertStatement->errorInfo()));
                return false;
            }
        } catch (PDOException $e) {
            //die(json_encode($e));
            return false;
        }

        if ($result === false) {
            var_dump($insertStatement->errorInfo());
        }

        return $result;
    }

    public function updateNode(NodeRequest $nodeUpdateRequest): bool {
        try {
            $connection = (new Db())->getConnection();

            $insertStatement = $connection->prepare("
                UPDATE `nodes` SET
                        `parent_node_id`=:parent_node_id, `text`=:text, `is_leaf`=:is_leaf, `url`=:url, `added_time`=:added_time, `properties`=:properties
                    WHERE `node_id`=:node_id
            ");
            $nodeRequestArray = $nodeUpdateRequest->toArray();

            $result = $insertStatement->execute([
                'node_id' => $nodeRequestArray['node_id'],
                'parent_node_id' => $nodeRequestArray['parent_node_id'],
                'text' => $nodeRequestArray['text'],
                'is_leaf' => $nodeRequestArray['is_leaf'],
                'url' => $nodeRequestArray['url'],
                'added_time' => $nodeRequestArray['added_time'],
                'properties' => $nodeRequestArray['properties']
                ]);
        
            if ($result === false) {
                die(json_encode($insertStatement->errorInfo()));
                return false;
            }
        } catch (PDOException $e) {
            return false;
        }

        if ($result === false) {
            var_dump($insertStatement->errorInfo());
        }

        return $result;
    }
}