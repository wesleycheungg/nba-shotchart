import { useMemo } from 'react';
import '../styles/KeyInsight.css';

const MIN_ATTEMPTS = 10;

// League averages by zone (2024-25 approximations)
const LEAGUE_AVG = {
  'restricted area': 63.0,
  'in the paint (non-ra)': 40.5,
  'mid-range': 42.0,
  'above the break 3': 35.8,
  'left corner 3': 38.5,
  'right corner 3': 38.5,
};

function getLastName(name) {
  return name?.split(' ').pop() || 'Player';
}

function diff(pct, zone) {
  const avg = LEAGUE_AVG[zone.toLowerCase()] || 44.0;
  return pct - avg;
}

function fmt(n) {
  const s = n.toFixed(1);
  return n > 0 ? `+${s}%` : `${s}%`;
}

function generateInsight(zones, playerName, shots) {
  if (!zones || zones.length === 0 || !shots || shots.length === 0) return null;

  const last = getLastName(playerName);
  const qualified = zones.filter(z => z.attempts >= MIN_ATTEMPTS);
  if (qualified.length === 0) return null;

  const totalAttempts = zones.reduce((s, z) => s + z.attempts, 0);
  const totalMade = zones.reduce((s, z) => s + z.made, 0);
  const overallPct = totalAttempts > 0 ? (totalMade / totalAttempts) * 100 : 0;

  const candidates = [];

  // 1. Biggest positive outlier vs league avg
  for (const z of qualified) {
    const d = diff(z.percentage, z.shot_zone);
    if (d > 3) {
      candidates.push({
        score: d * Math.log(z.attempts + 1),
        line1: `${last} is shooting <b>${z.percentage}%</b> from <b>${z.shot_zone}</b> — <b>${fmt(d)}</b> above league average.`,
        line2: `${z.made}/${z.attempts} from this zone, accounting for ${((z.attempts / totalAttempts) * 100).toFixed(0)}% of his shots.`,
      });
    }
  }

  // 2. Biggest negative outlier (cold zone)
  for (const z of qualified) {
    const d = diff(z.percentage, z.shot_zone);
    if (d < -5) {
      candidates.push({
        score: Math.abs(d) * Math.log(z.attempts + 1) * 0.8,
        line1: `${last} is struggling from <b>${z.shot_zone}</b> at just <b>${z.percentage}%</b> — <b>${fmt(d)}</b> below league average.`,
        line2: `${z.made}/${z.attempts} on the season from this zone.`,
      });
    }
  }

  // 3. Volume dominance — if one zone is >40% of shots
  for (const z of qualified) {
    const share = (z.attempts / totalAttempts) * 100;
    if (share > 40) {
      const d = diff(z.percentage, z.shot_zone);
      candidates.push({
        score: share * 1.5,
        line1: `${last} takes <b>${share.toFixed(0)}%</b> of his shots from <b>${z.shot_zone}</b>, converting at <b>${z.percentage}%</b> (${fmt(d)} vs avg).`,
        line2: `${z.attempts} of ${totalAttempts} total field goal attempts this season.`,
      });
    }
  }

  // 4. Corner 3 specialist — high pct from either corner
  const corners = qualified.filter(z => z.shot_zone.toLowerCase().includes('corner'));
  for (const c of corners) {
    const d = diff(c.percentage, c.shot_zone);
    if (d > 5 && c.percentage >= 45) {
      candidates.push({
        score: d * 2.5,
        line1: `${last} is lethal from <b>${c.shot_zone}</b> — hitting <b>${c.percentage}%</b> on ${c.attempts} attempts (<b>${fmt(d)}</b> vs avg).`,
        line2: `One of his most efficient spots on the floor this season.`,
      });
    }
  }

  // 5. Rim finishing — restricted area context
  const ra = qualified.find(z => z.shot_zone.toLowerCase().includes('restricted'));
  if (ra) {
    const d = diff(ra.percentage, ra.shot_zone);
    if (Math.abs(d) > 3) {
      candidates.push({
        score: Math.abs(d) * Math.log(ra.attempts + 1) * 0.9,
        line1: `${last} is finishing at <b>${ra.percentage}%</b> at the rim — <b>${fmt(d)}</b> ${d > 0 ? 'above' : 'below'} league average.`,
        line2: `${ra.made}/${ra.attempts} in the restricted area this season.`,
      });
    }
  }

  // 6. Mid-range game
  const mid = qualified.find(z => z.shot_zone.toLowerCase().includes('mid-range'));
  if (mid) {
    const d = diff(mid.percentage, mid.shot_zone);
    if (d > 5) {
      candidates.push({
        score: d * Math.log(mid.attempts + 1) * 0.85,
        line1: `${last} has a deadly mid-range game — <b>${mid.percentage}%</b> on ${mid.attempts} attempts (<b>${fmt(d)}</b> vs avg).`,
        line2: `The mid-range accounts for ${((mid.attempts / totalAttempts) * 100).toFixed(0)}% of his shot diet.`,
      });
    }
  }

  if (candidates.length === 0) {
    // Fallback: just show best zone
    const best = qualified.reduce((a, b) => (b.percentage > a.percentage ? b : a));
    const d = diff(best.percentage, best.shot_zone);
    return {
      line1: `${last} is most efficient from <b>${best.shot_zone}</b> at <b>${best.percentage}%</b> (${fmt(d)} vs avg).`,
      line2: `${best.made}/${best.attempts} this season, ${((best.attempts / totalAttempts) * 100).toFixed(0)}% of total volume.`,
    };
  }

  // Return highest scored candidate
  return candidates.reduce((a, b) => (b.score > a.score ? b : a));
}

export default function KeyInsight({ zones, playerName, shots }) {
  const insight = useMemo(() => generateInsight(zones, playerName, shots), [zones, playerName, shots]);

  if (!insight) return null;

  return (
    <div className="key-insight">
      <span className="key-insight-tag">Key Insight</span>
      <div className="key-insight-body">
        <p className="key-insight-line1" dangerouslySetInnerHTML={{ __html: insight.line1 }} />
        <p className="key-insight-line2">{insight.line2}</p>
      </div>
    </div>
  );
}
