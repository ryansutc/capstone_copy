@extends('layouts.app')

@section('content')

    <link rel="stylesheet" href="/css/map.css">
    <link rel="stylesheet" href="/css/bootstrap-timepicker.css" />
    {{--<script src="https://code.jquery.com/jquery-1.10.2.js"></script> --}}

    <script src=" {{ asset('js/bootstrap-timepicker.js') }}"></script>

    <script>

        $(document).ready(function(){
            var $buildingsList = '{!! json_encode($buildingsList)!!}';
            $buildingsObj = JSON.parse($buildingsList); //global variable
            //loadCampuses($buildingsObj);

        });
    </script>

     {{--
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
     <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
     --}}

    <div class="container col-md-6 col-md-offset-3">
        <div class="row">
            {{--<h1>NSCC Room Availability App</h1>--}}
            <h3>Locate Any Room (Test)</h3>
            <form method="post" name="myform" id="myform">
                {{ csrf_field() }}
                <div class="form-group">
                    <label for="campus">Campus</label>
                    <select name="campus" id="campus" class="form-control">
                        <option value="0">&#60;Select Your Campus&#62;</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="building">Building</label>
                    <select name="building" id="building" class="form-control">
                    </select>
                </div>

                <div class="form-group">
                    <label for="roomtype">Room Type</label>
                    <select name="roomtype" id="roomtype" class="form-control">
                    </select>
                </div>
            </form>
        </div>

        <div class="input-group bootstrap-timepicker timepicker">

            <input id="timepicker1" type="text" class="form-control input-small">
            <span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
        </div>

        <script type="text/javascript">
            $('#timepicker1')
                    .bind('keydown', function (event) {  // BEGIN APPLYING NinaNa's S.O. ANSWER
                        if (event.which == 13) {
                            var e = jQuery.Event("keydown");
                            e.which = 9;//tab
                            e.keyCode = 9;
                            $(this).trigger(e);
                            return false;
                        }
                    }).timepicker();
        </script>


        {{--THIS SHOULD BE SEPERATE BLADE COMPONENT --}}
        <div id="mapframe">
            <div id="map" style='width: 100%; height: 500px;'>
                <nav id="mapmenuleft">
                    <a href="#" id="buildingToggle">Step Into Building</a>
                </nav>
                <nav id="mapmenu"></nav>
            </div>

        </div>

        <div id="RoomSelect">
            <p></p>
        </div>

        {{--THIS SHOULD BE SEPERATE BLADE COMPONENT --}}
        <div id="roomstable">
        </div>
        <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.35.1/mapbox-gl.js'></script>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.35.1/mapbox-gl.css' rel='stylesheet' />
        <script src="{{ asset('js/appUI.js') }}"></script>
        <script src="{{ asset('js/mapEngine.js') }}"></script>

@endsection