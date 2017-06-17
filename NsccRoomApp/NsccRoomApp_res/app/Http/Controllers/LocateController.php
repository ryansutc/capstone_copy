<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use DB;

class locateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // THIS IS EXACT COPY OF FREE ROOM CONTROLLER AT PRESENT
        $selectedCampus = null;
        $selectedBuilding = null;
        $building = null;
        $roomtype = null;
        $matchingRooms = null;
        $selectedRoomType = null;
        $matchingFreeRooms = null;
        $buildingsList = DB::table('BuildingsLU')->orderBy('campus')->orderBy('building')->get();

        return view('Locate', compact('selectedCampus', 'selectedBuilding',
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    

}
