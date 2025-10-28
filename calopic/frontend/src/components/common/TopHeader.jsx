// src/components/common/TopHeader.jsx
import { useEffect, useState } from 'react';
import { Dropdown, Avatar, Space } from 'antd';
import './TopHeader.css';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TopHeader() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:18090/api/layout/header', { withCredentials: true })
      .then(res => setUserId(res.data?.userId ?? null))
      .catch(() => setUserId(null))
      .finally(() => setLoading(false));
  }, []);

  const menuItems = [
    { key: 'mypage', label: '마이페이지' },
    { key: 'logout', label: '로그아웃' },
  ];

  const handleMenuClick = (e) => {
    if (e.key === 'mypage') navigate('/mypage');
    if (e.key === 'logout') {
      axios.post('http://localhost:18090/auth/logout', {}, { withCredentials: true })
        .finally(() => navigate('/login'));
    }
  };

  const displayText = loading
    ? '불러오는 중...'
    : (userId ? `USER_ID: ${userId}` : '알 수 없는 사용자');

  return (
    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <Space size={8}>
        <img
          src="/images/Calopic-logo.png"
          alt="Calopic"
          className="header-logo"
          style={{ height: 24, width: 'auto', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
      </Space>

      <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
          <span style={{ color: '#52c41a', fontWeight: 600 }}>{displayText}</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </div>
  );
}
