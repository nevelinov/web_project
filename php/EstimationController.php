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
                die(json_encode($insertStatement->errorInfo()));
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
}