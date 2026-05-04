from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect('db/shots.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/shots', methods=['GET'])
def get_shots():
    player_id = request.args.get('player_id', 201939, type=int)
    conn = get_db()
    cursor = conn.cursor()

    shots = cursor.execute('''
        SELECT player_name, loc_x, loc_y, shot_made, action_type, shot_zone, shot_distance, period
        FROM shots
        WHERE player_id = ?
    ''', (player_id,)).fetchall()

    conn.close()

    return jsonify([dict(shot) for shot in shots])

@app.route('/api/shots/summary', methods=['GET'])
def get_summary():
    player_id = request.args.get('player_id', 201939, type=int)
    conn = get_db()
    cursor = conn.cursor()

    summary = cursor.execute('''
        SELECT shot_zone,
               COUNT(*) as attempts,
               SUM(shot_made) as made,
               ROUND(SUM(shot_made) * 100.0 / COUNT(*), 1) as percentage
        FROM shots
        WHERE player_id = ?
        GROUP BY shot_zone
        ORDER BY attempts DESC
    ''', (player_id,)).fetchall()

    conn.close()

    return jsonify([dict(row) for row in summary])

@app.route('/api/player/stats', methods=['GET'])
def get_player_stats():
    player_id = request.args.get('player_id', 201939, type=int)
    conn = get_db()
    cursor = conn.cursor()

    row = cursor.execute('''
        SELECT ppg, ft_pct
        FROM player_stats
        WHERE player_id = ?
    ''', (player_id,)).fetchone()

    conn.close()

    if row:
        return jsonify(dict(row))
    return jsonify({'ppg': 0, 'ft_pct': 0})

@app.route('/api/player/bio', methods=['GET'])
def get_player_bio():
    player_id = request.args.get('player_id', 201939, type=int)
    conn = get_db()
    cursor = conn.cursor()

    bio = cursor.execute(
        'SELECT * FROM player_bio WHERE player_id = ?', (player_id,)
    ).fetchone()

    season = cursor.execute(
        'SELECT * FROM player_season_stats WHERE player_id = ?', (player_id,)
    ).fetchone()

    career = cursor.execute(
        'SELECT * FROM player_career_stats WHERE player_id = ?', (player_id,)
    ).fetchone()

    conn.close()

    return jsonify({
        'bio': dict(bio) if bio else None,
        'season': dict(season) if season else None,
        'career': dict(career) if career else None,
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)