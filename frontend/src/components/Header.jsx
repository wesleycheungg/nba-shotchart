import { useState } from 'react';
import '../styles/Header.css';
import { HeaderSkeleton } from './Skeleton';

const PLAYERS = [
  { id: 201939, name: 'Stephen Curry' },
  { id: 2544, name: 'LeBron James' },
  { id: 201142, name: 'Kevin Durant' },
  { id: 1629029, name: 'Luka Doncic' },
  { id: 203507, name: 'Giannis Antetokounmpo' },
];

function getHeadshotUrl(playerId) {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
}

export { PLAYERS };

export default function Header({ shots, loading, error, playerId, onPlayerChange, playerStats, playerBio }) {
  const [statMode, setStatMode] = useState('season');

  if (loading) {
    return (
      <header className="player-header">
        <HeaderSkeleton />
      </header>
    );
  }

  const player = PLAYERS.find(p => p.id === playerId);
  const bio = playerBio?.bio;
  const season = playerBio?.season;
  const career = playerBio?.career;

  const fga = shots.length;
  const fgm = shots.filter(s => s.shot_made === 1).length;

  const threes = shots.filter(s => s.shot_zone && s.shot_zone.includes('3'));
  const threesAttempted = threes.length;
  const threesmade = threes.filter(s => s.shot_made === 1).length;

  const fgPct = fga > 0 ? ((fgm / fga) * 100).toFixed(1) : '0.0';
  const threePct = threesAttempted > 0 ? ((threesmade / threesAttempted) * 100).toFixed(1) : '0.0';
  const efgPct = fga > 0 ? (((fgm + 0.5 * threesmade) / fga) * 100).toFixed(1) : '0.0';

  const draftText = bio?.draft_year
    ? `${bio.draft_year} Rd ${bio.draft_round}, Pick ${bio.draft_number}`
    : 'Undrafted';

  return (
    <header className="player-header">
      <div className="player-silhouette">
        <img src={getHeadshotUrl(playerId)} alt={`${player?.name}`} />
      </div>

      <div className="player-info">
        <h1 className="player-name">{player?.name}</h1>

        {bio && (
          <div className="player-bio">
            <span className="bio-item">{bio.position}</span>
            <span className="bio-sep" />
            <span className="bio-item">{bio.height}, {bio.weight} lbs</span>
            <span className="bio-sep" />
            <span className="bio-item">{bio.team}</span>
            {bio.jersey && (
              <>
                <span className="bio-sep" />
                <span className="bio-item">#{bio.jersey}</span>
              </>
            )}
            <span className="bio-sep" />
            <span className="bio-item">{bio.college || bio.country}</span>
            <span className="bio-sep" />
            <span className="bio-item">{draftText}</span>
            {bio.experience && (
              <>
                <span className="bio-sep" />
                <span className="bio-item">{bio.experience} yrs exp</span>
              </>
            )}
          </div>
        )}

        <div className="player-picker">
          {PLAYERS.map(p => (
            <button
              key={p.id}
              className={`player-chip${p.id === playerId ? ' active' : ''}`}
              onClick={() => onPlayerChange(p.id)}
            >
              <img
                className="chip-headshot"
                src={getHeadshotUrl(p.id)}
                alt={p.name}
              />
              <span className="chip-name">{p.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {error && <div className="header-error">{error}</div>}
        {!error && (
          <>
            <div className="stat-mode-toggle">
              <button
                className={`stat-mode-btn ${statMode === 'season' ? 'active' : ''}`}
                onClick={() => setStatMode('season')}
              >
                2024–25
              </button>
              <button
                className={`stat-mode-btn ${statMode === 'career' ? 'active' : ''}`}
                onClick={() => setStatMode('career')}
              >
                Career
              </button>
            </div>
            <div className="player-stats">
              {statMode === 'season' ? (
                <>
                  <Stat value={season?.pts_pg ?? playerStats.ppg} label="PPG" />
                  <Stat value={season?.reb_pg ?? '—'} label="RPG" />
                  <Stat value={season?.ast_pg ?? '—'} label="APG" />
                  <Stat value={`${fgPct}%`} label="FG%" />
                  <Stat value={`${threePct}%`} label="3P%" />
                  <Stat value={`${efgPct}%`} label="eFG%" />
                  <Stat value={`${season?.ft_pct ?? playerStats.ft_pct}%`} label="FT%" />
                  <Stat value={season?.stl_pg ?? '—'} label="STL" />
                  <Stat value={season?.blk_pg ?? '—'} label="BLK" />
                </>
              ) : (
                <>
                  <Stat value={career?.pts_pg ?? '—'} label="PPG" />
                  <Stat value={career?.reb_pg ?? '—'} label="RPG" />
                  <Stat value={career?.ast_pg ?? '—'} label="APG" />
                  <Stat value={career?.fg_pct != null ? `${career.fg_pct}%` : '—'} label="FG%" />
                  <Stat value={career?.fg3_pct != null ? `${career.fg3_pct}%` : '—'} label="3P%" />
                  <Stat value={career?.ft_pct != null ? `${career.ft_pct}%` : '—'} label="FT%" />
                  <Stat value={career?.stl_pg ?? '—'} label="STL" />
                  <Stat value={career?.blk_pg ?? '—'} label="BLK" />
                  <Stat value={career?.gp ?? '—'} label="GP" />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
