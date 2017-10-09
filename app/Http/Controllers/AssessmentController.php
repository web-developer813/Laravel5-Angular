<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Auth;

use App\Assessment;

use App\Daily_entry;

use App\Assessment_topic;

use App\Assessment_key;

use App\Partner;

use App\Assessment_state;

use App\Assessment_entry;

use App\Quarter;

use App\Export;

class AssessmentController extends Controller
{
    public function postAssessment(Request $request)
    {
        $topics = $request->input('topic_id');
        $keyFields = $request->input('key_field_id');
        $states = $request->input('state_id');
        $dailyIds = $request->input('data_capture_id');
        $date = new \DateTime();
        $currentDate = $date->format('Y-m-d');

        $assessment = Assessment::create([
            'assessment_text' => $request->input('assessment_text'),
            'quarter_id' => $request->input('quarter_id'),
            'date_added' => $currentDate,
            'date_updated' => $currentDate,
            'creator_id' => Auth::user()->id,
            'editor_id' => Auth::user()->id
        ]);
        foreach ($topics as $key_topic => $topic) {
            Assessment_topic::create([
                'assessment_id' => $assessment->id,
                'topic_id' => $topic,
            ]);
        }
        foreach ($keyFields as $key_keyfield => $keyField) {
            Assessment_key::create([
                'assessment_id' => $assessment->id,
                'key_field_id' => $keyField,
            ]);
        }
        foreach ($states as $key_state => $state) {
            Assessment_state::create([
                'assessment_id' => $assessment->id,
                'state_id' => $state,
            ]);
        }
        if (count($dailyIds) > 0) {
            foreach ($dailyIds as $key_daily => $dailyId) {
                if($dailyId !=""){
                    Assessment_entry::create([
                        'assessment_id' => $assessment->id,
                        'entry_id' => $dailyId,
                    ]);
                }
            }
        }
        return response()->success(compact('assessment'));
    }


    public function getIndex()
    {
        $assessments = Assessment::all();
        $assessmentData = $this->getAssessmentListFunction($assessments);
        $this->importData($assessmentData);
        return response()->json(['response' => $assessmentData]);
    }

    function getAssessmentListFunction($assessments)
    {
        $assessmentData = array();
        foreach ($assessments as $key => $assessment) {
            $assessmentData[$key]['id'] = $assessment->id;
            $assessmentData[$key]['topic_id'] = "";
            $assessmentData[$key]['key_field_id'] = "";
            $assessmentData[$key]['state_id'] = "";
            $topics = $assessment->topics;
            if (count($topics) > 0) {
                $topics_label = "";
                foreach ($topics as $key_topic => $topic) {
                    if ($key_topic == 0) {
                        $topics_label = $topic->topic->topic_label;
                    } else {
                        $topics_label .= ', <br>' . $topic->topic->topic_label;
                    }
                }
                $assessmentData[$key]['topic_id'] = $topics_label;
            }

            $keys = $assessment->keys;
            if (count($keys) > 0) {
                $keys_label = "";
                foreach ($keys as $key_keyField => $keyField) {
                    if ($key_keyField == 0) {
                        $keys_label = $keyField->keyField->key_field_label;
                    } else {
                        $keys_label .= ', <br>' . $keyField->keyField->key_field_label;
                    }
                }
                $assessmentData[$key]['key_field_id'] = $keys_label;
            }
            $states = $assessment->states;
            if (count($states) > 0) {
                $states_label = "";
                foreach ($states as $key_state => $state) {
                    if ($key_state == 0) {
                        $states_label = $state->state->state_name;
                    } else {
                        $states_label .= ', <br>' . $state->state->state_name;
                    }
                }
                $assessmentData[$key]['state_id'] = $states_label;
            }
            $assessmentData[$key]['note'] = "";
            $entries = $assessment->entry;
            if (count($entries) > 0) {
                $note_label = "";
                foreach ($entries as $key_entry => $entry) {
                    if ($key_entry == 0) {
                        $note_label = $entry->dataCapture->entry_text;
                    } else {
                        $note_label .= ', <br>' . $entry->dataCapture->entry_text;
                    }
                }
                $assessmentData[$key]['note'] = $note_label;
            }


            $assessmentData[$key]['quarter_id'] = $assessment->quarter->quarter_name;
            $assessmentData[$key]['assessment_text'] = $assessment->assessment_text;
        }
        return $assessmentData;
    }

    public function getAssessmentShow($id)
    {
        $assessment = Assessment::find($id);
        $topics = $assessment->topics;
        $topic_array = array();
        if(count($topics) >0){
            foreach ($topics as $key_topic =>$value_topic){
                $topic_array[$key_topic] = $value_topic->topic;
            }
        }
        $keys = $assessment->keys;
        $key_array = array();
        if(count($keys) >0){
            foreach ($keys as $key_key =>$value_key){
                $key_array[$key_key] = $value_key->keyField;
            }
        }
        $states = $assessment->states;
        $state_array = array();
        if(count($states)>0){
            foreach ($states as $key_state => $value_state){
                $state_array[$key_state] = $value_state->state;
            }
        }
        $entries = $assessment->entry;

        $data = array();
        $data = $assessment;
        $data['topics'] = $topics;
        $data['keys'] = $keys;
        $data['states'] = $states;
        $data['entries'] = $entries;
        $data['topics_array'] = $topic_array;
        $data['keys_array'] = $key_array;
        $data['states_array'] = $state_array;
//        return response()->success($assessment);
        return response()->json(['data' =>$data]);
    }


