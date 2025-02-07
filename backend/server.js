const express = require("express");
const { createClient } = require("supabase");
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const supabase = createClient(
  'https://qcrxolzcxulhkunwonuv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjcnhvbHpjeHVsaGt1bndvbnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NTgyMzAsImV4cCI6MjA1NDUzNDIzMH0.dxV-ZtkAGRC50PRQcDB6qmZQoJg0rs46QG3wl6SIMjE'
);

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ tasks: data });
  }
});

// POST a new task
app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title }]);

  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ task: data[0] });
  }
});

// DELETE a task
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ task: data });
  }
});

// PUT to mark task as completed
app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ task: data });
  }
});

app.listen(5000, () => {
  console.log("Backend is running on port 5000");
});
