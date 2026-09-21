const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/auth/login - Authenticate user by email
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let query = "SELECT * FROM users WHERE email = ?";
    const params = [email.trim().toLowerCase()];

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials or user not found" });
    }

    const user = rows[0];

    // Fetch related profile based on role
    let profile = null;
    if (user.role === "PATIENT") {
      const [patients] = await db.execute("SELECT * FROM patients WHERE user_id = ?", [user.user_id]);
      profile = patients[0] || null;
    } else if (user.role === "DOCTOR") {
      const [doctors] = await db.execute("SELECT * FROM doctors WHERE user_id = ?", [user.user_id]);
      profile = doctors[0] || null;
    }

    res.json({
      message: "Login successful",
      user,
      profile,
    });
  } catch (error) {
    console.error("Auth login error:", error);
    res.status(500).json({ error: "Database error during login", details: error.message });
  }
});

// POST /api/auth/register - Register new patient
router.post("/register", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, phone, date_of_birth, gender, address } = req.body;

    if (!name || !email) {
      await connection.rollback();
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email already exists
    const [existing] = await connection.execute("SELECT user_id FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // Insert user
    const [userResult] = await connection.execute(
      "INSERT INTO users (name, email, phone, role, created_at) VALUES (?, ?, ?, 'PATIENT', NOW())",
      [name.trim(), email.trim().toLowerCase(), phone || ""]
    );
    const userId = userResult.insertId;

    // Insert patient profile
    const [patientResult] = await connection.execute(
      "INSERT INTO patients (user_id, date_of_birth, gender, address) VALUES (?, ?, ?, ?)",
      [userId, date_of_birth || "1995-01-01", gender || "Other", address || ""]
    );
    const patientId = patientResult.insertId;

    // Insert welcome notification
    await connection.execute(
      "INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES (?, ?, 'system', FALSE, NOW())",
      [userId, "Welcome to MediConnect! Your patient portal account has been provisioned."]
    );

    await connection.commit();

    res.status(201).json({
      message: "Registration successful",
      user: {
        user_id: userId,
        name,
        email,
        phone,
        role: "PATIENT",
      },
      patient: {
        patient_id: patientId,
        user_id: userId,
        date_of_birth,
        gender,
        address,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Auth register error:", error);
    res.status(500).json({ error: "Failed to register patient", details: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
