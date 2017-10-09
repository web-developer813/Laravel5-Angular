<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Daily_entry;

use App\Key_field;


class Daily_key extends Model
{

    protected $fillable = [
        'key_field_id','entry_id'
    ];

    public function entry(){
        return $this->belongsTo(Daily_entry::class, 'entry_id');
    }


    public function keyField(){
        return $this->belongsTo(Key_field::class, 'key_field_id');
    }
}
