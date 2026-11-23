<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'titre',
        'type',
        'type_bien',
        'ville',
        'prix',
        'description',
        'image',
        'images',
        'caracteristiques',
        'statut',
        'published_at',
    ];

    protected $casts = [
        'images' => 'array',
        'caracteristiques' => 'array',
        'published_at' => 'datetime',
        'prix' => 'decimal:2',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
