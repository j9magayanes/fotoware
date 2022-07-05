require("dotenv").config();
const e = require("express");
const express  = require("express");
const morgan = require("morgan");
const db = require("./db");
const bcrypt = require("bcrypt");

const app = express();

// attach body property
app.use(express.json());

// get all models
app.get("/api/v1/models", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM models")
        console.log(results)
        res.status(200).json({
            status: "success",
            results: results.rows.length,
           data: {
               models: results.rows,
           }
        });
    } catch (err) {
        console.log(err)
    }
});

// get a model
app.get("/api/v1/models/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const results = await db.query("SELECT * FROM models WHERE id =  $1", [req.params.id]);
        // select * from restaurants where id = req.params.id
        res.status(200).json({
            status: "success",
            data: {
                results: results.rows,
            },
        });
    } catch (err) {
        console.log(err)
    }
});

// create a model
app.post("/api/v1/models", async (req, res) => {
    try {
        const results = await db.query("INSERT models (name, location, price_range) values ($1, $2, $3) returning *", [req.body.name, req.body.location, req.body.price_range]);
        console.log(results);
        res.status(201).json({
            status: "success",
            data: { 
                models: results.rows[0],
            },
        });
    } catch (err) {
        console.log(err);
    }
});

//update models
app.put("/api/v1/models/:id", async (req, res) => {
   try {
    const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning * ", [req.body.name, req.body.location, req.body.price_range, req.params.id]);
   res.status(200).json({
       status: "success",
       data: {
        models: results.rows[0],
       },
   });
}catch (err) {
    console.log(err)
}
console.log(req.params.id);
console.log(req.body)
});

app.delete("/api/v1/models/:id", (req, res) => {
    try {
        const results = db.query("DELETE FROM models where id = $1", [req.params.id])
        res.status(204).json({
            status: "success",
        });
    } catch (err) {
        console.log(err)
    }
});

// register a new user
app.post("/api/v1/users/register", async (req, res) => {
        let { name, email, password, password2 } = req.body;
        let errors = [] 
        if(!email || !password || !password2)
        {
            console.log("Please enter the correct fields ")
        }
        if(password.length < 10){
            errors.push({ message: "Password should have more than 10 characters"})
        }

        if(password != password2) {
            errors.push({ message: "Passwords do not match"});
        }

        if(errors.length > 0){
            res.render("register", {errors});
        } else {
            let hashedPassword =  await bcrypt.hash(password, 10);
         
                console.log(email)
                const results = await db.query("SELECT * FROM users where email = $1", [email])
                res.status(204).json({
                    status: "success",
                })
                console.log(results.rows);
        }   
    });

const port = process.env.PORT || 3001  ;
app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`)
})