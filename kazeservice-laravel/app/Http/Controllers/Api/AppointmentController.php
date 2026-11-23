<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'email' => 'required|email',
            'motif' => 'required|string',
            'date_souhaitee' => 'nullable|date',
            'creneau' => 'nullable|string',
            'bien_id' => 'nullable|exists:properties,id',
            'message' => 'nullable|string',
        ]);

        $appointment = Appointment::create($request->all());
        return response()->json($appointment, 201);
    }

    public function myAppointments(Request $request)
    {
        $email = $request->user()->email;

        $appointments = Appointment::where('email', $email)
            ->orderBy('date_souhaitee', 'desc')
            ->get();
        return response()->json($appointments);
    }

    public function index()
    {
        $appointments = Appointment::orderBy('date_souhaitee', 'desc')->get();
        return response()->json($appointments);
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['statut' => $request->statut]);
        return response()->json($appointment);
    }
}
