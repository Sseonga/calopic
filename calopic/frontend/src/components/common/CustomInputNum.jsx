import React from 'react';
import { InputNumber } from 'antd';

/**
 * CustomInputNum — 공통 숫자 입력 컴포넌트
 *
 * props:
 *  - value: 외부 제어용 숫자 값
 *  - defaultValue: 초기값 (비제어)
 *  - onChange: 값 변경 시 실행 함수 (value: number)
 *  - min: 최소값 (기본 1)
 *  - max: 최대값 (기본 10)
 *  - step: 증감 단위 (기본 1)
 *  - placeholder: 입력창 안내 문구
 *  - disabled: 비활성화 여부
 *  - style: 추가 스타일
 *  - color: 포커스 및 활성 색상 (기본 #36C96D)
 */
export default function CustomInputNum({
  value,
  defaultValue = 1,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  placeholder = '',
  disabled = false,
  style,
  color = '#bebebeff',
}) {
  return (
    <InputNumber
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        borderColor: color,
        '--ant-primary-color': color,
        ...style,
      }}
    />
  );
}
