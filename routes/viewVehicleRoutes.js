const express = require("express");
const router = express.Router();
const db = require("../config/db");

// VIEW ALL VEHICLES
router.get("/vehicles", (req, res) => {

    const userId = req.session.userId;

db.query(
"SELECT role FROM users WHERE id = ?",
[userId],
(err,user)=>{

    if(err){
        return res.send("Error");
    }

    const role = user[0].role;

    let sql;
    let values = [];

    if(role === "admin"){

        sql = "SELECT * FROM vehicles";

    }else{

        sql = "SELECT * FROM vehicles WHERE user_id = ?";
        values = [userId];

    }

    db.query(sql, values, (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

       let html = `

<!DOCTYPE html>

<html>

<head>

<title>Vehicle List</title>

<link rel="stylesheet" href="/css/style.css">

</head>

<body>

<div class="container">

<div class="card">

<h1>🚗 Vehicle List</h1>
<p style="text-align:center;">
Logged in as: <b>${role.toUpperCase()}</b>
</p>

<form action="/searchVehicle">

<input
type="text"
name="keyword"
placeholder="Search Vehicle">

<button>
Search
</button>

</form>

<br>

<table style="width:100%; border-collapse:collapse;">

<tr>

<th>ID</th>

<th>Car Name</th>

<th>Plate</th>

<th>Model</th>

<th>Year</th>

<th>Edit</th>

<th>Delete</th>

</tr>

`;

        results.forEach(vehicle => {

            html += `
            <tr>
                <td>${vehicle.vehicle_id}</td>
                <td>${vehicle.car_name}</td>
                <td>${vehicle.plate_number}</td>
                <td>${vehicle.model}</td>
                <td>${vehicle.year}</td>

                <td style="padding:8px;">
    <a href="/editVehicle/${vehicle.vehicle_id}">
        Edit
    </a>
</td>

<td style="padding:8px;">
    <a href="/deleteVehicle/${vehicle.vehicle_id}"
       onclick="return confirm('Delete this vehicle?')">
       Delete
    </a>
</td>
            </tr>
            `;

        });

        html += `

</table>

<br>

<a href="/dashboard">

⬅ Back to Dashboard

</a>

</div>

</div>

</body>

</html>

`;
        res.send(html);

    });

});

// DELETE VEHICLE
router.get("/deleteVehicle/:id", (req, res) => {

    const id = req.params.id;

    

    db.query(
        "DELETE FROM vehicles WHERE vehicle_id=?",
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Delete Failed");
            }

            res.redirect("/vehicles");

        }
    );

});

// EDIT VEHICLE PAGE
router.get("/editVehicle/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM vehicles WHERE vehicle_id=?",
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            const vehicle = result[0];
            if (!vehicle) {
            return res.send("Vehicle Not Found");
            }

            res.send(`
                <h1>Edit Vehicle</h1>

                <form action="/editVehicle/${vehicle.vehicle_id}" method="POST">

                    <input
                        type="text"
                        name="car_name"
                        value="${vehicle.car_name}">

                    <br><br>

                    <input
                        type="text"
                        name="plate_number"
                        value="${vehicle.plate_number}">

                    <br><br>

                    <input
                        type="text"
                        name="model"
                        value="${vehicle.model}">

                    <br><br>

                    <input
                        type="number"
                        name="year"
                        value="${vehicle.year}">

                    <br><br>

                    <button type="submit">
                        Update
                    </button>

                </form>
            `);

        }
    );

});

// SAVE EDITED VEHICLE
router.post("/editVehicle/:id", (req, res) => {

    const id = req.params.id;

    const {
        car_name,
        plate_number,
        model,
        year
    } = req.body;

    db.query(
        `UPDATE vehicles
        SET car_name=?,
            plate_number=?,
            model=?,
            year=?
        WHERE vehicle_id=?`,
        [
            car_name,
            plate_number,
            model,
            year,
            id
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Update Failed");
            }

            res.redirect("/vehicles");

        }
    );

});

// SEARCH VEHICLE
router.get("/searchVehicle", (req, res) => {

    const keyword = req.query.keyword;

    db.query(
        `SELECT * FROM vehicles
         WHERE car_name LIKE ?
         OR plate_number LIKE ?`,
        [
            `%${keyword}%`,
            `%${keyword}%`
        ],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Search Error");
            }

            res.send(results);

        }
    );

});

});

module.exports = router;