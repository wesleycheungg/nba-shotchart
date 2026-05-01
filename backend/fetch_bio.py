from nba_api.stats.endpoints import commonplayerinfo, playercareerstats
from nba_api.stats.endpoints import playerdashboardbygeneralsplits
import pandas as pd
import time

PLAYERS = {
    201939: 'Stephen Curry',
    2544: 'LeBron James',
    201142: 'Kevin Durant',
    1629029: 'Luka Doncic',
    203507: 'Giannis Antetokounmpo',
}

bio_rows = []
season_rows = []
career_rows = []

for player_id, name in PLAYERS.items():
    print(f"\n{'='*50}")
    print(f"Fetching data for {name} ({player_id})...")

    # --- Bio info ---
    for attempt in range(3):
        try:
            print(f"  Bio info...")
            info = commonplayerinfo.CommonPlayerInfo(
                player_id=player_id, timeout=60
            )
            df = info.get_data_frames()[0]
            row = df.iloc[0]

            # Parse draft info
            draft_year = row.get('DRAFT_YEAR', '')
            draft_round = row.get('DRAFT_ROUND', '')
            draft_number = row.get('DRAFT_NUMBER', '')

            bio_rows.append({
                'player_id': player_id,
                'player_name': name,
                'height': row.get('HEIGHT', ''),
                'weight': row.get('WEIGHT', ''),
                'position': row.get('POSITION', ''),
                'jersey': row.get('JERSEY', ''),
                'team': row.get('TEAM_NAME', ''),
                'team_abbr': row.get('TEAM_ABBREVIATION', ''),
                'college': row.get('SCHOOL', ''),
                'country': row.get('COUNTRY', ''),
                'birthdate': row.get('BIRTHDATE', ''),
                'draft_year': draft_year if draft_year != 'Undrafted' else '',
                'draft_round': draft_round if draft_round != 'Undrafted' else '',
                'draft_number': draft_number if draft_number != 'Undrafted' else '',
                'from_year': row.get('FROM_YEAR', ''),
                'experience': row.get('SEASON_EXP', ''),
            })
            break
        except Exception as e:
            print(f"    Retry {attempt + 1}/3 - {e}")
            time.sleep(10)
    time.sleep(3)

    # --- Career stats (per game, totals) ---
    for attempt in range(3):
        try:
            print(f"  Career stats...")
            career = playercareerstats.PlayerCareerStats(
                player_id=player_id,
                per_mode36='PerGame',
                timeout=60
            )
            frames = career.get_data_frames()
            seasons_pg = frames[0]  # SeasonTotalsRegularSeason (PerGame)
            career_totals = frames[1] if len(frames) > 1 else None  # CareerTotalsRegularSeason

            # Current season per-game
            current = seasons_pg[seasons_pg['SEASON_ID'] == '2024-25']
            if not current.empty:
                r = current.iloc[0]
                season_rows.append({
                    'player_id': player_id,
                    'player_name': name,
                    'season': '2024-25',
                    'team': r.get('TEAM_ABBREVIATION', ''),
                    'gp': int(r.get('GP', 0)),
                    'min_pg': round(float(r.get('MIN', 0)), 1),
                    'pts_pg': round(float(r.get('PTS', 0)), 1),
                    'reb_pg': round(float(r.get('REB', 0)), 1),
                    'ast_pg': round(float(r.get('AST', 0)), 1),
                    'stl_pg': round(float(r.get('STL', 0)), 1),
                    'blk_pg': round(float(r.get('BLK', 0)), 1),
                    'tov_pg': round(float(r.get('TOV', 0)), 1),
                    'fg_pct': round(float(r.get('FG_PCT', 0)) * 100, 1),
                    'fg3_pct': round(float(r.get('FG3_PCT', 0)) * 100, 1),
                    'ft_pct': round(float(r.get('FT_PCT', 0)) * 100, 1),
                    'fgm_pg': round(float(r.get('FGM', 0)), 1),
                    'fga_pg': round(float(r.get('FGA', 0)), 1),
                    'fg3m_pg': round(float(r.get('FG3M', 0)), 1),
                    'fg3a_pg': round(float(r.get('FG3A', 0)), 1),
                    'ftm_pg': round(float(r.get('FTM', 0)), 1),
                    'fta_pg': round(float(r.get('FTA', 0)), 1),
                })

            # Career totals per game
            if career_totals is not None and not career_totals.empty:
                c = career_totals.iloc[0]
                career_rows.append({
                    'player_id': player_id,
                    'player_name': name,
                    'gp': int(c.get('GP', 0)),
                    'min_pg': round(float(c.get('MIN', 0)), 1),
                    'pts_pg': round(float(c.get('PTS', 0)), 1),
                    'reb_pg': round(float(c.get('REB', 0)), 1),
                    'ast_pg': round(float(c.get('AST', 0)), 1),
                    'stl_pg': round(float(c.get('STL', 0)), 1),
                    'blk_pg': round(float(c.get('BLK', 0)), 1),
                    'tov_pg': round(float(c.get('TOV', 0)), 1),
                    'fg_pct': round(float(c.get('FG_PCT', 0)) * 100, 1),
                    'fg3_pct': round(float(c.get('FG3_PCT', 0)) * 100, 1),
                    'ft_pct': round(float(c.get('FT_PCT', 0)) * 100, 1),
                })
            break
        except Exception as e:
            print(f"    Retry {attempt + 1}/3 - {e}")
            time.sleep(10)
    time.sleep(3)

print(f"\n{'='*50}")
print("Saving CSVs...")

pd.DataFrame(bio_rows).to_csv('player_bio.csv', index=False)
print(f"  player_bio.csv — {len(bio_rows)} players")

pd.DataFrame(season_rows).to_csv('player_season_stats.csv', index=False)
print(f"  player_season_stats.csv — {len(season_rows)} players")

pd.DataFrame(career_rows).to_csv('player_career_stats.csv', index=False)
print(f"  player_career_stats.csv — {len(career_rows)} players")

print("\nDone! Now run setup_db.py to load into the database.")
