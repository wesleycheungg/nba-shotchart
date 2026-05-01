import * as d3 from 'd3';

const WIDTH = 500;
const HEIGHT = 470;
const SCALE = 10;

const BASELINE_Y = -47.5;
const LANE_WIDTH = 80;        // ±8 ft from center
const LANE_LENGTH = 190;      // 19 ft from baseline
const FT_LINE_Y = BASELINE_Y + LANE_LENGTH; // 142.5
const FT_CIRCLE_R = 60;      // 6 ft radius
const RESTRICTED_R = 40;     // 4 ft restricted area
const CORNER_3_X = 220;
const THREE_PT_R = 237.5;
const CORNER_3_Y = Math.sqrt(THREE_PT_R * THREE_PT_R - CORNER_3_X * CORNER_3_X);
const THREE_ARC_ANGLE = Math.asin(CORNER_3_X / THREE_PT_R);

export const xScale = d => (d / 10) * SCALE + WIDTH / 2;
export const yScale = d => HEIGHT - 50 - (d / 10) * SCALE;

export default function Court({ children, dark = false }) {
  const bg = dark ? '#12122a' : '#f8f8f8';
  const line = dark ? 'rgba(255,255,255,0.18)' : '#ccc';
  const paintFill = dark ? '#0f0f25' : '#f0f0f0';

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ width: '100%', display: 'block' }}
    >
      {/* Background */}
      <rect width={WIDTH} height={HEIGHT} fill={bg} />

      {/* Outer boundary */}
      <rect
        x={xScale(-250)} y={yScale(422.5)}
        width={xScale(250) - xScale(-250)}
        height={yScale(-47.5) - yScale(422.5)}
        fill="none" stroke={line} strokeWidth="1.5"
      />

      {/* Paint */}
      <rect
        x={xScale(-LANE_WIDTH)} y={yScale(FT_LINE_Y)}
        width={xScale(LANE_WIDTH) - xScale(-LANE_WIDTH)}
        height={yScale(BASELINE_Y) - yScale(FT_LINE_Y)}
        fill={paintFill} stroke={line} strokeWidth="1.5"
      />

      {/* Free throw circle */}
      <circle
        cx={xScale(0)} cy={yScale(FT_LINE_Y)}
        r={(FT_CIRCLE_R / 10) * SCALE}
        fill="none" stroke={line} strokeWidth="1.5"
      />

      {/* Restricted area arc */}
      <RestrictedArc color={line} />

      {/* Basket */}
      <circle
        cx={xScale(0)} cy={yScale(0)}
        r={(7.5 / 10) * SCALE}
        fill="none" stroke={line} strokeWidth="1.5"
      />

      {/* Backboard */}
      <line
        x1={xScale(-30)} y1={yScale(-7.5)}
        x2={xScale(30)} y2={yScale(-7.5)}
        stroke={line} strokeWidth="1.5"
      />

      {/* Corner 3 lines */}
      <line x1={xScale(-CORNER_3_X)} y1={yScale(-47.5)} x2={xScale(-CORNER_3_X)} y2={yScale(CORNER_3_Y)} stroke={line} strokeWidth="1.5" />
      <line x1={xScale(CORNER_3_X)} y1={yScale(-47.5)} x2={xScale(CORNER_3_X)} y2={yScale(CORNER_3_Y)} stroke={line} strokeWidth="1.5" />

      {/* Three point arc */}
      <ThreePointArc color={line} />

      {/* Season label */}
      <text
        x={WIDTH / 2} y={22}
        textAnchor="middle"
        fill={line}
        fontFamily="monospace"
        fontSize="13px"
        letterSpacing="4px"
      >
        2024 · 25 REGULAR SEASON
      </text>

      {/* Chart layer rendered on top */}
      {children}
    </svg>
  );
}

function RestrictedArc({ color }) {
  const arcGenerator = d3.arc()
    .innerRadius((RESTRICTED_R / 10) * SCALE)
    .outerRadius((RESTRICTED_R / 10) * SCALE)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

  return (
    <path
      d={arcGenerator()}
      transform={`translate(${xScale(0)}, ${yScale(0)})`}
      fill="none" stroke={color} strokeWidth="1.5"
    />
  );
}

function ThreePointArc({ color }) {
  const arcGenerator = d3.arc()
    .innerRadius((THREE_PT_R / 10) * SCALE)
    .outerRadius((THREE_PT_R / 10) * SCALE)
    .startAngle(-THREE_ARC_ANGLE)
    .endAngle(THREE_ARC_ANGLE);

  return (
    <path
      d={arcGenerator()}
      transform={`translate(${xScale(0)}, ${yScale(0)})`}
      fill="none" stroke={color} strokeWidth="1.5"
    />
  );
}
