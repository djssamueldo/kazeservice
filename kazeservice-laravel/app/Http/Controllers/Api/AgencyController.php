<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use Illuminate\Http\Request;

class AgencyController extends Controller
{
    public function index()
    {
        $agencies = Agency::orderBy('ordre')->get();
        return response()->json($agencies);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'nullable|string',
            'telephones' => 'nullable|array',
            'whatsapp' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'horaires' => 'nullable|array',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $data = $request->all();

        // Définir des valeurs par défaut si non fournies
        $data['ordre'] = $data['ordre'] ?? 0;

        $agency = Agency::create($data);
        return response()->json($agency, 201);
    }

    public function update(Request $request, $id)
    {
        $agency = Agency::findOrFail($id);
        $agency->update($request->all());
        return response()->json($agency);
    }

    public function destroy($id)
    {
        $agency = Agency::findOrFail($id);
        $agency->delete();
        return response()->json(null, 204);
    }
}
