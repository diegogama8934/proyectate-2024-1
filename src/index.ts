import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3120;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", userRoutes);

// Connect to MongoDB Atlas
const mongoOptions: ConnectOptions = {};

app.get("/", (req, res) => {
  res.send("API Proyectate 2024");
});

mongoose
  .connect(process.env.DATABASE_URL, mongoOptions)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Connection error", error.message);
  });
