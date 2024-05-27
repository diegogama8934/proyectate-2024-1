import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);

// Routes
app.get("/", (req, res) => {
    res.send("API Proyectate 2024");
});

// Conexión a mongo
mongoose
    .connect(process.env.DATABASE_URL || "")
    .then(() => console.log("Conectado a Mongo Atlas"))
    .catch((error) => console.error(error));

app.listen(port, () => {
    console.log("Server running on port ", port);
    console.log("localhost:", port);
});
