
-- Test Script should fire and return 12:00. Tests new RoomAvailableOnUntil function 
SELECT RoomAvailableOnUntil('ITC-B270', '0930', date_sub(NOW(), INTERVAL 3 DAY));

--Test Script should return two records available for 45 mins D212, D315
CALL RoomAvailOnUntilBatch('INSTI', 'ITC', '0945', date_sub(NOW(), INTERVAL 3 DAY),'Computer Lab');
