const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    const [rows] = await db.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const [result] = await db.execute(
      "UPDATE notifications SET is_read = TRUE WHERE notification_id = ?",
      [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

router.put("/read-all/:userId", async (req, res) => {
  try {
    await db.execute("UPDATE notifications SET is_read = TRUE WHERE user_id = ?", [req.params.userId]);
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

module.exports = router;