    public function putAssessmentShow(Request $request)
    {

        $assessmentForm = $request->input('data');
        $date = new \DateTime();
        $currentDate = $date->format('Y-m-d');
        $topics = $assessmentForm['topic_id'];
        $keyFields = $assessmentForm['key_field_id'];
        $states = $assessmentForm['state_id'];
        $dailyIds = $assessmentForm['entry_id'];

        $data = [
            'assessment_text' => $assessmentForm['assessment_text'],
            'quarter_id' => $assessmentForm['quarter_id'],
            'editor_id' => Auth::user()->id,
            'date_updated' => $currentDate

        ];

        $affectedRows = Assessment::where('id', '=', intval($assessmentForm['id']))->update($data);

        Assessment_topic::where('assessment_id', '=', intval($assessmentForm['id']))->delete();
        Assessment_state::where('assessment_id', '=', intval($assessmentForm['id']))->delete();
        Assessment_key::where('assessment_id', '=', intval($assessmentForm['id']))->delete();
        Assessment_entry::where('assessment_id', '=', intval($assessmentForm['id']))->delete();

        $assessment = Assessment::where('id', '=', intval($assessmentForm['id']))->first();


        foreach ($topics as $key_topic => $topic) {
            Assessment_topic::create([
                'assessment_id' => $assessment->id,
                'topic_id' => $topic,
            ]);
        }
        foreach ($keyFields as $key_keyfield => $keyField) {
            Assessment_key::create([
                'assessment_id' => $assessment->id,
                'key_field_id' => $keyField,
            ]);
        }
        foreach ($states as $key_state => $state) {
            Assessment_state::create([
                'assessment_id' => $assessment->id,
                'state_id' => $state,
            ]);
        }
        if (count($dailyIds) > 0) {
            foreach ($dailyIds as $key_daily => $dailyId) {
                if($dailyId != ""){
                    Assessment_entry::create([
                        'assessment_id' => $assessment->id,
                        'entry_id' => $dailyId,
                    ]);
                }
            }
        }
        return response()->success('success');
    }


    public function deleteAssessment($id)
    {
        Assessment::destroy($id);

        return response()->success('success');
    }


