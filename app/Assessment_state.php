<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Assessment;

use App\State;
class Assessment_state extends Model
{
    protected $fillable = [
        'state_id','assessment_id'
    ];
    public function state(){
        return $this->belongsTo(State::class, 'state_id');
    }
    public function assessment(){
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }
}
