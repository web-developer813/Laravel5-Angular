<?php

use Illuminate\Database\Seeder;

use App\Quarter;
class quarterSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = array(  'Q1 2017','Q2 2017','Q3 2017','Q4 2017','Q1 2018','Q2 2018','Q3 2018','Q4 2018');

        foreach($data as $key =>$value){
            Quarter::create([
                'quarter_name' =>$value,
            ]);
        }
    }
}
