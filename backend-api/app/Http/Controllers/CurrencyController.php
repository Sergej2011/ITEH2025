<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use App\Models\Product;

class CurrencyController extends Controller
{
    // GET /api/currency/convert?amount=100&from=EUR&to=RSD
    public function convert(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|numeric',
            'from'   => 'required|string|size:3',
            'to'     => 'required|string|size:3',
        ]);

        $from = strtoupper($data['from']);
        $to   = strtoupper($data['to']);

        // Mock exchange rates za demo
        $rates = [
            'RSD' => ['EUR' => 0.0085, 'USD' => 0.0092, 'GBP' => 0.0073],
            'EUR' => ['RSD' => 117.65, 'USD' => 1.08, 'GBP' => 0.86],
            'USD' => ['RSD' => 108.70, 'EUR' => 0.93, 'GBP' => 0.79],
            'GBP' => ['RSD' => 136.99, 'EUR' => 1.16, 'USD' => 1.27],
        ];

        $rate = $rates[$from][$to] ?? null;

        if (!$rate) {
            return response()->json(['message' => 'Rate not available'], 422);
        }

        return response()->json([
            'amount' => (float)$data['amount'],
            'from' => $from,
            'to' => $to,
            'rate' => $rate,
            'converted' => round($data['amount'] * $rate, 2),
        ]);
    }

    // GET /api/products/converted?from=RSD&to=EUR
    public function productsConverted(Request $request)
    {
        $from = strtoupper($request->query('from', 'RSD'));
        $to   = strtoupper($request->query('to', 'EUR'));

        $rate = Cache::remember("rate:$from:$to", 3600, function () use ($from, $to) {
            $res = Http::get('https://api.exchangerate.host/latest', [
                'base' => $from,
                'symbols' => $to,
            ])->throw()->json();

            return $res['rates'][$to] ?? null;
        });

        if (!$rate) {
            return response()->json(['message' => 'Rate not available'], 422);
        }

        // Privremeno vraća prazan niz dok ne napravimo Product model
        $products = collect();

        return response()->json([
            'products' => $products,
            'conversion' => [
                'from' => $from,
                'to' => $to,
                'rate' => $rate,
            ]
        ]);
    }
}