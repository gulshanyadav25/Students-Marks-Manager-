let students = [];


// ==========================
// LOAD STUDENTS
// ==========================

async function loadStudents() {

    const response = await fetch("/students");

    students = await response.json();

    renderStudents(students);

    updateStats(students);
}


// ==========================
// RENDER STUDENTS
// ==========================

function renderStudents(data) {

    const table = document.getElementById("studentTable");

    const emptyState = document.getElementById("emptyState");

    table.innerHTML = "";


    if (data.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    data.forEach(student => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                <div class="student-name">
                    ${student.name}
                </div>
            </td>

            <td>
                <span class="roll">
                    #${student.roll}
                </span>
            </td>

            <td>
                ${student.total}/500
            </td>

            <td>
                ${student.percentage}%
            </td>

            <td>
                <span class="grade">
                    ${student.grade}
                </span>
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">

                    🗑️

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================
// ADD STUDENT
// ==========================

document
    .getElementById("studentForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const data = {

            name:
                document.getElementById("name").value,

            roll:
                document.getElementById("roll").value,

            maths:
                document.getElementById("maths").value,

            python:
                document.getElementById("python").value,

            english:
                document.getElementById("english").value,

            science:
                document.getElementById("science").value,

            computer:
                document.getElementById("computer").value

        };


        const response = await fetch("/students", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        if (!response.ok) {

            showToast(result.error);

            return;

        }


        students.push(result);


        renderStudents(students);

        updateStats(students);

        this.reset();


        showToast("Student added successfully 🎉");

    });


// ==========================
// DELETE STUDENT
// ==========================

async function deleteStudent(id) {

    const response =
        await fetch(`/students/${id}`, {

            method: "DELETE"

        });


    if (response.ok) {

        students =
            students.filter(student =>
                student.id !== id
            );


        renderStudents(students);

        updateStats(students);

        showToast("Student deleted");

    }

}


// ==========================
// SEARCH
// ==========================

document
    .getElementById("searchInput")
    .addEventListener("input", function() {

        const search =
            this.value.toLowerCase();


        const filtered =
            students.filter(student =>

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.roll
                    .toLowerCase()
                    .includes(search)

            );


        renderStudents(filtered);

    });


// ==========================
// STATISTICS
// ==========================

function updateStats(data) {

    document
        .getElementById("totalStudents")
        .textContent = data.length;


    document
        .getElementById("studentCount")
        .textContent = data.length;


    if (data.length === 0) {

        document
            .getElementById("averageMarks")
            .textContent = "0%";


        document
            .getElementById("topStudent")
            .textContent = "---";

        return;

    }


    const average =
        data.reduce(
            (sum, student) =>
                sum + student.percentage,
            0
        ) / data.length;


    document
        .getElementById("averageMarks")
        .textContent =
            average.toFixed(1) + "%";


    const top =
        [...data].sort(
            (a, b) =>
                b.percentage - a.percentage
        )[0];


    document
        .getElementById("topStudent")
        .textContent =
            top.name;

}


// ==========================
// DARK MODE
// ==========================

const themeBtn =
    document.getElementById("themeBtn");


themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");


    if (
        document.body.classList.contains("dark")
    ) {

        themeBtn.textContent = "☀️";

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        themeBtn.textContent = "🌙";

        localStorage.setItem(
            "theme",
            "light"
        );

    }

});


// ==========================
// LOAD SAVED THEME
// ==========================

if (
    localStorage.getItem("theme") === "dark"
) {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


// ==========================
// TOAST
// ==========================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ==========================
// START
// ==========================

loadStudents();