import "dotenv/config";
import express from "express";
import sequelize from "./config/database.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.APP_PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.get("/", (req, res) => {
  res.json({
    service: "Express Order Management Service",
    version: "1.0.0",
    status: "running",
  });
});

app.use("/api/v1/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' tidak ditemukan`,
  });
});

app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => {
    console.log("Koneksi database berhasil.");
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log(`API tersedia di http://localhost:${PORT}/api/v1/orders`);
    });
  })
  .catch((err) => {
    console.error("Gagal koneksi database:", err.message);
    process.exit(1);
  });

export default app;
