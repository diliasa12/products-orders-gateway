import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    order_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "Array of ordered items [{product_id, name, qty, price}]",
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.ENUM("transfer", "cod", "ewallet", "credit_card"),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["customer_email"] },
      { fields: ["order_number"], unique: true },
    ],
  },
);

export default Order;
