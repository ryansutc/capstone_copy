/*Various SQL Queries to Analyze data
 this is the workspace of queries
 */

-- ensure that combination of fields returns unique ID
SELECT count(course), course, sectionno,  term, component, deliveryId FROM RoomDelivery_TEMP
GROUP BY course, sectionno, term, component, deliveryId;

-- select a specific record
SELECT * FROM RoomDelivery_TEMP
WHERE faculty = 'NSCCS'
AND department = 'COMP/IT'
AND course = 'INFT2000_011601'
AND sectionNo = '701'
AND term = '1168'
AND componentType = 'DIS'
AND component = '701'
AND deliveryId = '1';

-- get classes scheduled for today
SELECT * FROM nsccSchedule 
WHERE days LIKE CONCAT('%',(
	SELECT dayChar 
    FROM daysLU 
    WHERE id = DAYOFWEEK(NOW())
    ), '%');

-- Get All Courses on Right Now
SELECT * FROM nsccSchedule 
WHERE days LIKE CONCAT('%',(
	SELECT dayChar 
    FROM daysLU 
    WHERE id = DAYOFWEEK(NOW())
    ), '%')
    AND 
    TIME(NOW()) > startTime
    AND TIME(NOW()) < endTime;

-- Get All Rooms WITHOUT courses right Now
SELECT * FROM nsccSchedule
WHERE days LIKE CONCAT('%',(
  SELECT dayChar
  FROM daysLU
  WHERE id = DAYOFWEEK(NOW())
), '%')
      AND
      TIME(NOW()) > startTime
      AND TIME(NOW()) < endTime;
  -- take this result, do an outer join with list of classrooms
  -- to find rooms without any class on at present.