const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/addVehicle", (req, res) => {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    const {
        car_name,
        plate_number,
        model,
        year
    } = req.body;

    const userId = req.session.userId;

    if (!car_name) {
        return res.send("Car Name Required");
    }

    const sql = `
    INSERT INTO vehicles
    (user_id, car_name, plate_number, model, year)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userId,
            car_name,
            plate_number,
            model,
            year
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Vehicle Failed");
            }

            res.send("Vehicle Added");

        }
    );

});

module.exports = router;