<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Sauvegarde automatique de la base de données MySQL';

    public function handle()
    {
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $host = env('DB_HOST');
        $port = env('DB_PORT', '3306');

        $backupPath = storage_path('app/backups');
        if (!file_exists($backupPath)) {
            mkdir($backupPath, 0755, true);
        }

        $fileName = $database . '_' . date('Y-m-d_H-i-s') . '.sql';
        $filePath = $backupPath . '/' . $fileName;

        // Utiliser la méthode Laravel pour Windows
        try {
            $tables = DB::select('SHOW TABLES');
            $sql = '';

            foreach ($tables as $table) {
                $tableName = array_values((array)$table)[0];
                $this->info('Exportation de la table : ' . $tableName);

                // Structure de la table
                $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
                $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
                $sql .= $createTable[0]->{'Create Table'} . ";\n\n";

                // Données de la table
                $rows = DB::table($tableName)->get();
                foreach ($rows as $row) {
                    $values = [];
                    foreach ((array)$row as $value) {
                        if ($value === null) {
                            $values[] = 'NULL';
                        } else {
                            $values[] = "'" . addslashes($value) . "'";
                        }
                    }
                    $columns = array_keys((array)$row);
                    $sql .= "INSERT INTO `{$tableName}` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $values) . ");\n";
                }
                $sql .= "\n";
            }

            file_put_contents($filePath, $sql);
            $this->info('Sauvegarde réussie : ' . $fileName);

            // Garder seulement les 10 dernières sauvegardes
            $this->cleanupOldBackups($backupPath, 10);

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Erreur lors de la sauvegarde : ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    private function cleanupOldBackups($backupPath, $keepCount)
    {
        $files = glob($backupPath . '/*.sql');
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
