const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/appointments - List appointments with joined patient, doctor, and department
router.get("/", async (req, res) => {
  try {
    const { patient_id, doctor_id, status, date } = req.query;

    let query = `
      SELECT 
        a.*,
        p.date_of_birth AS patient_dob,
        p.gender AS patient_gender,
        p.address AS patient_address,
        u_patient.name AS patient_name,
        u_patient.email AS patient_email,
        u_patient.phone AS patient_phone,
        d.specialization AS doctor_specialization,
        d.consultation_fee AS doctor_consultation_fee,
        u_doctor.name AS doctor_name,
        u_doctor.email AS doctor_email,
        dept.department_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.patient_id
      LEFT JOIN users u_patient ON p.user_id = u_patient.user_id
      LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
      LEFT JOIN users u_doctor ON d.user_id = u_doctor.user_id
      LEFT JOIN departments dept ON a.department_id = dept.department_id
      WHERE 1=1
    `;
    const params = [];

    if (patient_id) {
      query += " AND a.patient_id = ?";
      params.push(patient_id);
    }
    if (doctor_id) {
      query += " AND a.doctor_id = ?";
      params.push(doctor_id);
    }
    if (status) {
      query += " AND a.status = ?";
      params.push(status);
    }
    if (date) {
      query += " AND a.appointment_date = ?";
      params.push(date);
    }

    query += " ORDER BY a.appointment_date DESC, a.appointment_time ASC";

    const [rows] = await db.execute(query, params);

    // Format results to match the frontend shape
    const formatted = rows.map((r) => ({
      appointment_id: r.appointment_id,
      appointment_code: r.appointment_code,
      patient_id: r.patient_id,
      doctor_id: r.doctor_id,
      department_id: r.department_id,
      schedule_id: r.schedule_id,
      appointment_date: r.appointment_date,
      appointment_time: r.appointment_time,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
      patient: {
        patient_id: r.patient_id,
        date_of_birth: r.patient_dob,
        gender: r.patient_gender,
        address: r.patient_address,
        phone: r.patient_phone,
        user: {
          name: r.patient_name,
          email: r.patient_email,
          phone: r.patient_phone,
        },
      },
      doctor: {
        doctor_id: r.doctor_id,
        specialization: r.doctor_specialization,
        consultation_fee: r.doctor_consultation_fee,
        user: {
          name: r.doctor_name,
          email: r.doctor_email,
        },
      },
      department: {
        department_id: r.department_id,
        department_name: r.department_name,
      },
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetch appointments error:", error);
    res.status(500).json({ error: "Failed to fetch appointments", details: error.message });
  }
});

// GET /api/appointments/:id - Get single appointment with notes and documents
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM appointments WHERE appointment_id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appt = rows[0];

    // Fetch clinical notes
    const [notes] = await db.execute("SELECT * FROM appointment_notes WHERE appointment_id = ?", [id]);

    // Fetch related documents
    const [docs] = await db.execute("SELECT * FROM medical_documents WHERE appointment_id = ?", [id]);

    res.json({
      ...appt,
      notes: notes[0] || null,
      documents: docs,
    });
  } catch (error) {
    console.error("Fetch appointment by ID error:", error);
    res.status(500).json({ error: "Failed to fetch appointment", details: error.message });
  }
});

// POST /api/appointments - Book new appointment
router.post("/", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { patient_id, doctor_id, department_id, schedule_id, appointment_date, appointment_time, reason } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      await connection.rollback();
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    // Check for collision (prevent double booking)
    const [conflict] = await connection.execute(
      "SELECT appointment_id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'CANCELLED'",
      [doctor_id, appointment_date, appointment_time]
    );

    if (conflict.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: "This slot is already booked. Please choose another time." });
    }

    // Generate unique code
    const appointmentCode = `APT-${Math.floor(10000 + Math.random() * 90000)}`;

    const [result] = await connection.execute(
      `INSERT INTO appointments 
       (appointment_code, patient_id, doctor_id, department_id, schedule_id, appointment_date, appointment_time, reason, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NOW())`,
      [appointmentCode, patient_id, doctor_id, department_id || 1, schedule_id || null, appointment_date, appointment_time, reason || ""]
    );

    // Get patient user_id for notification
    const [patientRows] = await connection.execute("SELECT user_id FROM patients WHERE patient_id = ?", [patient_id]);
    if (patientRows.length > 0) {
      await connection.execute(
        "INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES (?, ?, 'APPOINTMENT_BOOKED', FALSE, NOW())",
        [
          patientRows[0].user_id,
          `Your appointment ${appointmentCode} for ${appointment_date} at ${appointment_time} has been booked and is pending review.`,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment_id: result.insertId,
      appointment_code: appointmentCode,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Book appointment error:", error);
    res.status(500).json({ error: "Failed to book appointment", details: error.message });
  } finally {
    connection.release();
  }
});

// PUT /api/appointments/:id/status - Update appointment status
router.put("/:id/status", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
      await connection.rollback();
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [apptRows] = await connection.execute("SELECT * FROM appointments WHERE appointment_id = ?", [id]);
    if (apptRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appt = apptRows[0];

    await connection.execute("UPDATE appointments SET status = ? WHERE appointment_id = ?", [status, id]);

    // Send notification to patient
    const [patientRows] = await connection.execute("SELECT user_id FROM patients WHERE patient_id = ?", [appt.patient_id]);
    if (patientRows.length > 0) {
      const msg =
        status === "CONFIRMED"
          ? `Your appointment ${appt.appointment_code} on ${appt.appointment_date} has been confirmed.`
          : status === "CANCELLED"
          ? `Your appointment ${appt.appointment_code} on ${appt.appointment_date} has been cancelled.`
          : `Your appointment ${appt.appointment_code} has been marked as ${status}.`;

      await connection.execute(
        "INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES (?, ?, ?, FALSE, NOW())",
        [patientRows[0].user_id, msg, `APPOINTMENT_${status}`]
      );
    }

    await connection.commit();

    res.json({ message: `Appointment status updated to ${status}` });
  } catch (error) {
    await connection.rollback();
    console.error("Update status error:", error);
    res.status(500).json({ error: "Failed to update appointment status", details: error.message });
  } finally {
    connection.release();
  }
});

// POST /api/appointments/:id/notes - Save diagnosis notes & prescription
router.post("/:id/notes", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { doctor_id, notes, prescription, follow_up_date } = req.body;

    const [apptRows] = await connection.execute("SELECT * FROM appointments WHERE appointment_id = ?", [id]);
    if (apptRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Insert note
    await connection.execute(
      `INSERT INTO appointment_notes (appointment_id, doctor_id, notes, prescription, follow_up_date, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [id, doctor_id || apptRows[0].doctor_id, notes || "", prescription || "", follow_up_date || null]
    );

    // Update appointment status to COMPLETED
    await connection.execute("UPDATE appointments SET status = 'COMPLETED' WHERE appointment_id = ?", [id]);

    await connection.commit();

    res.status(201).json({ message: "Consultation notes recorded and appointment completed." });
  } catch (error) {
    await connection.rollback();
    console.error("Save notes error:", error);
    res.status(500).json({ error: "Failed to save appointment notes", details: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
