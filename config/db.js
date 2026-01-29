const sql = require("mysql2/promise");

const pool = sql.createPool({
    host:process.env.HOST,
    port:process.env.PORT,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB
})



async function test() {
    const [rows] = await pool.query("SELECT 2+2 AS result");
    console.log(rows);
}

module.exports = {
    pool,
    test,
};
