@extends('layouts.app')

@section('calendar')
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Calendar Prototype</title>

    <link rel='stylesheet' href='/css/fullcalendar.css' />
    <script src='{{asset('/js/jquery.min.js')}}'></script>
    <script src='{{asset('/js/moment.min.js')}}'></script>
    <script src='{{asset('/js/fullcalendar.js')}}'></script>



    <script>$(document).ready(function() {

            // page is now ready, initialize the calendar...

            $('#calendar').fullCalendar({
                // put your options and callbacks here
                header: {
                    left: 'today prev,next',
                    center: 'title',
                    right: 'agendaWeek,agendaDay'
                },

                titleFormat: '[<?php echo $roomNum ?>]'+' | '+'MMMM D, YYYY',

                defaultView: 'agendaDay',

                allDaySlot: false,

                minTime: "07:00:00",

                maxTime: "23:00:00",

                contentHeight: "auto",

                events: [

                        <?php
                        foreach($eventArray as $e){ ?>
                        {
                            title: '<?php echo $e->title.'\n'.preg_replace('/[,]/', ', ',(preg_replace('/[\']/', '`',$e->description))); ?>',
                            start: '<?php echo $e->start; ?>',
                            end: '<?php echo $e->end; ?>',
                            description: ''
                        },
                            <?php } ?>


//                        title: 'Nick\'s Event',
//                        start: '2017-02-08T12:00:00',
//                        end: '2017-02-08T13:00:00',
//                        description: 'This is a cool event'

                    // more events here
                ],
//                renderEvents: function(events, element) { //currently no qtip functionality installed
//                    element.qtip({
//                        content: events.description
//                    });
//                },

//                eventClick: function(calEvent, jsEvent, view) {
//
//                    alert('Event Description: ' + calEvent.description);
//                    alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
//                    alert('View: ' + view.name);
//
//                    // change the border color just for fun
//                    $(this).css('border-color', 'red');
//
//                }



            })

        });</script>

@endsection

@section('content')
<div id='calendar'></div>
@endsection
