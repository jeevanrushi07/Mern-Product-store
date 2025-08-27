import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Production: serve frontend
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// ✅ Connect DB first, then start server
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("Server started at http://localhost:" + PORT);
	});
}).catch(err => {
	console.error("Failed to connect DB", err);
	process.exit(1);
});
