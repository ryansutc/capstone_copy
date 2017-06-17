/*
This is a SQL Script to run to load the flat text files
into MySQL. Run this as needed to ensure that you are
working against the latest database schema.

This version is initial version created RS 20170108

security Note: user and password used here should be changed before
pushed to production as they are exposed here and are ROOT!!!!
 */

CREATE DATABASE IF NOT EXISTS nsccschedule;
CONNECT nsccschedule;

-- this only works on mysql version 5.7.6 and above. we have 5.7.3
/*
CREATE USER IF NOT EXISTS 'root'@'localhost'
  IDENTIFIED BY 'inet2005';
*/

-- this instead.
GRANT ALL PRIVILEGES ON nsccschedule TO 'root'@'localhost' IDENTIFIED BY 'inet2005'; 

DROP TABLE IF EXISTS CourseDelivery_TEMP;

CREATE TABLE CourseDelivery_TEMP (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	faculty VARCHAR(255) NOT NULL,
	department VARCHAR(255) NOT NULL,
	course VARCHAR(255) NOT NULL,
	sectionNo VARCHAR(255) NOT NULL,
	term VARCHAR(255) NOT NULL,
	componentType VARCHAR(255) NOT NULL,
	component VARCHAR(255) NOT NULL,
	deliveryId VARCHAR(255) NOT NULL,
	enrollment INT NOT NULL,
	startDate DATE NOT NULL,
	endDate DATE NOT NULL,
	intervalNo INT NOT NULL,
	days VARCHAR(7) NOT NULL,
	startTime TIME,
	endTime TIME,
	duration TIME NOT NULL,
	reservationType VARCHAR(255) NOT NULL,
	componentDesc VARCHAR(255) NOT NULL,
	deliveryDesc VARCHAR(255) NOT NULL,
	regStatus INT
);

LOAD DATA LOCAL INFILE 
'Delivery_2017-01-08_19.01.24.txt' 
INTO TABLE CourseDelivery_TEMP
(@row)
SET faculty = TRIM(SUBSTR(@row,1,30)),
    department = TRIM(SUBSTR(@row,31,30)),
	 course = TRIM(SUBSTR(@row,61,30)),
    sectionNo = TRIM(SUBSTR(@row,91,13)),
	 term = TRIM(SUBSTR(@row,121,13)),
	 componentType = TRIM(SUBSTR(@row,151,13)),
	 component = TRIM(SUBSTR(@row,181,13)),
	 deliveryId = TRIM(SUBSTR(@row,211,13)),
	 enrollment = TRIM(SUBSTR(@row,241,13)),
	 startDate = TRIM(SUBSTR(@row,251,10)),
	 endDate = TRIM(SUBSTR(@row,261,10)),
	 intervalNo = TRIM(SUBSTR(@row,271,2)),
	 days = TRIM(SUBSTR(@row,273,7)),
	 startTime = TRIM(SUBSTR(@row,280,5)),
	 endTime = TRIM(SUBSTR(@row,285,5)),
	 duration = TRIM(SUBSTR(@row,290,5)),
	 reservationType = TRIM(SUBSTR(@row,295,30)),
	 componentDesc = TRIM(SUBSTR(@row,325,35)),
	 deliveryDesc = TRIM(SUBSTR(@row,360,255)),
	 regStatus = TRIM(SUBSTR(@row,870,1))
;

DROP TABLE IF EXISTS RoomDelivery_TEMP;
CREATE TABLE RoomDelivery_TEMP (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	faculty VARCHAR(255) NOT NULL,
	department VARCHAR(255) NOT NULL,
	course VARCHAR(255) NOT NULL,
	sectionNo VARCHAR(255) NOT NULL,
	term VARCHAR(255) NOT NULL,
	componentType VARCHAR(255) NOT NULL,
	component VARCHAR(255) NOT NULL,
	deliveryId VARCHAR(255) NOT NULL,
	campus VARCHAR(255) NOT NULL,
	building VARCHAR(255) NOT NULL,
	floorNm VARCHAR(255) NOT NULL,
	room VARCHAR(255) NOT NULL,
	status CHAR(1) NOT NULL
);

