const Pool = require("pg").Pool;

const pool = new Pool ({
    user:"postgres",
    password:"P4ssword",
    database:"postgres",
    host:"localhost",
    port:5432,
})

module.exports = pool;