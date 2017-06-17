@extends('layouts.app')

@section('content')

    <link rel='stylesheet' href='/css/fullcalendar.css' />
    <link rel="stylesheet" href="/css/bootstrap-timepicker.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.min.css" />
    <link rel="stylesheet" href="/css/freerooms.css" />
    {{--<script src='{{asset('/js/jquery.min.js')}}'></script>--}}

    <script src='{{asset('/js/moment.min.js')}}'></script>
    <script src='{{asset('/js/fullcalendar.js')}}'></script>
    <script src=" {{ asset('js/bootstrap-timepicker.js') }}"></script>
    {{--<script src="{{ asset('/js/bootstrap-datepicker.js') }}"></script>--}}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.js"></script>

    <script>
        $(document).ready(function(){
            var $buildingsList = '{!! json_encode($buildingsList)!!}';
            $buildingsObj = JSON.parse($buildingsList); //global variable
        });

    </script>

    <div class="container col-md-8 col-xl-6 col-md-offset-2 col-xl-offset-3">
        <div class="row">
            <h3>Find Rooms Available Now</h3>
            <form method="post" name="myform" id="myform" style="background-color: #b4b472">
                {{ csrf_field() }}
                <div class="row">
                    <div class="form-group">
                        <div class="col-md-6 col-md">
                            <label for="campus">Campus</label>
                            <select name="campus" id="campus" class="form-control">
                                <option value="0">&#60;Select Your Campus&#62;</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="building">Building</label>
                            <select name="building" id="building" class="form-control">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group">
                        <div class="col-md-6">
                            <label for="roomtype">Room Type</label>
                            <select name="roomtype" id="roomtype" class="form-control">
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label>Avail At</label>
                            <div class="input-group bootstrap-timepicker timepicker">
                                <input id="timepicker1" type="text" class="form-control input-small">
                                <span id="timepickerbutton1" class="input-group-addon">
                                    <i class="glyphicon glyphicon-time"></i>
                                </span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label>Avail On</label>
                            <div id="datepicker1" class="input-group date">
                                <input id="datepickerinput" type="text" value="{{date('M d, Y')}}"
                                       class="form-control input-small">
                                <span id="datepickerbutton1" class="input-group-addon">
                                    <i class="glyphicon glyphicon-calendar"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row"><p></p></div>
            </form>

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

                    $('#datepicker1').datepicker({
                        format: 'M dd, yyyy',
                        startDate: '01/01/2017',
                        endDate: '4/30/2017',
                        setDate: new Date()

                    })
                    .on('changeDate', function (ev) {
                        var $startDate = new Date("January 1, 2017 11:13:00");
                        var $endDate = new Date("April 30, 2017 11:13:00");
                        if (ev.date.valueOf() < $startDate.valueOf() ||
                                ev.date.valueOf() > $endDate.valueOf()) {
                            $("#dateWarningModal").modal(); //open the modal warning
                        }
                    });
                </script>
            <!-- Table Results. NEW -->
            <div class="table-responsive">
                <table id="roomstable" class="table table-condensed table-hover table-striped">
                    <thead>
                    <tr>
                        <th>Room Name</th>
                        <th class="avail"></th>
                    </tr>
                    </thead>
                    <tbody id="roomstablebody">
                    </tbody>
                </table>
            </div>
        </div>


    </div>


    <!-- Wrong Date Modal (in case user picks a bad date -->
    <div class="modal fade" id="dateWarningModal" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Bad Date</h3>
                </div>
                <div class="modal-body">
                    <p>We only have historic data from the 2017 winter semester.
                        Pick a date between Jan and April in 2017
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/appUI.js') }}"></script>

@endsection