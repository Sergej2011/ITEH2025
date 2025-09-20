<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class ModeratorController extends Controller
{
    /**
     * Prikaži proizvode koji čekaju odobrenje (samo moderator)
     */
    public function pendingProducts()
    {
        $products = Product::where('status', 'pending')
                          ->with(['user', 'categories'])
                          ->paginate(15);
        
        return response()->json($products);
    }

    /**
     * Odobri proizvod (samo moderator)
     */
    public function approveProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['status' => 'active']);

        return response()->json([
            'message' => 'Proizvod je odobren',
            'product' => $product
        ]);
    }

    /**
     * Odbaci proizvod (samo moderator)
     */
    public function rejectProduct(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $product = Product::findOrFail($id);
        $product->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason
        ]);

        return response()->json([
            'message' => 'Proizvod je odbačen',
            'product' => $product
        ]);
    }

    /**
     * Prikaži korisnike (samo moderator) - bez admin funkcionalnosti
     */
    public function users()
    {
        $users = User::where('role', 'user')
                    ->withCount(['products', 'ordersAsBuyer'])
                    ->paginate(10);
        
        return response()->json($users);
    }

    /**
     * Prikaži odbačene proizvode (samo moderator)
     */
    public function rejectedProducts()
    {
        $products = Product::where('status', 'rejected')
                          ->with(['user', 'categories'])
                          ->paginate(15);
        
        return response()->json($products);
    }

    /**
     * Moderator statistike
     */
    public function stats()
    {
        $stats = [
            'pending_products' => Product::where('status', 'pending')->count(),
            'rejected_products' => Product::where('status', 'rejected')->count(),
            'approved_today' => Product::where('status', 'active')
                                     ->whereDate('updated_at', today())
                                     ->count(),
            'total_users' => User::where('role', 'user')->count(),
        ];

        return response()->json($stats);
    }
}
