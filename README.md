# Tugas 7 — Microservice dengan API Gateway

## Identitas

| Field     | Keterangan          |
| --------- | ------------------- |
| **Nama**  | MUHAMMAD ASSYA DILI |
| **NIM**   | 2410511078          |
| **Kelas** | B                   |

---

## Deskripsi Layanan

Proyek ini mengimplementasikan arsitektur **microservice** yang terdiri dari tiga komponen utama:

| Komponen              | Teknologi             | Port   | Deskripsi                                                    |
| --------------------- | --------------------- | ------ | ------------------------------------------------------------ |
| **API Gateway**       | Express.js            | `3000` | Pintu masuk utama, meneruskan request ke service yang sesuai |
| **Order Service**     | Express.js + MySQL    | `3001` | Mengelola data order pelanggan                               |
| **Inventory Service** | Laravel Lumen + MySQL | `3002` | Mengelola data produk & stok                                 |

Semua request dari client masuk melalui **API Gateway (port 3000)**, yang kemudian mem-proxy request ke service yang sesuai berdasarkan prefix URL.

```
Client
  │
  ▼
API Gateway (port 3000)
  ├── /api/v1/orders/*   →  Order Service (port 3001)
  └── /api/v1/products/* →  Inventory Service (port 3002)
```

---

## Daftar Endpoint

### Order Service — via Gateway `http://localhost:3000/api/v1/orders`

| #   | Method   | Endpoint             | Deskripsi                              |
| --- | -------- | -------------------- | -------------------------------------- |
| 1   | `GET`    | `/api/v1/orders`     | List semua order (filter & pagination) |
| 2   | `GET`    | `/api/v1/orders/:id` | Detail order berdasarkan ID            |
| 3   | `POST`   | `/api/v1/orders`     | Buat order baru                        |
| 4   | `PUT`    | `/api/v1/orders/:id` | Update order berdasarkan ID            |
| ✚   | `DELETE` | `/api/v1/orders/:id` | Hapus order (hanya status pending)     |

**Query Parameters GET `/orders`:**

| Parameter        | Contoh         | Keterangan                                             |
| ---------------- | -------------- | ------------------------------------------------------ |
| `status`         | `pending`      | Filter: pending/processing/shipped/delivered/cancelled |
| `payment_method` | `transfer`     | Filter: transfer/cod/ewallet/credit_card               |
| `search`         | `budi`         | Cari by order_number/nama/email                        |
| `sort_by`        | `total_amount` | Kolom pengurutan                                       |
| `sort_order`     | `asc`          | Arah urutan (asc/desc)                                 |
| `page`           | `1`            | Nomor halaman                                          |
| `per_page`       | `10`           | Jumlah data per halaman (max 100)                      |

**Body POST `/orders`:**

```json
{
  "customer_name": "Rina Wati",
  "customer_email": "rina@example.com",
  "customer_phone": "085678901234",
  "shipping_address": "Jl. Pahlawan No. 5, Yogyakarta",
  "payment_method": "ewallet",
  "notes": "Titipkan ke satpam jika tidak ada",
  "items": [
    {
      "product_id": 1,
      "name": "Laptop ASUS VivoBook 15",
      "qty": 1,
      "price": 7500000
    },
    {
      "product_id": 2,
      "name": "Mouse Logitech M185",
      "qty": 1,
      "price": 195000
    }
  ]
}
```

---

### Inventory Service — via Gateway `http://localhost:3000/api/v1/products`

| #   | Method   | Endpoint               | Deskripsi                               |
| --- | -------- | ---------------------- | --------------------------------------- |
| 1   | `GET`    | `/api/v1/products`     | List semua produk (filter & pagination) |
| 2   | `GET`    | `/api/v1/products/:id` | Detail produk berdasarkan ID            |
| 3   | `POST`   | `/api/v1/products`     | Buat produk baru                        |
| 4   | `PUT`    | `/api/v1/products/:id` | Update produk berdasarkan ID            |
| ✚   | `DELETE` | `/api/v1/products/:id` | Hapus produk (soft delete)              |

**Query Parameters GET `/products`:**

| Parameter    | Contoh       | Keterangan                       |
| ------------ | ------------ | -------------------------------- |
| `category`   | `Elektronik` | Filter berdasarkan kategori      |
| `is_active`  | `true`       | Filter produk aktif/nonaktif     |
| `in_stock`   | `true`       | Hanya produk yang masih ada stok |
| `search`     | `laptop`     | Cari by nama/SKU                 |
| `sort_by`    | `price`      | Kolom pengurutan                 |
| `sort_order` | `asc`        | Arah urutan (asc/desc)           |
| `page`       | `1`          | Nomor halaman                    |
| `per_page`   | `10`         | Jumlah data per halaman          |

