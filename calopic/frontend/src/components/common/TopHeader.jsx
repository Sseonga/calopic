// src/components/common/TopHeader.jsx
import { useEffect, useState, useMemo } from 'react';
import { Dropdown, Avatar, Space } from 'antd';
import './TopHeader.css';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TopHeader() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [isAdmin, setIsAdmin] = useState('N');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:18090/api/layout/header', { withCredentials: true })
      .then(res => {
        const name = res.data?.userName ?? res.data?.USER_NAME ?? null;
        const admin = res.data?.isAdmin ?? res.data?.IS_ADMIN ?? 'N';
        setUserName(name);
        setIsAdmin(admin?.toUpperCase?.() === 'Y' ? 'Y' : 'N');
      })
      .catch(() => {
        setUserName(null);
        setIsAdmin('N');
      })
      .finally(() => setLoading(false));
  }, []);

  // 메뉴 항목
  const menuItems = useMemo(() => {
    if (loading) {
      return [{ key: 'loading', label: '불러오는 중...', disabled: true }];
    }

    if (!userName) {
      // 비로그인 상태
      return [{ key: 'login', label: '로그인' }];
    }

    // 로그인 상태
    if (isAdmin === 'Y') {
      return [
        { key: 'admin', label: '관리자페이지' },
        { key: 'logout', label: '로그아웃' },
      ];
    } else {
      return [
        { key: 'mypage', label: '마이페이지' },
        { key: 'logout', label: '로그아웃' },
      ];
    }
  }, [loading, userName, isAdmin]);

  const handleMenuClick = (e) => {
    const { key } = e;
    if (key === 'login') navigate('/login');
    if (key === 'admin') navigate('/admin');
    if (key === 'mypage') navigate('/mypage');
    if (key === 'logout') {
      axios.post('http://localhost:18090/auth/logout', {}, { withCredentials: true })
        .finally(() => navigate('/login'));
    }
  };

  const displayText = loading
    ? '불러오는 중...'
    : (userName ? userName : '로그인이 필요합니다');

  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}
    >
      <Space size={8}>
        <img
          src="/images/Calopic-logo.png"
          alt="Calopic"
          className="header-logo"
          style={{ height: 24, width: 'auto', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
      </Space>

      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Space style={{ cursor: 'pointer' }}>
          <span style={{ color: '#52c41a', fontWeight: 600 }}>{displayText}</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </div>
  );
}
