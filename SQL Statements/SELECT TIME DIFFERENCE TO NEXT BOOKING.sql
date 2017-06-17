SELECT timediff((SELECT startTime FROM nsccSchedule
WHERE room = 'ITC-D312'
AND	(DATE(NOW()) > startDate
		AND DATE(NOW()) < endDate)
        
AND days LIKE CONCAT('%',(
			SELECT dayChar 
			FROM daysLU 
			WHERE id = DAYOFWEEK(NOW())
		), '%')
        
AND startTime > '10:31:00'
ORDER BY startTime ASC
LIMIT 1), '10:31:00');


