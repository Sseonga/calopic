// src/pages/admin/AdminClass.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import TableTab from './TableTab';
import CustomSelect2 from '../common/CustomSelect2';
import { Pagination, message, Form, Input, InputNumber } from 'antd';
import CustomModal1 from '../common/CustomModal1';

export default function AdminClass() {
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');

  // rows → 선택값으로 1차 필터
  const filteredRows = useMemo(() => {
    if (!selectedFood) return rows;  // 전체
    return rows.filter(r => r.foodName === selectedFood);
  }, [rows, selectedFood]);

  // 페이지네이션
  const pagedRows = useMemo(() => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return filteredRows.slice(start, end);
}, [filteredRows, page]);

// 필터/삭제로 총 개수가 줄어들었을 때 페이지 보정
useEffect(() => {
  const last = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  if (page > last) setPage(1);
}, [filteredRows, pageSize]);


  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/classes');
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(
          data.map(v => ({
            classId: v.foodId,
            foodName: v.foodName,
            kcal: v.foodKcal,
            carbo: v.foodCarbo,
            protein: v.foodProtein,
            fat: v.foodFat,
            yoloId: v.yoloId,
            qtyCoeffi: v.qtyCoeffi,
            checked: false,
          }))
        );
      } catch (e) {
        message.error('클래스 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
  const loadFoodNames = async () => {
    try {
      const res = await axios.get('/api/classes/names');
      if (Array.isArray(res.data)) {
        const opts = res.data.map(name => ({ value: name, label: name }));
        setFoodOptions(opts);
      }
    } catch (err) {
      console.error('⚠️ 음식 이름 목록 불러오기 실패:', err);
    }
  };
  loadFoodNames();
}, []);

  // 전체 선택
