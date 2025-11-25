from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def hello():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return jsonify({
        "message": "Hello from the backend!",
        "timestamp": current_time,
        "status": "success"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port={{ backend_port }}, debug=True)