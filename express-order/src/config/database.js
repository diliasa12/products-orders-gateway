import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DB_NAME || "order_db", "root", "", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
  dialectOptions: {
    database: process.env.DB_NAME || "order_db",
  },
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
