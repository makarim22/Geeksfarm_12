const express = require('express');
const app = express();
const pool = require("./src/conn/db_postgres");
const port = 3001;

app.use(express.json());

app.get("/addasync", async (req, res) => {
    try {
        const name = "Jaka";
        const mobile = "081529939013";
        const email = "jackmakarim22@gmail.com";
        const newCont = await pool.query(
            "INSERT INTO contact (name, mobile, email) VALUES ($1, $2, $3) returning *", [name, mobile, email]
        );
        res.json(newCont);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});