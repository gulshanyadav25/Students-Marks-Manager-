from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = "students.json"


def load_students():
    if not os.path.exists(DATA_FILE):
        return []

    try:
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    except:
        return []


def save_students(students):
    with open(DATA_FILE, "w") as file:
        json.dump(students, file, indent=4)


def calculate_grade(percentage):
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 50:
        return "D"
    else:
        return "F"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(load_students())


@app.route("/students", methods=["POST"])
def add_student():

    data = request.get_json()

    name = data.get("name", "").strip()
    roll = data.get("roll", "").strip()

    try:
        maths = float(data.get("maths", 0))
        python = float(data.get("python", 0))
        english = float(data.get("english", 0))
        science = float(data.get("science", 0))
        computer = float(data.get("computer", 0))
    except:
        return jsonify({"error": "Please enter valid marks"}), 400

    if not name or not roll:
        return jsonify({"error": "Name and roll number are required"}), 400

    marks = [maths, python, english, science, computer]

    if any(mark < 0 or mark > 100 for mark in marks):
        return jsonify({"error": "Marks must be between 0 and 100"}), 400

    students = load_students()

    total = sum(marks)
    percentage = total / 5
    grade = calculate_grade(percentage)

    student = {
        "id": len(students) + 1,
        "name": name,
        "roll": roll,
        "maths": maths,
        "python": python,
        "english": english,
        "science": science,
        "computer": computer,
        "total": total,
        "percentage": round(percentage, 2),
        "grade": grade
    }

    students.append(student)

    save_students(students)

    return jsonify(student)


@app.route("/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):

    students = load_students()

    students = [
        student for student in students
        if student["id"] != student_id
    ]

    save_students(students)

    return jsonify({"message": "Student deleted"})


if __name__ == "__main__":
    app.run(debug=True)