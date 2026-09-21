const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const doctorRoutes = require("./routes/doctors");
const patientRoutes = require("./routes/patients");
const notificationRoutes = require("./routes/notifications");
const contactRoutes = require("./routes/contact");
const departmentRoutes = require("./routes/departments");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/departments", departmentRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT 1 AS database_ready");
    res.json({
      status: "UP",
      backend: "UP",
      database: "CONNECTED",
      database_ready: rows[0]?.database_ready === 1,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      backend: "UP",
      database: "DISCONNECTED",
      error: process.env.NODE_ENV === "production" ? "Database unavailable" : error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[MediConnect Backend API] listening on port ${PORT}`);
});
