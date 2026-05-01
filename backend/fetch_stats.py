from nba_api.stats.endpoints import playercareerstats
import pandas as pd
import time

PLAYERS = {
    201939: 'Stephen Curry',
    2544: 'LeBron James',
    201142: 'Kevin Durant',
    1629029: 'Luka Doncic',
    203507: 'Giannis Antetokounmpo',
}

print("Fetching season averages...")
stats_rows = []
for player_id, name in PLAYERS.items():
    for attempt in range(3):
        try:
            print(f"  {name}...")
            career = playercareerstats.PlayerCareerStats(
                player_id=player_id,
                timeout=60
            )
            seasons = career.get_data_frames()[0]
            current = seasons[seasons['SEASON_ID'] == '2024-25']
            if not current.empty:
                row = current.iloc[0]
                gp = row['GP']
                pts = row['PTS']
                ftm = row['FTM']
                fta = row['FTA']
                stats_rows.append({
                    'player_id': player_id,
                    'player_name': name,
                    'ppg': round(pts / gp, 1) if gp > 0 else 0,
                    'ft_pct': round(ftm / fta * 100, 1) if fta > 0 else 0,
                })
            break
        except Exception as e:
            print(f"    Retry {attempt + 1}/3 - {e}")
            time.sleep(10)
    time.sleep(5)

stats_df = pd.DataFrame(stats_rows)
stats_df.to_csv('player_stats.csv', index=False)
print(f"Saved stats for {len(stats_df)} players to player_stats.csv")
