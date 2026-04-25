import express from "express";
import { body } from "express-validator";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/orderController.js";

const router = express.Router();

const itemsRule = body("items")
  .isArray({ min: 1 })
  .withMessage("Items harus berupa array dan tidak boleh kosong")
  .custom((items) => {
    for (const item of items) {
      if (!item.product_id || !item.name || !item.qty || !item.price) {
        throw new Error(
          "Setiap item harus memiliki product_id, name, qty, dan price",
        );
      }
      if (item.qty < 1) throw new Error("Qty item minimal 1");
      if (item.price < 0) throw new Error("Price item tidak boleh negatif");
    }
    return true;
  });

const storeRules = [
  body("customer_name")
    .notEmpty()
    .withMessage("Nama customer wajib diisi")
    .isLength({ max: 255 }),
  body("customer_email")
    .notEmpty()
    .isEmail()
    .withMessage("Email customer tidak valid"),
  body("customer_phone")
    .notEmpty()
    .withMessage("Nomor telepon wajib diisi")
    .isLength({ max: 20 }),
  body("shipping_address")
    .notEmpty()
    .withMessage("Alamat pengiriman wajib diisi"),
  body("payment_method")
    .notEmpty()
    .isIn(["transfer", "cod", "ewallet", "credit_card"])
    .withMessage(
      "Metode pembayaran tidak valid. Pilih: transfer, cod, ewallet, credit_card",
    ),
  body("notes").optional().isString(),
  itemsRule,
];

const updateRules = [
  body("customer_name").optional().isLength({ max: 255 }),
  body("customer_email").optional().isEmail().withMessage("Email tidak valid"),
  body("customer_phone").optional().isLength({ max: 20 }),
  body("shipping_address").optional().isString(),
  body("payment_method")
    .optional()
    .isIn(["transfer", "cod", "ewallet", "credit_card"])
    .withMessage("Metode pembayaran tidak valid"),
  body("status")
    .optional()
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage(
      "Status tidak valid. Pilih: pending, processing, shipped, delivered, cancelled",
    ),
  body("notes").optional().isString(),
  body("items").optional().isArray({ min: 1 }),
];

router.get("/", index);

router.get("/:id", show);

router.post("/", storeRules, store);

router.put("/:id", updateRules, update);

router.delete("/:id", destroy);

export default router;
