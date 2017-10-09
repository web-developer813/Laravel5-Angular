<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


use App\Daily_entry;

use App\State;
class Daily_state extends Model
{

    protected $fillable = [
        'state_id','entry_id'
    ];

    public function entry(){
        return $this->belongsTo(Daily_entry::class, 'entry_id');
    }

    public function state(){
        return $this->belongsTo(State::class, 'state_id');
    }
}