LOAD DATA LOCAL INFILE 
'Delivery_Room_2017-01-08_19.01.24.txt' 
INTO TABLE RoomDelivery_TEMP
(@row)
SET faculty = TRIM(SUBSTR(@row,1,30)),
    department = TRIM(SUBSTR(@row,31,30)),
	course = TRIM(SUBSTR(@row,61,30)),
    sectionNo = TRIM(SUBSTR(@row,91,13)),
	 term = TRIM(SUBSTR(@row,121,13)),
	 componentType = TRIM(SUBSTR(@row,151,13)),
	 component = TRIM(SUBSTR(@row,181,13)),
	 deliveryId = TRIM(SUBSTR(@row,211,13)),
	 campus = TRIM(SUBSTR(@row,241,13)),
	 building = TRIM(SUBSTR(@row,271,13)),
	 floorNm = TRIM(SUBSTR(@row,301,13)),
	 room = TRIM(SUBSTR(@row,331,13)),
	 status = TRIM(SUBSTR(@row,361,13))
;

SET SQL_SAFE_UPDATES = 0;

DROP TABLE IF EXISTS daysLU;
CREATE TABLE daysLU
(
	id INT,
    dayChar CHAR(1)
);

INSERT INTO daysLU VALUES
(1, 'U');
INSERT INTO daysLU VALUES
(2, 'M');
INSERT INTO daysLU VALUES
(3, 'T');
INSERT INTO daysLU VALUES
(4, 'W');
INSERT INTO daysLU VALUES
(5, 'R');
INSERT INTO daysLU VALUES
(6, 'F');
INSERT INTO daysLU VALUES
(7, 'S');

DROP TABLE IF EXISTS nsccSchedule;
CREATE TABLE nsccSchedule AS
  (SELECT cd.*, 
          rd.campus, 
          rd.building, 
          rd.floornm,
          rd.room,
          rd.status
   FROM   CourseDelivery_TEMP as cd 
          INNER JOIN RoomDelivery_TEMP as rd 
		  ON cd.faculty = rd.faculty and
			cd.department = rd.department and
			cd.course = rd.course and
			cd.sectionno = rd.sectionno and
			cd.term = rd.term and
			cd.component = rd.component and
			cd.deliveryId = rd.deliveryId);

-- New add Classroom table
DROP TABLE IF EXISTS Rooms;
CREATE TABLE Rooms (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	campus VARCHAR(25) NOT NULL,
	Building VARCHAR(3) NOT NULL,
	Room VARCHAR(50) NOT NULL,
	RoomType VARCHAR(25) NOT NULL
);

LOAD DATA LOCAL INFILE
'roomList_2017-01-08.csv'
		INTO TABLE Rooms
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(campus, Building, Room, RoomType);
/*
[todo:] Need to do something here to create a
table of all the Classrooms
so we can find classrooms WITHOUT classes
 */

-- NEW: Create Buildings/Campus Lookup
DROP TABLE IF EXISTS BuildingsLU;
CREATE TABLE BuildingsLU AS
	(
		SELECT DISTINCT campus, building
		FROM nsccSchedule
		WHERE building <> 'CUSTOMER'
		AND building <> 'VIRTUAL'
	);


-- NEW: Adds descriptive names of campuses to BuildingsLU
ALTER TABLE BuildingsLU ADD COLUMN campusName VARCHAR(250);
ALTER TABLE BuildingsLU ADD COLUMN buildingName VARCHAR(250);

