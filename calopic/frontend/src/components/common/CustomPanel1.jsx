// src/component/CustomPanel1.jsx
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, theme } from 'antd';

/**
 * CustomPanel1 — 공통 아코디언 패널
 *
 * props:
 *  - items: [{ key, label, children, style }] 형태의 배열
 *  - defaultActiveKey: 기본으로 펼칠 key 배열 또는 문자열
 *  - activeKey: 외부 제어용 현재 펼친 key (제어 모드)
 *  - onChange: (keys) => void, 패널 토글 시 호출
 *  - bordered: 테두리 표시 여부 (기본 false)
 *  - rotateIcon: 아이콘 회전 표시 여부 (기본 true)
 *  - color: 포인트 색상 (아이콘/헤더 텍스트 등에 적용, 기본 #36C96D)
 *  - panelStyle: 각 패널에 공통 적용할 스타일
 *  - style: Collapse 컨테이너 스타일
 */
export default function CustomPanel1({
  items = [],
  defaultActiveKey = ['1'],
  activeKey,
  onChange,
  bordered = false,
  rotateIcon = true,
  color = '#000000ff',
  panelStyle,
  style,
}) {
  const { token } = theme.useToken();

  const basePanelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
    ...panelStyle,
  };

  // items가 label/children만 가진 간단 배열이어도 동작하도록 style 주입
  const mappedItems = items.map((it) => ({
    ...it,
    style: { ...basePanelStyle, ...(it.style || {}) },
    // 헤더 라벨에 색 포인트 적용
    label: (
      <span style={{ color, fontWeight: 500 }}>
        {it.label}
      </span>
    ),
  }));

  const expandIcon = ({ isActive }) => (
    <CaretRightOutlined
      rotate={rotateIcon && isActive ? 90 : 0}
      style={{ color }}
    />
  );

  const collapseProps = {
    bordered,
    expandIcon,
    style: { background: token.colorBgContainer, ...style },
    items: mappedItems,
  };

  if (activeKey !== undefined) {
    collapseProps.activeKey = activeKey; // 제어 모드
  } else {
    collapseProps.defaultActiveKey = defaultActiveKey; // 비제어 모드
  }

  return <Collapse {...collapseProps} onChange={onChange} />;
}
