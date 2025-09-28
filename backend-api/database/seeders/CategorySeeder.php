<?php

namespace Database\Seeders;
 
use App\Models\Category;
use Illuminate\Database\Seeder;
 
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Elektronika', 'slug' => 'elektronika', 'description' => 'Mobilni telefoni, laptopovi, tableti i ostala elektronika'],
            ['name' => 'Odeća i obuća', 'slug' => 'odeca-obuca', 'description' => 'Muška, ženska i dečja odeća i obuća'],
            ['name' => 'Kuća i bašta', 'slug' => 'kuca-basta', 'description' => 'Nameštaj, dekoracija, bašta i kućni potrepštaj'],
            ['name' => 'Automobili', 'slug' => 'automobili', 'description' => 'Automobili, motocikli i delovi'],
            ['name' => 'Sport i rekreacija', 'slug' => 'sport-rekreacija', 'description' => 'Sportska oprema, bicikli, fitness'],
            ['name' => 'Knjige i mediji', 'slug' => 'knjige-mediji', 'description' => 'Knjige, filmovi, muzika, video igre'],
            ['name' => 'Ljubimci', 'slug' => 'ljubimci', 'description' => 'Hrana, igračke i oprema za ljubimce'],
            ['name' => 'Kolekcionarstvo', 'slug' => 'kolekcionarstvo', 'description' => 'Antikviteti, umetnička dela, kovanice'],
            ['name' => 'Ostalo', 'slug' => 'ostalo', 'description' => 'Sve ostalo što ne spada u prethodne kategorije'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
