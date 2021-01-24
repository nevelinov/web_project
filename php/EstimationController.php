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
    
    public function postEstimation(EstimationRequest $estimationRequest): bool {
        
        try {
            $connection = (new Db())->getConnection();

            if($estimationRequest->isCreateReuqest()) {
                $sqlStatement = $connection->prepare("
                    INSERT INTO `student_estimations`(`user`, `node_id`, `estimation_text`, `estimation_value`)
                    VALUES (:user_id, :node_id, :estimation_text, :estimation_value)
                ");
            } else {
                $sqlStatement = $connection->prepare("
                    UPDATE `student_estimations`
                    SET `estimation_text`=:estimation_text,`estimation_value`=:estimation_value WHERE se_id = :se_id
                ");
            }
            
            $result = $sqlStatement->execute($estimationRequest->toArray());

            if ($result === false) {
                //die(json_encode($insertStatement->errorInfo()));
                return false;
            }
        } catch (PDOException $e) {
            //die(json_encode($e));
            return false;
        }

        if ($result === false) {
            var_dump($sqlStatement->errorInfo());
        }

        return $result;
    }
}