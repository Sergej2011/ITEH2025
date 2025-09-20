<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        return response()->json($category->loadCount('products'));
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $category->update($data);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Kategorija je uspešno obrisana']);
    }

    public function products(Category $category, Request $request)
    {
        $query = $category->products()->with(['user', 'categories']);

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

        // Sortiranje
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $products = $query->paginate(12);

        return response()->json($products);
    }
}
