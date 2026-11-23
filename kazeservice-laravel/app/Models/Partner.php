<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'logo',
        'site_web',
        'statut',
        'ordre',
    ];

    protected $casts = [
        'publie' => 'boolean',
    ];

    public function scopePublished($query)
    {
        return $query->where('statut', 'publie');
    }
}
