<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    /**
     * Résout le chemin physique d'une URL d'image gérée par ce bien.
     * Ne retourne un chemin que pour les fichiers situés dans
     * public/storage/properties/{id}/ — jamais pour les URL externes.
     */
    private function managedImageFilePath(?string $url, int $propertyId): ?string
    {
        if (!is_string($url) || $url === '') {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);
        if (!is_string($path)) {
            return null;
        }

        $prefix = "/storage/properties/{$propertyId}/";
        if (strpos($path, $prefix) !== 0) {
            return null;
        }

        // Le stockage réel est public/storage (dossier physique, pas un symlink)
        $fullPath = public_path(ltrim($path, '/'));

        // Sécurité : le chemin résolu doit rester dans le dossier du bien
        $baseDir = realpath(public_path('storage/properties'));
        $resolved = realpath($fullPath);
        if ($baseDir === false || $resolved === false || strpos($resolved, $baseDir . DIRECTORY_SEPARATOR) !== 0) {
            return null;
        }

        return $resolved;
    }

    /**
     * Vérifie si une URL d'image est encore référencée par un autre bien.
     */
    private function isImageUsedByOtherProperty(string $url, int $excludePropertyId): bool
    {
        return Property::where('id', '!=', $excludePropertyId)
            ->where(function ($query) use ($url) {
                $query->where('image', $url)
                    ->orWhereJsonContains('images', $url);
            })
            ->exists();
    }

    /**
     * Supprime physiquement les fichiers des URL données, uniquement si :
     * - l'URL pointe vers public/storage/properties/{id}/ du bien concerné ;
     * - le fichier existe ;
     * - aucun autre bien ne référence encore cette URL.
     * Appelée APRÈS la mise à jour/suppression en base.
     */
    private function deleteManagedImageFiles(array $urls, int $propertyId): void
    {
        foreach ($urls as $url) {
            if (!is_string($url) || $url === '') {
                continue;
            }
            if ($this->isImageUsedByOtherProperty($url, $propertyId)) {
                continue;
            }
            $filePath = $this->managedImageFilePath($url, $propertyId);
            if ($filePath && is_file($filePath)) {
                @unlink($filePath);
            }
        }
    }

    /**
     * Toutes les URL d'images d'un bien (galerie + image principale), dédupliquées.
     */
    private function allImageUrls(Property $property): array
    {
        $urls = $property->images ?? [];
        if (!is_array($urls)) {
            $urls = [];
        }
        if (is_string($property->image) && $property->image !== '') {
            $urls[] = $property->image;
        }
        return array_values(array_unique(array_filter($urls, 'is_string')));
    }

    /**
     * Synchronise le champ image avec la première entrée du tableau images.
     * images[0] devient l'image principale ; galerie vide => image = null.
     */
    private function syncMainImage(array $data): array
    {
        if (array_key_exists('images', $data)) {
            $images = $data['images'];
            if (!is_array($images)) {
                $images = [];
            }
            $data['image'] = isset($images[0]) && is_string($images[0]) && $images[0] !== ''
                ? $images[0]
                : null;
        }
        return $data;
    }
    public function index()
    {
        $properties = Property::orderBy('published_at', 'desc')->get();
        return response()->json($properties);
    }

    public function show($id)
    {
        $property = Property::findOrFail($id);
        return response()->json($property);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'type' => 'required|string',
            'type_bien' => 'required|string',
            'ville' => 'required|string',
            'prix' => 'required|numeric',
            'description' => 'nullable|string',
            'statut' => 'sometimes|in:disponible,vendu,loue,reserve',
        ]);

        $data = $this->syncMainImage($request->all());

        // Générer une référence automatiquement si non fournie
        if (!isset($data['reference']) || empty($data['reference'])) {
            $data['reference'] = 'PROP-' . strtoupper(uniqid());
        }

        $property = Property::create($data);
        return response()->json($property, 201);
    }

    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        $validated = $request->validate([
            'reference' => 'sometimes|string|max:255',
            'titre' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:vente,location',
            'type_bien' => 'sometimes|string|max:100',
            'ville' => 'sometimes|string|max:255',
            'prix' => 'sometimes|numeric',
            'description' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|string',
            'images' => 'sometimes|nullable|array',
            'caracteristiques' => 'sometimes|nullable|array',
            'statut' => 'sometimes|in:disponible,vendu,loue,reserve',
            'published_at' => 'sometimes|nullable|date',
        ]);

        // images[] est la source de vérité : images[0] devient image,
        // une galerie explicitement vide remet image à null.
        // Si 'images' est absent, les images existantes sont préservées.
        $validated = $this->syncMainImage($validated);

        // Mémoriser les URL avant mise à jour pour détecter les suppressions
        $previousUrls = $this->allImageUrls($property);

        $property->update($validated);

        // Supprimer physiquement les fichiers des images retirées
        // (uniquement après confirmation de la mise à jour en base,
        // uniquement les fichiers gérés par ce bien et non réutilisés ailleurs)
        if (array_key_exists('images', $validated)) {
            $newUrls = $this->allImageUrls($property->fresh());
            $removedUrls = array_values(array_diff($previousUrls, $newUrls));
            $this->deleteManagedImageFiles($removedUrls, $property->id);
        }

        return response()->json($property);
    }

    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        // Mémoriser toutes les URL (image principale + galerie)
        $imageUrls = $this->allImageUrls($property);

        $property->delete();

        // Supprimer les fichiers physiques après suppression en base,
        // uniquement ceux situés dans public/storage/properties/{id}/
        $this->deleteManagedImageFiles($imageUrls, $property->id);

        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:disponible,vendu,loue,reserve',
        ]);

        $property = Property::findOrFail($id);
        $property->update(['statut' => $request->statut]);
        return response()->json($property);
    }

    public function uploadImage(Request $request, $id)
    {
        try {
            // Validation avec vérification du contenu réel du fichier
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
                'index' => 'required|integer',
            ]);

            $property = Property::findOrFail($id);
            $file = $request->file('image');
            $index = $request->index;

            // Vérification que le fichier est valide
            if (!$file || !$file->isValid()) {
                return response()->json(['error' => 'Fichier invalide'], 422);
            }

            // Stockage direct dans public/storage pour éviter les problèmes de lien symbolique sur Windows
            $fileName = "properties/{$id}/{$index}-{$file->getClientOriginalName()}";
            $destinationPath = public_path('storage/' . $fileName);

            // Créer le dossier si nécessaire
            $directory = dirname($destinationPath);
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            // Déplacer le fichier
            $file->move($directory, basename($destinationPath));

            // URL complète pour l'affichage
            $url = request()->getSchemeAndHttpHost() . '/storage/' . $fileName;

            $images = $property->images ?? [];
            // Éviter les doublons si l'URL est déjà dans la galerie
            if (!in_array($url, $images, true)) {
                $images[] = $url;
            }
            $property->images = array_values($images);
            // images[0] est l'image principale
            $property->image = $property->images[0];
            $property->save();

            return response()->json(['url' => $url]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation error', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Property upload image - Error: ' . $e->getMessage());
            \Log::error('Property upload image - Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de l\'envoi du fichier. Veuillez réessayer.'], 500);
        }
    }

    public function deleteImage(Request $request, $id)
    {
        $request->validate(['url' => 'required|string']);

        $property = Property::findOrFail($id);
        $url = $request->url;

        $images = $property->images ?? [];
        if (!is_array($images)) {
            $images = [];
        }

        $inGallery = in_array($url, $images, true);
        $isMain = $property->image === $url;

        // L'URL doit réellement appartenir à ce bien
        if (!$inGallery && !$isMain) {
            return response()->json(['error' => 'Cette image n\'est pas associée à ce bien'], 422);
        }

        $images = array_values(array_filter($images, fn($img) => $img !== $url));
        $property->images = $images;
        // Resynchroniser l'image principale : images[0], ou null si galerie vide
        $property->image = $images[0] ?? null;
        $property->save();

        // Supprimer le fichier physique après mise à jour en base,
        // uniquement s'il est géré par ce bien et non utilisé ailleurs
        $this->deleteManagedImageFiles([$url], $property->id);

        return response()->json($property);
    }
}
