// src/pages/PageUpload/components/DietNutrientInfo.jsx
import React, { useMemo, useState } from 'react';
import CustomProgressbar1 from '../common/CustomProgressbar1';

/* ===== 공통 색상 팔레트 ===== */
const COLORS = {
  calories: '#ff4d4f', // 빨강
  protein:  '#36c96d', // 초록
  carbs:    '#b37feb', // 보라
  sodium:   '#8fa1ff', // 연파랑
  other:    '#ffd08a', // 살구
};

const clampPercent = (v) => Math.max(0, Math.min(100, Math.round(v)));
const toPercent = (value, goal) => (goal > 0 ? clampPercent((value / goal) * 100) : 0);

/* ===== SVG 도넛 그래프 (툴팁 + 직선 구분선) ===== */
function DonutSummarySvg({
  size = 220,
  thickness = 18,
  segments = [],
  centerText = { title: '총', value: 0, unit: 'kcal' },
  trackColor = '#f0f0f0',
  cutoutStartDeg = -90,
  separatorColor = '#ffffff',
  separatorWidth = 0,
}) {
  const [tip, setTip] = useState(null);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - thickness / 2;
  const C = 2 * Math.PI * r;

  const arcs = useMemo(() => {
    const totalPct = segments.reduce((s, v) => s + (v.percent || 0), 0) || 1;
    let accPct = 0;
    return segments.map((s) => {
      const pct = Math.max(0, s.percent || 0);
      const len = (pct / totalPct) * C;
      const gap = C - len;
      const rot = cutoutStartDeg + (accPct / totalPct) * 360;
      accPct += pct;
      return { ...s, dash: len, gap, rot };
    });
  }, [segments, C, cutoutStartDeg]);

  const separators = useMemo(() => {
    const totalPct = segments.reduce((s, v) => s + (v.percent || 0), 0) || 1;
    let accPct = 0;
    const lines = [];
    segments.forEach((s, idx) => {
      const pct = Math.max(0, s.percent || 0);
      const angle = cutoutStartDeg + (accPct / totalPct) * 360;
      accPct += pct;
      if (idx > 0) lines.push(angle);
    });
    return lines;
  }, [segments, cutoutStartDeg]);

  const onEnter = (e, a) => {
    const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    setTip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
      label: a.label,
      percent: clampPercent(a.percent),
      color: a.color,
    });
  };
  const onLeave = () => setTip(null);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={thickness} fill="none" />
        {arcs.map((a, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={thickness}
            strokeLinecap="butt"
            strokeDasharray={`${a.dash} ${a.gap}`}
            transform={`rotate(${a.rot} ${cx} ${cy})`}
            onMouseEnter={(e) => onEnter(e, a)}
            onMouseMove={(e) => onEnter(e, a)}
            onMouseLeave={onLeave}
          />
        ))}
        {separators.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = cx + (r - thickness / 2) * Math.cos(rad);
          const y1 = cy + (r - thickness / 2) * Math.sin(rad);
          const x2 = cx + (r + thickness / 2) * Math.cos(rad);
          const y2 = cy + (r + thickness / 2) * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={separatorColor}
              strokeWidth={separatorWidth}
            />
          );
        })}
      </svg>

      {/* 중앙 총칼로리 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div>
          <div style={{ fontSize: 15, color: '#888' }}>{centerText.title}</div>
          <div style={{ fontSize: 50, fontWeight: 800, lineHeight: 1 }}>{centerText.value}</div>
          <div style={{ fontSize: 15, color: '#888' }}>{centerText.unit}</div>
        </div>
      </div>

      {/* 툴팁 */}
      {tip && (
        <div
          style={{
            position: 'absolute',
            left: tip.x,
            top: tip.y,
            transform: 'translate(-50%, -100%)',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '6px 10px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            fontSize: 12,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: 999,
              background: tip.color,
              marginRight: 6,
            }}
          />
          <b>{tip.label}</b> · {tip.percent}%
        </div>
      )}
    </div>
  );
}

/* ===== 메인 컴포넌트 ===== */
export default function DietNutrientInfo({
  totalKcal = 0, // 🔹 props로 받는 실제 값
}) {
  // 나머지 mock 데이터 (임시)
  const totals = {
    calories: totalKcal, // props로 받은 값
    protein: 23,
    carbs: 47,
    sodium: 411,
  };

  const goals = {
    calories: 2000,
    protein: 55,
    carbs: 275,
    sodium: 2000,
  };

  const pcts = {
    calories: toPercent(totals.calories, goals.calories),
    protein: toPercent(totals.protein, goals.protein),
    carbs: toPercent(totals.carbs, goals.carbs),
    sodium: toPercent(totals.sodium, goals.sodium),
  };

  const donutSegments = useMemo(() => {
    const used = pcts.calories + pcts.protein + pcts.carbs + pcts.sodium;
    const rest = clampPercent(100 - used);
    return [
      { key: 'calories', label: '칼로리', percent: pcts.calories, color: COLORS.calories },
      { key: 'protein', label: '단백질', percent: pcts.protein, color: COLORS.protein },
      { key: 'carbs', label: '탄수화물', percent: pcts.carbs, color: COLORS.carbs },
      { key: 'sodium', label: '나트륨', percent: pcts.sodium, color: COLORS.sodium },
      { key: 'other', label: '기타', percent: rest, color: COLORS.other },
    ].filter((s) => s.percent > 0);
  }, [pcts]);

  const bars = [
    { key: 'calories', label: '칼로리', value: totals.calories, goal: goals.calories, unit: 'kcal', color: COLORS.calories, percent: pcts.calories },
    { key: 'protein', label: '단백질', value: totals.protein, goal: goals.protein, unit: 'g', color: COLORS.protein, percent: pcts.protein },
    { key: 'carbs', label: '탄수화물', value: totals.carbs, goal: goals.carbs, unit: 'g', color: COLORS.carbs, percent: pcts.carbs },
    { key: 'sodium', label: '나트륨', value: totals.sodium, goal: goals.sodium, unit: 'mg', color: COLORS.sodium, percent: pcts.sodium },
  ];

  return (
    <div
      className="diet-nutrient-info"
      style={{
        background: '#f6fff6',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ margin: '0 0 12px' }}>식단 영양소 정보</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'center' }}>
        {/* 왼쪽: 도넛 */}
        <DonutSummarySvg
          size={220}
          thickness={20}
          segments={donutSegments}
          centerText={{ title: '총', value: totals.calories || 0, unit: 'kcal' }}
        />

        {/* 오른쪽: 막대 그래프 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            rowGap: 12,
            columnGap: 16,
            alignItems: 'center',
          }}
        >
          <div style={{ gridColumn: '1 / -1', height: 1, background: '#e8e8e8', marginBottom: 4 }} />
          <div style={{ color: '#888', fontWeight: 600 }}>목표치</div>
          <div />
          <div />

          {bars.map((b) => (
            <React.Fragment key={b.key}>
              <div style={{ fontWeight: 600, color: b.color }}>{b.label}</div>
              <div>
                <div style={{ marginBottom: 6, color: '#999' }}>
                  {b.value.toLocaleString()} / {b.goal.toLocaleString()} {b.unit}
                </div>
                <CustomProgressbar1
                  percent={b.percent}
                  status={b.value > b.goal ? 'exception' : 'active'}
                  color={b.color}
                  trailColor="#e9e9e9"
                  strokeWidth={10}
                  showInfo={false}
                />
              </div>
              <div style={{ color: '#999', fontWeight: 600 }}>{b.percent}%</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
