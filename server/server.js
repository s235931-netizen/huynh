const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Student = require("./models/Student");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

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

app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({
            message: "Lỗi lấy danh sách sinh viên",
            error: err.message
        });
    }
});
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({
            message: "Lỗi thêm sinh viên",
            error: err.message
        });
    }
});
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);
    } catch (err) {
        res.status(400).json({
            message: "Lỗi cập nhật sinh viên",
            error: err.message
        });
    }
});
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công",
            student
        });
    } catch (err) {
        res.status(400).json({
            message: "Lỗi xóa sinh viên",
            error: err.message
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
