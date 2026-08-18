const mysql = require("mysql2");
const fs = require("fs");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(require("path").join(__dirname, "ca.pem"))
    }
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed:");
        console.log(err.message);
        return;
    }

    console.log("Aiven MySQL database connected successfully!");

    // Check database and user
    connection.query(
        "SELECT DATABASE() AS db, CURRENT_USER() AS user, @@hostname AS host",
        (queryErr, results) => {
            if (queryErr) {
                console.log("Could not check database:", queryErr.message);
                return;
            }

            console.log("Node.js database information:");
            console.table(results);

            // Check departments table
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