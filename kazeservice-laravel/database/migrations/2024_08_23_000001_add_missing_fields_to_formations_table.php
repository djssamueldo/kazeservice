<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->string('niveau')->nullable()->after('duree');
            $table->string('format')->nullable()->after('niveau');
            $table->string('langue')->nullable()->after('format');
            $table->string('certification')->nullable()->after('langue');
            $table->date('date_debut')->nullable()->after('certification');
            $table->json('public_cible')->nullable()->after('programme');
        });
    }

    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn(['niveau', 'format', 'langue', 'certification', 'date_debut', 'public_cible']);
        });
    }
};
