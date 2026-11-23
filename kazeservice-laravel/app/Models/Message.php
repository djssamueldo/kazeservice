<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'nom',
        'email',
        'telephone',
        'message',
        'donnees',
        'statut',
    ];

    protected $casts = [
        'donnees' => 'array',
    ];
}
