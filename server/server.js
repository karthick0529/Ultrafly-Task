const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/studentDB")
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Define Schema and Model
const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: Number,
  class: String,
  marks: Number,
  grade: String,
});

const Student = mongoose.model("Student", studentSchema);

// CRUD Operations

// Create a new student
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: "Error creating student", details: err.message });
  }
});

// Get all students (with optional search filters)
app.get("/students", async (req, res) => {
  try {
    const { grade, marks } = req.query;
    const filter = {};
    if (grade) filter.grade = grade;
    if (marks) filter.marks = { $gte: marks };
    const students = await Student.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching students", details: err.message });
  }
});

// Update a student
app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Error updating student", details: err.message });
  }
});

// Delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting student", details: err.message });
  }
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
