// src/pages/PageUpload/components/DietInfo.jsx
import React, { useMemo, useState } from 'react';
import { Card, InputNumber, Form, Input, Space, Tag, Empty, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import CustomModal1 from '../common/CustomModal1';
import CustomSelect2 from '../common/CustomSelect2';

const IMG_CARROT = '/images/carrot.jpg';

// (임시) 검색 옵션 — DB 붙이기 전까지 사용
const FOOD_OPTIONS = [
  { value: 'carrot', label: '당근', kcalPer100: 41, img: IMG_CARROT },
];

export default function DietInfo({ onChange }) {
  const [items, setItems] = useState([
    {
      id: crypto.randomUUID(),
      code: 'carrot',
      name: '당근',
      kcalPer100: 41,
      amount: 100,
      unit: 'g',
      img: IMG_CARROT,
    },
  ]);

  const [form] = Form.useForm();
  const [unit, setUnit] = useState('g');
  const [selectedFood, setSelectedFood] = useState(null);

  const totalKcal = useMemo(
    () => items.reduce((sum, it) => sum + Math.round((it.kcalPer100 * toGram(it.amount, it.unit)) / 100), 0),
    [items]
  );

  const emit = (next) => {
    setItems(next);
    onChange && onChange(next);
  };

  const handleRemove = (id) => emit(items.filter((it) => it.id !== id));
  const handleAmountChange = (id, amount) =>
    emit(items.map((it) => (it.id === id ? { ...it, amount: amount ?? 0 } : it)));
  const handleUnitChange = (id, u) =>
    emit(items.map((it) => (it.id === id ? { ...it, unit: u } : it)));

  // 단위 환산(g, kg, 개[임시 1개=100g])
  function toGram(amount, u) {
    if (!amount) return 0;
    if (u === 'kg') return amount * 1000;
    if (u === '개') return amount * 100;
    return amount; // g
  }

  const handleAdd = async () => {
    const vals = await form.validateFields();
    const food =
      FOOD_OPTIONS.find((o) => o.value === vals.name) ||
      { value: vals.name, label: vals.name, kcalPer100: 0, img: IMG_CARROT };

    const next = [
      ...items,
      {
        id: crypto.randomUUID(),
        code: food.value,
        name: food.label,
        kcalPer100: food.kcalPer100 ?? 0,
        amount: Number(vals.amount),
        unit,
        img: food.img || IMG_CARROT,
      },
    ];
    emit(next);
    form.resetFields();
    setUnit('g');
    setSelectedFood(null);
  };

  return (
    <div
      className="diet-info"
      style={{
        background: '#f6fff6',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        display: 'grid',
        gap: 16,
      }}
    >
      {/* 헤더 + 음식 추가하기 모달 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>식단 정보</h3>

        <CustomModal1
          title={
            <div style={{ fontWeight: 700, fontSize: 18, paddingBottom: 8, borderBottom: '1px solid #eee' }}>
              음식 추가하기
            </div>
          }
          buttonText="음식 추가하기"
          okText="추가"
          onOk={handleAdd}
          width={520}
        >
          {/* 모달 내부 */}
          <Form form={form} layout="vertical" colon={false}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>음식명</span>}
              name="name"
              rules={[{ required: true, message: '음식명을 선택하세요' }]}
            >
              <CustomSelect2
                options={FOOD_OPTIONS}
                value={selectedFood}
                onChange={(v) => {
                  setSelectedFood(v);
                  form.setFieldsValue({ name: v });
                }}
                placeholder="음식을 선택하세요."
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600 }}>양</span>} required style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Form.Item
                  name="amount"
                  initialValue={100}
                  rules={[{ required: true, message: '양을 입력하세요' }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Select
                  value={unit}
                  onChange={setUnit}
                  options={[
                    { value: 'g', label: 'g' },
                    { value: 'kg', label: 'kg' },
                    { value: '개', label: '개' },
                  ]}
                  style={{ width: 90 }}
                />
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 6 }}>
                * 현재는 1개 = 100g으로 임시 계산합니다. (DB 연동 시 품목별 중량으로 대체)
              </div>
            </Form.Item>
          </Form>
        </CustomModal1>
      </div>

      {/* 카드 리스트 */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {items.length === 0 ? (
          <div style={{ width: '100%' }}>
            <Empty description="추가된 음식이 없습니다" />
          </div>
        ) : (
          items.map((it) => {
            const kcal = Math.round((it.kcalPer100 * toGram(it.amount, it.unit)) / 100);
            return (
              <Card
                key={it.id}
                hoverable
                style={{ width: 180, borderRadius: 12 }}
                cover={
                  <div
                    style={{
                      position: 'relative',
                      height: 110,
                      overflow: 'hidden',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  >
                    <img src={it.img} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {/* X 버튼 */}
                    <button
                      onClick={() => handleRemove(it.id)}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 24,
                        height: 24,
                        borderRadius: 24,
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        border: 'none',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',
                      }}
                      aria-label="삭제"
                      title="삭제"
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                }
                bodyStyle={{ padding: 12 }}
              >
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <div style={{ fontWeight: 600 }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    100g 당 <b>{it.kcalPer100}</b> kcal
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#8c8c8c' }}>양</span>
                    <InputNumber
                      min={0}
                      size="small"
                      value={it.amount}
                      onChange={(v) => handleAmountChange(it.id, v)}
                    />
                    <Tag color="green" style={{ marginLeft: 'auto' }}>
                      {kcal} kcal
                    </Tag>
                  </div>
                </Space>
              </Card>
            );
          })
        )}
      </div>

      {/* 총 칼로리 */}
      <div style={{ textAlign: 'right', color: '#8c8c8c' }}>
        총 <b>{totalKcal}</b> kcal
      </div>
    </div>
  );
}
