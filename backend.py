from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Dummy data to simulate database
mentors = [
    {"name": "Robert", "role": "Senior DevOps Engineer", "rating": 4.3},
    {"name": "Julia", "role": "Frontend Developer", "rating": 4.9},
    {"name": "Sam", "role": "Data Scientist", "rating": 5.0},
]

badges = [
    {"name": "First Session", "icon": "🏅"},
    {"name": "5-Day Streak", "icon": "🔥"},
    {"name": "Expert", "icon": "🏆"},
]

@app.route('/')
def index():
    return render_template("index.html", mentors=mentors, badges=badges)

@app.route('/mentors')
def get_mentors():
    return jsonify(mentors)

# ---------- AI HELP ASSISTANT ----------
@app.route('/api/assist', methods=['POST'])
def assist():
    data = request.get_json()
    user_message = data.get("message", "").lower()

    # Basic AI logic (you can connect OpenAI API later)
    if "mentor" in user_message:
        response = "You can explore mentors under the 'Mentors' tab or search by skill."
    elif "profile" in user_message:
        response = "You can edit your profile from the top-right corner near your name."
    elif "skill" in user_message:
        response = "Try searching skills like DevOps, AI, or Web Development in the search bar!"
    else:
        response = "I'm your AI assistant 🤖. Ask me about mentors, skills, or platform features!"

    return jsonify({"reply": response})

if __name__ == '__main__':
    app.run(debug=True)
