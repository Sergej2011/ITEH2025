<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Prikaži sve korisnike (samo admin)
     */
    public function users()
    {
        $users = User::withCount(['products', 'ordersAsBuyer', 'ordersAsSeller'])
                    ->paginate(10);
        
        return response()->json($users);
    }

    /**
     * Kreiraj novog korisnika (samo admin)
     */ 
    public function createUser(Request $request)
    { 
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(['user', 'admin', 'moderator'])]
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'],
            'role' => $data['role']
        ]);

        return response()->json([
            'message' => 'Korisnik je uspešno kreiran',
            'user' => $user
        ], 201);
    }

    /**
     * Ažuriraj korisnika (samo admin)
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'role' => ['sometimes', Rule::in(['user', 'admin', 'moderator'])]
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Korisnik je uspešno ažuriran',
            'user' => $user
        ]);
    }

    /**
     * Obriši korisnika (samo admin)
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Ne dozvoli brisanje samog sebe
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Ne možete obrisati samog sebe'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Korisnik je uspešno obrisan']);
    }

    /**
     * Prikaži sve proizvode sa detaljima (samo admin)
     */
    public function allProducts()
    {
        $products = Product::with(['user', 'categories'])
                          ->withCount('orders')
                          ->paginate(15);
        
        return response()->json($products);
    }

    /**
     * Prikaži sve porudžbine (samo admin)
     */
    public function allOrders()
    {
        $orders = Order::with(['buyer', 'seller', 'products'])
                      ->paginate(15);
        
        return response()->json($orders);
    }

    /**
     * Statistike (samo admin)
     */
    public function stats()
    {
        $stats = [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'users_by_role' => [
                'admin' => User::where('role', 'admin')->count(),
                'moderator' => User::where('role', 'moderator')->count(),
                'user' => User::where('role', 'user')->count(),
            ],
            'active_products' => Product::where('status', 'active')->count(),
            'pending_products' => Product::where('status', 'pending')->count(),
        ];

        return response()->json($stats);
    }
}
