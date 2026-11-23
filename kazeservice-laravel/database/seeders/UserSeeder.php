<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!app()->environment(['local', 'testing'])) {
            $this->command?->warn('Les comptes de test sont désactivés dans cet environnement.');
            return;
        }

        // Créer l'administrateur principal
        $admin = User::updateOrCreate(
            ['email' => 'admin@kazeservice.com'],
            [
                'nom' => 'Administrateur',
                'email' => 'admin@kazeservice.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'permissions' => null,
            ]
        );

        // Forcer la réinitialisation du mot de passe admin
        $admin->password = Hash::make('admin123');
        $admin->save();

        // Créer un compte staff avec toutes les permissions
        User::updateOrCreate(
            ['email' => 'staff@kazeservice.com'],
            [
                'nom' => 'Staff',
                'email' => 'staff@kazeservice.com',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
                'permissions' => [
                    'biens' => true,
                    'rendezvous' => true,
                    'messages' => true,
                    'partenaires' => true,
                    'agences' => true,
                    'formations' => true,
                    'reglages' => true,
                ],
            ]
        );

        // Créer un compte staff limité (biens et rendez-vous seulement)
        User::updateOrCreate(
            ['email' => 'agent@kazeservice.com'],
            [
                'nom' => 'Agent',
                'email' => 'agent@kazeservice.com',
                'password' => Hash::make('agent123'),
                'role' => 'staff',
                'permissions' => [
                    'biens' => true,
                    'rendezvous' => true,
                    'messages' => false,
                    'partenaires' => false,
                    'agences' => false,
                    'formations' => false,
                    'reglages' => false,
                ],
            ]
        );

        // Créer un compte client de test
        User::updateOrCreate(
            ['email' => 'client@test.com'],
            [
                'nom' => 'Client Test',
                'email' => 'client@test.com',
                'password' => Hash::make('client123'),
                'role' => 'client',
                'permissions' => null,
            ]
        );

        $this->command->info('Comptes utilisateurs créés avec succès :');
        $this->command->info('- Admin: admin@kazeservice.com / admin123');
        $this->command->info('- Staff: staff@kazeservice.com / staff123');
        $this->command->info('- Agent: agent@kazeservice.com / agent123');
        $this->command->info('- Client: client@test.com / client123');
    }
}
