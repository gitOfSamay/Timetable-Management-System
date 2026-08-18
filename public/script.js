// ===============================
// LOAD SUBJECTS
// ===============================

async function loadSubjects() {
    try {
        const response = await fetch("/api/subjects");

        if (!response.ok) {
            throw new Error(`Subjects API error: ${response.status}`);
        }

        const subjects = await response.json();

        const subjectSelect = document.getElementById("subject");

        if (!subjectSelect) {
            console.error("Subject select not found in HTML");
            return;
        }

        subjectSelect.innerHTML = `
            <option value="">Select Subject</option>
        `;

        subjects.forEach(subject => {
            const option = document.createElement("option");

            option.value = subject.subject_id;
            option.textContent = subject.subject_name;

            subjectSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading subjects:", error);
    }
}


// ===============================
// LOAD TEACHERS
// ===============================

async function loadTeachers() {
    try {
        const response = await fetch("/api/teachers");

        if (!response.ok) {
            throw new Error(`Teachers API error: ${response.status}`);
        }

        const teachers = await response.json();

        const teacherSelect = document.getElementById("teacher");

        if (!teacherSelect) {
            console.error("Teacher select not found in HTML");
            return;
        }

        teacherSelect.innerHTML = `
            <option value="">Select Teacher</option>
        `;

        teachers.forEach(teacher => {
            const option = document.createElement("option");

            option.value = teacher.teacher_id;
            option.textContent = teacher.teacher_name;

            teacherSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading teachers:", error);
    }
}


// ===============================
// LOAD ROOMS
// ===============================

async function loadRooms() {
    try {
        const response = await fetch("/api/rooms");

        if (!response.ok) {
            throw new Error(`Rooms API error: ${response.status}`);
        }

        const rooms = await response.json();

        console.log("Rooms received:", rooms);

        const roomSelect = document.getElementById("room");

        if (!roomSelect) {
            console.error(
                "Room select not found! HTML must contain: <select id=\"room\">"
            );
            return;
        }

        roomSelect.innerHTML = `
            <option value="">Select Room</option>
        `;

        rooms.forEach(room => {
            const option = document.createElement("option");

            option.value = room.room_id;
            option.textContent = room.room_number;

            roomSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading rooms:", error);
    }
}


// ===============================
// LOAD TIMETABLE
// ===============================

async function loadTimetable() {
    try {
        const response = await fetch("/api/timetable");

        if (!response.ok) {
            throw new Error(`Timetable API error: ${response.status}`);
        }

        const data = await response.json();

        const tableBody = document.getElementById("timetableBody");

        if (!tableBody) {
            console.error("Timetable body not found in HTML");
            return;
        }

        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No timetable records found.
                    </td>
                </tr>
            `;

            return;
        }

        data.forEach(row => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${row.day}</td>

                <td>
                    ${row.start_time} -
                    ${row.end_time}
                </td>

                <td>${row.subject_name}</td>

                <td>${row.teacher_name}</td>

                <td>${row.room_number}</td>

                <td>
                    <button onclick="editTimetable(${row.timetable_id})">
                        Edit
                    </button>

                    <button onclick="deleteTimetable(${row.timetable_id})">
                        Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading timetable:", error);
    }
}


// ===============================
// ADD TIMETABLE
// ===============================

const form = document.getElementById("timetableForm");

if (form) {
    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        const day =
            document.getElementById("day").value;

        const startTime =
            document.getElementById("startTime").value;

        const endTime =
            document.getElementById("endTime").value;

        const subjectId =
            document.getElementById("subject").value;

        const teacherId =
            document.getElementById("teacher").value;

        const roomId =
            document.getElementById("room").value;

        const data = {
            day: day,
            start_time: startTime,
            end_time: endTime,
            subject_id: Number(subjectId),
            teacher_id: Number(teacherId),
            room_id: Number(roomId)
        };

        try {
            const response = await fetch(
                "/api/timetable",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(
                    result.error ||
                    "Failed to add timetable"
                );

                return;
            }

            alert("Timetable added successfully!");

            form.reset();

            loadTimetable();

        } catch (error) {
            console.error(
                "Add timetable error:",
                error
            );

            alert("Something went wrong.");
        }
    });
}


// ===============================
// DELETE TIMETABLE
// ===============================

async function deleteTimetable(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this timetable?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `/api/timetable/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(
                result.error ||
                "Delete failed"
            );

            return;
        }

        alert("Timetable deleted successfully!");

        loadTimetable();

    } catch (error) {
        console.error(
            "Delete error:",
            error
        );

        alert("Something went wrong.");
    }
}


// ===============================
// EDIT / UPDATE TIMETABLE
// ===============================

async function editTimetable(id) {

    const day = prompt(
        "Enter day (Monday-Saturday):"
    );

    if (!day) {
        return;
    }

    const startTime = prompt(
        "Enter start time (HH:MM):"
    );

    if (!startTime) {
        return;
    }

    const endTime = prompt(
        "Enter end time (HH:MM):"
    );

    if (!endTime) {
        return;
    }

    const subjectId = prompt(
        "Enter Subject ID:"
    );

    if (!subjectId) {
        return;
    }

    const teacherId = prompt(
        "Enter Teacher ID:"
    );

    if (!teacherId) {
        return;
    }

    const roomId = prompt(
        "Enter Room ID:"
    );

    if (!roomId) {
        return;
    }

    const data = {
        day: day,
        start_time: startTime,
        end_time: endTime,
        subject_id: Number(subjectId),
        teacher_id: Number(teacherId),
        room_id: Number(roomId)
    };

    try {
        const response = await fetch(
            `/api/timetable/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(
                result.error ||
                "Update failed"
            );

            return;
        }

        alert("Timetable updated successfully!");

        loadTimetable();

    } catch (error) {
        console.error(
            "Update error:",
            error
        );

        alert("Something went wrong.");
    }
}


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function() {

    loadSubjects();

    loadTeachers();

    loadRooms();

    loadTimetable();

});