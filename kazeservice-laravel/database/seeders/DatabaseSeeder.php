<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SiteSetting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (!app()->environment('production')) {
            $this->call(UserSeeder::class);
        }

        // Créer les paramètres du site par défaut
        SiteSetting::firstOrCreate(
            ['id' => 1],
            [
                'telephone' => '+228 92 99 97 38',
                'email' => 'kazeservices@gmail.com',
                'whatsapp' => '+228 92 99 97 38',
                'adresse' => '966 avenue AKEI, Lomé, Togo',
                'horaires' => 'Lun - Ven: 8h - 18h | Sam: 9h - 13h',
                'facebook' => '',
                'instagram' => '',
                'linkedin' => '',
            ]
        );
    }
}
