<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{ 
    public function index(Request $request)
    {
        $query = Order::with(['buyer', 'seller', 'product']);

        // Filtriranje po ulozi korisnika
        if ($request->user()->id) {
            $query->where(function ($q) use ($request) {
                $q->where('buyer_id', $request->user()->id)
                  ->orWhere('seller_id', $request->user()->id);
            });
        }

        // Filtriranje po statusu
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Sortiranje
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $orders = $query->paginate(15);

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'notes' => 'nullable|string',
        ]);

        $product = Product::findOrFail($data['product_id']);

        // Proveri da li je korisnik vlasnik proizvoda
        if ($product->user_id === $request->user()->id) {
            return response()->json(['message' => 'Ne možete kupiti svoj proizvod'], 400);
        }

        // Proveri da li je proizvod dostupan
        if ($product->status !== 'active') {
            return response()->json(['message' => 'Proizvod nije dostupan za kupovinu'], 400);
        }

        DB::beginTransaction();

        try {
            $order = Order::create([
                'buyer_id' => $request->user()->id,
                'seller_id' => $product->user_id,
                'product_id' => $product->id,
                'total_amount' => $product->price,
                'currency' => $product->currency,
                'notes' => $data['notes'] ?? null,
                'status' => Order::STATUS_PENDING,
            ]);

            // Označi proizvod kao rezervisan
            $product->update(['status' => 'sold']);

            DB::commit();

            return response()->json($order->load(['buyer', 'seller', 'product']), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Greška pri kreiranju porudžbine'], 500);
        }
    }

    public function show(Order $order)
    {
        // Proveri da li korisnik ima pristup porudžbini
        if ($order->buyer_id !== request()->user()->id && $order->seller_id !== request()->user()->id) {
            return response()->json(['message' => 'Nemate dozvolu za pristup ovoj porudžbini'], 403);
        }

        return response()->json($order->load(['buyer', 'seller', 'product']));
    }

    public function update(Request $request, Order $order)
    {
        // Proveri da li je korisnik prodavac
        if ($order->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Nemate dozvolu za izmenu ove porudžbine'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $order->update($data);

        return response()->json($order->load(['buyer', 'seller', 'product']));
    }

    public function cancel(Request $request, Order $order)
    {
        // Proveri da li je korisnik kupac ili prodavac
        if ($order->buyer_id !== $request->user()->id && $order->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Nemate dozvolu za otkazivanje ove porudžbine'], 403);
        }

        DB::beginTransaction();

        try {
            $order->update(['status' => Order::STATUS_CANCELLED]);

            // Vrati proizvod u aktivno stanje
            $order->product->update(['status' => 'active']);

            DB::commit();

            return response()->json(['message' => 'Porudžbina je uspešno otkazana']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Greška pri otkazivanju porudžbine'], 500);
        }
    }

    public function myOrders(Request $request)
    {
        $userId = $request->user()->id;
        
        $orders = Order::with(['buyer', 'seller', 'product'])
            ->where(function ($query) use ($userId) {
                $query->where('buyer_id', $userId)
                      ->orWhere('seller_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($orders);
    }

    public function orderDetails($id)
    {
        $order = Order::with(['buyer', 'seller', 'product'])
            ->findOrFail($id);

        // Proveri da li korisnik ima pristup porudžbini
        if ($order->buyer_id !== request()->user()->id && $order->seller_id !== request()->user()->id) {
            return response()->json(['message' => 'Nemate dozvolu za pristup ovoj porudžbini'], 403);
        }

        return response()->json($order);
    }

    public function statistics(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total_orders' => Order::where('buyer_id', $userId)->orWhere('seller_id', $userId)->count(),
            'pending_orders' => Order::where('buyer_id', $userId)->orWhere('seller_id', $userId)->where('status', 'pending')->count(),
            'completed_orders' => Order::where('buyer_id', $userId)->orWhere('seller_id', $userId)->where('status', 'delivered')->count(),
            'total_spent' => Order::where('buyer_id', $userId)->sum('total_amount'),
            'total_earned' => Order::where('seller_id', $userId)->sum('total_amount'),
        ];

        return response()->json($stats);
    }
}
