<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->decimal('prix', 10, 2)->nullable();
            $table->integer('duree')->nullable();
            $table->integer('places_disponibles')->default(10);
            $table->json('prerequis')->nullable();
            $table->json('objectifs')->nullable();
            $table->json('programme')->nullable();
            $table->integer('ordre')->default(0);
            $table->boolean('publie')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
