<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{ 
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Niste autentifikovani'], 401);
        }

        if ($request->user()->role !== $role) {
            return response()->json(['message' => 'Nemate dozvolu za ovu akciju'], 403);
        }

        return $next($request);
    }
}
