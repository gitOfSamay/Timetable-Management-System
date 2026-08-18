const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "timetable_db"
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed:");
        console.log(err.message);
        return;
    }

    console.log("MySQL database connected successfully!");
});

module.exports = connection;