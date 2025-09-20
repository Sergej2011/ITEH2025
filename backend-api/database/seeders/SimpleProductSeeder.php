<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Hash;

class SimpleProductSeeder extends Seeder
{
    public function run(): void
    {
        // Kreiraj test korisnike
        $user1 = User::updateOrCreate(
            ['email' => 'test1@example.com'],
            [
                'name' => 'Test Korisnik 1',
                'password' => Hash::make('password123'),
                'phone' => '123456789',
                'role' => 'user'
            ]
        );
 
        $user2 = User::updateOrCreate(
            ['email' => 'test2@example.com'],
            [
                'name' => 'Test Korisnik 2',
                'password' => Hash::make('password123'),
                'phone' => '987654321',
                'role' => 'user'
            ]
        );

        // Kreiraj admin korisnika
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('admin123'),
                'phone' => '111111111',
                'role' => 'admin'
            ]
        );

        // Kreiraj moderator korisnika
        $moderator = User::updateOrCreate(
            ['email' => 'moderator@example.com'],
            [
                'name' => 'Moderator',
                'password' => Hash::make('moderator123'),
                'phone' => '222222222',
                'role' => 'moderator'
            ]
        );

        // Kreiraj 15 različitih proizvoda sa odgovarajućim slikama
        $products = [
            // TELEFONI (3 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'iPhone 14 Pro',
                'description' => 'Najnoviji iPhone sa Dynamic Island. 128GB, odlično stanje.',
                'price' => 95000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://img.ep-cdn.com/i/500/500/ev/evlyoktbfwhdzsxqpgun/apple-iphone-14-pro-512gb-crna-mobilni-telefon-cene.jpg'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Samsung Galaxy S23',
                'description' => 'Android flagship telefon sa odličnom kamerom. 256GB.',
                'price' => 75000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://www.dotmarket.rs/image/catalog/samsung-galaxy-s23-8-256gb-lavander-82583.jpg'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Google Pixel 7',
                'description' => 'Google telefon sa najboljom kamerom. 128GB, malo korišćen.',
                'price' => 55000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://www.telekoplus.com/repo/mobilni-telefoni/google/pixel-7-cena/images/google-pixel7-2.jpg'
            ],

            // LAPTOPI (3 proizvoda)
            [
                'user_id' => $user2->id,
                'title' => 'MacBook Pro M2',
                'description' => 'Apple laptop sa M2 čipom. 16GB RAM, 512GB SSD.',
                'price' => 1800.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Dell XPS 15',
                'description' => 'Premium laptop sa 4K ekranom. Intel i7, 16GB RAM.',
                'price' => 1200.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://img.ep-cdn.com/i/500/500/ky/kyovinqgecsrptawlxju/dell-xps-9520-15-12th-gen-intel-core-i7-12700h-16gb-512gb-ssd-nvidia-rtx-3050-ti-15-6-3-5k-oled-touch-screen-w11-laptop-cene.jpg'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'HP Spectre x360',
                'description' => '2-in-1 laptop sa touch screen-om. Intel i5, 8GB RAM.',
                'price' => 900.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://img.ep-cdn.com/i/500/500/mn/mnrughiesxbdjfaktoqy/hp-spectre-x360-13-aw2024na-2g2c2earabu-i7-13-w-laptop-cene.jpg'
            ],

            // SLUŠALICE (2 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'Sony WH-1000XM5',
                'description' => 'Najnovije noise cancelling slušalice. Odličan zvuk.',
                'price' => 30000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Apple AirPods Pro 2',
                'description' => 'Bežične slušalice sa aktivnim noise cancelling-om.',
                'price' => 25000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://img.ep-cdn.com/i/500/500/vx/vxndmpbagtsiwheufrjk/apple-airpods-pro2-mqd83zm-a-cene.jpg'
            ],

            // TABLETI (2 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'iPad Pro 12.9"',
                'description' => 'Apple tablet sa M2 čipom. 256GB, odličan za kreativne poslove.',
                'price' => 1000.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Samsung Galaxy Tab S8',
                'description' => 'Android tablet sa S Pen-om. 128GB, odličan za notiranje.',
                'price' => 600.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://m.media-amazon.com/images/I/715AVcfGf2L.jpg'
            ],

            // GAMING (2 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'PlayStation 5',
                'description' => 'Sony konzola sa 4K gaming-om. 825GB SSD, DualSense kontroler.',
                'price' => 500.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Nintendo Switch OLED',
                'description' => 'Nintendo konzola sa OLED ekranom. 64GB, portabilna.',
                'price' => 300.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://static01.galaxus.com/productimages/3/8/2/0/0/9/3/5/3/1/1/7/7/2/5/2/0/8/3/80de25f1-de9a-400d-88e8-ce698014bc69.jpg_720.jpeg'
            ],

            // KAMERE (2 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'Canon EOS R5',
                'description' => 'Profesionalna mirrorless kamera. 45MP, 8K video, RF mount.',
                'price' => 3000.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Sony A7 IV',
                'description' => 'Full-frame mirrorless kamera. 33MP, 4K video, E-mount.',
                'price' => 2500.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://fotodiskont.rs/media/catalogProduct/sonyAlphaA7Iv/a7%20IV%20001.jpg'
            ],

            // PAMETNI SATOVI (1 proizvod)
            [
                'user_id' => $user1->id,
                'title' => 'Apple Watch Series 8',
                'description' => 'Najnoviji Apple sat sa zdravstvenim funkcijama. 45mm, GPS.',
                'price' => 400.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop&q=80'
            ],

            [
                'user_id' => $user1->id,
                'title' => 'Hajdeda majica',
                'description' => 'Hajdeda majica od najfinijih materijala.',
                'price' => 40.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'http://localhost:8000/slike/viber_image_2025-09-18_23-02-32-204.jpg'

            ],
            

            [
                'user_id' => $user1->id,
                'title' => 'Hajdeda x Zrce majica',
                'description' => 'Hajdeda crna majica Zrce.',
                'price' => 40.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'http://localhost:8000/slike/viber_image_2025-09-18_23-06-20-143.jpg'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Hajdeda x Zrce majica',
                'description' => 'Hajdeda bela majica Zrce.',
                'price' => 40.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'http://localhost:8000/slike/viber_image_2025-09-18_23-06-20-356.jpg'
            ]

        ];

        // Obriši sve postojeće proizvode
        Product::truncate();

        // Uzmi kategorije
        $electronics = Category::where('slug', 'elektronika')->first();
        $clothing = Category::where('slug', 'odeca-obuca')->first();
        $home = Category::where('slug', 'kuca-basta')->first();
        $cars = Category::where('slug', 'automobili')->first();
        $sports = Category::where('slug', 'sport-rekreacija')->first();
        $books = Category::where('slug', 'knjige-mediji')->first();
        $pets = Category::where('slug', 'ljubimci')->first();
        $collectibles = Category::where('slug', 'kolekcionarstvo')->first();
        $other = Category::where('slug', 'ostalo')->first();

        // Kreiraj nove proizvode sa kategorijama
        foreach ($products as $index => $productData) {
            $product = Product::create($productData);
            
            // Dodaj kategorije na osnovu tipa proizvoda
            if ($index < 6) { // Telefoni i laptopovi
                $product->categories()->attach($electronics->id);
            } elseif ($index < 9) { // Automobili
                $product->categories()->attach($cars->id);
            } elseif ($index < 12) { // Sport oprema
                $product->categories()->attach($sports->id);
            } elseif ($index < 14) { // Kuća i bašta
                $product->categories()->attach($home->id);
            } elseif ($index < 15) { // Elektronika (Apple Watch)
                $product->categories()->attach($electronics->id);
            } else { // Hajdeda majice - odeća
                $product->categories()->attach($clothing->id);
            }
        }
    }
}
