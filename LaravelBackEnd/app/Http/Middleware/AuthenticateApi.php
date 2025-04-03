<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class AuthenticateApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');
        
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'No token provided'
            ], 401);
        }

        // Remove "Bearer " from token string
        $token = str_replace('Bearer ', '', $token);

        $user = User::where('api_token', $token)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid token'
            ], 401);
        }

        // Add user to request
        $request->merge(['user' => $user]);
        
        return $next($request);
    }
} 