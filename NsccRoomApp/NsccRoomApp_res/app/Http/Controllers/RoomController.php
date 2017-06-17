<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use DB;

use App\Event;



class RoomController extends Controller
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

        return view('RoomSchedule', compact('selectedCampus', 'selectedBuilding',
            'roomtype', 'matchingRooms', 'selectedRoomType', 'matchingFreeRooms', 'buildingsList'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
//        if($request->campus != null)
//        {
//            $campus = DB::table('nsccSchedule')->select('campus')->groupBy('campus')->get();
//            $rooms = null;
//            $matchingRooms = null;
//            $selectedRoom = null;
//            $matchingFreeRooms = null;
//            $selectedCampus = $request->campus;
//            $building = DB::table('nsccSchedule')->select('building')->where('campus', '=', $request->campus)->groupBy('building')->get();
//
//            if($request->building != null)
//            {
//                $selectedBuilding = $request->building;
//                $rooms = DB::table('nsccSchedule')->select('room')->where('campus', '=', $selectedCampus)->where('building', '=', $selectedBuilding)->groupBy('room')->get();
//
//            }
//
//            return view('RoomSchedule', compact('building', 'campus', 'rooms', 'selectedCampus', 'selectedBuilding', 'selectedRoom', 'matchingFreeRooms'));
//        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($roomNum)
    {
        $bookings = DB::table('nsccSchedule')->distinct()->select('course', 'startDate',
            'endDate', 'days', 'startTime', 'endTime', 'deliveryDesc')->where('room', '=', $roomNum)->get();

        $eventArray = array();

        foreach($bookings as $b)
        {


            if(str_contains($b->days, 'M'))
            {
                $endDate = strtotime($b->endDate);
                for($i = strtotime('Monday', strtotime($b->startDate)); $i <= $endDate; $i = strtotime('+1 week', $i))
                {
                    $event = new Event($b->course, date('Y-m-d',$i).'T'.$b->startTime, date('Y-m-d',$i).'T'.$b->endTime, $b->deliveryDesc);
                    $eventArray[] = $event;
                }

            }

            if(str_contains($b->days, 'T'))
            {
                $endDate = strtotime($b->endDate);
                for($i = strtotime('Tuesday', strtotime($b->startDate)); $i <= $endDate; $i = strtotime('+1 week', $i))
                {
                    $event = new Event($b->course, date('Y-m-d',$i).'T'.$b->startTime, date('Y-m-d',$i).'T'.$b->endTime, $b->deliveryDesc);
                    $eventArray[] = $event;
                }

            }

            if(str_contains($b->days, 'W'))
            {
                $endDate = strtotime($b->endDate);
                for($i = strtotime('Wednesday', strtotime($b->startDate)); $i <= $endDate; $i = strtotime('+1 week', $i))
                {
                    $event = new Event($b->course, date('Y-m-d',$i).'T'.$b->startTime, date('Y-m-d',$i).'T'.$b->endTime, $b->deliveryDesc);
                    $eventArray[] = $event;
                }

            }

            if(str_contains($b->days, 'R'))
            {
                $endDate = strtotime($b->endDate);
                for($i = strtotime('Thursday', strtotime($b->startDate)); $i <= $endDate; $i = strtotime('+1 week', $i))
                {
                    $event = new Event($b->course, date('Y-m-d',$i).'T'.$b->startTime, date('Y-m-d',$i).'T'.$b->endTime, $b->deliveryDesc);
                    $eventArray[] = $event;
                }

            }

            if(str_contains($b->days, 'F'))
            {
                $endDate = strtotime($b->endDate);
                for($i = strtotime('Friday', strtotime($b->startDate)); $i <= $endDate; $i = strtotime('+1 week', $i))
                {
                    $event = new Event($b->course, date('Y-m-d',$i).'T'.$b->startTime, date('Y-m-d',$i).'T'.$b->endTime, $b->deliveryDesc);
                    $eventArray[] = $event;
                }

            }


        }
        return view('Calendar', compact('eventArray', 'roomNum'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
