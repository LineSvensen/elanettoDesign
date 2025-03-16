import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const connectDB = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    });

    console.log("MySQL database connected successfully.");
    return db;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

let db: mysql.Connection;

(async () => {
  db = await connectDB();
})();

// Basic API Route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Example route: Get all stickers
app.get("/api/stickers", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute("SELECT * FROM stickers");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stickers." });
  }
});

// Example route: Create a new sticker
app.post("/api/stickers", async (req: Request, res: Response) => {
  const {
    title,
    description,
    image_url,
    image_alt,
    category,
    stock_quantity,
    price,
    discount,
  } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO stickers (title, description, image_url, image_alt, category, stock_quantity, price, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        image_url,
        image_alt,
        category,
        stock_quantity,
        price,
        discount,
      ]
    );
    res.status(201).json({ message: "Sticker created successfully", id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create sticker." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
