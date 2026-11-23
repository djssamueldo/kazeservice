<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function index()
    {
        $partners = Partner::where('statut', 'publie')->orderBy('created_at', 'desc')->get();
        return response()->json($partners);
    }

    public function all()
    {
        $partners = Partner::orderBy('created_at', 'desc')->get();
        return response()->json($partners);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'site_web' => 'nullable|string',
            ]);

            $partner = new Partner();
            $partner->nom = $validated['nom'];
            $partner->description = $validated['description'] ?? null;
            $partner->site_web = $validated['site_web'] ?? null;
            $partner->statut = 'brouillon';
            $partner->ordre = 0;
            $partner->save();

            return response()->json($partner, 201);
        } catch (\Exception $e) {
            \Log::error('Partner store - Error: ' . $e->getMessage());
            \Log::error('Partner store - Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'site_web' => 'nullable|string',
                'logo' => 'nullable|string',
            ]);

            $partner = Partner::findOrFail($id);

            // Construire les données de mise à jour
            $updateData = [
                'nom' => $validated['nom'],
                'description' => $validated['description'] ?? $partner->description,
                'site_web' => $validated['site_web'] ?? $partner->site_web,
            ];

            // Ne mettre à jour le logo que s'il est fourni dans la requête
            if ($request->has('logo') && $validated['logo'] !== null) {
                $updateData['logo'] = $validated['logo'];
            }

            $partner->update($updateData);

            return response()->json($partner);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation error', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Partner update - Error: ' . $e->getMessage());
            \Log::error('Partner update - Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.'], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'statut' => 'required|string|in:brouillon,publie,archive',
            ]);

            $partner = Partner::findOrFail($id);
            $partner->update(['statut' => $validated['statut']]);

            return response()->json($partner);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Partenaire non trouvé'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Statut invalide', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Update partner status error', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Une erreur est survenue lors de la mise à jour du statut.'], 500);
        }
    }

    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);
        $partner->delete();
        return response()->json(null, 204);
    }

    public function uploadLogo(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'logo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            ]);

            $partner = Partner::findOrFail($id);
            $file = $request->file('logo');

            if (!$file || !$file->isValid()) {
                return response()->json(['error' => 'Fichier invalide', 'file_info' => $file ? $file->getError() : 'No file'], 400);
            }

            // Log des informations du fichier pour diagnostic
            \Log::info('Upload logo attempt', [
                'id' => $id,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
            ]);

            // Créer le dossier partners s'il n'existe pas
            $storagePath = public_path('storage/partners');
            if (!file_exists($storagePath)) {
                mkdir($storagePath, 0777, true);
            }

            // Utiliser l'extension originale du fichier (déjà validée par Laravel)
            $extension = strtolower($file->getClientOriginalExtension());

            $fileName = 'partner-' . $id . '-' . time() . '.' . $extension;
            $destinationPath = $storagePath . '/' . $fileName;

            // Essayer de déplacer le fichier
            $sourcePath = $file->getPathname();
            if (!file_exists($sourcePath)) {
                return response()->json(['error' => 'Fichier source introuvable', 'source' => $sourcePath], 500);
            }

            if (!move_uploaded_file($sourcePath, $destinationPath)) {
                return response()->json(['error' => 'Impossible de déplacer le fichier', 'source' => $sourcePath, 'dest' => $destinationPath], 500);
            }

            // Vérifier que le fichier existe et est lisible
            if (!file_exists($destinationPath)) {
                return response()->json(['error' => 'Fichier uploadé mais inexistant', 'path' => $destinationPath], 500);
            }

            $fileSize = filesize($destinationPath);
            if ($fileSize === 0) {
                return response()->json(['error' => 'Fichier uploadé mais vide', 'path' => $destinationPath], 500);
            }

            \Log::info('Upload logo success', [
                'id' => $id,
                'file_name' => $fileName,
                'file_size' => $fileSize,
                'destination' => $destinationPath,
            ]);

            $url = request()->getSchemeAndHttpHost() . '/storage/partners/' . $fileName;
            $partner->logo = $url;
            $partner->save();

            return response()->json(['url' => $url]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation error', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Upload logo error', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Une erreur est survenue lors de l\'envoi du fichier. Veuillez réessayer.'], 500);
        }
    }
}
