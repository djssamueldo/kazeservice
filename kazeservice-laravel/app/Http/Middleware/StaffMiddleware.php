<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StaffMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Vérifier que l'utilisateur est connecté et a le rôle staff ou admin
        if (!$user || !$user->isStaff()) {
            return response()->json([
                'message' => 'Vous n\'avez pas la permission d\'accéder à cette ressource. Seuls les membres du staff peuvent effectuer cette action.'
            ], 403);
        }

        return $next($request);
    }
}
