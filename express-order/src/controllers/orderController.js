import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Order from "../models/Order.js";
const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Order.count();
  const seq = String(count + 1).padStart(4, "0");
  return `ORD-${year}-${seq}`;
};

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: "Validasi gagal",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return false;
  }
  return true;
};

export const index = async (req, res, next) => {
  try {
    const {
      status,
      payment_method,
      search,
      sort_by = "created_at",
      sort_order = "DESC",
      page = 1,
      per_page = 15,
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (payment_method) where.payment_method = payment_method;
    if (search) {
      where[Op.or] = [
        { order_number: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_email: { [Op.like]: `%${search}%` } },
      ];
    }

    const allowedSorts = [
      "id",
      "order_number",
      "total_amount",
      "status",
      "created_at",
    ];
    const orderBy = allowedSorts.includes(sort_by) ? sort_by : "created_at";
    const orderDir = sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const limit = Math.min(parseInt(per_page) || 15, 100);
    const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where,
      order: [[orderBy, orderDir]],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "Data order berhasil diambil",
      data: rows,
      meta: {
        current_page: parseInt(page) || 1,
        per_page: limit,
        total: count,
        last_page: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order dengan ID ${req.params.id} tidak ditemukan`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Detail order berhasil diambil",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  if (!handleValidation(req, res)) return;

  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      payment_method,
      notes,
    } = req.body;

    const total_amount = items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0,
    );

    const order_number = await generateOrderNumber();

    const order = await Order.create({
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      total_amount,
      payment_method,
      notes: notes || null,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  if (!handleValidation(req, res)) return;

  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order dengan ID ${req.params.id} tidak ditemukan`,
      });
    }

    if (
      ["delivered", "cancelled"].includes(order.status) &&
      req.body.status !== undefined
    ) {
      return res.status(422).json({
        success: false,
        message: `Order dengan status '${order.status}' tidak dapat diubah`,
      });
    }

    const allowedFields = [
      "customer_name",
      "customer_email",
      "customer_phone",
      "shipping_address",
      "items",
      "payment_method",
      "status",
      "notes",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (updateData.items) {
      updateData.total_amount = updateData.items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0,
      );
    }

    await order.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Order berhasil diupdate",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order dengan ID ${req.params.id} tidak ditemukan`,
      });
    }

    if (order.status !== "pending") {
      return res.status(422).json({
        success: false,
        message: `Hanya order berstatus 'pending' yang dapat dihapus. Status saat ini: '${order.status}'`,
      });
    }

    await order.destroy();

    return res.status(200).json({
      success: true,
      message: `Order '${order.order_number}' berhasil dihapus`,
    });
  } catch (error) {
    next(error);
  }
};
