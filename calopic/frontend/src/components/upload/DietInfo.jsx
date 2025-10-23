// src/pages/PageUpload/components/DietInfo.jsx
import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Card, InputNumber, Form, Space, Tag, Empty, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import CustomModal1 from '../common/CustomModal1';
import CustomSelect2 from '../common/CustomSelect2';

const IMG_CARROT = '/images/carrot.jpg';

export default function DietInfo({ onChange, onTotalsChange }) {
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
