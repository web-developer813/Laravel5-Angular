<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Topic;

use App\State;

class TopicController extends Controller
{
    public function getIndex(){
        $topics = Topic::whereRaw(true)->orderBy('topic_label','asc')->get();

        return response()->success(compact('topics'));
    }

    public function getTopicShow($id)
    {
        $topic = Topic::find($id);

        return response()->success($topic);
    }


    public function putTopicShow(Request $request)
    {
        $topicForm = $request->input('data');
        $topicData = [
            'topic_label' => $topicForm['topic_label'],
        ];

        $affectedRows = Topic::where('id', '=', intval($topicForm['id']))->update($topicData);

        return response()->success('success');
    }


    public function postTopics(Request $request)
    {

        $topic = Topic::create([
            'topic_label' => $request->input('topic_label'),
        ]);

        return response()->success(compact('topic'));
    }


    public function deleteTopic($id)
    {
        Topic::destroy($id);

        return response()->success('success');
    }

}
