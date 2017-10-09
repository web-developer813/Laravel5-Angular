<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Daily_topic;

use App\Daily_key;

use App\Daily_partner;

use App\Daily_state;

use App\User;

class Daily_entry extends Model
{
    protected $fillable = [
        'entry_text','creator_id','editor_id','date_of_action','date_added','date_updated'
    ];

    public function topics(){
        return $this->hasMany(Daily_topic::class, 'entry_id');
    }
    public function keys(){
        return $this->hasMany(Daily_key::class, 'entry_id');
    }
    public function states(){
        return $this->hasMany(Daily_state::class, 'entry_id');
    }
    public function partners(){
        return $this->hasMany(Daily_partner::class, 'entry_id');
    }

    public function creator(){
        return $this->belongsTo(User::class, 'creator_id');
    }
}
