const viewVehicleRoutes = require("./routes/viewVehicleRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const db = require("./config/db");
const vehicleRoutes = require("./routes/vehicleRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const viewMaintenanceRoutes = require("./routes/viewMaintenanceRoutes");
const statsRoutes = require("./routes/statsRoutes");

app.use(session({
  secret: "cartrackersecret",
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/register", (req,res)=>{
  res.sendFile(__dirname + "/public/register.html");
});
app.get("/login", (req,res)=>{
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/dashboard",(req,res)=>{

    if(!req.session.userId){
        return res.redirect("/login");
    }

    res.sendFile(
        __dirname +
        "/public/dashboard.html"
    );

});
app.get("/addVehicle",(req,res)=>{
    res.sendFile(
        __dirname +
        "/public/addVehicle.html"
    );
}); 
app.get("/addMaintenance",(req,res)=>{
    res.sendFile(
        __dirname +
        "/public/addMaintenance.html"
    );
});

app.use(authRoutes);
app.use(vehicleRoutes);
app.use(maintenanceRoutes);
app.use(viewVehicleRoutes);
app.use(viewMaintenanceRoutes);
app.use(statsRoutes);

app.get("/logout",(req,res)=>{

    req.session.destroy(()=>{
        res.redirect("/login");
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});