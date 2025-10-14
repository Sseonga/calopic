// src/components/common/TopHeader.jsx
import { Dropdown, Avatar, Space } from 'antd';
import './TopHeader.css';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function TopHeader() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userEmail') || 'test@test.com';

  const menuItems = [
    { key: 'mypage', label: '마이페이지' },
    { key: 'logout', label: '로그아웃' },
  ];

  return (
    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <Space size={8}>
        <img
          src="/images/Calopic-logo.png"               // ✅ public/images 경로
          alt="Calopic"
          className="header-logo"
          style={{ height: 24, width: 'auto', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
      </Space>

      <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
          <span style={{ color: '#52c41a', fontWeight: 600 }}>{userId}</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </div>
  );
}
