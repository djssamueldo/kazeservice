<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Vérifier que le mot de passe n'est pas trop courant
        $commonPasswords = [
            'password', '12345678', 'azerty123', 'qwerty123', 'password123',
            'admin123', '123456789', '1234567890', 'azerty', 'qwerty',
            'password1', '123456', '1234567', '1234567890', 'abc123',
            'letmein', 'welcome', 'monkey', 'dragon', 'master',
            'sunshine', 'iloveyou', 'princess', 'admin', 'root',
            'login', 'passw0rd', 'hello', 'football', 'baseball',
        ];

        if (in_array(strtolower($request->password), $commonPasswords)) {
            throw ValidationException::withMessages([
                'password' => ['Ce mot de passe est trop courant. Veuillez choisir un mot de passe plus sécurisé.'],
            ]);
        }

        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
        ]);

        // Connecter l'utilisateur automatiquement après l'inscription (pose le cookie de session)
        Auth::login($user);

        // Envoyer l'email de vérification
        $user->sendEmailVerificationNotification();

        return response()->json([
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $user = Auth::user();

        // Pour le mode SPA avec cookies, Auth::attempt() pose déjà le cookie
        // On ne renvoie plus de token dans la réponse
        return response()->json([
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        // Invalider la session côté serveur
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function profile(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::findOrFail($id);

        // Un utilisateur ne peut voir que son propre profil, sauf s'il est admin/staff
        if (!$currentUser->isStaff() && $currentUser->id !== $targetUser->id) {
            return response()->json([
                'message' => 'Vous n\'avez pas la permission de voir ce profil.'
            ], 403);
        }

        return response()->json($targetUser);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }

    public function sendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email déjà vérifié']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Email de vérification envoyé']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = \Illuminate\Support\Facades\Password::sendResetLink($request->only('email'));

        if ($status == \Illuminate\Support\Facades\Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new \Illuminate\Auth\Events\PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        return response()->json([
            'exists' => $user !== null,
        ]);
    }
}