UPDATE BuildingsLU SET campusName = 'Akerley' WHERE campus = 'AKERL';
UPDATE BuildingsLU SET campusName = 'Annapolis Valley' WHERE campus = 'ANNAP';
UPDATE BuildingsLU SET campusName = 'Burridge' WHERE campus = 'BURRI';
UPDATE BuildingsLU SET campusName = 'Cumberland' WHERE campus = 'CUMBE';
UPDATE BuildingsLU SET campusName = 'Institute of Technology' WHERE campus = 'INSTI';
UPDATE BuildingsLU SET campusName = 'Kingstec' WHERE campus = 'KINGS';
UPDATE BuildingsLU SET campusName = 'Lunenburg' WHERE campus = 'LUNEN';
UPDATE BuildingsLU SET campusName = 'Marconi' WHERE campus = 'MARCO';
UPDATE BuildingsLU SET campusName = 'Pictou' WHERE campus = 'PICTO';
UPDATE BuildingsLU SET campusName = 'Shelburne' WHERE campus = 'SHELB';
UPDATE BuildingsLU SET campusName = 'Strait Area' WHERE campus = 'STRAT';
UPDATE BuildingsLU SET campusName = 'Truro' WHERE campus = 'TRURO';
UPDATE BuildingsLU SET campusName = 'Waterfront' WHERE campus = 'WATER';

UPDATE BuildingsLU SET buildingName = 'Akerley' WHERE building = 'AKE';
UPDATE BuildingsLU SET buildingName = 'Centre for Geographic Sciences' WHERE building = 'COG';
UPDATE BuildingsLU SET buildingName = 'Annapolis Valley' WHERE building = 'MID';
UPDATE BuildingsLU SET buildingName = 'Burridge' WHERE building = 'BUR';
UPDATE BuildingsLU SET buildingName = 'Digby Site' WHERE building = 'DIG';
UPDATE BuildingsLU SET buildingName = 'Amherst Site' WHERE building = 'AMH';
UPDATE BuildingsLU SET buildingName = 'Cumberland' WHERE building = 'CUM';
UPDATE BuildingsLU SET buildingName = 'Institute of Technology' WHERE building = 'ITC';
UPDATE BuildingsLU SET buildingName = 'Kingstec' WHERE building = 'KIN';
UPDATE BuildingsLU SET buildingName = 'Lunenburg' WHERE building = 'LUN';
UPDATE BuildingsLU SET buildingName = 'Marconi' WHERE building = 'MAR';
UPDATE BuildingsLU SET buildingName = 'Pictou' WHERE building = 'PIC';
UPDATE BuildingsLU SET buildingName = 'Shelburne' WHERE building = 'SHE';
UPDATE BuildingsLU SET buildingName = 'Strait Area' WHERE building = 'STR';
UPDATE BuildingsLU SET buildingName = 'Wagmatcook Learning Centre' WHERE building = 'WAG';
UPDATE BuildingsLU SET buildingName = 'Forrester' WHERE building = 'TRF';
UPDATE BuildingsLU SET buildingName = 'Gittens' WHERE building = 'TRG';
UPDATE BuildingsLU SET buildingName = 'McCarthy' WHERE building = 'TRM';
UPDATE BuildingsLU SET buildingName = 'Soloan' WHERE building = 'TRS';
UPDATE BuildingsLU SET buildingName = 'Gym' WHERE building = 'TRU';
UPDATE BuildingsLU SET buildingName = 'Waterfront' WHERE building = 'WAT';
UPDATE BuildingsLU SET buildingName = 'Aviation Institute' WHERE building = 'AVA';
UPDATE BuildingsLU SET buildingName = 'ST CAMPUS' WHERE building = 'ST CAMPUS';



-- ###################################################
-- Functions and Procedures
-- ###################################################

