const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const caPath = path.join(__dirname, "ca.pem");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(caPath)
    }
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed:");
        console.log(err.message);
        return;
    }

    console.log("Aiven MySQL database connected successfully!");

    connection.query(
        "SELECT DATABASE() AS db, CURRENT_USER() AS user, @@hostname AS host",
        (queryErr, results) => {
            if (queryErr) {
                console.log("Could not check database:", queryErr.message);
                return;
            }

            console.log("Node.js database information:");
            console.table(results);

            connection.query(
                "SELECT * FROM departments LIMIT 5",
                (queryErr, results) => {
                    if (queryErr) {
                        console.log(
                            "Could not read departments table:",
                            queryErr.message
                        );
                        return;
                    }

                    console.log("Departments visible to Node.js:");
                    console.table(results);
                }
            );
        }
    );
});

module.exports = connection;