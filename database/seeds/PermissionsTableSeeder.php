<?php

use Illuminate\Database\Seeder;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('permissions')->insert([
            [
                'id' => 1,
                'name' => 'Admin Users',
                'slug' => 'admin.users',
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ],
             [  'id' => 2,
                'name' => 'Manage Users',
                'slug' => 'manage.users',
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ], [
                'id' => 3,
                'name' => 'Manage Roles',
                'slug' => 'manage.roles',
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ], [
                'id' => 4,
                'name' => 'Manage Permissions',
                'slug' => 'manage.permissions',
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ], [
                'id' => 5,
                'name' => 'Manage Datas',
                'slug' => 'manage.datas',
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ], [
                'id' => 6,
                'name' => 'Manage Assessments',
                'slug' => 'manage.assessments',
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ], [
                'id' => 7,
                'name' => 'Manage Summaries',
                'slug' => 'manage.summaries',
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ],
        ]);
    }
}
