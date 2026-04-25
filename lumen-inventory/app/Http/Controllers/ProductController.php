<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        $query = Product::query();


        if ($request->has('category')) {
            $query->where('category', $request->category);
        }


        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }


        if ($request->boolean('in_stock')) {
            $query->inStock();
        }


        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }


        $sortBy    = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['name', 'price', 'stock', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }


        $perPage = min((int) $request->get('per_page', 15), 100);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data produk berhasil diambil',
            'data'    => $products->items(),
            'meta'    => [
                'current_page' => $products->currentPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
                'last_page'    => $products->lastPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => "Produk dengan ID {$id} tidak ditemukan",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail produk berhasil diambil',
            'data'    => $product,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $this->validate($request, [
                'name'        => 'required|string|max:255',
                'sku'         => 'required|string|max:100|unique:products,sku',
                'description' => 'nullable|string',
                'price'       => 'required|numeric|min:0',
                'stock'       => 'required|integer|min:0',
                'category'    => 'required|string|max:100',
                'unit'        => 'required|string|max:50',
                'is_active'   => 'nullable|boolean',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $e->errors(),
            ], 422);
        }

        $product = Product::create([
            'name'        => $request->name,
            'sku'         => strtoupper($request->sku),
            'description' => $request->description,
            'price'       => $request->price,
            'stock'       => $request->stock,
            'category'    => $request->category,
            'unit'        => $request->unit,
            'is_active'   => $request->get('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dibuat',
            'data'    => $product,
        ], 201);
    }


    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => "Produk dengan ID {$id} tidak ditemukan",
            ], 404);
        }

        try {
            $this->validate($request, [
                'name'        => 'sometimes|string|max:255',
                'sku'         => "sometimes|string|max:100|unique:products,sku,{$id}",
                'description' => 'nullable|string',
                'price'       => 'sometimes|numeric|min:0',
                'stock'       => 'sometimes|integer|min:0',
                'category'    => 'sometimes|string|max:100',
                'unit'        => 'sometimes|string|max:50',
                'is_active'   => 'sometimes|boolean',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $e->errors(),
            ], 422);
        }

        $product->fill($request->only([
            'name',
            'sku',
            'description',
            'price',
            'stock',
            'category',
            'unit',
            'is_active',
        ]));

        if ($request->has('sku')) {
            $product->sku = strtoupper($request->sku);
        }

        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diupdate',
            'data'    => $product->fresh(),
        ]);
    }



    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => "Produk dengan ID {$id} tidak ditemukan",
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => "Produk '{$product->name}' berhasil dihapus",
        ]);
    }
}
