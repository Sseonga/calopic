// AdminClass.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableTab from './TableTab';
import CustomSelect2 from '../common/CustomSelect2';
import { Pagination } from 'antd';
import CustomModal1 from '../common/CustomModal1';
import { Form, Input, InputNumber } from 'antd';

export default function AdminClass() {
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/classes'); // 실제 API에 맞게 수정
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(data.map(v => ({ ...v, checked: false })));
      } catch (e) {
        console.warn('⚠️ /api/classes 호출 실패 — mock 데이터로 대체합니다.');
        const mock = [
          { classId: 1, foodName: '현미밥',   kcal: 150, carbo: 32, protein: 3,  fat: 1   },
          { classId: 2, foodName: '닭가슴살', kcal: 165, carbo: 0,  protein: 31, fat: 3.6 },
          { classId: 3, foodName: '아몬드',   kcal: 579, carbo: 22, protein: 21, fat: 50  },
        ];
        setRows(mock.map(v => ({ ...v, checked: false })));
      }
    };
    load();
  }, []);

  const headers = ['클래스 번호', '음식명', '칼로리', '탄수화물', '단백질', '지방', '']; // 마지막 '' = 헤더 체크박스

  // 7열에 맞는 colgroup (선택사항)
  const colGroup = [
    { width: '12%' }, // 클래스 번호
    { width: '22%' }, // 음식명
    { width: '12%' }, // 칼로리
    { width: '12%' }, // 탄수화물
    { width: '12%' }, // 단백질
    { width: '12%' }, // 지방
    { width: '5%'  }, // 체크박스
  ];

  const toggleRow = (classId) => {
    setRows(prev =>
      prev.map(r => r.classId === classId ? { ...r, checked: !r.checked } : r)
    );
  };

  const onSelectAll = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    setRows(prev => prev.map(r => ({ ...r, checked })));
  };

  const renderRow = (row) => (
    <tr key={row.classId} onClick={() => toggleRow(row.classId)}>
      <td>{row.classId}</td>
      <td>{row.foodName}</td>
      <td>{row.kcal}</td>
      <td>{row.carbo}</td>
      <td>{row.protein}</td>
      <td>{row.fat}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={!!row.checked}
          onChange={() => toggleRow(row.classId)}
        />
      </td>
    </tr>
  );

  //CustomSelect2 
  const foodClassValue = useState('');

  const foodClassOptions = [
    { value: 'hyunmibab', label: '현미밥' },
    { value: 'chickencchicchi', label: '닭가슴살' },
    { value: 'amond', label: '아몬드' },
  ]
  const handleFoodClassChange = (foodClassValue) => {
    console.log('선택된 음식 클래스:', foodClassValue);
  };
//페이지네이션
    const pageOnChange = (page, pageSize) => {
        console.log('현재 페이지:', page, '페이지당 항목 수:', pageSize);
    };
    //탈퇴하기 모달
    const handleOkAction = () => {
        console.log('확인 버튼 클릭');
    };
    const handleCancelAction = () => {
        console.log('취소 버튼 클릭');
    };

    //음식클래스 추가 모달
    const [form] = Form.useForm();

    const handleAdd = async () => {
    try {
        const values = await form.validateFields();
        // TODO: values로 API 호출하거나 rows 갱신하기
        form.resetFields();
    } catch {}
    };

  return (
    <div className="admin-wrap">
      <h2 className="admin-user-title">음식클래스 관리</h2>
        <div className="user-table-selector">
            <CustomSelect2
                value={foodClassValue}
                options={foodClassOptions}               
            />
        </div>
      <TableTab
        tabType="classes"
        headers={headers}
        rows={rows}
        renderRow={renderRow}
        onSelectAll={onSelectAll}
        allChecked={allChecked}
        minRows={12}
        colGroup={colGroup} 
      />
      <Pagination
        defaultCurrent={1}
            total={50}       // 전체 항목 수
            pageSize={12}    // 한 페이지에 표시할 항목 수
            onChange={pageOnChange}
            className="food-class-pagination"
      />
    <div className="admin-toolbar-right">
        <CustomModal1
            title="삭제하기"
            buttonText="삭제하기"
            okText="삭제"
            cancelText="닫기"
            color="#ff3838ff"
            onOk={handleOkAction}
            onCancel={handleCancelAction}
            style={{marginRight : 10}}
        ></CustomModal1>
    
      <CustomModal1
        title={
          <div style={{ fontWeight: 700, fontSize: 18, paddingBottom: 8, borderBottom: '1px solid #eee' }}>
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
        {/* 모달 내부 폼 */}
        <Form form={form} layout="vertical" colon={false} className="add-class-form">
          {/* 1) 음식명 (가로 전체) */}
          <Form.Item
            label={<span className="acf-label">음식명</span>}
            name="name"
            rules={[{ required: true, message: '음식명을 적어주세요.' }]}
          >
            <Input placeholder="음식명을 적어주세요." className="acf-input" />
          </Form.Item>

          {/* 2) 칼로리 / 탄수화물 */}
          <div className="acf-row">
            <Form.Item
              label={<span className="acf-label">칼로리(100g)</span>}
              name="kcal"
              rules={[{ required: true, message: '칼로리를 입력하세요.' }]}
              className="acf-col"
            >
              <InputNumber min={0} placeholder="" className="acf-input" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<span className="acf-label">탄수화물</span>}
              name="carbo"
              rules={[{ required: true, message: '탄수화물을 입력하세요.' }]}
              className="acf-col"
            >
              <InputNumber min={0} placeholder="" className="acf-input" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          {/* 3) 단백질 / 지방 */}
          <div className="acf-row">
            <Form.Item
              label={<span className="acf-label">단백질</span>}
              name="protein"
              rules={[{ required: true, message: '단백질을 입력하세요.' }]}
              className="acf-col"
            >
              <InputNumber min={0} placeholder="" className="acf-input" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={<span className="acf-label">지방</span>}
              name="fat"
              rules={[{ required: true, message: '지방을 입력하세요.' }]}
              className="acf-col"
            >
              <InputNumber min={0} placeholder="" className="acf-input" style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </CustomModal1>
    </div>
    </div>
  );
}