**Body POST `/products`:**

```json
{
  "name": "SSD Samsung 870 EVO 1TB",
  "sku": "SAM-SSD-870-1TB",
  "description": "SSD SATA 2.5 inch, kecepatan baca 560MB/s",
  "price": 1450000,
  "stock": 50,
  "category": "Elektronik",
  "unit": "pcs"
}
```

---

## Cara Menjalankan

### Prasyarat

- Node.js >= 18
- PHP >= 8.1
- Composer
- MySQL >= 8.0

---

### 1. Clone & Install Dependencies

```bash
# Install semua dependencies Node.js (gateway + order service)
npm install
```

```bash
# Install dependencies Laravel Lumen
cd lumen-inventory
composer install
cd ..
```

---

### 2. Konfigurasi Environment

**Node.js (`.env` di root):**

```env
# Gateway
APP_PORT=3000

# Order Service
APP_NAME="Express Order Service"
APP_PORT=3001
APP_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=order_db
DB_USER=root
DB_PASS=


# Inventory Service URL (untuk gateway)
INVENTORY_SERVICE_URL=http://localhost:3002
```

**Laravel Lumen (`lumen-inventory/.env`):**

```env
APP_PORT=3002
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_db
DB_USERNAME=root
DB_PASSWORD=
```

---

### 3. Migrasi & Seed Database

```bash
# Order Service — buat tabel & isi data contoh
npm run migrate
npm run seed
```

```bash
# Inventory Service (Lumen)
cd lumen-inventory
php artisan migrate --seed
cd ..
```

---

### 4. Menjalankan Service

Buka **3 terminal terpisah**:

**Terminal 1 — Inventory Service (Lumen, port 3002):**

```bash
cd lumen-inventory
php -S localhost:3002 -t public
```

**Terminal 2 — Order Service (Express, port 3001):**

```bash
npm run express-order
```

**Terminal 3 — API Gateway (port 3000):**

```bash
npm run dev
```

---

### 5. Verifikasi

Buka browser atau Postman, akses:

```
GET http://localhost:3000/api/v1/orders
GET http://localhost:3000/api/v1/products
```

---

## Screenshot Postman

### Order Service

#### GET `/api/v1/orders` — List Semua Order

> ![GET orders](/screenshots/get-orders.png)

#### GET `/api/v1/orders/:id` — Detail Order

> ![GET ordersDetail](/screenshots/get-ordersById.png)

#### POST `/api/v1/orders` — Buat Order Baru

> ![POST orders](/screenshots/post-orders.png)

#### PUT `/api/v1/orders/:id` — Update Order

> ![PUT orders](/screenshots/update-orders.png)

#### DELETE `/api/v1/orders/:id` — Hapus Order

> ![DELETE orders](/screenshots/delete-orders.png)

---

### Inventory Service

#### GET `/api/v1/products` — List Semua Produk

> ![GET products](/screenshots/get-products.png)

#### GET `/api/v1/products/:id` — Detail Produk

> ![GET productsId](/screenshots/get-productsById.png)

#### POST `/api/v1/products` — Buat Produk Baru

> ![POST products](/screenshots/post-products.png)

#### PUT `/api/v1/products/:id` — Update Produk

> ![PUT products](/screenshots/put-products.png)

#### DELETE `/api/v1/products/:id` — Hapus Produk

> ![DELETE products](/screenshots/delete-products.png)

---

## Struktur Project

```
tugas-7/
├── README.md                          ← Dokumentasi ini
│
├── package.json                       ← Dependencies gateway + order service
├── .env                               ← Konfigurasi environment
│
├── gateway/                           ← API Gateway (port 3000)
│   └── src/
│       └── app.js
│
├── express-order/                     ← Order Service (port 3001)
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── database.js
│       │   ├── migrate.js
│       │   └── seed.js
│       ├── controllers/
│       │   └── orderController.js
│       ├── middleware/
│       │   └── errorHandler.js
│       └── routes/
│           └── orderRoutes.js
│
└── lumen-inventory/                   ← Inventory Service (port 3002)
    ├── app/
    │   ├── Http/Controllers/
    │   │   └── ProductController.php
    │   └── Models/
    │       └── Product.php
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    └── routes/
        └── api.php
```

---

## HTTP Status Codes

| Code  | Keterangan                       |
| ----- | -------------------------------- |
| `200` | OK — request berhasil            |
| `201` | Created — data berhasil dibuat   |
| `404` | Not Found — data tidak ditemukan |
| `422` | Unprocessable — validasi gagal   |
| `500` | Internal Server Error            |
