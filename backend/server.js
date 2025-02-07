const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Supabase Client (API Keys Kept Intact)
const supabase = createClient(
  "https://qcrxolzcxulhkunwonuv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjcnhvbHpjeHVsaGt1bndvbnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NTgyMzAsImV4cCI6MjA1NDUzNDIzMH0.dxV-ZtkAGRC50PRQcDB6qmZQoJg0rs46QG3wl6SIMjE"
);

// ✅ Test Route (Check if Backend is Running)
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is working!" });
});

// ✅ Fetch All Tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) throw error;
    res.status(200).json({ tasks: data });
  } catch (error) {
    console.error("❌ GET /api/tasks Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add a New Task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Task title is required" });

    const { data, error } = await supabase.from("tasks").insert([{ title }]);
    if (error) throw error;
    res.status(201).json({ task: data[0] });
  } catch (error) {
    console.error("❌ POST /api/tasks Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a Task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
    res.status(200).json({ message: "Task deleted", task: data });
  } catch (error) {
    console.error("❌ DELETE /api/tasks Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Task Completion Status
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const { data, error } = await supabase.from("tasks").update({ completed }).eq("id", id);
    if (error) throw error;
    res.status(200).json({ message: "Task updated", task: data });
  } catch (error) {
    console.error("❌ PUT /api/tasks Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});
