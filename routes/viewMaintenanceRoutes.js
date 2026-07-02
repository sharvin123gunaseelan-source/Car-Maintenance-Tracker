const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/maintenance",(req,res)=>{

    db.query(
        `SELECT m.*
FROM maintenance_records m
JOIN vehicles v
ON m.vehicle_id = v.vehicle_id
WHERE v.user_id = ?`,
        [req.session.userId],
        (err,results)=>{

            if(err){
                return res.send("Error");
            }

            let html = `

<!DOCTYPE html>

<html>

<head>

<title>Maintenance Records</title>

<link rel="stylesheet" href="/css/style.css">

</head>

<body>

<div class="container">

<div class="card">

<h1>🛠 Maintenance Records</h1>

`;

            results.forEach(record=>{

    html += `
<p>

${record.service_type}
-
RM${record.cost}

<a href="/editMaintenance/${record.maintenance_id}">
Edit
</a>

<a
href="/deleteMaintenance/${record.maintenance_id}"
onclick="return confirm('Delete this maintenance record?')">
Delete
</a>

</p>
`;
   });
   

            html += `

<br><br>

<a href="/dashboard">

⬅ Back to Dashboard

</a>

</div>

</div>

</body>

</html>

`;

res.send(html);

        }
    );

});
router.get("/editMaintenance/:id",(req,res)=>{

    db.query(
        "SELECT * FROM maintenance_records WHERE maintenance_id=?",
        [req.params.id],
        (err,result)=>{

            const record = result[0];

            res.send(`
                <h1>Edit Maintenance</h1>

                <form action="/editMaintenance/${record.maintenance_id}" method="POST">

                <input
                name="service_type"
                value="${record.service_type}">

                <br><br>

                <input
                name="cost"
                value="${record.cost}">

                <br><br>

                <button>
                Update
                </button>

                </form>
            `);

        }
    );

});
router.post("/editMaintenance/:id",(req,res)=>{

    db.query(
        `UPDATE maintenance_records
         SET service_type=?,
             cost=?
         WHERE maintenance_id=?`,
        [
            req.body.service_type,
            req.body.cost,
            req.params.id
        ],
        ()=>{
            res.redirect("/maintenance");
        }
    );

});
// DELETE MAINTENANCE
router.get("/deleteMaintenance/:id",(req,res)=>{

    db.query(
        "DELETE FROM maintenance_records WHERE maintenance_id=?",
        [req.params.id],
        (err,result)=>{

            if(err){
                console.log(err);
                return res.send("Delete Failed");
            }

            res.redirect("/maintenance");

        }
    );

});
module.exports = router;