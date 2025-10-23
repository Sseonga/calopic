import { Menu } from 'antd';
import {
  AppleOutlined,
  BookOutlined,
  CalculatorOutlined,
  TeamOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

const NAVS_DEFAULT = [
  { key: '/', label: '식단 업로드', Icon: AppleOutlined },
  { key: '/diary', label: '식단 다이어리', Icon: BookOutlined },
  { key: '/calculator', label: '칼로리 계산기', Icon: CalculatorOutlined },
];

// 관리자페이지 사이드바
const NAVS_ADMIN = [
  { key: '/admin/users',    label: '유저 관리',         Icon: TeamOutlined },
  { key: '/admin/classes',  label: '음식 관리',   Icon: DatabaseOutlined },
];

export default function Sidebar({ activePath, onNavigate }) {
  // /admin 또는 /admin/하위면 관리자 메뉴 세트 사용
  const isAdmin = activePath === '/admin' || activePath.startsWith('/admin/');
  const navs = isAdmin ? NAVS_ADMIN : NAVS_DEFAULT;

  const selectedKey =
    navs.find(({ key }) => activePath === key || activePath.startsWith(key + '/'))?.key
    || (isAdmin ? '/admin/users' : '/');

  const items = navs.map(({ key, label, Icon }) => {
    const active = (activePath === '/' ? '/' : activePath) === key;
    return {
      key,
      // icon prop은 쓰지 않고 label에 커스텀 렌더
      label: (
        <div className={`nav-item ${active ? 'is-active' : ''}`}>
          <Icon className="nav-icon" />
          <span className="nav-text">{label}</span>
        </div>
      ),
      className: 'nav-menu-item',
    };
  });

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={items}
      onClick={(e) => onNavigate(e.key)}
      inlineIndent={0}
      style={{ borderRight: 0  }}
    />
  );
}
