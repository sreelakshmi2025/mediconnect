const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM departments ORDER BY department_id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Fetch departments error:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { department_name, description, status = "ACTIVE", icon_name = "Stethoscope", head_doctor = null } = req.body;
    if (!department_name || !description) return res.status(400).json({ error: "Department name and description are required" });
    const [result] = await db.execute(
      "INSERT INTO departments (department_name, description, status, icon_name, head_doctor) VALUES (?, ?, ?, ?, ?)",
      [department_name.trim(), description.trim(), status, icon_name, head_doctor]
    );
    const [rows] = await db.execute("SELECT * FROM departments WHERE department_id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({ error: "Failed to create department" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { department_name, description, status, icon_name, head_doctor } = req.body;
    await db.execute(
      `UPDATE departments SET department_name = COALESCE(?, department_name), description = COALESCE(?, description),
       status = COALESCE(?, status), icon_name = COALESCE(?, icon_name), head_doctor = COALESCE(?, head_doctor)
       WHERE department_id = ?`,
      [department_name, description, status, icon_name, head_doctor, req.params.id]
    );
    res.json({ message: "Department updated successfully" });
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({ error: "Failed to update department" });
  }
});

module.exports = router;
