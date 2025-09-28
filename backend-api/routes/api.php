<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ModeratorController;
use App\Http\Controllers\CategoryController;

// Javni REST servisi (bez autentifikacije)
Route::get('/currency/convert', [CurrencyController::class, 'convert']); // Javni servis: Exchangerate.host

// Test ruta
Route::get('/test', function () {
    return response()->json(['message' => 'Laravel API radi!', 'timestamp' => now()]);
});

// Javni proizvodi (bez autentifikacije)
Route::get('/products', [ProductController::class, 'index']); // Lista proizvoda
Route::get('/products/{id}', [ProductController::class, 'show']); // Detalji proizvoda

// Javne kategorije (bez autentifikacije)
Route::get('/categories', [CategoryController::class, 'index']); // Lista kategorija

// Autentifikacija (javne rute)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Zaštićene rute (potrebna autentifikacija)
Route::middleware('auth:sanctum')->group(function () {
    // Autentifikacija
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Proizvodi - samo CREATE, UPDATE, DELETE (GET je javno)
    Route::post('/products', [ProductController::class, 'store']); // Kreiranje proizvoda
    Route::put('/products/{id}', [ProductController::class, 'update']); // Ažuriranje proizvoda
    Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Brisanje proizvoda
    
    // Porudžbine (Resource rute) - Osnovne operacije za e-trgovinu
    Route::get('/orders', [OrderController::class, 'index']); // Lista porudžbina
    Route::get('/orders/my-orders', [OrderController::class, 'myOrders']); // Moje porudžbine
    Route::post('/orders', [OrderController::class, 'store']); // Kreiranje porudžbine
    
    // Statistike za sve korisnike
    Route::get('/statistics', [OrderController::class, 'statistics']); // Lične statistike
});
 
// ADMIN RUTE (samo admin)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Upravljanje korisnicima
    Route::get('/users', [AdminController::class, 'users']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    
    // Upravljanje proizvodima
    Route::get('/products', [AdminController::class, 'allProducts']);
    
    // Upravljanje porudžbinama
    Route::get('/orders', [AdminController::class, 'allOrders']);
    
    // Statistike
    Route::get('/stats', [AdminController::class, 'stats']);
});

// MODERATOR RUTE (samo moderator)
Route::middleware(['auth:sanctum', 'role:moderator'])->prefix('moderator')->group(function () {
    // Moderiranje proizvoda
    Route::get('/products/pending', [ModeratorController::class, 'pendingProducts']);
    Route::put('/products/{id}/approve', [ModeratorController::class, 'approveProduct']);
    Route::put('/products/{id}/reject', [ModeratorController::class, 'rejectProduct']);
    Route::get('/products/rejected', [ModeratorController::class, 'rejectedProducts']);
    
    // Pregled korisnika
    Route::get('/users', [ModeratorController::class, 'users']);
    
    // Statistike
    Route::get('/stats', [ModeratorController::class, 'stats']);
});
