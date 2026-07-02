const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/addMaintenance", (req, res) => {

    const {
        vehicle_id,
        service_type,
        service_date,
        cost,
        notes
    } = req.body;

    if(!service_type){
    return res.send(
        "Service Type Required"
    );
}

    const sql = `
    INSERT INTO maintenance_records
    (vehicle_id, service_type, service_date, cost, notes)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [vehicle_id, service_type, service_date, cost, notes],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Maintenance Failed");
            }

            res.send("Maintenance Added");
        }
    );

});

module.exports = router;