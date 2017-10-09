<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Daily_entry;

use App\Daily_key;

use App\Daily_state;

use App\Daily_topic;

use App\Daily_partner;

use Auth;

use Response;

use Carbon\Carbon;

use Session;

use App\Export;

class DailyController extends Controller
{
    public function getIndex()
    {
        $datas = Daily_entry::all();
        $dataDetails = $this->getDataListFunction($datas);
        $this->importData($dataDetails);
        return response()->json(['response' => $dataDetails]);
    }


    function getDataListFunction($datas)
    {
        $dataDetails = array();
        foreach ($datas as $key => $data) {
            $dataDetails[$key]['id'] = $data->id;
            $dataDetails[$key]['topic_id'] = "";
            $dataDetails[$key]['key_field_id'] = "";
            $dataDetails[$key]['state_id'] = "";


            $topics = $data->topics;
            if (count($topics) > 0) {
                $topics_label = "";
                foreach ($topics as $key_topic => $topic) {
                    if ($key_topic == 0) {
                        $topics_label = $topic->topic->topic_label;
                    } else {
                        $topics_label .= ', <br>' . $topic->topic->topic_label;
                    }
                }
                $dataDetails[$key]['topic_id'] = $topics_label;
            }
            $keys = $data->keys;
            if (count($keys) > 0) {
                $keys_label = "";
                foreach ($keys as $key_keyField => $keyField) {
                    if ($key_keyField == 0) {
                        $keys_label = $keyField->keyField->key_field_label;
                    } else {
                        $keys_label .= ', <br>' . $keyField->keyField->key_field_label;
                    }
                }
                $dataDetails[$key]['key_field_id'] = $keys_label;
            }
            $states = $data->states;
            if (count($states) > 0) {
                $states_label = "";
                foreach ($states as $key_state => $state) {
                    if ($key_state == 0) {
                        $states_label = $state->state->state_name;
                    } else {
                        $states_label .= ', <br>' . $state->state->state_name;
                    }
                }
                $dataDetails[$key]['state_id'] = $states_label;
            }
            $dataDetails[$key]['partner_id'] = "";

            $partners = $data->partners;
            if (count($partners) > 0) {
                $partners_label = "";
                foreach ($partners as $key_partner => $partner) {
                    if ($key_partner == 0) {
                        $partners_label = $partner->partner->partner_name;
                    } else {
                        $partners_label .= ', <br>' . $partner->partner->partner_name;
                    }
                }
                $dataDetails[$key]['partner_id'] = $partners_label;
            }
            $dataDetails[$key]['creator'] = $data->creator->first_name." " . $data->creator->last_name;
            $dataDetails[$key]['entry_text'] = $data->entry_text;
//            $dataDetails[$key]['date_of_action'] = $data->date_of_action;
            $dataDetails[$key]['date_of_action'] = date("m/d/Y", strtotime($data->date_of_action));
//            date("d/m/Y", strtotime($str));
            $create_at_time =  substr($data->date_added, 0, 10);
            $dataDetails[$key]['created_at'] =date("m/d/Y", strtotime($create_at_time));
        }
        return $dataDetails;
    }

