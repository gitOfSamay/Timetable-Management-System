const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));


// ===============================
// READ - Get complete timetable
// ===============================

app.get("/api/timetable", (req, res) => {

    const sql = `
        SELECT
            timetable.timetable_id,
            timetable.day,
            timetable.start_time,
            timetable.end_time,
            subjects.subject_id,
            subjects.subject_name,
            teachers.teacher_id,
            teachers.teacher_name,
            rooms.room_id,
            rooms.room_number

        FROM timetable

        JOIN subjects
            ON timetable.subject_id = subjects.subject_id

        JOIN teachers
            ON timetable.teacher_id = teachers.teacher_id

        JOIN rooms
            ON timetable.room_id = rooms.room_id

        ORDER BY
            FIELD(
                timetable.day,
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ),
            timetable.start_time
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Database query failed:");
            console.log(err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});


// ===============================
// READ - Get subjects
// ===============================

app.get("/api/subjects", (req, res) => {

    const sql = `
        SELECT subject_id, subject_name
        FROM subjects
        ORDER BY subject_name
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Failed to load subjects:");
            console.log(err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});


// ===============================
// READ - Get teachers
// ===============================

app.get("/api/teachers", (req, res) => {

    const sql = `
        SELECT teacher_id, teacher_name
        FROM teachers
        ORDER BY teacher_name
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Failed to load teachers:");
            console.log(err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});


// ===============================
// READ - Get rooms
// ===============================

app.get("/api/rooms", (req, res) => {

    const sql = `
        SELECT room_id, room_number
        FROM rooms
        ORDER BY room_number
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Failed to load rooms:");
            console.log(err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});


// ===============================
// CREATE - Add timetable
// ===============================

app.post("/api/timetable", (req, res) => {

    const {
        day,
        start_time,
        end_time,
        subject_id,
        teacher_id,
        room_id
    } = req.body;

    if (
        !day ||
        !start_time ||
        !end_time ||
        !subject_id ||
        !teacher_id ||
        !room_id
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO timetable
        (day, start_time, end_time, subject_id, teacher_id, room_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            day,
            start_time,
            end_time,
            subject_id,
            teacher_id,
            room_id
        ],
        (err, result) => {

            if (err) {
                console.log("Insert failed:");
                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Timetable added successfully",
                timetable_id: result.insertId
            });
        }
    );
});


// ===============================
// UPDATE - Update timetable
// ===============================

app.put("/api/timetable/:id", (req, res) => {

    const id = req.params.id;

    const {
        day,
        start_time,
        end_time,
        subject_id,
        teacher_id,
        room_id
    } = req.body;

    const sql = `
        UPDATE timetable

        SET
            day = ?,
            start_time = ?,
            end_time = ?,
            subject_id = ?,
            teacher_id = ?,
            room_id = ?

        WHERE timetable_id = ?
    `;

    db.query(
        sql,
        [
            day,
            start_time,
            end_time,
            subject_id,
            teacher_id,
            room_id,
            id
        ],
        (err, result) => {

            if (err) {
                console.log("Update failed:");
                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Timetable record not found"
                });
            }

            res.json({
                message: "Timetable updated successfully"
            });
        }
    );
});


// ===============================
// DELETE - Delete timetable
// ===============================

app.delete("/api/timetable/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM timetable
        WHERE timetable_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log("Delete failed:");
            console.log(err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Timetable record not found"
            });
        }

        res.json({
            message: "Timetable deleted successfully"
        });
    });
});


// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);
});