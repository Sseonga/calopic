import React from 'react';
import { Switch } from 'antd';

/**
 * 공통 스위치 컴포넌트
 * props:
 *  - checked: 외부 제어용 boolean 값
 *  - defaultChecked: 초기 on/off 상태
 *  - onChange: 상태 변경 시 실행 함수
 *  - disabled: 비활성화 여부
 *  - color: 활성(on) 상태 색상 (기본 초록 #36C96D)
 *  - style: 추가 스타일
 */
export default function CustomSwitch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  color = '#36C96D',
  style,
}) {
  return (
    <Switch
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      style={{
        backgroundColor: checked ? color : undefined,
        ...style,
      }}
    />
  );
}
