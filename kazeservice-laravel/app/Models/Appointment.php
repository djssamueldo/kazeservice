<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'telephone',
        'email',
        'motif',
        'date_souhaitee',
        'creneau',
        'property_id',
        'message',
        'statut',
    ];

    protected $casts = [
        'date_souhaitee' => 'date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
