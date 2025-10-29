// src/pages/admin/AdminUser.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import TableTab from './TableTab';
import CustomSelect from '../common/CustomSelect';
import { Pagination, message } from 'antd';
import CustomModal1 from '../common/CustomModal1';

export default function AdminUser() {
  // 테이블 상태
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  // 필터/페이지 상태
  const [roleFilter, setRoleFilter] = useState('전체'); // 전체 | 유저 | 관리자
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [loading, setLoading] = useState(false);

  // 셀렉트 옵션: 휴면 제거, is_admin 기준
  const userStatusOptions = useMemo(
    () => [
      { value: '전체', label: '전체' },
      { value: '유저', label: '유저' },       // is_admin = 'N'
      { value: '관리자', label: '관리자' },   // is_admin = 'Y'
    ],
    []
  );

  // 필터 값을 API 파라미터로 변환
  const apiRole = useMemo(() => {
    if (roleFilter === '관리자') return 'admin'; // is_admin = 'Y'
    if (roleFilter === '유저') return 'user';    // is_admin = 'N'
    return 'all';
  }, [roleFilter]);

  // 날짜 포맷터
  const formatDate = (d) => {
    if (!d) return '';
    try {
      // 백엔드가 ISO 문자열을 준다고 가정
      const date = new Date(d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${y}.${m}.${dd}`;
    } catch {
      return d;
    }
  };

  //페이지네이션
  const pagedRows = useMemo(() => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return rows.slice(start, end);
}, [rows, page]);

const selectedIds = useMemo(
      () => rows.filter(r => r.checked).map(r => r.userId),
      [rows]
    );

// 3) rows 변경 시 현재 페이지가 끝을 넘어가면 1페이지로 보정(선택 사항)
useEffect(() => {
  const lastPage = Math.max(1, Math.ceil(rows.length / pageSize));
  if (page > lastPage) setPage(1);
}, [rows]);

  // 데이터 로드
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // GET /api/users?role=all|user|admin
      const res = await axios.get('/api/users', {
        params: { role: apiRole },
      });

      const list = Array.isArray(res.data) ? res.data : [];

      setRows(
        list.map((v) => ({
          userId: v.userId,
          isAdmin: v.isAdmin,           // 'Y' | 'N'
          userName: v.userName,
          userQuestion: v.userQuestion, // 필요 시 라벨 필드 사용
          userAnswer: v.userAnswer,
          createdDate: v.createdDate,
          checked: false,
        }))
      );
      setAllChecked(false);
      // setTotal(Number(res.data?.total || list.length)); // 제거
    } catch (err) {
      console.error('백엔드 요청 실패', err);
      message.error('사용자 목록을 가져오지 못했습니다');
      setRows([]);
      setAllChecked(false);
      // setTotal(0); // 제거
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [apiRole]); // page, pageSize 의존성 제거

  // 테이블 헤더 교체
  const headers = [
    '유저번호',
    '분류',
    '사용자명',
    '유저질문',
    '답변',
    '가입일',
    '',
  ];

  const colGroup = [
    { width: '12%' }, // 유저번호
    { width: '10%' }, // 분류
    { width: '18%' }, // 사용자명
    { width: '20%' }, // 유저질문
    { width: '25%' }, // 답변
    { width: '10%' }, // 가입일
    { width: '5%' },  // 체크박스
  ];

  // 전체 체크
  const onSelectAll = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    setRows((prev) => prev.map((r) => ({ ...r, checked })));
  };

  // 단일 토글
  const toggleRow = (userId) => {
    setRows((prev) =>
      prev.map((r) => (r.userId === userId ? { ...r, checked: !r.checked } : r))
    );
  };

  // 분류 표시 변환
  const renderRole = (isAdmin) => (isAdmin === 'Y' ? '관리자' : '유저');

  // 유저질문 표시 보강
  // userQuestion이 코드값이면 백엔드에서 label을 함께 내려주세요
  // ex) userQuestionName을 내려주면 v.userQuestionName 사용
  const renderQuestion = (q) => q ?? '';

  // 행 렌더링
  const renderRow = (row) => (
    <tr key={row.userId} onClick={() => toggleRow(row.userId)}>
      <td>{row.userId}</td>
      <td>{renderRole(row.isAdmin)}</td>
      <td>{row.userName}</td>
      <td>{renderQuestion(row.userQuestion)}</td>
      <td>{row.userAnswer}</td>
      <td>{formatDate(row.createdDate)}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={!!row.checked}
          onChange={() => toggleRow(row.userId)}
          className="table-checkbox"
        />
      </td>
    </tr>
  );

  // 페이지네이션
  const pageOnChange = (nextPage) => setPage(nextPage);

  // 탈퇴 모달
  const handleOkAction = () => {
    // const selectedIds = rows.filter((r) => r.checked).map((r) => r.userId);
    if (selectedIds.length === 0) {
      message.warning('선택된 사용자가 없습니다');
      return;
    }
    // 예시: DELETE /api/users (body: { userIds: [...] })
    axios
      .delete('/api/users', { data: { userIds: selectedIds } })
      .then(() => {
        message.success('탈퇴 처리 완료');
        // 현재 페이지 새로고침
        setPage((p) => p); 
      })
      .catch(() => message.error('탈퇴 처리 중 오류가 발생했습니다'));
  };

  const handleCancelAction = () => {};

  // 2) 삭제 핸들러 (모달 ok에서 호출)
//    반환값 true면 모달 닫힘(CustomModal1 규약)
const handleDeleteUsers = async () => {
  if (selectedIds.length === 0) {
    message.warning('선택된 사용자가 없습니다');
    return false;
  }
  try {
    await axios.delete('/api/users', { data: { userIds: selectedIds } });

    setRows(prev => {
      const next = prev.filter(r => !selectedIds.includes(r.userId));
      // 현재 페이지가 빈 페이지가 되면 당겨오기
      const lastPage = Math.max(1, Math.ceil(next.length / pageSize));
      if (page > lastPage) setPage(lastPage);
      return next;
    });
    setAllChecked(false);
    message.success(`총 ${selectedIds.length}건 삭제되었습니다`);
    return true; // 모달 닫기
  } catch (e) {
    console.error(e);
    message.error('삭제 중 오류가 발생했습니다');
    return false; // 모달 유지
  }
};

  return (
    <div className="admin-wrap">
      <h2 className="admin-user-title">유저관리</h2>

      <div className="user-table-selector">
        <CustomSelect
          options={userStatusOptions}
          placeholder="분류를 선택해주세요."
          className="user-status-select"
          value={roleFilter}
          onChange={(v) => {
            const value = v?.value ?? v; // 객체/문자열 모두 대응
            setRoleFilter(value);
            setPage(1); // 필터 변경 시 1페이지로
          }}
        />
      </div>

      <TableTab
        tabType="member"
        headers={headers}
        rows={pagedRows}
        renderRow={renderRow}
        onSelectAll={onSelectAll}
        allChecked={allChecked}
        minRows={12}
        colGroup={colGroup}
        loading={loading}
      />

      <div className="user-table-bottom">
        <Pagination
          current={page}
          total={rows.length}
          pageSize={pageSize}
          onChange={pageOnChange}
          className="user-pagination"
        />

        <CustomModal1
          title="회원 탈퇴"
          buttonText="탈퇴하기"
          okText="탈퇴"
          cancelText="닫기"
          color="#ff3838ff"
          onOk={handleDeleteUsers}
          onCancel={() => {}}
          style={{ position: 'absolute', right: 0 }}
        >
          <div style={{ lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              정말 탈퇴하시겠습니까?
            </div>
            <div>탈퇴된 유저 데이터는 영구히 삭제됩니다.</div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#666' }}>
              선택된 사용자 수: {selectedIds.length}명
              {/* {selectedIds.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  ID 미리보기: {selectedIds.slice(0, 5).join(', ')}
                  {selectedIds.length > 5 ? ' 외 ...' : ''}
                </div>
              )} */}
            </div>
          </div>
        </CustomModal1>
      </div>
    </div>
  );
}
