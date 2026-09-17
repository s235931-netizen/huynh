const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3157;

const connectToMongoDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI is not configured. Continuing without MongoDB.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.log("MongoDB connection error:", err.message);
    }
};

connectToMongoDB();

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello from Backend Docker!"
    });
});

app.get("/api/students", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Nguyen Van A"
        },
        {
            id: 2,
            name: "Tran Thi B"
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});