-- Create Function to get Atlantic Time
-- Gets the current time (whether Standard or Daylight Savings for Atlantic. Works for 2017, 2018)
-- This is a hack to deal with the fact that the database is set to EST.
DROP FUNCTION IF EXISTS GetAtlanticNow;
DELIMITER //
CREATE FUNCTION GetAtlanticNow() RETURNS datetime
BEGIN
	DECLARE ASTNow datetime;
    IF NOW() < STR_TO_DATE('2017-03-12 02:00:00', '%Y-%m-%d %H:%i:%s') THEN
		SET ASTNow = (SELECT CONVERT_TZ(NOW(), @@session.time_zone,  '-04:00' ));
	ELSEIF NOW() > STR_TO_DATE('2017-03-12 02:00:00', '%Y-%m-%d %H:%i:%s') AND
		NOW() < STR_TO_DATE('2017-11-05 02:00:00', '%Y-%m-%d %H:%i:%s') THEN -- daylight savings starts
		SET ASTNow = (SELECT CONVERT_TZ(NOW(), @@session.time_zone,  '-03:00' ));
	ELSEIF NOW() > STR_TO_DATE('2017-11-05 02:00:00', '%Y-%m-%d %H:%i:%s') AND
		NOW() < STR_TO_DATE('2018-03-11 02:00:00', '%Y-%m-%d %H:%i:%s') THEN
		SET ASTNow = (SELECT CONVERT_TZ(NOW(), @@session.time_zone,  '-04:00' ));
	ELSE
		SET ASTNow = (SELECT CONVERT_TZ(NOW(), @@session.time_zone,  '-03:00' ));
	END IF;
	RETURN ASTNow;
END //
DELIMITER ;




-- Create FreeRoomsNow as a dynamic view
DROP VIEW IF EXISTS FreeRoomsNowView;
CREATE VIEW FreeRoomsNowView AS
 (
 SELECT DISTINCT room FROM nsccSchedule
      WHERE room NOT IN(
        SELECT DISTINCT room FROM nsccSchedule
        WHERE days LIKE CONCAT('%',(
          SELECT dayChar
          FROM daysLU
          WHERE id = DAYOFWEEK(GetAtlanticNow())
          ), '%')
        AND
          (TIME(NOW()) > startTime
          AND TIME(NOW()) < endTime)
        AND
          (DATE(NOW()) > startDate
          AND DATE(NOW()) < endDate)
      )
);

-- Original Get Free Rooms Procedure
DROP PROCEDURE IF EXISTS GetFreeRoomsNow;
DELIMITER //
CREATE PROCEDURE GetFreeRoomsNow()
  BEGIN
      SELECT DISTINCT room FROM nsccSchedule
      WHERE room NOT IN(
        SELECT DISTINCT room FROM nsccSchedule
        WHERE days LIKE CONCAT('%',(
          SELECT dayChar
          FROM daysLU
          WHERE id = DAYOFWEEK(GetAtlanticNow())
          ), '%')
        AND
          (TIME(NOW()) >= startTime
          AND TIME(NOW()) < endTime)
        AND
          (DATE(NOW()) > startDate
          AND DATE(NOW()) < endDate)
      );
  END //
DELIMITER ;


-- PROCEDURE to get next booking of single given room.
DROP PROCEDURE IF EXISTS RoomAvailableUntil;
DELIMITER //
CREATE PROCEDURE `RoomAvailableUntil`(
	IN roomNum VARCHAR(255), IN timeStr VARCHAR(255))
BEGIN
	IF timeStr IS NULL THEN
		SET timeStr = TIME(NOW());
	END IF;
      SELECT startTime FROM nsccSchedule
		WHERE room = roomNum
		AND	(DATE(NOW()) >= startDate
		AND DATE(NOW()) < endDate)

		AND days LIKE CONCAT('%',(
			SELECT dayChar
			FROM daysLU
			WHERE id = DAYOFWEEK(NOW())
		), '%')

		AND startTime > TIME(STR_TO_DATE(timeStr,'%H%i'))
		ORDER BY startTime ASC
		LIMIT 1;
	END//
DELIMITER ;

-- Get Rooms avail Until in a Procedure as Batch (calls Function)
DROP PROCEDURE IF EXISTS RoomAvailUntilBatch;
DELIMITER //
CREATE PROCEDURE `RoomAvailUntilBatch`(
	IN campus VARCHAR(15), IN building VARCHAR(15),
    IN timeStr VARCHAR(255), IN dayInt INTEGER, IN roomType VARCHAR(255))
