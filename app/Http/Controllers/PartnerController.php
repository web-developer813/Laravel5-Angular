<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Partner;

class PartnerController extends Controller
{
    public function getIndex(){
        $partners = Partner::whereRaw(true)->orderBy('partner_name','asc')->get();

        return response()->success(compact('partners'));
    }

    public function postPartner(Request $request){
        $partner = Partner::create([
            'partner_name' => $request->input('partner_name'),
        ]);

        return response()->success(compact('partner'));
    }

    public function getPartnerShow($id)
    {
        $partner = Partner::find($id);

        return response()->success($partner);
    }

    public function putPartnerShow(Request $request)
    {
        $partnerForm = $request->input('data');
        $partnerData = [
            'partner_name' => $partnerForm['partner_name'],
        ];

        $affectedRows = Partner::where('id', '=', intval($partnerForm['id']))->update($partnerData);

        return response()->success('success');
    }

    public function deletePartner($id)
    {
        Partner::destroy($id);

        return response()->success('success');
    }
}
