import { Menu } from 'antd';
import {
  AppleOutlined,
  BookOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

const NAVS = [
  { key: '/', label: '식단 업로드', Icon: AppleOutlined },
  { key: '/diary', label: '식단 다이어리', Icon: BookOutlined },
  { key: '/calculator', label: '칼로리 계산기', Icon: CalculatorOutlined },
];

export default function Sidebar({ activePath, onNavigate }) {
  const items = NAVS.map(({ key, label, Icon }) => {
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
      selectedKeys={[activePath === '/' ? '/' : activePath]}
      items={items}
      onClick={(e) => onNavigate(e.key)}
      inlineIndent={0}
      style={{ borderRight: 0  }}
    />
  );
}
