<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'slug',
        'description_courte',
        'description',
        'image',
        'prix',
        'duree',
        'niveau',
        'format',
        'langue',
        'certification',
        'date_debut',
        'places_disponibles',
        'prerequis',
        'objectifs',
        'programme',
        'public_cible',
        'ordre',
        'publie',
    ];

    protected $casts = [
        'prerequis' => 'array',
        'objectifs' => 'array',
        'programme' => 'array',
        'public_cible' => 'array',
        'prix' => 'decimal:2',
        'publie' => 'boolean',
        'date_debut' => 'date',
    ];

    public function scopePublished($query)
    {
        return $query->where('publie', true);
    }
}
