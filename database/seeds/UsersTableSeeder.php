<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'id' => 1,
            'email' => 'admin@gmail.com',
            'first_name' => 'Samuel',
            'last_name' => 'Stine',
            'password' => bcrypt('password'),
            'status' => 1,
            'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
        ]);
    }
}
