/**
 * Created by inet2005 on 4/16/17.
 */

//Code to configure the date picker (should be concatenated with other files
//------------------------------------------------------------------
//New: configure Date Picker

$('#datepicker').datepicker()
    .on('changeDate', function(ev){
        var $startDate = Date(2017, 01, 01, 12,12,12);
        var $endDate = Date(2017, 04,25,12,12,12);
        if (ev.date.valueOf() < $startDate.valueOf() &&
            ev.date.valueOf() < $endDate.valueOf() ){

            $("#dateWarningModal").modal()
        }
    });
