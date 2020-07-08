const { Pool } = require("pg");

module.exports = new Pool({
    user: "postgres",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "foodfy"
});