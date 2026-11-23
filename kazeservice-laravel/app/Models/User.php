<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'email',
        'password',
        'role',
        'permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'permissions' => 'array',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'email', 'email');
    }

    public function isStaff()
    {
        return $this->role === 'admin' || $this->role === 'staff';
    }

    public function hasPermission($permission)
    {
        if ($this->role === 'admin') {
            return true;
        }
        return isset($this->permissions[$permission]) && $this->permissions[$permission] === true;
    }
}
