// src/pages/PageUpload/components/DietNutrientInfo.jsx
import React, { useMemo, useState } from 'react';
import CustomProgressbar1 from '../common/CustomProgressbar1';

const COLORS = {
  calories: '#ff8486',  // 6자리 권장
  protein:  '#36c96d',
  carbs:    '#b37feb',
  fat:      '#ffd08a',
  other:    '#e9e9e9',
};

const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
const toPctRaw = (v, g) => (g > 0 ? (v / g) * 100 : 0);     // 캡 없음
const toPctCap = (v, g) => (g > 0 ? clamp((v / g) * 100) : 0); // 0~100 캡

/* donut */
function Donut({ size=220, thickness=20, segments=[], centerText={ title:'총', value:0, unit:'kcal' } }) {
  const [tip, setTip] = useState(null);
  const cx=size/2, cy=size/2, r=size/2-thickness/2, C=2*Math.PI*r, start=-90;

  const arcs = useMemo(() => {
    const total = segments.reduce((s,x)=>s+(x.percent||0),0)||1;
    let acc=0;
    return segments.map(s=>{
      const pct=Math.max(0,s.percent||0);
      const len=(pct/total)*C, gap=C-len, rot=start + (acc/total)*360; acc+=pct;
      return {...s, dash:len, gap, rot};
    });
  }, [segments, C]);

  return (
    <div style={{position:'relative', width:size, height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} stroke="#f0f0f0" strokeWidth={thickness} fill="none" />
        {arcs.map((a,i)=>(
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={a.color} strokeWidth={thickness} strokeLinecap="butt"
            strokeDasharray={`${a.dash} ${a.gap}`}
            transform={`rotate(${a.rot} ${cx} ${cy})`}
            onMouseEnter={(e)=>{const rect=e.currentTarget.ownerSVGElement.getBoundingClientRect(); setTip({x:e.clientX-rect.left,y:e.clientY-rect.top-10,label:a.label,percent:clamp(a.percent),color:a.color});}}
            onMouseMove={(e)=>{const rect=e.currentTarget.ownerSVGElement.getBoundingClientRect(); setTip({x:e.clientX-rect.left,y:e.clientY-rect.top-10,label:a.label,percent:clamp(a.percent),color:a.color});}}
            onMouseLeave={()=>setTip(null)}
          />
        ))}
      </svg>

      <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', textAlign:'center', pointerEvents:'none'}}>
        <div>
          <div style={{fontSize:15, color:'#888'}}>{centerText.title}</div>
          <div style={{fontSize:50, fontWeight:800, lineHeight:1}}>{centerText.value}</div>
          <div style={{fontSize:15, color:'#888'}}>{centerText.unit}</div>
        </div>
      </div>

      {tip && (
        <div style={{position:'absolute', left:tip.x, top:tip.y, transform:'translate(-50%, -100%)',
          background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, padding:'6px 10px',
          boxShadow:'0 6px 20px rgba(0,0,0,0.08)', pointerEvents:'none', whiteSpace:'nowrap', fontSize:12}}>
          <span style={{display:'inline-block', width:8, height:8, borderRadius:999, background:tip.color, marginRight:6}}/>
          <b>{tip.label}</b> · {tip.percent}%
        </div>
      )}
    </div>
  );
}

export default function DietNutrientInfo({ totals, goals }) {
  const G = goals || { calories: 2000, protein: 55, carbs: 275, fat: 54 };

  // 1) 원본 퍼센트(캡 없음)
  const pRaw = useMemo(() => {
    if (!totals) return { calories:0, protein:0, carbs:0, fat:0 };
    return {
      calories: toPctRaw(totals.calories, G.calories),
      protein:  toPctRaw(totals.protein,  G.protein),
      carbs:    toPctRaw(totals.carbs,    G.carbs),
      fat:      toPctRaw(totals.fat,      G.fat),
    };
  }, [totals, G]);

  // 2) 표시/도넛/막대 채움용(0~100)
  const pCap = useMemo(() => ({
    calories: toPctCap(totals?.calories ?? 0, G.calories),
    protein:  toPctCap(totals?.protein  ?? 0, G.protein),
    carbs:    toPctCap(totals?.carbs    ?? 0, G.carbs),
    fat:      toPctCap(totals?.fat      ?? 0, G.fat),
  }), [totals, G]);

  const segments = useMemo(() => {
    const used = pCap.calories + pCap.protein + pCap.carbs + pCap.fat;
    const rest = clamp(100 - used);
    return [
      { key:'calories', label:'칼로리',   percent:pCap.calories, color:COLORS.calories },
      { key:'protein',  label:'단백질',   percent:pCap.protein,  color:COLORS.protein  },
      { key:'carbs',    label:'탄수화물', percent:pCap.carbs,    color:COLORS.carbs    },
      { key:'fat',      label:'지방',     percent:pCap.fat,      color:COLORS.fat      },
      { key:'other',    label:'기타',     percent:rest,          color:COLORS.other    },
    ].filter(s=>s.percent>0);
  }, [pCap]);

  const bars = [
    {
      key:'calories', label:'칼로리',
      value: totals?.calories ?? 0, goal: G.calories, unit:'kcal',
      color: COLORS.calories, percentRaw: pRaw.calories, percentCap: pCap.calories
    },
    {
      key:'protein', label:'단백질',
      value: totals?.protein ?? 0, goal: G.protein, unit:'g',
      color: COLORS.protein, percentRaw: pRaw.protein, percentCap: pCap.protein
    },
    {
      key:'carbs', label:'탄수화물',
      value: totals?.carbs ?? 0, goal: G.carbs, unit:'g',
      color: COLORS.carbs, percentRaw: pRaw.carbs, percentCap: pCap.carbs
    },
    {
      key:'fat', label:'지방',
      value: totals?.fat ?? 0, goal: G.fat, unit:'g',
      color: COLORS.fat, percentRaw: pRaw.fat, percentCap: pCap.fat
    },
  ];

  return (
    <div style={{ background:'#f6fff6', borderRadius:16, padding:16, boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin:'0 0 12px' }}>식단 영양소 정보</h3>

      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:16, alignItems:'center' }}>
        <Donut
          size={220}
          thickness={20}
          segments={segments}
          centerText={{ title:'총', value: totals?.calories || 0, unit:'kcal' }}
        />

        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', rowGap:12, columnGap:16, alignItems:'center' }}>
          <div style={{ gridColumn:'1 / -1', height:1, background:'#e8e8e8', marginBottom:4 }} />
          <div style={{ color:'#888', fontWeight:600 }}>목표치</div><div /><div />
          {bars.map(b=>(
            <React.Fragment key={b.key}>
              <div style={{ fontWeight:600, color:b.color }}>{b.label}</div>
              <div>
                <div style={{ marginBottom:4, color:'#999' }}>
                  {b.value.toLocaleString()} / {b.goal.toLocaleString()} {b.unit}
                </div>
                {/* 막대는 0~100으로 채움. CustomProgressbar1이 내부에서 cap 처리하도록 percentRaw를 넘겨도 됨 */}
                <CustomProgressbar1
                  percent={b.percentRaw}
                  status={b.value > b.goal ? 'exception' : 'active'}
                  color={b.color}
                  trailColor="#e9e9e9"
                  strokeWidth={12}
                  showInfo={false}
                />
              </div>
              {/* 텍스트는 원본 퍼센트로 표시, 100% 이상이면 빨간색 */}
              <div style={{ color: b.percentRaw >= 100 ? 'red' : '#999', fontWeight:600 }}>
                {Math.round(b.percentRaw)}%
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
