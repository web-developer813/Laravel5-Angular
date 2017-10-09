<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use Bican\Roles\Models\Permission;
use Bican\Roles\Models\Role;
use Hash;
use Illuminate\Http\Request;
use Input;
use Validator;

class UserController extends Controller
{
    /**
     * Get user current context.
     *
     * @return JSON
     */
    public function getMe()
    {
        $user = Auth::user();

        return response()->success($user);
    }

    /**
     * Update user current context.
     *
     * @return JSON success message
     */
    public function putMe(Request $request)
    {
        $user = Auth::user();

        $this->validate($request, [
            'data.email' => 'required|email|unique:users,email,'.$user->id,
            'data.first_name' => 'required|min:3',
            'data.last_name' => 'required|min:3',
        ]);

        $userForm = app('request')
                    ->only(
                        'data.current_password',
                        'data.new_password',
                        'data.new_password_confirmation',
                        'data.email',
                        'data.first_name',
                        'data.last_name'
                    );

        $userForm = $userForm['data'];
        $user->email = $userForm['email'];
        $user->first_name = $userForm['first_name'];
        $user->last_name = $userForm['last_name'];

        if ($request->has('data.current_password')) {
            Validator::extend('hashmatch', function ($attribute, $value, $parameters) {
                return Hash::check($value, Auth::user()->password);
            });

            $rules = [
                'data.current_password' => 'required|hashmatch:data.current_password',
                'data.new_password' => 'required|min:8|confirmed',
                'data.new_password_confirmation' => 'required|min:8',
            ];

            $payload = app('request')->only('data.current_password', 'data.new_password', 'data.new_password_confirmation');

            $messages = [
                'hashmatch' => 'Invalid Password',
            ];

            $validator = app('validator')->make($payload, $rules, $messages);

            if ($validator->fails()) {
                return response()->error($validator->errors());
            } else {
                $user->password = Hash::make($userForm['new_password']);
            }
        }

        $user->save();

        return response()->success('success');
    }

    public function postUserStatus(Request $request){
        $user_id = $request->input('user_id');
        $user = User::find($user_id);
        if($user->status == 1){
            $userStatus = 0;
        }else{
            $userStatus = 1;
        }
        $user->status = $userStatus;
        $user->save();
        return response()->success('success');
    }
    /**
     * Get all users.
     *
     * @return JSON
     */
    public function getIndex()
    {
        $users = User::all();

        return response()->success(compact('users'));
    }

    /**
     * Get user details referenced by id.
     *
     * @param int User ID
     *
     * @return JSON
     */
    public function getShow($id)
    {
        $user = User::find($id);
        $user['role'] = $user
                        ->roles()
                        ->select(['roles.id', 'roles.name'])
                        ->get();

        return response()->success($user);
    }

    /**
     * Update user data.
     *
     * @return JSON success message
     */
    public function putShow(Request $request)
    {
        $userForm = array_dot(
            app('request')->only(
                'data.email',
                'data.first_name',
                'data.last_name',
                'data.id'
            )
        );

        $userId = intval($userForm['data.id']);

        $user = User::find($userId);

        $this->validate($request, [
            'data.id' => 'required|integer',
            'data.email' => 'required|email|unique:users,email,'.$user->id,
            'data.first_name' => 'required|min:3',
            'data.last_name' => 'required|min:3',
        ]);

        $userData = [
            'email' => $userForm['data.email'],
            'first_name' => $userForm['data.first_name'],
            'last_name' => $userForm['data.last_name'],
        ];

        $affectedRows = User::where('id', '=', $userId)->update($userData);

        $user->detachAllRoles();

        foreach (Input::get('data.role') as $setRole) {
            $user->attachRole($setRole);
        }

        return response()->success('success');
    }