// 전체선택 시 현재 화면(필터된 목록)만 대상으로 체크
const onSelectAll = (e) => {
  const checked = e.target.checked;
  setAllChecked(checked);
  setRows(prev =>
    prev.map(r =>
      (!selectedFood || r.foodName === selectedFood)
        ? { ...r, checked }
        : r
    )
  );
};


  // 단일 선택
  const toggleRow = (classId) => {
    setRows(prev =>
      prev.map(r =>
        r.classId === classId ? { ...r, checked: !r.checked } : r
      )
    );
  };

  // 삭제 모달용 핸들러
  const handleDeleteClasses = async () => {
    const selectedIds = rows.filter(r => r.checked).map(r => r.classId);
    if (selectedIds.length === 0) {
      message.warning('선택된 음식 클래스가 없습니다.');
      return false;
    }

    try {
      await axios.delete('/api/classes', { data: { classIds: selectedIds } });

      setRows(prev => {
        const next = prev.filter(r => !selectedIds.includes(r.classId));
        const lastPage = Math.max(1, Math.ceil(next.length / pageSize));
        if (page > lastPage) setPage(lastPage);
        return next;
      });
      setAllChecked(false);
      message.success(`총 ${selectedIds.length}건 삭제되었습니다.`);
      return true; // 모달 닫기
    } catch (e) {
      message.error('삭제 중 오류가 발생했습니다.');
      return false; // 모달 유지
    }
  };

  const handleCancelAction = () => {};

  // 추가 모달 저장
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await axios.post('/api/classes', values); // insert용
      message.success('새 음식클래스가 추가되었습니다.');
      form.resetFields();
      return true;
    } catch (e) {
      message.error('추가 중 오류가 발생했습니다.');
      return false;
    }
  };

  const handleFoodChange = (v) => {
    const value = v?.value ?? v;     // 객체/문자열 모두 대응
    setSelectedFood(value || '');
    setPage(1);                      // 선택 바뀌면 1페이지로
  };


  // 테이블 헤더
  const headers = ['클래스 번호', '음식명', '칼로리', '탄수화물', '단백질', '지방', 'YOLO-ID', '양추정계수', ''];

  const colGroup = [
    { width: '10%' },
    { width: '22%' },
    { width: '10%' },
    { width: '10%' },
    { width: '10%' },
    { width: '10%' },
    { width: '10%' },
    { width: '12%' },
    { width: '5%' },
  ];

  const renderRow = (row) => (
    <tr key={row.classId} onClick={() => toggleRow(row.classId)}>
      <td>{row.classId}</td>
      <td>{row.foodName}</td>
      <td>{row.kcal}</td>
      <td>{row.carbo}</td>
      <td>{row.protein}</td>
      <td>{row.fat}</td>
      <td>{row.yoloId}</td>
      <td>{row.qtyCoeffi}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={!!row.checked}
          onChange={() => toggleRow(row.classId)}
        />
      </td>
    </tr>
  );

  const pageOnChange = (nextPage) => setPage(nextPage);

  return (
    <div className="admin-wrap">
      <h2 className="admin-user-title">음식클래스 관리</h2>

      <div className="user-table-selector">
        <CustomSelect2
          value={selectedFood}        // ← 기존 "" 대신 상태 바인딩
          options={foodOptions}       // DB에서 불러온 옵션
          onChange={handleFoodChange}
        />
      </div>

      <TableTab
        tabType="classes"
        headers={headers}
        rows={pagedRows}
        renderRow={renderRow}
        onSelectAll={onSelectAll}
        allChecked={allChecked}
        minRows={12}
        colGroup={colGroup}
        loading={loading}
      />

      <Pagination
        current={page}
        total={filteredRows.length}
        pageSize={pageSize}
        onChange={pageOnChange}
        showSizeChanger={false}
        className="food-class-pagination"
      />

      <div className="admin-toolbar-right">
        {/* 삭제 모달 */}
        <CustomModal1
          title="삭제하기"
          buttonText="삭제하기"
          okText="삭제"
          cancelText="닫기"
          color="#ff3838ff"
          onOk={handleDeleteClasses}
          onCancel={handleCancelAction}
          style={{ marginRight: 10 }}
        >
          <div style={{ lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              선택한 음식 클래스를 삭제하시겠습니까?
            </div>
            <div>삭제된 데이터는 복구할 수 없습니다.</div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#666' }}>
              선택된 항목 수: {rows.filter(r => r.checked).length}개
            </div>
          </div>
        </CustomModal1>

        {/* 추가 모달 */}
        <CustomModal1
          title={
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                paddingBottom: 8,
                borderBottom: '1px solid #eee',
              }}
            >
              음식클래스 추가
            </div>
          }
          buttonText="음식클래스 추가"
          okText="저장하기"
          cancelText="닫기"
          color="#36C96D"
          onOk={handleAdd}
          width={520}
        >
          <Form form={form} layout="vertical" colon={false} className="add-class-form">
            <Form.Item
              label={<span className="acf-label">음식명</span>}
              name="foodName"
              rules={[{ required: true, message: '음식명을 입력하세요.' }]}
            >
              <Input placeholder="음식명을 입력하세요." />
            </Form.Item>

            <div className="acf-row">
              <Form.Item
                label="칼로리(100g)"
                name="foodKcal"
                rules={[{ required: true, message: '칼로리를 입력하세요.' }]}
                className="acf-col"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="탄수화물"
                name="foodCarbo"
                rules={[{ required: true, message: '탄수화물을 입력하세요.' }]}
                className="acf-col"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <div className="acf-row">
              <Form.Item
                label="단백질"
                name="foodProtein"
                rules={[{ required: true, message: '단백질을 입력하세요.' }]}
                className="acf-col"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="지방"
                name="foodFat"
                rules={[{ required: true, message: '지방을 입력하세요.' }]}
                className="acf-col"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <div className="acf-row">
              <Form.Item
                label="YOLO-ID"
                name="yoloId"
                // rules={[{ required: true, message: '단백질을 입력하세요.' }]}
                className="acf-col"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="양추정 계수"
                name="qtyCoeffi"
                // rules={[{ required: true, message: '지방을 입력하세요.' }]}
                className="acf-col"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </div>
          </Form>
        </CustomModal1>
      </div>
    </div>
  );
}
