<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::resource('/','HomeController');

//free rooms available NOW
Route::get('FreeRoom/roomData/{campus}/{building}/{roomType?}/{filter?}',
    function($campus, $building, $roomType = null, $filter = null) {
        $filter = strtoupper($filter); //convert uppercase
        if($roomType && $filter) {
            $matchingRooms = DB::table('Rooms')->select('Rooms.Room')
                ->join('FreeRoomsNowView', 'FreeRoomsNowView.room', '=', 'Rooms.Room')
                ->where('Rooms.campus', '=', $campus)
                ->where('Rooms.Building', '=', $building)
                ->where('Rooms.RoomType', '=', $roomType)
                ->where('Rooms.Room', 'like', "'%'". $filter."%'")
                ->groupBy('Rooms.Room')->get();
        }
        elseif($roomType) {
            $matchingRooms = DB::table('Rooms')->select('Rooms.Room')
                ->join('FreeRoomsNowView', 'FreeRoomsNowView.room', '=', 'Rooms.Room')
                ->where('Rooms.campus', '=', $campus)
                ->where('Rooms.Building', '=', $building)
                ->where('Rooms.RoomType', '=', $roomType)
                ->groupBy('Rooms.Room')->get();
        }
        elseif($filter){
            $matchingRooms = DB::table('Rooms')->select('Rooms.Room')
                ->join('FreeRoomsNowView', 'FreeRoomsNowView.room', '=', 'Rooms.Room')
                ->where('Rooms.campus', '=', $campus)
                ->where('Rooms.Building', '=', $building)
                ->where('Rooms.Room', 'like', "'%'". $filter."%'")
                ->groupBy('Rooms.Room')->get();
        }
        else{
            $matchingRooms = DB::table('Rooms')->select('Rooms.Room')
                ->join('FreeRoomsNowView', 'FreeRoomsNowView.room', '=', 'Rooms.Room')
                ->where('Rooms.campus', '=', $campus)
                ->where('Rooms.Building', '=', $building)
                ->groupBy('Rooms.Room')->get();
        }
        return json_encode($matchingRooms); //$matchingFreeRooms;

}); //handles ajax calls for free rooms

//Room Types for Building
Route::get('FreeRoom/roomTypeData/{building}', function($building) {
    //'FreeRoomController@retrieveRoomTypeData'
    $roomTypes = DB::table('Rooms')
        ->select('RoomType')
        ->where('Building','=', $building)
        ->distinct()->get();

    return json_encode($roomTypes);
}); //handles ajax calls for roomtype data

//Route to get avail until for SINGLE ROOM
Route::get('FreeRoomUntil/{roomNum}/{onDayStr?}/{strTime?}', function($roomNum, $onDayStr = null, $strTime = null){

    if($strTime == null){
        $strTime = Date('%H%i');
    }
    if($onDayStr == 'Today'){
        $onDayNo = date('N') + 1;
    }
    else {
        $onDayNo = date('N', strtotime($onDayStr)) + 1;
    }
    $until = DB::select('SELECT RoomAvailableUntil(?,?,?) as AvailUntil',array($roomNum, $strTime, $onDayNo));
    return json_encode($until);
});

//Variant of RoomAvailUntil via function and with date time variables
Route::get('FreeRoomUntil/roomData/{campus}/{building}/{fromTime}/{onDayStr}/{roomType?}',
    function($campus, $building, $fromTime, $onDayStr, $roomType = null){

        if($onDayStr == 'Today'){
            $onDayNo = date('N') + 1;
        }
        else {
            $onDayNo = date('N', strtotime($onDayStr)) + 1;
        }
        if(!$roomType){
            $roomType = "";
        }

        //No roomType provided
        $matchingRooms = DB::select('CALL RoomAvailUntilBatch(?,?,?,?,?)',
            array($campus, $building, $fromTime,$onDayNo, $roomType));

        return json_encode($matchingRooms);

});

//New: Variant of RoomAvailUntil for a specific date/time
Route::get('FreeRoomOnUntil/roomData/{campus}/{building}/{fromTime}/{onDate}/{roomType?}',
    function($campus, $building, $fromTime, $onDate, $roomType = null){

        $myDateStr = Date('Ymd', strtotime($onDate)); //convert date to string YYYYMMDD


        if(!$roomType){
            $roomType = "";
        }
        //No roomType provided
        $matchingRooms = DB::select('CALL RoomAvailOnUntilBatch(?,?,?,?,?)',
            array($campus, $building, $fromTime,$myDateStr, $roomType));

        return json_encode($matchingRooms);
    }
);

Route::resource('/FreeRoom','FreeRoomController'
    ,  ['only' => ['index', 'show', 'store']]
);

//Route::post('FreeRoom/buildingList', 'FreeRoomController@retrieveBuildingList');

Route::resource('/RoomSchedule','RoomController');


Route::get('RoomSchedule/{campus}/{building}', function($campus, $building){
   $result = DB::table('Rooms')->select('Rooms.Room')
       ->where('Rooms.campus', '=', $campus)
       ->where('Rooms.Building', '=', $building)
       ->groupBy('Rooms.Room')->get();

    return json_encode($result);
});

//new: route to pass json data (for map). TEMP
Route::get('/Locate/CampusJSON', function () {
    return redirect('media/campuses.txt');
});

Route::get('CampusJSON', function () {
    return redirect('/Locate/CampusJSON');
});

Route::resource('/Locate','LocateController');


//NEW: Call to directly get list of buildings as JSON (for map and API calls)
Route::get('RoomsList/getJSON', function () {
    $result = DB::table('BuildingsLU')->orderBy('campus')->orderBy('building')->get();
    return json_encode($result);
});