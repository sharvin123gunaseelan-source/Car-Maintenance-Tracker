const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/stats", (req, res) => {

    db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, userResult) => {

            if (err) {
                return res.send("Error");
            }

            db.query(
                "SELECT COUNT(*) AS totalVehicles FROM vehicles",
                (err, vehicleResult) => {

                    if (err) {
                        return res.send("Error");
                    }

                    db.query(
                        "SELECT COUNT(*) AS totalMaintenance FROM maintenance_records",
                        (err, maintenanceResult) => {

                            if (err) {
                                return res.send("Error");
                            }

                            res.send(`
<!DOCTYPE html>

<html>

<head>

<title>Statistics</title>

<link rel="stylesheet" href="/css/style.css">

</head>

<body>

<div class="container">

<div class="card">

<h1>📊 Statistics</h1>

<h2>Total Registered Users</h2>
<h1>${userResult[0].totalUsers}</h1>

<br>

<h2>Total Vehicles</h2>
<h1>${vehicleResult[0].totalVehicles}</h1>

<br>

<h2>Total Maintenance Records</h2>
<h1>${maintenanceResult[0].totalMaintenance}</h1>

<br>

<a href="/dashboard">
⬅ Back to Dashboard
</a>

</div>

</div>

</body>

</html>
                            `);

                        }
                    );

                }
            );

        }
    );

});

module.exports = router;