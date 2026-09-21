const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    console.error("Fetch contact messages error:", error);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Name, email, subject, and message are required" });
    }
    const [result] = await db.execute(
      "INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim()]
    );
    const [rows] = await db.execute("SELECT * FROM contact_messages WHERE message_id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create contact message error:", error);
    res.status(500).json({ error: "Failed to send contact message" });
  }
});

module.exports = router;
