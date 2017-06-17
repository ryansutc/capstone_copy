<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    function __construct($title, $start, $end, $desc)
    {
        $this->title = $title;
        $this->start = $start;
        $this->end = $end;
        $this->description = $desc;
    }
    
    
    public $title;
    public $start;
    public $end;
    public $description;
}
