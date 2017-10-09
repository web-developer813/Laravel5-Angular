<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Topic;

use App\Daily_entry;

class Daily_topic extends Model
{

    protected $fillable = [
        'topic_id','entry_id'
    ];
    public function topic(){
        return $this->belongsTo(Topic::class, 'topic_id');
    }

    public function entry(){
        return $this->belongsTo(Daily_entry::class, 'entry_id');
    }
}