    public function postUsers(Request $request){
        $rules = [
            'email' => 'required|email|unique:users',
            'first_name' => 'required|min:3',
            'last_name' => 'required|min:3',
            'password' => 'required|min:3|confirmed',
            'password_confirmation' =>'required|min:3'
        ];

        $validator = app('validator')->make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->error($validator->errors());
        }else{
            $user = User::create([
                'email' => $request->input('email'),
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'password' => Hash::make($request->input('password')),
                'status' =>1,
            ]);
            $roles = $request->input('role');
            if(count($roles)>0){
                foreach (Input::get('role') as $setRole) {
                    $user->attachRole($setRole);
                }
            }else{
                $role = Role::where('name', 'Data Viewer')->first();
                $user->attachRole($role->id);
            }

            return response()->success('success');
        }
    }

    /**
     * Delete User Data.
     *
     * @return JSON success message
     */
    public function deleteUser($id)
    {
         $user = User::find($id);
         $user->delete();
        return response()->success('success');
    }

    /**
     * Get all user roles.
     *
     * @return JSON
     */
    public function getRoles()
    {
        $roles = Role::all();

        return response()->success(compact('roles'));
    }

    /**
     * Get role details referenced by id.
     *
     * @param int Role ID
     *
     * @return JSON
     */
    public function getRolesShow($id)
    {
        $role = Role::find($id);

        $role['permissions'] = $role
                        ->permissions()
                        ->select(['permissions.name', 'permissions.id'])
                        ->get();

        return response()->success($role);
    }

    /**
     * Update role data and assign permission.
     *
     * @return JSON success message
     */
    public function putRolesShow()
    {
        $roleForm = Input::get('data');
        $postRole = $roleForm['name'];
        $postSlugLower = strtolower($postRole);
        $postSlug = str_replace(' ', '.', $postSlugLower);
        $roleData = [
            'name' => $roleForm['name'],
            'slug' =>$postSlug
        ];

        $affectedRows = Role::where('id', '=', intval($roleForm['id']))->update($roleData);
        $role = Role::find($roleForm['id']);

        $role->detachAllPermissions();

        foreach (Input::get('data.permissions') as $setPermission) {
            $role->attachPermission($setPermission);
        }

        return response()->success('success');
    }

    /**
     * Create new user role.
     *
     * @return JSON
     */
    public function postRoles()
    {
        $permissions = Input::get('permissions');

        $postRole = Input::get('role');
        $postSlugLower = strtolower($postRole);
        $postSlug = str_replace(' ', '.', $postSlugLower);
        $role = Role::create([
            'name' => Input::get('role'),
            'slug' => $postSlug
        ]);
        if(count($permissions)>0){
            foreach ($permissions as $setPermission) {
                $role->attachPermission($setPermission);
            }
        }else{
             $permission = Permission::where('slug','manage.summary')->first();
             if(count($permission)>0){
                 $role->attachPermission($permission);
             }
        }
        return response()->success(compact('role'));
    }

    /**
     * Delete user role referenced by id.
     *
     * @param int Role ID
     *
     * @return JSON
     */
    public function deleteRoles($id)
    {
        Role::destroy($id);

        return response()->success('success');
    }

    /**
     * Get all system permissions.
     *
     * @return JSON
     */
    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->success(compact('permissions'));
    }

    /**
     * Create new system permission.
     *
     * @return JSON
     */
    public function postPermissions()
    {

        $postPermission = Input::get('name');
        $postSlugLower = strtolower($postPermission);
        $postSlug = str_replace(' ', '.', $postSlugLower);
        $permission = Permission::create([
            'name' => Input::get('name'),
            'slug' => $postSlug,
        ]);

        return response()->success(compact('permission'));
    }

    /**
     * Get system permission referenced by id.
     *
     * @param int Permission ID
     *
     * @return JSON
     */
    public function getPermissionsShow($id)
    {
        $permission = Permission::find($id);

        return response()->success($permission);
    }

    /**
     * Update system permission.
     *
     * @return JSON
     */
    public function putPermissionsShow()
    {
        $permissionForm = Input::get('data');
        $postPermission = $permissionForm['name'];
        $postSlugLower = strtolower($postPermission);
        $postSlug = str_replace(' ', '.', $postSlugLower);
        $data = [
            'name' =>$postPermission,
            'slug' =>$postSlug
        ];
        $affectedRows = Permission::where('id', '=', intval($permissionForm['id']))->update($data);

        return response()->success($permissionForm);
    }

    /**
     * Delete system permission referenced by id.
     *
     * @param int Permission ID
     *
     * @return JSON
     */
    public function deletePermissions($id)
    {
        Permission::destroy($id);

        return response()->success('success');
    }
}
