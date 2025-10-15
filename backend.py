from flask import Flask, render_template, jsonify, request, redirect, url_for, session
import json, os

app = Flask(__name__)
app.secret_key = "supersecretkey"  # For session handling

USERS_FILE = "users.json"

# ---------- DUMMY DATA ----------
mentors = [
    {"id": 1, "name": "Robert", "skill": "DevOps", "role": "Senior DevOps Engineer", "rating": 4.3, "experience": "6 years"},
    {"id": 2, "name": "Julia", "skill": "Frontend Development", "role": "Frontend Developer", "rating": 4.9, "experience": "5 years"},
    {"id": 3, "name": "Sam", "skill": "Data Science", "role": "Data Scientist", "rating": 5.0, "experience": "7 years"},
]

badges = [
    {"name": "First Session", "icon": "🏅"},
    {"name": "5-Day Streak", "icon": "🔥"},
    {"name": "Expert", "icon": "🏆"},
]


# ---------- UTILITY FUNCTIONS ----------
def load_users():
    """Load all users from JSON file."""
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w") as f:
            json.dump([], f)
    with open(USERS_FILE, "r") as f:
        return json.load(f)


def save_users(users):
    """Save users to JSON file."""
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)


# ---------- ROUTES ----------

@app.route('/')
def index():
    """Home page."""
    user = session.get("user")
    return render_template("interface.html", mentors=mentors, badges=badges, user=user)


@app.route('/login')
def login_page():
    """Login/Signup page."""
    return render_template("login.html")


# ---------- REGISTER (SIGN UP) ----------
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    users = load_users()

    # Validate fields
    required_fields = ["firstName", "lastName", "email", "password", "username", "role"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "All fields are required"}), 400

    # Check for duplicates
    if any(u["email"] == data["email"] or u["username"] == data["username"] for u in users):
        return jsonify({"error": "Email or username already exists"}), 400

    users.append(data)
    save_users(users)
    return jsonify({"message": "Signup successful!"})


# ---------- LOGIN (SIGN IN) ----------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    users = load_users()

    user = next((u for u in users if
                (u["email"] == data["user"] or u["username"] == data["user"])
                and u["password"] == data["password"]), None)

    if not user:
        return jsonify({"error": "Invalid email/username or password"}), 401

    session["user"] = {"firstName": user["firstName"], "role": user["role"], "email": user["email"]}
    return jsonify({"message": "Login successful", "user": session["user"]})


# ---------- LOGOUT ----------
@app.route('/logout')
def logout():
    session.pop("user", None)
    return redirect(url_for("index"))


# ---------- MENTORS PAGE ----------
@app.route('/mentors')
def mentor_page():
    user = session.get("user")
    return render_template("mentors.html", mentors=mentors, user=user)


# ---------- BOOK MENTOR ----------
@app.route('/book/<int:mentor_id>', methods=['POST'])
def book_mentor(mentor_id):
    mentor = next((m for m in mentors if m["id"] == mentor_id), None)
    if not mentor:
        return jsonify({"status": "error", "message": "Mentor not found"}), 404

    # Later store bookings in a file or DB
    return jsonify({"status": "success", "message": f"Session booked with {mentor['name']}!"})


# ---------- AI HELP ASSISTANT ----------
@app.route('/api/assist', methods=['POST'])
def assist():
    data = request.get_json()
    user_message = data.get("message", "").lower()

    if "mentor" in user_message:
        response = "You can explore mentors under the 'Mentors' tab or search by skill."
    elif "profile" in user_message:
        response = "You can edit your profile from the top-right corner near your name."
    elif "skill" in user_message:
        response = "Try searching skills like DevOps, AI, or Web Development in the search bar!"
    else:
        response = "I'm your AI assistant 🤖. Ask me about mentors, skills, or platform features!"

    return jsonify({"reply": response})


# ---------- MAIN ----------
if __name__ == '__main__':
    app.run(debug=True)
n