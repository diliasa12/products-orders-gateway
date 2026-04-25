<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductSeeder extends Seeder
{
  public function run(): void
  {
    $products = [
      [
        'name'        => 'Laptop ASUS VivoBook 15',
        'sku'         => 'ASUS-VB15-001',
        'description' => 'Laptop ringan untuk kerja sehari-hari, Intel Core i5, RAM 8GB, SSD 512GB',
        'price'       => 7500000,
        'stock'       => 25,
        'category'    => 'Elektronik',
        'unit'        => 'pcs',
        'is_active'   => true,
      ],
      [
        'name'        => 'Mouse Wireless Logitech M185',
        'sku'         => 'LOG-M185-BLK',
        'description' => 'Mouse wireless ergonomis, daya tahan baterai 12 bulan',
        'price'       => 195000,
        'stock'       => 100,
        'category'    => 'Aksesori Komputer',
        'unit'        => 'pcs',
        'is_active'   => true,
      ],
      [
        'name'        => 'Keyboard Mechanical Keychron K2',
        'sku'         => 'KEY-K2-RGB',
        'description' => 'Keyboard mechanical TKL dengan backlight RGB, switch Gateron Red',
        'price'       => 1350000,
        'stock'       => 40,
        'category'    => 'Aksesori Komputer',
        'unit'        => 'pcs',
        'is_active'   => true,
      ],
    ];

    DB::table('products')->insert(array_map(function ($p) {
      return array_merge($p, [
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
      ]);
    }, $products));

    echo "✅ " . count($products) . " produk berhasil di-seed.\n";
  }
}
