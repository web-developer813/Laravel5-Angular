<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;


use App\Quarter;
class QuarterController extends Controller
{
    public function getIndex(){

        $quarters = Quarter::all();

        return response()->success(compact('quarters'));
    }
}
