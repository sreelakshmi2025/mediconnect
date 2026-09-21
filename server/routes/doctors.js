const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/doctors - List all doctors with users and department info
router.get("/", async (req, res) => {
  try {
    const { department_id, status } = req.query;

    let query = `
      SELECT 
        d.*,
        u.name,
        u.email,
        u.phone,
        dept.department_name
      FROM doctors d
      JOIN users u ON d.user_id = u.user_id
      LEFT JOIN departments dept ON d.department_id = dept.department_id
      WHERE 1=1
    `;
    const params = [];

    if (department_id) {
      query += " AND d.department_id = ?";
      params.push(department_id);
    }
    if (status) {
      query += " AND d.status = ?";
      params.push(status);
    }

    query += " ORDER BY u.name ASC";

    const [rows] = await db.execute(query, params);

    const formatted = rows.map((r) => {
      let days = [];
      try {
        days = typeof r.available_days === "string" ? JSON.parse(r.available_days) : r.available_days || [];
      } catch (e) {
        days = r.available_days ? r.available_days.split(",") : [];
      }

      return {
        doctor_id: r.doctor_id,
        user_id: r.user_id,
        department_id: r.department_id,
        specialization: r.specialization,
        qualification: r.qualification,
        experience: r.experience,
        consultation_fee: r.consultation_fee,
        status: r.status,
        rating: r.rating,
        available_days: days,
        photo_url: r.photo_url,
        about: r.about,
        bio: r.bio || r.about,
        user: {
          user_id: r.user_id,
          name: r.name,
          email: r.email,
          phone: r.phone,
        },
        department: {
          department_id: r.department_id,
          department_name: r.department_name,
        },
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Fetch doctors error:", error);
    res.status(500).json({ error: "Failed to fetch doctors", details: error.message });
  }
});

// GET /api/doctors/:id - Single doctor
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        d.*,
        u.name,
        u.email,
        u.phone,
        dept.department_name
      FROM doctors d
      JOIN users u ON d.user_id = u.user_id
      LEFT JOIN departments dept ON d.department_id = dept.department_id
      WHERE d.doctor_id = ?
    `;
    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const r = rows[0];
    let days = [];
    try {
      days = typeof r.available_days === "string" ? JSON.parse(r.available_days) : r.available_days || [];
    } catch (e) {
      days = r.available_days ? r.available_days.split(",") : [];
    }

    // Also fetch upcoming schedules
    const [schedules] = await db.execute("SELECT * FROM doctor_schedules WHERE doctor_id = ? ORDER BY date ASC", [id]);

    res.json({
      doctor_id: r.doctor_id,
      user_id: r.user_id,
      department_id: r.department_id,
      specialization: r.specialization,
      qualification: r.qualification,
      experience: r.experience,
      consultation_fee: r.consultation_fee,
      status: r.status,
      rating: r.rating,
      available_days: days,
      photo_url: r.photo_url,
      about: r.about,
      bio: r.bio || r.about,
      user: {
        user_id: r.user_id,
        name: r.name,
        email: r.email,
        phone: r.phone,
      },
      department: {
        department_id: r.department_id,
        department_name: r.department_name,
      },
      schedules,
    });
  } catch (error) {
    console.error("Fetch doctor by ID error:", error);
    res.status(500).json({ error: "Failed to fetch doctor", details: error.message });
  }
});

// PUT /api/doctors/:id - Update doctor profile
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, qualification, experience, consultation_fee, status, available_days, photo_url, about, bio } = req.body;

    const daysJson = Array.isArray(available_days) ? JSON.stringify(available_days) : available_days;

    await db.execute(
      `UPDATE doctors SET 
        specialization = COALESCE(?, specialization),
        qualification = COALESCE(?, qualification),
        experience = COALESCE(?, experience),
        consultation_fee = COALESCE(?, consultation_fee),
        status = COALESCE(?, status),
        available_days = COALESCE(?, available_days),
        photo_url = COALESCE(?, photo_url),
        about = COALESCE(?, about),
        bio = COALESCE(?, bio)
      WHERE doctor_id = ?`,
      [specialization, qualification, experience, consultation_fee, status, daysJson, photo_url, about, bio, id]
    );

    res.json({ message: "Doctor profile updated successfully" });
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({ error: "Failed to update doctor profile", details: error.message });
  }
});

// GET /api/doctors/:id/schedules - Get doctor's OPD schedules
router.get("/:id/schedules", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM doctor_schedules WHERE doctor_id = ? ORDER BY date ASC", [id]);

    const formatted = rows.map((r) => {
      let slots = [];
      try {
        slots = typeof r.slots === "string" ? JSON.parse(r.slots) : r.slots || [];
      } catch (e) {
        slots = [];
      }
      return {
        ...r,
        slots,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Fetch schedules error:", error);
    res.status(500).json({ error: "Failed to fetch doctor schedules", details: error.message });
  }
});

module.exports = router;
