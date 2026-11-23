<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Sauvegarde automatique de la base de données tous les jours à minuit
Schedule::command('db:backup')->dailyAt('00:00');

// Sauvegarde automatique des fichiers tous les jours à 1h du matin
Schedule::command('files:backup')->dailyAt('01:00');
