import { useState } from 'react';
import { xScale, yScale } from './Court';

export default function ShotChart({ shots, showMade = true, showMissed = true }) {
  const [tooltip, setTooltip] = useState(null);

  const visible = shots.filter(s => {
    if (s.shot_made === 1 && !showMade) return false;
    if (s.shot_made === 0 && !showMissed) return false;
    return true;
  });

  const missed = visible.filter(s => s.shot_made === 0);
  const made = visible.filter(s => s.shot_made === 1);

  function handleEnter(shot, e) {
    const svg = e.target.closest('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setTooltip({ shot, x: svgPt.x, y: svgPt.y });
  }

  function handleLeave() {
    setTooltip(null);
  }

  return (
    <g>
      {missed.map((shot, i) => (
        <circle
          key={`miss-${i}`}
          cx={xScale(shot.loc_x)}
          cy={yScale(shot.loc_y)}
          r={2.5}
          fill="#e53935"
          opacity={0.4}
          onMouseEnter={e => handleEnter(shot, e)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer' }}
        />
      ))}
      {made.map((shot, i) => (
        <circle
          key={`make-${i}`}
          cx={xScale(shot.loc_x)}
          cy={yScale(shot.loc_y)}
          r={3}
          fill="#22c55e"
          opacity={0.8}
          onMouseEnter={e => handleEnter(shot, e)}
          onMouseLeave={handleLeave}
          style={{ cursor: 'pointer' }}
        />
      ))}

      {tooltip && <Tooltip {...tooltip} />}
    </g>
  );
}

function Tooltip({ shot, x, y }) {
  const made = shot.shot_made === 1;
  const qLabel = shot.period <= 4 ? `Q${shot.period}` : `OT${shot.period - 4}`;
  const lines = [
    `${made ? 'Made' : 'Missed'} ${shot.action_type}`,
    `${shot.shot_distance} ft · ${shot.shot_zone}`,
    qLabel,
  ];
  const charW = 5.4;
  const padding = 16;
  const longest = Math.max(...lines.map(l => l.length));
  const w = longest * charW + padding;
  const h = 56;

  const svgW = 500;
  const svgH = 470;
  const tx = Math.min(Math.max(5, x + 8), svgW - w - 5);
  const ty = y - h - 4 < 5 ? Math.min(y + 12, svgH - h - 5) : y - h - 4;

  return (
    <g pointerEvents="none">
      <rect
        x={tx}
        y={ty}
        width={w}
        height={h}
        rx={4}
        fill="#fff"
        stroke={made ? '#22c55e' : '#e53935'}
        strokeWidth={1}
        opacity={0.95}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={tx + 8}
          y={ty + 16 + i * 16}
          fill="#1a1a1a"
          fontSize="9"
          fontFamily="monospace"
        >
          {line}
        </text>
      ))}
    </g>
  );
}
