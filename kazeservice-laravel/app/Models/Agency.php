<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'adresse',
        'telephones',
        'whatsapp',
        'email',
        'horaires',
        'latitude',
        'longitude',
        'ordre',
    ];

    protected $casts = [
        'telephones' => 'array',
        'horaires' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];
}
