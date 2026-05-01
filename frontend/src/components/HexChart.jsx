import { useMemo } from 'react';
import { xScale, yScale } from './Court';

const R = 14;
const SQ3 = Math.sqrt(3);

function snap(px, py) {
  const col = Math.round(px / (1.5 * R));
  const rowOff = (col & 1) ? (SQ3 * R) / 2 : 0;
  const row = Math.round((py - rowOff) / (SQ3 * R));
  return `${col},${row}`;
}

function hexCenter(key) {
  const [col, row] = key.split(',').map(Number);
  const rowOff = (col & 1) ? (SQ3 * R) / 2 : 0;
  return [col * 1.5 * R, row * SQ3 * R + rowOff];
}

function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

const COLOR_STOPS = [
  [58, '#00e5a0'],
  [51, '#7dcd8e'],
  [45, '#f5c518'],
  [38, '#ff8c42'],
  [0,  '#ff3c5f'],
];

function toColor(pct) {
  for (const [threshold, color] of COLOR_STOPS) {
    if (pct >= threshold) return color;
  }
  return '#ff3c5f';
}

export default function HexChart({ shots }) {
  const bins = useMemo(() => {
    const map = new Map();
    shots.forEach(s => {
      const key = snap(xScale(s.loc_x), yScale(s.loc_y));
      if (!map.has(key)) map.set(key, { attempts: 0, made: 0 });
      const b = map.get(key);
      b.attempts++;
      if (s.shot_made === 1) b.made++;
    });
    return [...map.entries()].map(([key, b]) => ({ key, b, center: hexCenter(key) }));
  }, [shots]);

  const max = Math.max(...bins.map(({ b }) => b.attempts), 1);

  return (
    <g>
      {bins.map(({ key, b, center: [cx, cy] }) => {
        if (b.attempts < 2) return null;
        const pct = (b.made / b.attempts) * 100;
        const r = R * 0.3 + R * 0.7 * Math.sqrt(b.attempts / max);
        return (
          <polygon
            key={key}
            points={hexPoints(cx, cy, r)}
            fill={toColor(pct)}
            opacity={0.82}
            stroke="#fff"
            strokeWidth={0.5}
          />
        );
      })}
    </g>
  );
}