    public function postDatas(Request $request)
    {
        $topics = $request->input('topic_id');
        $keyFields = $request->input('key_field_id');
        $states = $request->input('state_id');

        $daily_topics = array();
        $daily_keys = array();
        $daily_states = array();
        $daily_entry_ids = array();
        if (count($topics) > 0) {
            $daily_topics = Daily_topic::whereIn('topic_id', $topics)->groupBy('entry_id')->pluck('entry_id')->toArray();

        }else{
            $daily_topics = Daily_topic::all()->pluck('entry_id')->toArray();
        }
        if (count($keyFields) > 0) {

            $daily_keys = Daily_key::whereIn('key_field_id', $keyFields)->groupBy('entry_id')->pluck('entry_id')->toArray();
        }else{
            $daily_keys = Daily_key::all()->pluck('entry_id')->toArray();
        }
        if (count($states) > 0) {
            $daily_states = Daily_state::whereIn('state_id', $states)->groupBy('entry_id')->pluck('entry_id')->toArray();
        }else{
            $daily_states = Daily_state::all()->pluck('entry_id')->toArray();
        }

        $result = array_intersect($daily_topics, $daily_keys, $daily_states);
        $daily_entry_ids = (array_unique($result));
        $dataDetails = "";

        if (count($daily_entry_ids) > 0) {
            $datas = Daily_entry::whereIn('id', $daily_entry_ids)->get();
            if (count($datas)>0) {
                $dataDetails = $this->getDataListFunction($datas);
            }
        }
        return response()->json(['response' => $dataDetails]);

    }
    public function postFilterData(Request $request){
        $topics = $request->input('topic_id');
        $keys = $request->input('key_field_id');
        $states = $request->input('state_id');
        $partners = $request->input("partner_id");
        $from = $request->input('from');
        $to = $request->input('to');
        /*****Topic ****/
        if(count($topics)>1){
            $all = 0;
            foreach($topics  as $key_topic => $topic){
                if($topic == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $daily_topics = Daily_topic::all()->pluck('entry_id')->toArray();
            }else{
                $daily_topics = Daily_topic::whereIn('topic_id', $topics)->pluck('entry_id')->toArray();
            }
        }
        else if (count($topics) == 1) {
            $topic = $topics[0];
            if($topic == "") {
                $daily_topics = Daily_topic::all()->pluck('entry_id')->toArray();
            }else{
                $daily_topics = Daily_topic::where('topic_id', $topic)->groupBy('entry_id')->pluck('entry_id')->toArray();
            }
        }else{
            $daily_topics = Daily_topic::all()->pluck('entry_id')->toArray();
        }
//        print_r($daily_topics);
        /***** key Field ***/
        if(count($keys)>1){
            $all = 0;
            foreach($keys  as $key_keyField => $key){
                if($key == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $daily_keys = Daily_key::all()->pluck('entry_id')->toArray();
            }else{
                $daily_keys = Daily_key::whereIn('key_field_id', $keys)->pluck('entry_id')->toArray();
            }
        }
        else if (count($keys) == 1) {
            $key = $keys[0];
            if($key == "") {
                $daily_keys = Daily_key::all()->pluck('entry_id')->toArray();
            }else{
                $daily_keys = Daily_key::where('key_field_id', $keys)->groupBy('entry_id')->pluck('entry_id')->toArray();
            }
        }else{
            $daily_keys = Daily_key::all()->pluck('entry_id')->toArray();
        }
//        print_r($daily_keys);

        /*******States*****/
        if(count($states)>1){
            $all = 0;
            foreach($states  as $key_state => $state){
                if($state == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $daily_states = Daily_state::all()->pluck('entry_id')->toArray();
            }else{
                $daily_states = Daily_state::whereIn('state_id', $states)->pluck('entry_id')->toArray();
            }
        }
        else if (count($states) == 1) {
            $state = $states[0];
            if($state == "") {
                $daily_states = Daily_state::all()->pluck('entry_id')->toArray();
            }else{
                $daily_states = Daily_state::where('state_id', $state)->groupBy('entry_id')->pluck('entry_id')->toArray();
            }
        }else{
            $daily_states = Daily_state::all()->pluck('entry_id')->toArray();
        }
//        print_r($daily_states);
        /******* Partners ******/
        if(count($partners) > 1){
            $all = 0;
            foreach($partners  as $key_partner => $partner){
                if($partner == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $daily_partners = Daily_entry::all()->pluck('id')->toArray();
            }else{
                $daily_partners = Daily_partner::whereIn('partner_id', $partners)->pluck('entry_id')->toArray();
            }
        }else if (count($partners) == 1) {
            $partner = $partners[0];
            if($partner == "") {
                $daily_partners = Daily_entry::all()->pluck('id')->toArray();
            }else{
                $daily_partners = Daily_partner::where('partner_id', $partner)->groupBy('entry_id')->pluck('entry_id')->toArray();
            }
        }else{
            $daily_partners = Daily_entry::all()->pluck('id')->toArray();
        }


//        print_r($daily_partners);

        /***from - to list *****/
         if( ($from != "" && $to !="") ){
             $daily_dates =Daily_entry::whereBetween('date_of_action', array($from,$to))->pluck('id')->toArray();
         }else if($from != "" && $to == ""){
             $daily_dates =Daily_entry::where('date_of_action', '>=' , $from)->pluck('id')->toArray();
         }else if($to != "" && $from ==""){
             $daily_dates =Daily_entry::where('date_of_action', '<=' , $to)->pluck('id')->toArray();
         }else{
             $daily_dates =Daily_entry::all()->pluck('id')->toArray();
         }

//        print_r($daily_dates);

        /*** result ****/
        $result = array_intersect($daily_topics, $daily_keys, $daily_states,$daily_partners,$daily_dates);
        $daily_entry_ids = (array_unique($result));


        $dataDetails = "";

        if (count($daily_entry_ids) > 0) {
            $datas = Daily_entry::whereIn('id', $daily_entry_ids)->get();
            if (count($datas)>0) {
                $dataDetails = $this->getDataListFunction($datas);
            }
        }
        $this->importData($dataDetails);
        return response()->json(['response' => $dataDetails]);
    }

    function importData($dataDetails){
        $user_id = Auth::user()->id;
        $export = Export::where('user_id' , $user_id)->where('name', 'daily_export_to_excel')->first();
        if(count($export) ==0){
            $export = new Export;
        }

        $export->user_id = $user_id;
        $export->name = "daily_export_to_excel";
        $export->list = json_encode($dataDetails);
        $export->save();
    }
    public function postExport(Request $request){
        $dataDetails = "";
        $user_id = Auth::user()->id;
        $export = Export::where('user_id' , $user_id)->where('name', 'daily_export_to_excel')->first();
        $dataDetails = json_decode($export->list);
        if(count($dataDetails) >0 ){
            $result = "success";
        }else{
            $result = "empty";
        }
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Type: application/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=daily_Export.csv');

        $csv_filename = "daily_Export.csv";

        $file = fopen($csv_filename, "w");

        $exportPush = array();
        $resultArray = array();
        array_push($exportPush, "Capture_ID");
        array_push($exportPush, "Topics");
        array_push($exportPush, "Key Fields");
        array_push($exportPush, "State");
        array_push($exportPush, "Partner");
        array_push($exportPush, "Note");
        array_push($exportPush, "Date of Action");
        array_push($exportPush, "User");
        array_push($resultArray, $exportPush);

        fputcsv($file,$exportPush);
        foreach ($dataDetails as $dataDetail)
        {
            $exportPush = array();
            array_push($exportPush, strip_tags($dataDetail->id));
            array_push($exportPush, strip_tags($dataDetail->topic_id));
            array_push($exportPush, strip_tags($dataDetail->key_field_id));
            array_push($exportPush, strip_tags($dataDetail->state_id));
            array_push($exportPush, strip_tags($dataDetail->partner_id));
            array_push($exportPush, strip_tags($dataDetail->entry_text));
            array_push($exportPush, $dataDetail->date_of_action);
            array_push($exportPush, strip_tags($dataDetail->creator));
            array_push($resultArray, $exportPush);
            fputcsv($file,$exportPush);
        }
        fclose($file);
        return response()->json(['result' =>$result, 'result_array' =>$resultArray]);
    }
    public function postTopicData(Request $request)
    {
        $topics = $request->input('topic_id');
        if (count($topics) > 1) {
            $all = 0;
            foreach ($topics as $key_topic =>$topic){
                if($topic == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $daily_topics = Daily_topic::all()->pluck('entry_id')->toArray();
            }else{
                $daily_topics = Daily_topic::whereIn('topic_id', $topics)->groupBy('entry_id')->pluck('entry_id')->toArray();
            }

            if (count($daily_topics) > 0) {
                $datas = Daily_entry::whereIn('id', $daily_topics)->get();
                $dataDetails = $this->getDataListFunction($datas);
            } else {
                $dataDetails = "";
            }
        } else if (count($topics) == 1) {
            $topic = $topics[0];
            if ($topic == "") {
                $datas = Daily_entry::all();
                $dataDetails = $this->getDataListFunction($datas);
            } else {
                $daily_topics = Daily_topic::where('topic_id', $topic)->groupBy('entry_id')->pluck('entry_id')->toArray();
                if (count($daily_topics) > 0) {
                    $datas = Daily_entry::whereIn('id', $daily_topics)->get();
                    $dataDetails = $this->getDataListFunction($datas);
                } else {
                    $dataDetails = "";
                }
            }
        } else {
            $datas = Daily_entry::all();
            $dataDetails = $this->getDataListFunction($datas);
        }


        return response()->json(['response' => $dataDetails]);
    }

    public function postStateData(Request $request)
    {
        $states = $request->input('state_id');
        if (count($states) > 1) {
            $all = 0;
            foreach ($states as $key_state =>$state){
                if($state == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $daily_states = Daily_state::all()->pluck('entry_id')->toArray();
            }else{
                $daily_states = Daily_state::whereIn('state_id', $states)->groupBy('entry_id')->pluck('entry_id')->toArray();
            }

            if (count($daily_states) > 0) {
                $datas = Daily_entry::whereIn('id', $daily_states)->get();
                $dataDetails = $this->getDataListFunction($datas);
            } else {
                $dataDetails = "";
            }
        } elseif (count($states) == 1) {
            $state = $states[0];
            if ($state == "") {
                $datas = Daily_entry::all();
                $dataDetails = $this->getDataListFunction($datas);
            } else {
                $daily_states = Daily_state::where('state_id', $state)->groupBy('entry_id')->pluck('entry_id')->toArray();
                if (count($daily_states) > 0) {
                    $datas = Daily_entry::whereIn('id', $daily_states)->get();
                    $dataDetails = $this->getDataListFunction($datas);
                } else {
                    $dataDetails = "";
                }
            }

        } else {
            $datas = Daily_entry::all();
            $dataDetails = $this->getDataListFunction($datas);
        }
        return response()->json(['response' => $dataDetails]);
    }

    public function getDataShow($id)
    {
        $Daily_entry = Daily_entry::find($id);
        $topic_array  = array();
        $topics = $Daily_entry->topics;
        if(count($topics) >0){
            foreach ($topics as $key_topic => $value_topic){
                $topic_array[$key_topic] = $value_topic->topic;
            }
        }
        $keys = $Daily_entry->keys;
        $key_array = array();
        if(count($keys)>0){
            foreach ($keys as $key_key => $value_key){
                $key_array[$key_key] = $value_key->keyField;
            }
        }
        $states = $Daily_entry->states;
        $state_array = array();
        if(count($states)>0){
            foreach($states as $key_state =>$value_state){
                $state_array[$key_state] = $value_state->state;
            }
        }
        $partners = $Daily_entry->partners;
        $partner_array = array();
        if(count($partners)>0){
            foreach($partners as $key_partner =>$value_partner){
                $partner_array[$key_partner] = $value_partner->partner;
            }
        }


        $data = array();
        $data = $Daily_entry;
        $data['topics'] = $topics;
        $data['keys'] = $keys;
        $data['states'] = $states;
        $data['partners'] = $partners;
        $data['topics_array'] = $topic_array;
        $data['keys_array'] = $key_array;
        $data['states_array'] = $state_array;
        $data['partners_array'] = $partner_array;

//        return response()->success($Daily_entry,$topic_array);
        return response()->json(['data' =>$data]);
    }


    public function putDataShow(Request $request)
    {
        $user = Auth::user();
        $dataForm = $request->input('data');
        $date = new \DateTime();
        $currentDate = $date->format('m/d/Y');
        $topics = $dataForm['topic_id'];
        $states = $dataForm['state_id'];
        $keyFields = $dataForm['key_field_id'];
        $partners =  $dataForm['partner_id'];
        $data = [
            'entry_text' => $dataForm['entry_text'],
            'editor_id' => Auth::user()->id,
            'date_updated' => $currentDate
        ];

        $affectedRows = Daily_entry::where('id', '=', intval($dataForm['id']))->update($data);

        Daily_topic::where('entry_id', '=', intval($dataForm['id']))->delete();
        Daily_key::where('entry_id', '=', intval($dataForm['id']))->delete();
        Daily_state::where('entry_id', '=', intval($dataForm['id']))->delete();
        Daily_partner::where('entry_id', '=', intval($dataForm['id']))->delete();

        $daily = Daily_entry::where('id', '=', intval($dataForm['id']))->first();

        foreach ($states as $key_state => $state) {
            Daily_state::create([
                'entry_id' => $daily->id,
                'state_id' => $state,
            ]);
        }
        foreach ($keyFields as $key_keyfield => $keyField) {
            Daily_key::create([
                'entry_id' => $daily->id,
                'key_field_id' => $keyField
            ]);
        }
        foreach ($topics as $key_topic => $topic) {
            Daily_topic::create([
                'entry_id' => $daily->id,
                'topic_id' => $topic
            ]);
        }
        foreach($partners as $key_partner => $partner){
            if($partner !=""){
                Daily_partner::create([
                    'entry_id' => $daily->id,
                    'partner_id' => $partner
                ]);
            }

        }
        return response()->success('success');
    }


    public function postData(Request $request)
    {
        $date = new \DateTime();
        $currentDate = $date->format('m/d/Y');
        $topics = $request->input('topic_id');
        $keyFields = $request->input('key_field_id');
        $states = $request->input('state_id');
        $partners = $request->input('partner_id');
        $entry_text = $request->input('entry_text');
        $date_of_action_input = $request->input('date_of_action');
        if ($date_of_action_input != "") {
            $date_of_action = substr($date_of_action_input, 0, 10);
        } else {
            $date_of_action = $currentDate;
        }

        $daily = Daily_entry::create([
            'entry_text' => $entry_text,
            'creator_id' => Auth::user()->id,
            'editor_id' => Auth::user()->id,
            'date_of_action' => $date_of_action,
            'date_added' => $currentDate,
            'date_updated' => $currentDate
        ]);
        foreach ($states as $key_state => $state) {
            Daily_state::create([
                'entry_id' => $daily->id,
                'state_id' => $state,
            ]);
        }
        foreach ($keyFields as $key_keyfield => $keyField) {
            Daily_key::create([
                'entry_id' => $daily->id,
                'key_field_id' => $keyField
            ]);
        }
        foreach ($topics as $key_topic => $topic) {
            Daily_topic::create([
                'entry_id' => $daily->id,
                'topic_id' => $topic
            ]);
        }
        if(count($partners) >0){
            foreach($partners as $key_partner => $partner){
                Daily_partner::create([
                    'entry_id' => $daily->id,
                    'partner_id' => $partner
                ]);
            }
        }


        return response()->success(compact('daily'));
    }


    public function deleteData($id)
    {
        Daily_entry::destroy($id);

        return response()->success('success');
    }

}
