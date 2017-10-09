<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Daily_entry;

use App\Assessment_topic;

use App\Assessment_key;

use App\Partner;

use App\Assessment_state;

use App\Assessment_entry;

use App\Quarter;
class Assessment extends Model
{
    protected $fillable = [
       'assessment_text','creator_id', 'editor_id','date_added','date_updated','quarter_id'
    ];
    public function topics(){
        return $this->hasMany(Assessment_topic::class, 'assessment_id');
    }
    public function keys(){
        return $this->hasMany(Assessment_key::class, 'assessment_id');
    }
    public function states(){
        return $this->hasMany(Assessment_state::class, 'assessment_id');
    }

    public function entry(){
        return $this->hasMany(Assessment_entry::class, 'assessment_id');
    }

    public function quarter(){
        return $this->belongsTo(Quarter::class, 'quarter_id');
    }
}
