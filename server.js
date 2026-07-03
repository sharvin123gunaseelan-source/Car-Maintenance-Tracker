const express = require("express");
const app = express();

require("dotenv").config();
const session = require("express-session");

// Routes
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const viewVehicleRoutes = require("./routes/viewVehicleRoutes");
const viewMaintenanceRoutes = require("./routes/viewMaintenanceRoutes");
const statsRoutes = require("./routes/statsRoutes");

// DB
const db = require("./config/db");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "cartrackersecret",
  resave: false,
  saveUninitialized: false
}));

// ✅ HOME ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Pages
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.get("/dashboard", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(__dirname + "/public/dashboard.html");
});

app.get("/addVehicle", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(__dirname + "/public/addVehicle.html");
});

app.get("/addMaintenance", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(__dirname + "/public/addMaintenance.html");
});

// API Routes
app.use(authRoutes);
app.use(vehicleRoutes);
app.use(maintenanceRoutes);
app.use(viewVehicleRoutes);
app.use(viewMaintenanceRoutes);
app.use(statsRoutes);

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});