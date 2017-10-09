<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Assessment;

use App\Daily_entry;

class Assessment_entry extends Model
{
    protected $fillable = [
        'entry_id','assessment_id'
    ];

    public function dataCapture(){
        return $this->belongsTo(Daily_entry::class, 'entry_id');
    }
    public function assessment(){
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }
}
