import sqlite3
import pandas as pd

# Connect to (or create) the database
conn = sqlite3.connect('db/shots.db')
cursor = conn.cursor()

# Create the shots table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS shots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER,
        player_name TEXT,
        loc_x INTEGER,
        loc_y INTEGER,
        shot_made INTEGER,
        action_type TEXT,
        shot_zone TEXT,
        shot_distance INTEGER,
        game_date TEXT,
        period INTEGER
    )
''')

print("Table created!")

# Load the CSV we already fetched
df = pd.read_csv('all_players_shots.csv')

# Pick only the columns we care about and rename them
df_clean = df[[
    'PLAYER_ID_NBA',
    'PLAYER_NAME',
    'LOC_X',
    'LOC_Y',
    'SHOT_MADE_FLAG',
    'ACTION_TYPE',
    'SHOT_ZONE_BASIC',
    'SHOT_DISTANCE',
    'GAME_DATE',
    'PERIOD'
]].rename(columns={
    'PLAYER_ID_NBA': 'player_id',
    'PLAYER_NAME': 'player_name',
    'LOC_X': 'loc_x',
    'LOC_Y': 'loc_y',
    'SHOT_MADE_FLAG': 'shot_made',
    'ACTION_TYPE': 'action_type',
    'SHOT_ZONE_BASIC': 'shot_zone',
    'SHOT_DISTANCE': 'shot_distance',
    'GAME_DATE': 'game_date',
    'PERIOD': 'period'
})

# Insert data into the database
df_clean.to_sql('shots', conn, if_exists='replace', index=False)
print(f"Inserted {len(df_clean)} shots into the database!")

# Test it with a quick query
print("\n--- Quick SQL query test ---")
result = cursor.execute('''
    SELECT player_name, shot_zone,
           COUNT(*) as attempts,
           SUM(shot_made) as made
    FROM shots
    GROUP BY player_name, shot_zone
    ORDER BY player_name, attempts DESC
''').fetchall()

for row in result:
    print(f"{row[0]} | {row[1]}: {row[3]}/{row[2]} made")

# Load player stats
stats_df = pd.read_csv('player_stats.csv')
stats_df.to_sql('player_stats', conn, if_exists='replace', index=False)
print(f"\nInserted stats for {len(stats_df)} players!")

# Load player bio (if available)
import os
if os.path.exists('player_bio.csv'):
    bio_df = pd.read_csv('player_bio.csv')
    bio_df.to_sql('player_bio', conn, if_exists='replace', index=False)
    print(f"Inserted bio for {len(bio_df)} players!")

if os.path.exists('player_season_stats.csv'):
    season_df = pd.read_csv('player_season_stats.csv')
    season_df.to_sql('player_season_stats', conn, if_exists='replace', index=False)
    print(f"Inserted season stats for {len(season_df)} players!")

if os.path.exists('player_career_stats.csv'):
    career_df = pd.read_csv('player_career_stats.csv')
    career_df.to_sql('player_career_stats', conn, if_exists='replace', index=False)
    print(f"Inserted career stats for {len(career_df)} players!")

conn.close()