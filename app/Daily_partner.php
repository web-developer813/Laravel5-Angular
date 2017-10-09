<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Partner;

use App\Daily_entry;

class Daily_partner extends Model
{
    protected $fillable = [
        'partner_id','entry_id'
    ];
    public function partner(){
        return $this->belongsTo(Partner::class, 'partner_id');
    }

    public function entry(){
        return $this->belongsTo(Daily_entry::class, 'entry_id');
    }
}
