import React from 'react';
import { Checkbox } from 'antd';

/**
 * CustomCheckbox1 — 공통 체크박스 컴포넌트
 *
 * props:
 *  - checked: 외부 제어용 boolean 값
 *  - defaultChecked: 초기 체크 상태
 *  - onChange: 상태 변경 시 실행 함수
 *  - disabled: 비활성화 여부
 *  - label: 체크박스 옆에 표시할 텍스트
 *  - color: 체크박스 활성 색상 (기본 #36C96D)
 *  - style: 커스텀 스타일
 */
export default function CustomCheckbox1({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label = 'Checkbox',
  color = '#c93636ff',
  style,
}) {
  return (
    <Checkbox
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      style={{
        accentColor: color, // ✅ 최신 브라우저에서 체크박스 색상 제어
        ...style,
      }}
    >
      {label}
    </Checkbox>
  );
}
