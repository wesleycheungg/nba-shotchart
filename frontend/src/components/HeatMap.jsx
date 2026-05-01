import { useMemo } from 'react';
import { xScale, yScale } from './Court';

const W = 500;
const H = 470;
const RADIUS = 28;

// Light-theme colormap: transparent → cool blue → teal → warm orange → red
const COLORMAP = [
  [0, 0, 0, 0],
  [190, 210, 240, 70],
  [120, 170, 210, 140],
  [60, 180, 170, 180],
  [80, 195, 100, 200],
  [200, 210, 50, 220],
  [240, 160, 30, 235],
  [230, 70, 45, 245],
  [180, 20, 35, 255],
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function sampleColor(value) {
  const idx = value * (COLORMAP.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, COLORMAP.length - 1);
  const t = idx - lo;
  return [
    lerp(COLORMAP[lo][0], COLORMAP[hi][0], t),
    lerp(COLORMAP[lo][1], COLORMAP[hi][1], t),
    lerp(COLORMAP[lo][2], COLORMAP[hi][2], t),
    lerp(COLORMAP[lo][3], COLORMAP[hi][3], t),
  ];
}

function buildHeatmap(shots) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Step 1: accumulate density as alpha
  shots.forEach(s => {
    const x = xScale(s.loc_x);
    const y = yScale(s.loc_y);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, RADIUS);
    grad.addColorStop(0, 'rgba(0,0,0,0.09)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - RADIUS, y - RADIUS, RADIUS * 2, RADIUS * 2);
  });

  // Step 2: read density, normalize, and map to colormap
  const imageData = ctx.getImageData(0, 0, W, H);
  const d = imageData.data;

  let maxA = 0;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] > maxA) maxA = d[i];
  }

  for (let i = 0; i < d.length; i += 4) {
    const norm = maxA > 0 ? d[i + 3] / maxA : 0;
    const [r, g, b, a] = sampleColor(norm);
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = a;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export default function HeatMap({ shots }) {
  const dataUrl = useMemo(() => buildHeatmap(shots), [shots]);

  return (
    <image href={dataUrl} x={0} y={0} width={W} height={H} />
  );
}
