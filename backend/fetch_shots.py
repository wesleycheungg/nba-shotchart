from nba_api.stats.endpoints import shotchartdetail
import pandas as pd
import time

PLAYERS = {
    201939: 'Stephen Curry',
    2544: 'LeBron James',
    201142: 'Kevin Durant',
    1629029: 'Luka Doncic',
    203507: 'Giannis Antetokounmpo',
}

all_shots = []

for player_id, name in PLAYERS.items():
    print(f"Fetching shot data for {name}...")
    shots = shotchartdetail.ShotChartDetail(
        team_id=0,
        player_id=player_id,
        season_type_all_star='Regular Season',
        season_nullable='2024-25',
        context_measure_simple='FGA'
    )
    df = shots.get_data_frames()[0]
    df['PLAYER_ID_NBA'] = player_id
    all_shots.append(df)
    print(f"  Got {len(df)} shots!")
    time.sleep(1)

combined = pd.concat(all_shots, ignore_index=True)
combined.to_csv('all_players_shots.csv', index=False)
print(f"\nSaved {len(combined)} total shots to all_players_shots.csv")