<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Key_field;


class KeyFieldController extends Controller
{
    public function getIndex(){

        $keyFields = Key_field::whereRaw(true)->orderBy('key_field_label','asc')->get();

        return response()->success(compact('keyFields'));
    }



    public function getKeyfieldShow($id)
    {
        $keyField = Key_field::find($id);

        return response()->success($keyField);
    }



    public function putKeyfieldShow(Request $request)
    {
        $keyFieldForm = $request->input('data');
        $keyFieldData = [
            'key_field_label' => $keyFieldForm['key_field_label'],
        ];

        $affectedRows = Key_field::where('id', '=', intval($keyFieldForm['id']))->update($keyFieldData);

        return response()->success('success');
    }

    public function postKeyfield(Request $request){

        $keyField = Key_field::create([

            'key_field_label' => $request->input('key_field_label'),
        ]);

        return response()->success(compact('keyField'));
    }

    public function deleteKeyfield($id)
    {
        Key_field::destroy($id);

        return response()->success('success');
    }


}
