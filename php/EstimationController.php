<?php
declare(strict_types=1);

class EstimationController {
    
    public function getAllEstimations(): array {
        
        $estimations = [];
        
        $query = (new Db())->getConnection()->query("SELECT * FROM `student_estimations`") or die("failed!");

        while ($estimation = $query->fetch()) {
            $estimations[] = Estimation::createFromArray($estimation);
        }
        
        return $estimations;
    }
    
    public function createEstimation(EstimationRequest $estimationRequest): bool {
        
        try {
            $connection = (new Db())->getConnection();

            $sqlStatement = $connection->prepare("
                INSERT INTO `student_estimations`(`user_id`, `node_id`, `estimation_text`, `estimation_value`)
                VALUES (:user_id, :node_id, :estimation_text, :estimation_value)
            ");
            $result = $sqlStatement->execute($estimationRequest->toArray());

            if ($result === false) {
                die(json_encode($updateStatement->errorInfo()));
                return false;
            }
        } catch (PDOException $e) {
            die(json_encode($e));
            return false;
        }

        if ($result === false) {
            var_dump($sqlStatement->errorInfo());
        }

        return $result;
    }

    public function setPriority(float $estimationPriority, int $estimationId): bool {
        try {
            $connection = (new Db())->getConnection();

            $updateStatement = $connection->prepare("
                UPDATE `student_estimations` SET `estimation_priority`=:estimation_priority, `priority_set`=True
                WHERE `se_id` =:se_id
            ");

            $result = $updateStatement->execute(['estimation_priority' => $estimationPriority, 'se_id' => $estimationId]);
            //die(json_encode(['estimation_priority' => $estimationPriority, 'se_id' => $estimationId]));
            if ($result === false) {
                die(json_encode($updateStatement->errorInfo()));
                return false;
            }
        } catch (PDOException $e) {
            return false;
        }

        if ($result === false) {
            var_dump($updateStatement->errorInfo());
        }

        return $result;
    }
}