<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Assessment;

use App\Key_field;

class Assessment_key extends Model
{
    protected $fillable = [
        'key_field_id','assessment_id'
    ];

    public function keyField(){
        return $this->belongsTo(Key_field::class, 'key_field_id');
    }

    public function assessment(){
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }
}
