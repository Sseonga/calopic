// src/pages/PageUpload/components/DietInfo.jsx
import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Card, InputNumber, Form, Space, Tag, Empty, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import CustomModal1 from '../common/CustomModal1';
import CustomSelect2 from '../common/CustomSelect2';

const IMG_CARROT = '/images/carrot.jpg';

export default function DietInfo({ onChange, onTotalsChange, detections = [] }) {
  const [items, setItems] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [form] = Form.useForm();
  const [unit, setUnit] = useState('g');
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await axios.get('http://localhost:18090/api/upload/foods');
      const opts = (res.data || []).map((f) => ({ value: f.foodName, label: f.foodName }));
      setFoodOptions(opts);
    })();
  }, []);

   // *** AI 탐지 결과(detections)가 바뀔 때 자동으로 DB에서 음식정보 불러오기 ***
  useEffect(() => {
    if (!detections || detections.length === 0) return;

    // 1) class_id 목록만 추출
    // const classIds = [...new Set(detections.map(d => d.class_id))];
    const classIds  = [...new Set(detections.map(d => d.class_id))];
    const classNames = [...new Set(detections.map(d => d.class_name))];

    // 2) DB에서 yolo_id와 매칭되는 음식 가져오기
    (async () => {
      try {
        // const { data } = await axios.post('http://localhost:18090/api/upload/foods/by-yolo', {
        //   classIds: classIds,
        // });
        console.log('[by-yolo] req', { classIds, classNames });
        const { data } = await axios.post('http://localhost:18090/api/upload/foods/by-yolo', {
          classIds, classNames
        });
        console.log('[by-yolo] res', data?.length, data);

        // 3) 이미 추가된 항목 중복 제거
        const existingNames = new Set(items.map(it => it.name));
        const newItems = data
          .filter(f => !existingNames.has(f.foodName))
          .map(f => ({
            id: crypto.randomUUID(),
            foodId: f.foodId,
            name: f.foodName,
            kcalPer100: Number(f.foodKcal) || 0,
            proteinPer100: Number(f.foodProtein) || 0,
            carbsPer100: Number(f.foodCarbo) || 0,
            fatPer100: Number(f.foodFat) || 0,
            amount: 100, // 기본값
            unit: 'g',
            img: IMG_CARROT,
          }));

        if (newItems.length > 0) {
          // const next = [...items, ...newItems];
          // setItems(next);
          // onChange?.(next);
           setItems(prev => {
           const exist = new Set(prev.map(p => p.name));
           const add = newItems.filter(n => !exist.has(n.name));
           const next = [...prev, ...add];
           onChange?.(next);
           return next;
         });
       } else {
         console.warn('[by-yolo] 매칭 0건 — DB YOLO_ID 혹은 이름 매핑 확인 필요');
        }
      } catch (e) {
        // console.error('음식정보 불러오기 실패:', e);
        console.error('음식정보 불러오기 실패:', e?.response?.status, e?.response?.data, e);
      }
    })();
  }, [detections]); // ← AI 분석 결과 변경될 때마다 자동 실행

  const toGram = (amount, u) => (!amount ? 0 : u === 'kg' ? amount * 1000 : u === '개' ? amount * 100 : amount);

  const totals = useMemo(() => {
    const acc = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    items.forEach((it) => {
      const m = toGram(it.amount, it.unit) / 100;
      acc.calories += (Number(it.kcalPer100)    || 0) * m;
      acc.protein  += (Number(it.proteinPer100) || 0) * m;
      acc.carbs    += (Number(it.carbsPer100)   || 0) * m;
      acc.fat      += (Number(it.fatPer100)     || 0) * m;
    });
    return {
      calories: Math.round(acc.calories),
      protein:  Math.round(acc.protein * 10) / 10,
      carbs:    Math.round(acc.carbs * 10) / 10,
      fat:      Math.round(acc.fat * 10) / 10,
    };
  }, [items]);

  useEffect(() => { onTotalsChange?.(totals); }, [totals, onTotalsChange]);

  const emit = (next) => { setItems(next); onChange?.(next); };
  const handleRemove = (id) => emit(items.filter((it) => it.id !== id));
  const handleAmountChange = (id, amount) => emit(items.map((it) => (it.id === id ? { ...it, amount: amount ?? 0 } : it)));

  const handleAdd = async () => {
    const { name, amount } = await form.validateFields();
    const res = await axios.get(`http://localhost:18090/api/upload/foods/${encodeURIComponent(name)}`);
    const f = res.data;

    emit([
      ...items,
      {
        id: crypto.randomUUID(),
        foodId: f.foodId,
        name: f.foodName,
        kcalPer100: Number(f.foodKcal)      || 0,
        proteinPer100: Number(f.foodProtein) || 0,
        carbsPer100:   Number(f.foodCarbo)   || 0,
        fatPer100:     Number(f.foodFat)     || 0,
        amount: Number(amount),
        unit,
        img: IMG_CARROT,
      },
    ]);
    form.resetFields(); setUnit('g'); setSelectedFood(null);
  };

  return (
    <div className="diet-info" style={{ background:'#f6fff6', borderRadius:16, padding:16, boxShadow:'0 4px 16px rgba(0,0,0,0.06)', display:'grid', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h3 style={{ margin:0 }}>식단 정보</h3>
        <CustomModal1
          title={<div style={{ fontWeight:700, fontSize:18, paddingBottom:8, borderBottom:'1px solid #eee' }}>음식 추가하기</div>}
          buttonText="음식 추가하기" okText="추가" onOk={handleAdd} width={520}
        >
          <Form form={form} layout="vertical" colon={false}>
            <Form.Item label={<span style={{ fontWeight:600 }}>음식명</span>} name="name" rules={[{ required:true, message:'음식명을 선택하세요' }]}>
              <CustomSelect2
                options={foodOptions}
                value={selectedFood}
                onChange={(v)=>{ setSelectedFood(v); form.setFieldsValue({ name:v }); }}
                placeholder="음식을 선택하세요." style={{ width:'100%' }}
              />
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight:600 }}>양</span>} required style={{ marginBottom:0 }}>
              <div style={{ display:'flex', gap:8 }}>
                <Form.Item name="amount" initialValue={100} rules={[{ required:true, message:'양을 입력하세요' }]} style={{ flex:1, marginBottom:0 }}>
                  <InputNumber min={0} style={{ width:'100%' }} />
                </Form.Item>
                <Select value={unit} onChange={setUnit} options={[{value:'g',label:'g'},{value:'kg',label:'kg'},{value:'개',label:'개'}]} style={{ width:90 }} />
              </div>
              <div style={{ fontSize:12, color:'#8c8c8c', marginTop:6 }}>* 현재는 1개 = 100g 임시 계산</div>
            </Form.Item>
          </Form>
        </CustomModal1>
      </div>

      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        {items.length === 0 ? (
          <div style={{ width:'100%' }}><Empty description="추가된 음식이 없습니다" /></div>
        ) : (
          items.map((it) => {
            const toGram = (amount, u) => (!amount ? 0 : u === 'kg' ? amount * 1000 : u === '개' ? amount * 100 : amount);
            const kcal = Math.round((it.kcalPer100 * (toGram(it.amount, it.unit))) / 100);
            return (
              <Card key={it.id} hoverable style={{ width:180, borderRadius:12 }}
                cover={
                  <div style={{ position:'relative', height:110, overflow:'hidden', borderTopLeftRadius:12, borderTopRightRadius:12 }}>
                    <img src={it.img} alt={it.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <button onClick={()=>handleRemove(it.id)} style={{ position:'absolute', top:8, right:8, width:24, height:24, borderRadius:24, background:'rgba(0,0,0,0.55)', color:'#fff', border:'none', display:'grid', placeItems:'center', cursor:'pointer' }} aria-label="삭제" title="삭제">
                      <CloseOutlined />
                    </button>
                  </div>
                }
                bodyStyle={{ padding:12 }}
              >
                <Space direction="vertical" size={6} style={{ width:'100%' }}>
                  <div style={{ fontWeight:600 }}>{it.name}</div>
                  <div style={{ fontSize:12, color:'#8c8c8c' }}>100g 당 <b>{it.kcalPer100}</b> kcal</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:12, color:'#8c8c8c' }}>양</span>
                    <InputNumber min={0} size="small" value={it.amount} onChange={(v)=>handleAmountChange(it.id, v)} />
                    <Tag color="green" style={{ marginLeft:'auto' }}>{kcal} kcal</Tag>
                  </div>
                </Space>
              </Card>
            );
          })
        )}
      </div>

      <div style={{ textAlign:'right', color:'#8c8c8c' }}>
        총 <b>{totals.calories}</b> kcal
      </div>
    </div>
  );
}
