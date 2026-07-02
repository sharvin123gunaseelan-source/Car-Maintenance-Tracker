const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// REGISTER
router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    if(
!name ||
!email ||
!password
){
return res.send(
"All fields required"
);
}

    db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err,result)=>{

        if(err){
            return res.send("Error");
        }

        if(result.length > 0){
            return res.send(
                "Email already exists"
            );
        }

        const hashedPassword =
        await bcrypt.hash(password,10);

        const sql =
        `INSERT INTO users
        (name,email,password)
        VALUES (?,?,?)`;

        db.query(
            sql,
            [name,email,hashedPassword],
            (err,result)=>{

                if(err){
                    console.log(err);
                    return res.send(
                        "Registration Failed"
                    );
                }

                res.send(
                    "Registration Successful"
                );

            }
        );

    }
);
    });

// LOGIN
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        if (result.length === 0) {
            return res.send("User Not Found");
        }

        const user = result[0];

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (match) {

            req.session.userId = user.id;

            return res.redirect("/dashboard");

        } else {

            return res.send("Wrong Password");

        }

    });

});

module.exports = router;