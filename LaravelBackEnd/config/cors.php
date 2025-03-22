<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Options
    |--------------------------------------------------------------------------
    |
    | The allowed_methods and allowed_headers options are case-insensitive.
    |
    | You don't need to provide both allowed_origins and allowed_origins_patterns.
    | If one of the strings passed matches, it is considered a valid origin.
    |
    | If ['*'] is provided to allowed_methods, allowed_origins or allowed_headers
    | all methods / origins / headers are allowed.
    |
    */

'paths' => [
    'api/*',
    'sanctum/csrf-cookie',
    'login',
    'logout'
],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'], // Your frontend URL
'allowed_headers' => ['*'],
'allowed_origins_patterns' => [],
'max_age' => 0,
'supports_credentials' => true, // Important for cookies
];
