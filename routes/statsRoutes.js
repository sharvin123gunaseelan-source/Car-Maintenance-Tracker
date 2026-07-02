const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/stats", (req, res) => {

    db.query(
        `SELECT COUNT(*) total 
            FROM vehicles
            WHERE user_id = ?`,
        [req.session.userId],
        (err, result) => {

            if(err){
                return res.send("Error");
            }

            const total = result[0].total;

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

<h2>Total Vehicles</h2>

<h1>${total}</h1>

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

});

module.exports = router;