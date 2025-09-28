<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['user', 'categories']);

        // Filtriranje
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('category_id')) {
            $query->byCategory($request->category_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Pretraga
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sortiranje
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);
 
        // Paginacija
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Proveri da li je korisnik admin ili moderator
        if (!in_array($user->role, ['admin', 'moderator'])) {
            return response()->json(['message' => 'Samo admin i moderator mogu da dodaju proizvode'], 403);
        } 

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $data['user_id'] = $user->id;
        $data['status'] = 'active';

        // Upload slike
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        // Povezivanje sa kategorijama
        if (isset($data['category_ids'])) {
            $product->categories()->attach($data['category_ids']);
        }

        return response()->json($product->load('categories'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['user', 'categories']));
    }

    public function update(Request $request, Product $product)
    {
        $user = $request->user();
        
        // Proveri da li je korisnik vlasnik proizvoda ILI admin/moderator
        if ($product->user_id !== $user->id && !in_array($user->role, ['admin', 'moderator'])) {
            return response()->json(['message' => 'Nemate dozvolu za izmenu ovog proizvoda'], 403);
        }

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'status' => 'sometimes|in:active,sold,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Upload nove slike
        if ($request->hasFile('image')) {
            // Obriši staru sliku
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        // Ažuriranje kategorija
        if (isset($data['category_ids'])) {
            $product->categories()->sync($data['category_ids']);
        }

        return response()->json($product->load('categories'));
    }

    public function destroy(Request $request, Product $product)
    {
        $user = $request->user();
        
        // Proveri da li je korisnik admin (samo admin može da briše)
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Samo admin može da briše proizvode'], 403);
        }

        // Obriši sliku
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Proizvod je uspešno obrisan']);
    }

    public function uploadImage(Request $request, Product $product)
    {
        $user = $request->user();
        
        if ($product->user_id !== $user->id && !in_array($user->role, ['admin', 'moderator'])) {
            return response()->json(['message' => 'Nemate dozvolu za upload slike'], 403);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Obriši staru sliku
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $imagePath = $request->file('image')->store('products', 'public');
        $product->update(['image_path' => $imagePath]);

        return response()->json([
            'message' => 'Slika je uspešno uploadovana',
            'image_path' => $imagePath,
            'image_url' => Storage::url($imagePath)
        ]);
    }

    public function search(Request $request)
    {
        $query = Product::with(['user', 'categories'])->active();

        if ($request->has('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $products = $query->paginate(12);

        return response()->json($products);
    }
}
