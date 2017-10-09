<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\State;

class StateController extends Controller
{
    public function getIndex(){

        $states = State::all();

        return response()->success(compact('states'));
    }
}
