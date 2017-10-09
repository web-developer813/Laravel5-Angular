<?php

use Illuminate\Database\Seeder;

use App\State;
class stateSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = array(  'ALL','AL','AK','AS','AR','AZ','BIE','CA','CO','CNMI','CT','DE','DoDEA','DC','FL','GA','GU',
            'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
            'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
            'NM','NY','NC','ND','OH','OK','OR','PA','PR','RI','SC',
            'SD','TN','TX','UT','VT','VI','VA','WA','WV','WI','WY');
        foreach($data as $key =>$value){
            State::create([
                'state_name' =>$value,
            ]);
        }
    }
}
