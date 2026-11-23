<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class FormationController extends Controller
{
    public function index()
    {
        $formations = Formation::orderBy('ordre')->get();
        return response()->json($formations);
    }

    public function show($slug)
    {
        $formation = Formation::where('slug', $slug)->firstOrFail();
        return response()->json($formation);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Formation store - Request data:', $request->all());

            $request->validate([
                'titre' => 'required|string|max:255',
                'description_courte' => 'nullable|string',
                'description' => 'nullable|string',
                'prix' => 'nullable|numeric',
                'duree' => 'nullable|string',
                'places_disponibles' => 'nullable|integer',
                'image' => 'nullable|image|max:5120',
            ]);

            $data = $request->all();

            // Génération du slug si non fourni
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = Str::slug($data['titre']);
            }

            // Upload de l'image
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . Str::slug($data['titre']) . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images/formations'), $imageName);
                $data['image'] = '/images/formations/' . $imageName;
            }

            // Définir des valeurs par défaut si non fournies
            $data['ordre'] = $data['ordre'] ?? 0;
            $data['publie'] = filter_var($data['publie'] ?? true, FILTER_VALIDATE_BOOLEAN);

            \Log::info('Formation store - Data to save:', $data);

            $formation = Formation::create($data);
            return response()->json($formation, 201);
        } catch (\Exception $e) {
            \Log::error('Formation store - Error: ' . $e->getMessage());
            \Log::error('Formation store - Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $formation = Formation::findOrFail($id);

            $data = $request->all();

            // Upload de l'image si fournie
            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($formation->image && file_exists(public_path($formation->image))) {
                    unlink(public_path($formation->image));
                }

                $image = $request->file('image');
                $imageName = time() . '_' . Str::slug($formation->titre) . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images/formations'), $imageName);
                $data['image'] = '/images/formations/' . $imageName;
            }

            // Convertir publie en boolean
            if (isset($data['publie'])) {
                $data['publie'] = filter_var($data['publie'], FILTER_VALIDATE_BOOLEAN);
            }

            $formation->update($data);
            return response()->json($formation);
        } catch (\Exception $e) {
            \Log::error('Formation update - Error: ' . $e->getMessage());
            \Log::error('Formation update - Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.'], 500);
        }
    }

    public function destroy($id)
    {
        $formation = Formation::findOrFail($id);

        // Supprimer l'image si elle existe
        if ($formation->image && file_exists(public_path($formation->image))) {
            unlink(public_path($formation->image));
        }

        $formation->delete();
        return response()->json(null, 204);
    }
}
