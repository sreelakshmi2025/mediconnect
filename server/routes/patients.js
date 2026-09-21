const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/patients - List all patients
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        u.name,
        u.email,
        u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.user_id
      ORDER BY u.name ASC
    `;
    const [rows] = await db.execute(query);

    const formatted = rows.map((r) => ({
      patient_id: r.patient_id,
      user_id: r.user_id,
      date_of_birth: r.date_of_birth,
      gender: r.gender,
      address: r.address,
      phone: r.phone,
      user: {
        user_id: r.user_id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        role: "PATIENT",
      },
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetch patients error:", error);
    res.status(500).json({ error: "Failed to fetch patients", details: error.message });
  }
});

// GET /api/patients/:id - Single patient with appointments and documents
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        p.*,
        u.name,
        u.email,
        u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.patient_id = ?
    `;
    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const r = rows[0];

    // Fetch documents
    const [documents] = await db.execute(
      "SELECT * FROM medical_documents WHERE patient_id = ? ORDER BY uploaded_at DESC",
      [id]
    );

    // Fetch appointments
    const [appointments] = await db.execute(
      "SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC",
      [id]
    );

    res.json({
      patient_id: r.patient_id,
      user_id: r.user_id,
      date_of_birth: r.date_of_birth,
      gender: r.gender,
      address: r.address,
      phone: r.phone,
      user: {
        user_id: r.user_id,
        name: r.name,
        email: r.email,
        phone: r.phone,
      },
      documents,
      appointments,
    });
  } catch (error) {
    console.error("Fetch patient by ID error:", error);
    res.status(500).json({ error: "Failed to fetch patient", details: error.message });
  }
});

// PUT /api/patients/:id - Update patient profile
router.put("/:id", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { name, phone, date_of_birth, gender, address } = req.body;

    const [patientRows] = await connection.execute("SELECT user_id FROM patients WHERE patient_id = ?", [id]);
    if (patientRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Patient not found" });
    }

    const userId = patientRows[0].user_id;

    // Update patient table
    await connection.execute(
      `UPDATE patients SET 
        date_of_birth = COALESCE(?, date_of_birth),
        gender = COALESCE(?, gender),
        address = COALESCE(?, address)
      WHERE patient_id = ?`,
      [date_of_birth, gender, address, id]
    );

    // Update user table (name, phone)
    if (name || phone) {
      await connection.execute(
        `UPDATE users SET 
          name = COALESCE(?, name),
          phone = COALESCE(?, phone)
        WHERE user_id = ?`,
        [name, phone, userId]
      );
    }

    await connection.commit();

    res.json({ message: "Patient profile updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Update patient error:", error);
    res.status(500).json({ error: "Failed to update patient profile", details: error.message });
  } finally {
    connection.release();
  }
});

// GET /api/patients/:id/documents - List documents
router.get("/:id/documents", async (req, res) => {
  try {
    const { id } = req.params;
    const [docs] = await db.execute(
      "SELECT * FROM medical_documents WHERE patient_id = ? ORDER BY uploaded_at DESC",
      [id]
    );
    res.json(docs);
  } catch (error) {
    console.error("Fetch documents error:", error);
    res.status(500).json({ error: "Failed to fetch documents", details: error.message });
  }
});

// POST /api/patients/:id/documents - Register uploaded document (S3 metadata)
router.post("/:id/documents", async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_id, file_name, file_type, file_size, s3_key, s3_url } = req.body;

    if (!file_name || !file_type) {
      return res.status(400).json({ error: "File name and type are required" });
    }

    const [result] = await db.execute(
      `INSERT INTO medical_documents 
       (patient_id, appointment_id, file_name, file_type, file_size, s3_key, s3_url, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id,
        appointment_id || null,
        file_name,
        file_type,
        file_size || "1.5 MB",
        s3_key || `patient-documents/patient-${id}/${file_name}`,
        s3_url || process.env.S3_PUBLIC_BASE_URL || "",
      ]
    );

    res.status(201).json({
      message: "Document registered successfully",
      document_id: result.insertId,
    });
  } catch (error) {
    console.error("Upload document record error:", error);
    res.status(500).json({ error: "Failed to register document", details: error.message });
  }
});

router.delete("/documents/:documentId", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM medical_documents WHERE document_id = ?", [req.params.documentId]);
    if (!result.affectedRows) return res.status(404).json({ error: "Document not found" });
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

module.exports = router;
