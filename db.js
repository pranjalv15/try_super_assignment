const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "PostPass15@",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "invoice",
});

module.exports = pool;
