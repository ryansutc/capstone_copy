SELECT DISTINCT room FROM nsccSchedule
	WHERE days LIKE CONCAT('%',(
			SELECT dayChar 
			FROM daysLU 
			WHERE id = DAYOFWEEK(NOW())
		), '%')
		AND 
		(TIME(NOW()) > startTime
		AND TIME(NOW()) < endTime)
		AND
		(DATE(NOW()) > startDate
		AND DATE(NOW()) < endDate)