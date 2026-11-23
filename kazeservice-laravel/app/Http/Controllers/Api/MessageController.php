<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'nom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telephone' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        $message = Message::create([
            'type' => $request->type,
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'message' => $request->message,
            'donnees' => $request->except(['type', 'nom', 'email', 'telephone', 'message']),
            'statut' => 'nouveau',
        ]);

        return response()->json($message, 201);
    }

    public function index(Request $request)
    {
        $query = Message::orderBy('created_at', 'desc');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $messages = $query->get();
        return response()->json($messages);
    }

    public function updateStatus(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        $message->update(['statut' => $request->statut]);
        return response()->json($message);
    }
}
