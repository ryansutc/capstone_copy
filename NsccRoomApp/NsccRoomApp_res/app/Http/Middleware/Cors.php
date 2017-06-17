<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    /**
     * Handle an incoming request.
     * This middleware was created to allow cross origin requests to be made to certain pages
     * so we can grab the JSON information from other websites.
     * 
     * As per here: http://stackoverflow.com/questions/39429462/adding-access-control-allow-origin-header-response-in-laravel-5-3-passport
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET');
    }
}
