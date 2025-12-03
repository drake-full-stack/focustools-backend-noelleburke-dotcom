require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models
const Task = require("./models/Task");
const Session = require("./models/Session");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "FocusTools API",
    status: "Running",
    endpoints: {
      tasks: "/api/tasks",
      sessions: "/api/sessions",
    },
  });
});

// TODO: Add your Task routes here
//POST /api/tasks
app.post("/api/tasks", async (req,res)=>{
try{
   const newTask= new Task(req.body);
   const savedTask= await newTask.save();
   res.status(201).json(savedTask);
} catch (error){
  res.status(400).json({ message: error.message });
}
});



//GET /api/tasks
app.get("/api/tasks", async(req,res)=>{
try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET /api/tasks/:id
app.get("/api/tasks/id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!Task) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/tasks/:id
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, // Which book to update
      req.body, // New data
      {
        new: true, // Return updated version
        runValidators: true, // Check schema rules
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
      Task: deletedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// TODO: Add your Session routes here
// POST /api/sessions
app.post("/api/sessions", async (req, res) => {
  try {
    const newSession = await Session.create(req.body);
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// GET /api/sessions
app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await Session.find().populate("taskId");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
