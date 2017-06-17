@extends('layouts.app')

@section('content')

    <script>
        $(document).ready(function(){
            var $buildingsList = '{!! json_encode($buildingsList)!!}';
            $scheduleBuildingsObj = JSON.parse($buildingsList); //global variable
        });


    </script>

    <div class="container col-md-6 col-md-offset-3">
        <div class="row">
            {{--<h1>NSCC Room Availability App</h1>--}}
            <h3>Find Any Room's Schedule</h3>
            <form method="post" name="myform" id="myform">
                {{ csrf_field() }}
                <div class="form-group">
                    <label for="scheduleCampus">Campus</label>
                    <select name="scheduleCampus" id="scheduleCampus" class="form-control">
                        <option value="0">&#60;Select Your Campus&#62;</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="scheduleBuilding">Building</label>
                    <select name="scheduleBuilding" id="scheduleBuilding" class="form-control">
                    </select>
                </div>

                <div class="form-group">
                    <label for="room">Room</label>
                    <select name="room" id="room" class="form-control">
                    </select>
                </div>


                <div align="center" class="form-group">
                    <button type="button" name="button" id="button" class="btn btn-primary">View Room Schedule</button>
                </div>


            </form>
        </div>

        <div id="roomstable">

        </div>

    </div>
    <script src="{{ asset('js/appUI.js') }}"></script>
@endsection