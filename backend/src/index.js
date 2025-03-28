import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" })); // Increase the limit to 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
server.use(
  cors({
    origin: "http://localhost:5173" || "http://localhost:5174",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT || 5000, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
