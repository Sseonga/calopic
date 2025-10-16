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

    //  1. 메뉴 클릭을 처리할 함수를 추가합니다.
    const handleMenuClick = (e) => {
        // 클릭된 메뉴의 key 값 (예: 'mypage') 에 따라 페이지를 이동시킵니다.
        if (e.key === 'mypage') {
            navigate('/mypage');
        }
        // 여기에 로그아웃 로직도 추가할 수 있습니다.
        if (e.key === 'logout') {
            console.log('로그아웃 처리');
            navigate('/login');
        }
    };

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

        {/*  2. Dropdown의 menu 프롭에 onClick 이벤트를 연결합니다. */}
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
          <span style={{ color: '#52c41a', fontWeight: 600 }}>{userId}</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </div>
  );
}
