<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use DB;

class FreeRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $selectedCampus = null;
        $selectedBuilding = null;
        $building = null;
        $roomtype = null;
        $matchingRooms = null;
        $selectedRoomType = null;
        $matchingFreeRooms = null;
        $buildingsList = DB::table('BuildingsLU')->orderBy('campus')->orderBy('building')->get();
        
        return view('FreeRoom', compact('selectedCampus', 'selectedBuilding',
            'roomtype', 'matchingRooms', 'selectedRoomType', 'matchingFreeRooms', 'buildingsList'));
    }

    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
//
//
//        if($request->campus != null)
//        {
//            $campus = DB::table('nsccSchedule')->select('campus')->groupBy('campus')->get();
//            $roomtype = null;
//            $matchingRooms = null;
//            $selectedRoomType = null;
//            $matchingFreeRooms = null;
//            $selectedCampus = $request->campus;
//            $building = DB::table('nsccSchedule')->select('building')->where('campus', '=', $request->campus)->groupBy('building')->get();
//
//            if($request->building != null)
//            {
//                $selectedBuilding = $request->building;
//                $roomtype = DB::table('Rooms')->select('RoomType')->where('campus', '=', $selectedCampus)->where('Building', '=', $selectedBuilding)->groupBy('RoomType')->get();
//
//                if($request->roomtype != null)
//                {
//                    $selectedRoomType = $request->roomtype;
//                    $matchingRooms = DB::table('Rooms')->select('Room')
//                        ->where('campus', '=', $selectedCampus)
//                        ->where('Building', '=', $selectedBuilding)
//                        ->where('RoomType', '=', $selectedRoomType)
//                        ->groupBy('Room')->get();
//                    $freeRooms = DB::select('CALL `nsccschedule`.`GetFreeRoomsNow`();');
//
//                    $y = array();
//                    $z = array();
//
//                    foreach($matchingRooms as $m)
//                    {
//                        $y[] = $m->Room;
//                    }
//
//                    foreach($freeRooms as $f)
//                    {
//                        $z[] = $f->room;
//                    }
//
//
//                    $matchingFreeRooms = array_intersect($y, $z);
//
//                }
//
//            }
//
//            return view('FreeRoom', compact('building', 'campus', 'roomtype', 'selectedCampus', 'selectedBuilding', 'selectedRoomType', 'matchingFreeRooms'));
//        }
        //in the view, hide the select boxes instead of only creating them when needed...
        //send thru data from all boxes each time.
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
    
}
