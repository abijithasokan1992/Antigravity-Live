from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/qc', methods=['POST'])
def quality_control():
    data = request.json or {}
    result = {'status': 'ok', 'details': 'QC passed (placeholder)', 'input': data}
    return jsonify(result)

@app.route('/metadata', methods=['POST'])
def generate_metadata():
    data = request.json or {}
    result = {'status': 'ok', 'metadata': {'subtitles': [], 'tags': []}, 'input': data}
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
