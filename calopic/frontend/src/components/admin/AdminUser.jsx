import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableTab from './TableTab';
import CustomSelect from '../common/CustomSelect';
import { Pagination } from 'antd';
import CustomModal1 from '../common/CustomModal1';

export default function AdminUser() {
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/member');  // 실제 백엔드 호출
      const data = Array.isArray(res.data) ? res.data : [];
      setRows(data.map(v => ({ ...v, checked: false })));
    } catch (err) {
      console.warn('⚠️ 백엔드 연결 실패 — mock 데이터로 대체합니다.');

      // ⚙️ 임시 데이터
      const mockData = [
        {
          memberId: 1,
          memberName: '홍길동',
          memberRoleName: '일반회원',
          memberBname: '길동상회',
          memberEmail: 'gildong@example.com',
          memberStatusName: '2025.10.23',
        },
        {
          memberId: 2,
          memberName: '김철수',
          memberRoleName: '판매자',
          memberBname: '철수상점',
          memberEmail: 'chulsoo@example.com',
          memberStatusName: '2025.09.09',
        },
      ];

      setRows(mockData.map(v => ({ ...v, checked: false })));
    }
  };

  fetchData();
}, []);


  const headers = ['유저 번호', '분류', '아이디', '비밀번호', '가입일', '']; // 마지막은 체크박스
  const colGroup = [
  { width: '12%' }, { width: '18%' }, { width: '27%' },
  { width: '20%' }, { width: '20%' }, { width: '5%' },
];

//   유저 분류 콤보박스(추후 DB연결)
  const userStatusOptions = [
    { value: '전체', label: '전체' },
    { value: '유저', label: '유저' },
    { value: '관리자', label: '관리자' },
    { value: '휴면', label: '휴면' },
  ]

  const onSelectAll = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    setRows(prev => prev.map(r => ({ ...r, checked })));
  };

  const toggleRow = (memberId) => {
    setRows(prev => prev.map(r => r.memberId === memberId ? { ...r, checked: !r.checked } : r));
  };

  const renderRow = (row) => (
    <tr key={row.memberId} onClick={() => toggleRow(row.memberId)}>
      <td>{row.memberName}</td>
      <td>{row.memberRoleName}</td>
      <td>{row.memberBname}</td>
      <td>{row.memberEmail}</td>
      <td>{row.memberStatusName}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={!!row.checked}
          onChange={() => toggleRow(row.memberId)}
          className="table-checkbox"
        />
      </td>
    </tr>
  );
// 페이지네이션
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
  return (
    <div className="admin-wrap">
      <h2 className="admin-user-title">유저관리</h2>
      <div className="user-table-selector">
        <CustomSelect
            options={userStatusOptions}
            placeholder="분류를 선택해주세요."
            className="user-status-select"
        />
      </div>
      <TableTab
        tabType="member"
        headers={headers}
        rows={rows}
        renderRow={renderRow}
        onSelectAll={onSelectAll}
        allChecked={allChecked}
        minRows={12}
        colGroup={colGroup}
      />
      <div className="user-table-bottom">
        <Pagination
            defaultCurrent={1}
            total={50}       // 전체 항목 수
            pageSize={12}    // 한 페이지에 표시할 항목 수
            onChange={pageOnChange}
            className="user-pagination"
        />
        <CustomModal1
            title="회원 탈퇴"
            buttonText="탈퇴하기"
            okText="탈퇴"
            cancelText="닫기"
            color="#ff3838ff"
            onOk={handleOkAction}
            onCancel={handleCancelAction}
            style={{ position: 'absolute', right: 0 }}
        ></CustomModal1> 
      </div>
      
    </div>
  );
}
