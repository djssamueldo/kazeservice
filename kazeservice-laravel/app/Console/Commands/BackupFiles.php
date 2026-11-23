<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class BackupFiles extends Command
{
    protected $signature = 'files:backup';
    protected $description = 'Sauvegarde des fichiers uploadés';

    public function handle()
    {
        $backupPath = storage_path('app/backups');
        if (!file_exists($backupPath)) {
            mkdir($backupPath, 0755, true);
        }

        $fileName = 'files_' . date('Y-m-d_H-i-s') . '.zip';
        $zipPath = $backupPath . '/' . $fileName;

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE) {
            // Ajouter le dossier storage/app/public
            $files = Storage::disk('public')->allFiles();
            foreach ($files as $file) {
                $content = Storage::disk('public')->get($file);
                $zip->addFromString($file, $content);
            }

            $zip->close();
            $this->info('Sauvegarde des fichiers réussie : ' . $fileName);

            // Garder seulement les 10 dernières sauvegardes
            $this->cleanupOldBackups($backupPath, 10);

            return Command::SUCCESS;
        } else {
            $this->error('Impossible de créer l\'archive ZIP');
            return Command::FAILURE;
        }
    }

    private function cleanupOldBackups($backupPath, $keepCount)
    {
        $files = glob($backupPath . '/files_*.zip');
        usort($files, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });

        $filesToDelete = array_slice($files, 0, -$keepCount);
        foreach ($filesToDelete as $file) {
            unlink($file);
            $this->info('Ancienne sauvegarde supprimée : ' . basename($file));
        }
    }
}
