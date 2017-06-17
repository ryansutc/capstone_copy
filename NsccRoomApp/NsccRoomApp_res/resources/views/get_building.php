<?php
use DB;

if(!empty($_POST["campus"])){
    $query = DB::table('nsccSchedule')->select('building')->where('campus', '=', $_POST["campus"])->groupBy('building')->get();

    foreach($query as $q)
    {
        echo $q->building;
    }
}


?>