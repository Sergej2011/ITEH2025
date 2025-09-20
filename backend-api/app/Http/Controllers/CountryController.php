<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CountryController extends Controller
{
    // GET /api/countries
    public function index()
    {
        $data = Cache::remember('countries:min', 86400, function () {
            $res = Http::get('https://restcountries.com/v3.1/all', [
                'fields' => 'name,cca2,currencies'
            ])->throw()->json();

            return collect($res)->map(function ($c) {
                return [
                    'name' => $c['name']['common'] ?? '',
                    'code' => $c['cca2'] ?? '',
                    'currencies' => array_keys($c['currencies'] ?? []),
                ];
            })->sortBy('name')->values();
        });

        return response()->json($data);
    }
}