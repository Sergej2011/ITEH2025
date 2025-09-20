<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Message;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
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

        // Kreiraj 30 različitih proizvoda sa sličnim kategorijama
        $products = [
            // TELEFONI (5 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'iPhone 14 Pro',
                'description' => 'Najnoviji iPhone sa Dynamic Island. 128GB, odlično stanje.',
                'price' => 95000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1592899677977-9c10b588e483?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Samsung Galaxy S23',
                'description' => 'Android flagship telefon sa odličnom kamerom. 256GB.',
                'price' => 75000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Google Pixel 7',
                'description' => 'Google telefon sa najboljom kamerom. 128GB, malo korišćen.',
                'price' => 55000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80'
            ],
            [ 
                'user_id' => $user2->id,
                'title' => 'OnePlus 11',
                'description' => 'Brzi Android telefon sa 120Hz ekranom. 256GB.',
                'price' => 65000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Xiaomi 13 Pro',
                'description' => 'Kineski flagship sa odličnim performansama. 512GB.',
                'price' => 60000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80'
            ],

            // LAPTOPI (5 proizvoda)
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
                'image_path' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'HP Spectre x360',
                'description' => '2-in-1 laptop sa touch screen-om. Intel i5, 8GB RAM.',
                'price' => 900.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Lenovo ThinkPad X1',
                'description' => 'Poslovni laptop sa odličnom tastaturom. Intel i7, 16GB.',
                'price' => 1100.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'ASUS ROG Strix',
                'description' => 'Gaming laptop sa RTX 3070. AMD Ryzen 7, 32GB RAM.',
                'price' => 1500.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&q=80'
            ],

            // SLUŠALICE (4 proizvoda)
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
                'title' => 'Bose QuietComfort 45',
                'description' => 'Premium slušalice sa aktivnim prigušivanjem buke.',
                'price' => 250.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Apple AirPods Pro 2',
                'description' => 'Bežične slušalice sa noise cancellation. H1 čip.',
                'price' => 22000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Sennheiser HD 660S',
                'description' => 'Profesionalne slušalice za audiofil. Otvoreni dizajn.',
                'price' => 400.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&q=80'
            ],

            // TABLETI (3 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'iPad Pro 12.9"',
                'description' => 'Najveći iPad sa M2 čipom. 256GB, WiFi + Cellular.',
                'price' => 800.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Samsung Galaxy Tab S8',
                'description' => 'Android tablet sa S Pen-om. 128GB, odličan za crtanje.',
                'price' => 600.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Microsoft Surface Pro 9',
                'description' => '2-in-1 tablet sa Windows 11. Intel i5, 8GB RAM.',
                'price' => 1000.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&q=80'
            ],

            // GAMING (4 proizvoda)
            [
                'user_id' => $user2->id,
                'title' => 'PlayStation 5',
                'description' => 'Sony gaming konzola sa 3D audio. U originalnoj kutiji.',
                'price' => 60000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Xbox Series X',
                'description' => 'Microsoft gaming konzola. 1TB SSD, 4K gaming.',
                'price' => 55000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Nintendo Switch OLED',
                'description' => 'Nintendo konzola sa OLED ekranom. 64GB, sa 3 igre.',
                'price' => 35000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Steam Deck 64GB',
                'description' => 'Valve handheld gaming PC. Linux OS, odličan za PC igre.',
                'price' => 45000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&q=80'
            ],

            // KAMERE (3 proizvoda)
            [
                'user_id' => $user2->id,
                'title' => 'Canon EOS R5',
                'description' => 'Profesionalna mirrorless kamera. 45MP, 8K video.',
                'price' => 2500.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Sony A7 IV',
                'description' => 'Full-frame mirrorless kamera. 33MP, odlična za video.',
                'price' => 2000.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Fujifilm X-T5',
                'description' => 'APS-C mirrorless kamera. 40MP, retro dizajn.',
                'price' => 1500.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80'
            ],

            // PAMETNI SATOVI (3 proizvoda)
            [
                'user_id' => $user1->id,
                'title' => 'Apple Watch Series 8',
                'description' => 'Najnoviji Apple sat sa EKG funkcijom. 45mm, GPS.',
                'price' => 40000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Samsung Galaxy Watch 5',
                'description' => 'Android sat sa zdravstvenim funkcijama. 44mm, LTE.',
                'price' => 30000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Garmin Fenix 7',
                'description' => 'Outdoor sat sa GPS-om. Solar charging, 47mm.',
                'price' => 50000.00,
                'currency' => 'RSD',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop&q=80'
            ],

            // KUĆNI APARATI (3 proizvoda)
            [
                'user_id' => $user2->id,
                'title' => 'Dyson V15 Detect',
                'description' => 'Najnoviji usisivač sa laser detekcijom prašine.',
                'price' => 500.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user1->id,
                'title' => 'Roomba i7+',
                'description' => 'Pametni robot usisivač sa automatskim pražnjenjem.',
                'price' => 600.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&q=80'
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Philips Airfryer XXL',
                'description' => 'Veliki air fryer za zdravu pripremu hrane. 6.2L.',
                'price' => 200.00,
                'currency' => 'EUR',
                'status' => 'active',
                'image_path' => 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&q=80'
            ]
        ];

        $createdProducts = [];
        foreach ($products as $productData) {
            $createdProducts[] = Product::create($productData);
        }

        // Poveži proizvode sa kategorijama
        $electronics = Category::where('slug', 'elektronika')->first();
        $computers = Category::where('slug', 'racunari')->first();
        $phones = Category::where('slug', 'telefoni')->first();
        $gaming = Category::where('slug', 'igrice')->first();
        
        // Poveži proizvode sa kategorijama
        if ($electronics) {
            $createdProducts[0]->categories()->attach($electronics->id); // iPhone
            $createdProducts[2]->categories()->attach($electronics->id); // Samsung
            $createdProducts[4]->categories()->attach($electronics->id); // Sony slušalice
            $createdProducts[6]->categories()->attach($electronics->id); // Nintendo
            $createdProducts[8]->categories()->attach($electronics->id); // Apple Watch
            $createdProducts[10]->categories()->attach($electronics->id); // PlayStation
            $createdProducts[11]->categories()->attach($electronics->id); // Bose slušalice
        }
        
        if ($computers) {
            $createdProducts[1]->categories()->attach($computers->id); // MacBook
            $createdProducts[3]->categories()->attach($computers->id); // Dell XPS
            $createdProducts[5]->categories()->attach($computers->id); // iPad
        }
        
        if ($phones) {
            $createdProducts[0]->categories()->attach($phones->id); // iPhone
            $createdProducts[2]->categories()->attach($phones->id); // Samsung
        }
        
        if ($gaming) {
            $createdProducts[6]->categories()->attach($gaming->id); // Nintendo
            $createdProducts[10]->categories()->attach($gaming->id); // PlayStation
        }

        // Kreiraj test porudžbine
        $orders = [
            [
                'buyer_id' => $user2->id,
                'seller_id' => $user1->id,
                'product_id' => $createdProducts[0]->id, // iPhone
                'status' => 'pending',
                'total_amount' => 80000.00,
                'total_in_rsd' => 80000.00,
                'currency' => 'RSD',
                'notes' => 'Interesuje me iPhone 13 Pro'
            ],
            [
                'buyer_id' => $user1->id,
                'seller_id' => $user2->id,
                'product_id' => $createdProducts[1]->id, // MacBook
                'status' => 'confirmed',
                'total_amount' => 1200.00,
                'total_in_rsd' => 1200.00,
                'currency' => 'EUR',
                'notes' => 'MacBook za posao'
            ]
        ];

        foreach ($orders as $orderData) {
            Order::create($orderData);
        }

        // Kreiraj test poruke
        $messages = [
            [
                'sender_id' => $user2->id,
                'receiver_id' => $user1->id,
                'product_id' => $createdProducts[0]->id, // iPhone
                'subject' => 'Pitanje o iPhone-u',
                'body' => 'Da li je iPhone još uvek dostupan? Možete li mi poslati još slika?',
                'is_read' => false
            ],
            [
                'sender_id' => $user1->id,
                'receiver_id' => $user2->id,
                'product_id' => $createdProducts[1]->id, // MacBook
                'subject' => 'MacBook Air M1',
                'body' => 'Interesuje me MacBook. Da li je u garanciji?',
                'is_read' => true
            ],
            [
                'sender_id' => $user2->id,
                'receiver_id' => $user1->id,
                'product_id' => $createdProducts[6]->id, // Nintendo Switch
                'subject' => 'Nintendo Switch',
                'body' => 'Koje igre su uključene u cenu?',
                'is_read' => false
            ]
        ];

        foreach ($messages as $messageData) {
            Message::create($messageData);
        }
    }
}
