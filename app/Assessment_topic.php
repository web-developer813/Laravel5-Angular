<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Topic;

use App\Assessment;
class Assessment_topic extends Model
{
    protected $fillable = [
        'topic_id','assessment_id'
    ];

    public function topic(){
        return $this->belongsTo(Topic::class, 'topic_id');
    }
    public function assessment(){
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }
}