    public function postFilterData(Request $request){
        $topics = $request->input('topic_id');
        $keys = $request->input('key_field_id');
        $states = $request->input('state_id');
        $from = $request->input('from');
        $to = $request->input('to');

        $assessment_topics = array();
        $assessment_keys = array();
        $assessment_states = array();
        $assessment_dates = array();
        $assessment_lists = array();
        /*** Topic list ****/
        if(count($topics)>1){
            $all =0;
            foreach($topics as $key_topic =>$topic){
                if($topic == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $assessment_topics = Assessment_topic::all()->pluck('assessment_id')->toArray();
            }else{
                $assessment_topics = Assessment_topic::whereIn('topic_id', $topics)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            }
        }elseif(count($topics) == 1){
            $topic = $topics[0];
            if($topic == "") {
                $assessment_topics = Assessment_topic::all()->pluck('assessment_id')->toArray();
            }else{
                $assessment_topics = Assessment_topic::where('topic_id', $topic)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            }
        }else{
            $assessment_topics = Assessment_topic::all()->pluck('assessment_id')->toArray();
        }


        /*** Key list ****/
        if(count($keys)>1){
            $all =0;
            foreach($keys as $key_keyField =>$key){
                if($key == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $assessment_keys = Assessment_key::all()->pluck('assessment_id')->toArray();
            }else{
                $assessment_keys = Assessment_key::whereIn('key_field_id', $keys)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            }
        }elseif(count($keys) == 1){
            $key = $keys[0];
            if($key == "") {
                $assessment_keys = Assessment_key::all()->pluck('assessment_id')->toArray();
            }else{
                $assessment_keys = Assessment_key::where('key_field_id', $key)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            }
        }else{
            $assessment_keys = Assessment_key::all()->pluck('assessment_id')->toArray();
        }

        /******State List ****/
        if(count($states)>1){
            $all =0;
            foreach($states as $key_state =>$state){
                if($state == ""){
                    $all = 1;
                }
            }
            if($all == 1){
                $assessment_states = Assessment_state::all()->pluck('assessment_id')->toArray();
            }else{
                $assessment_states = Assessment_state::whereIn('state_id', $states)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            }
        }elseif(count($states) == 1){
            $state = $states[0];
            if($state == "") {
                $assessment_states = Assessment_state::all()->pluck('assessment_id')->toArray();
            }else{
                $assessment_states = Assessment_state::where('state_id', $state)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            }
        }else{
            $assessment_states = Assessment_state::all()->pluck('assessment_id')->toArray();
        }


        /****Date Added ***/
        if( ($from != "" && $to !="") ){
            $assessment_dates =Assessment::whereBetween('date_added', array($from,$to))->pluck('id')->toArray();
        }else if($from != "" && $to == ""){
            $assessment_dates =Assessment::where('date_added', '>=' , $from)->pluck('id')->toArray();
        }else if($to != "" && $from ==""){
            $assessment_dates =Assessment::where('date_added', '<=' , $to)->pluck('id')->toArray();
        }else{
            $assessment_dates =Assessment::all()->pluck('id')->toArray();
        }

        $result = array_intersect($assessment_topics, $assessment_keys, $assessment_states,$assessment_dates);
        $assessment_ids = (array_unique($result));
        $assessmentDatas = "";
        if(count($assessment_ids)>0){
            $assessments = Assessment::whereIn('id', $assessment_ids)->get();
            if (count($assessments)>0) {
                $assessmentDatas = $this->getAssessmentListFunction($assessments);
            }

        }
        $this->importData($assessmentDatas);
        return response()->json(['response' => $assessmentDatas]);

    }
    function importData($dataDetails){
        $user_id = Auth::user()->id;
        $export = Export::where('user_id' , $user_id)->where('name', 'assessment_export_to_excel')->first();
        if(count($export) ==0){
            $export = new Export;
        }

        $export->user_id = $user_id;
        $export->name = "assessment_export_to_excel";
        $export->list = json_encode($dataDetails);
        $export->save();
    }

    public function postExport(){
        $dataDetails = "";
        $user_id = Auth::user()->id;
        $export = Export::where('user_id' , $user_id)->where('name', 'assessment_export_to_excel')->first();
        $dataDetails = json_decode($export->list);
        if(count($dataDetails) >0 ){
            $result = "success";
        }else{
            $result = "empty";
        }
        $csv_filename = "assessment_export.csv";
        $file = fopen($csv_filename, "w");

        $exportPush = array();
        $resultArray = array();
        array_push($exportPush, "Assessment_ID");
        array_push($exportPush, "Topic Label");
        array_push($exportPush, "Key Field Label");
        array_push($exportPush, "State Name");
        array_push($exportPush, "Assessment");
        array_push($resultArray, $exportPush);

        fputcsv($file,$exportPush);
        foreach ($dataDetails as $dataDetail)
        {
            $exportPush = array();
            array_push($exportPush, strip_tags($dataDetail->id));
            array_push($exportPush, strip_tags($dataDetail->topic_id));
            array_push($exportPush, strip_tags($dataDetail->key_field_id));
            array_push($exportPush, strip_tags($dataDetail->state_id));
            array_push($exportPush, strip_tags($dataDetail->assessment_text));

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
            $assessment_topics = Assessment_topic::whereIn('topic_id', $topics)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            if (count($assessment_topics) > 0) {
                $assessments = Assessment::whereIn('id', $assessment_topics)->get();
                $assessmentDatas = $this->getAssessmentListFunction($assessments);
            } else {
                $assessmentDatas = "";
            }

        } else if (count($topics) == 1) {
            $topic = $topics[0];
            if ($topic == "") {
                $assessments = Assessment::all();
                $assessmentDatas = $this->getAssessmentListFunction($assessments);
            } else {
                $assessment_topics = Assessment_topic::where('topic_id', $topic)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
                if (count($assessment_topics) > 0) {
                    $assessments = Assessment::whereIn('id', $assessment_topics)->get();
                    $assessmentDatas = $this->getAssessmentListFunction($assessments);
                } else {
                    $assessmentDatas = "";
                }
            }
        } else {
            $assessments = Assessment::all();
            $assessmentDatas = $this->getAssessmentListFunction($assessments);
        }
        return response()->json(['response' => $assessmentDatas]);

    }

    public function postStateData(Request $request)
    {
        $states = $request->input('state_id');
        $assessmentDatas = "";
        if (count($states) > 1) {
            $assessment_states = Assessment_state::whereIn('state_id', $states)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
            if (count($assessment_states) > 0) {
                $assessments = Assessment::whereIn('id', $assessment_states)->get();
                $assessmentDatas = $this->getAssessmentListFunction($assessments);
            } else {
                $assessmentDatas = "";
            }

        } elseif (count($states) == 1) {
            $state = $states[0];
            if ($state == "") {
                $assessments = Assessment::all();
                $assessmentDatas = $this->getAssessmentListFunction($assessments);
            } else {
                $assessment_states = Assessment_state::where('state_id', $state)->groupBy('assessment_id')->pluck('assessment_id')->toArray();
                if (count($assessment_states) > 0) {
                    $assessments = Assessment::whereIn('id', $assessment_states)->get();
                    $assessmentDatas = $this->getAssessmentListFunction($assessments);
                } else {
                    $assessmentDatas = "";
                }
            }
        } else {
            $assessments = Assessment::all();
            $assessmentDatas = $this->getAssessmentListFunction($assessments);
        }
        return response()->json(['response' => $assessmentDatas]);

    }
}
