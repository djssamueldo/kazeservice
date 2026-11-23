<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        $profiles = User::orderBy('created_at', 'desc')->get();
        return response()->json($profiles);
    }

    public function updatePermissions(Request $request, $id)
    {
        $currentUser = $request->user();

        // Seul un admin peut modifier les permissions d'un autre utilisateur
        if ($currentUser->role !== 'admin') {
            return response()->json([
                'message' => 'Seuls les administrateurs peuvent modifier les permissions des utilisateurs.'
            ], 403);
        }

        $request->validate([
            'permissions' => 'required|array',
        ]);

        $targetUser = User::findOrFail($id);
        $permissions = $request->permissions;

        $payload = ['permissions' => $permissions];

        // Si l'utilisateur cible n'est pas admin, ajuster le rôle selon les permissions
        if ($targetUser->role !== 'admin') {
            $hasAnyPermission = collect($permissions)->some(fn($value) => $value === true);
            $payload['role'] = $hasAnyPermission ? 'staff' : 'client';
        }

        $targetUser->update($payload);
        return response()->json($targetUser);
    }
}
