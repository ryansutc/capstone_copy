-- PROCEDURE to get next booking of given room.
DROP PROCEDURE IF EXISTS RoomAvailableUntil;
DELIMITER //
CREATE PROCEDURE RoomAvailableUntil(IN roomNum VARCHAR(255))
	
	BEGIN
      SELECT startTime FROM nsccSchedule
		WHERE room = roomNum
		AND	(DATE(NOW()) > startDate
		AND DATE(NOW()) < endDate)
        
		AND days LIKE CONCAT('%',(
			SELECT dayChar 
			FROM daysLU 
			WHERE id = DAYOFWEEK(NOW())
		), '%')
        
		AND startTime > TIME(NOW())
		ORDER BY startTime ASC
		LIMIT 1;
	END//
DELIMITER ;