BEGIN
	IF roomType IS NULL THEN
		SET roomType = '';
	END IF;
	SELECT r.Room, RoomAvailableUntil(r.Room, timeStr, dayInt) as AvailUntil
	FROM Rooms r
	WHERE r.Campus = campus
    AND r.Building = building
    AND r.RoomType LIKE CONCAT(roomType, '%')
	AND room NOT IN(
        SELECT DISTINCT room FROM nsccSchedule
        WHERE days LIKE CONCAT('%',(
          SELECT dayChar
          FROM daysLU
          WHERE id = dayInt
          ), '%')
        AND
          (TIME(STR_TO_DATE(timeStr,'%H%i')) > startTime
          AND TIME(STR_TO_DATE(timeStr,'%H%i')) < endTime)
        AND
          (DATE(GetAtlanticNow()) >= startDate
          AND DATE(GetAtlanticNow()) < endDate)
      );
END//
DELIMITER ;

-- NEW: Get Rooms avail Until in a Procedure as Batch (calls Function) using a set DATE
DROP PROCEDURE IF EXISTS RoomAvailOnUntilBatch;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `RoomAvailOnUntilBatch`(
	IN campus VARCHAR(15), IN building VARCHAR(15),
    IN timeStr VARCHAR(255), IN onDateStr VARCHAR(9), IN roomType VARCHAR(255))
BEGIN
	DECLARE OnDate DATE;
    SET OnDate = STR_TO_DATE(onDateStr, '%Y%m%d');


    IF roomType IS NULL THEN
		SET roomType = '';
	END IF;
    IF OnDate IS NOT NULL THEN

		SELECT r.Room, RoomAvailableOnUntil(r.Room, timeStr, onDate) as AvailUntil
		FROM Rooms r
		WHERE r.Campus = campus
		AND r.Building = building
		AND r.RoomType LIKE CONCAT(roomType, '%')
		AND room NOT IN(
			SELECT DISTINCT room FROM nsccSchedule
			WHERE days LIKE CONCAT('%',(
			  SELECT dayChar
			  FROM daysLU
			  WHERE id = DAYOFWEEK(onDate)
			  ), '%')
			AND
			  (TIME(STR_TO_DATE(timeStr,'%H%i')) >= startTime
			  AND TIME(STR_TO_DATE(timeStr,'%H%i')) < endTime)
			AND
			  (onDate > startDate
			  AND onDate < endDate)
		  );
	END IF;
END//
DELIMITER;

-- Get Rooms Until As a Function (REVISED, now takes time, day of week)
DROP FUNCTION IF EXISTS RoomAvailableUntil;
DELIMITER //
CREATE FUNCTION `RoomAvailableUntil`(roomNum VARCHAR(255),
		nowTime VARCHAR(255), dayNum INTEGER) RETURNS time
BEGIN
	DECLARE nextTime TIME;

	SELECT MIN(startTime) INTO nextTime
		FROM nsccSchedule
		WHERE room = roomNum

		AND	(DATE(NOW()) > startDate
		AND DATE(NOW()) < endDate)

		AND days LIKE CONCAT('%',
        (
			SELECT dayChar
			FROM daysLU
			WHERE id = dayNum
		), '%')

    -- Input time should be like so: '1815'
		AND startTime > TIME(STR_TO_DATE(nowTime, '%H%i'));

	RETURN nextTime;
END//
DELIMITER ;


-- NEW Get Rooms Until As a Function (REVISED, now takes time, AND SPECIFIC DATE)
DROP FUNCTION IF EXISTS RoomAvailableOnUntil;
DELIMITER //
CREATE DEFINER=`root`@`localhost` FUNCTION `RoomAvailableOnUntil`(roomNum VARCHAR(255),
		nowTime VARCHAR(255), nowDate DATE) RETURNS time
BEGIN
	DECLARE nextTime TIME;

	SELECT MIN(startTime) INTO nextTime
		FROM nsccSchedule
		WHERE room = roomNum

		AND	(DATE(nowDate) > startDate
		AND DATE(nowDate) < endDate)

		AND days LIKE CONCAT('%',
        (
			SELECT dayChar
			FROM daysLU
			WHERE id = DAYOFWEEK(nowDate)
		), '%')

    -- Input time should be like so: '1815'
		AND startTime > TIME(STR_TO_DATE(nowTime, '%H%i'));

	RETURN nextTime;
END//
DELIMITER ;
