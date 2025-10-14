import { Layout } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

const { Header, Sider, Content } = Layout;

export default function LayoutShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // 예: 인증 체크 후 미로그인 시 로그인 페이지 이동
    // if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={80}
        style={{
          background: '#001529',
          position: 'sticky',
          top: 0,
          height: '100vh',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
        }}
      >
        {/* 상단 메뉴 아이콘 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <MenuOutlined />
        </div>

        {/* 기존 Sidebar */}
        <Sidebar activePath={pathname} onNavigate={(p) => navigate(p)} />
      </Sider>

      <Layout>
        <Header
          style={{
            height: 64,
            background: '#ffffff',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: 0,
          }}
        >
          <TopHeader />
        </Header>

        <Content style={{ padding: 24, background: '#f7f8fa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
