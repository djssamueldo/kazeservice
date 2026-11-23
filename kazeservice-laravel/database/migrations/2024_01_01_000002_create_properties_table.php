<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('titre');
            $table->string('type');
            $table->string('type_bien');
            $table->string('ville');
            $table->decimal('prix', 12, 2);
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->json('caracteristiques')->nullable();
            $table->enum('statut', ['disponible', 'vendu', 'loue', 'reserve'])->default('disponible');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
