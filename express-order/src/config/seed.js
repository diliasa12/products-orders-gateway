import mysql from "mysql2/promise";
import "dotenv/config";

const DB_NAME = process.env.DB_NAME || "order_db";

const conn = await mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: DB_NAME,
  multipleStatements: true,
});

const orders = [
  {
    order_number: "ORD-2024-0001",
    customer_name: "Budi Santoso",
    customer_email: "budi@example.com",
    customer_phone: "081234567890",
    shipping_address: "Jl. Merdeka No. 10, Jakarta Pusat",
    items: JSON.stringify([
      {
        product_id: 1,
        name: "Laptop ASUS VivoBook 15",
        qty: 1,
        price: 7500000,
      },
      {
        product_id: 2,
        name: "Mouse Wireless Logitech M185",
        qty: 2,
        price: 195000,
      },
    ]),
    total_amount: 7890000,
    status: "pending",
    payment_method: "transfer",
    notes: "Mohon dikemas dengan bubble wrap",
  },
  {
    order_number: "ORD-2024-0002",
    customer_name: "Siti Rahayu",
    customer_email: "siti@example.com",
    customer_phone: "082345678901",
    shipping_address: "Jl. Sudirman No. 45, Bandung",
    items: JSON.stringify([
      {
        product_id: 3,
        name: "Keyboard Mechanical Keychron K2",
        qty: 1,
        price: 1350000,
      },
    ]),
    total_amount: 1350000,
    status: "processing",
    payment_method: "cod",
    notes: null,
  },
  {
    order_number: "ORD-2024-0003",
    customer_name: "Ahmad Fauzi",
    customer_email: "ahmad@example.com",
    customer_phone: "083456789012",
    shipping_address: "Jl. Diponegoro No. 88, Surabaya",
    items: JSON.stringify([
      { product_id: 4, name: 'Monitor LG 24" IPS FHD', qty: 1, price: 2200000 },
      { product_id: 5, name: "Kertas HVS A4 80gsm", qty: 5, price: 58000 },
    ]),
    total_amount: 2490000,
    status: "shipped",
    payment_method: "transfer",
    notes: "Kirim ke kantor, jam kerja 08.00-17.00",
  },
  {
    order_number: "ORD-2024-0004",
    customer_name: "Dewi Lestari",
    customer_email: "dewi@example.com",
    customer_phone: "084567890123",
    shipping_address: "Jl. Gajah Mada No. 12, Semarang",
    items: JSON.stringify([
      { product_id: 6, name: "Pulpen Pilot G2 0.5mm", qty: 3, price: 72000 },
    ]),
    total_amount: 216000,
    status: "delivered",
    payment_method: "ewallet",
    notes: null,
  },
];

for (const order of orders) {
  await conn.execute(
    `INSERT INTO orders 
      (order_number, customer_name, customer_email, customer_phone, shipping_address, items, total_amount, status, payment_method, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.order_number,
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.shipping_address,
      order.items,
      order.total_amount,
      order.status,
      order.payment_method,
      order.notes,
    ],
  );
}

console.log(`${orders.length} order berhasil di-seed.`);
await conn.end();
process.exit(0);
