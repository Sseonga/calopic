import React from 'react';
import { Radio, Flex } from 'antd';
import './CustomComponent.css'; 

/**
 * CustomRadio1 — 공통 라디오 그룹 컴포넌트
 *
 * props:
 *  - options: [{ label: '', value: '' }] 형태의 배열
 *  - value: 외부 제어용 선택값
 *  - defaultValue: 초기 선택값
 *  - onChange: 변경 시 실행 함수 (e.target.value)
 *  - type: 'default' | 'button'  (기본 'default')
 *  - buttonStyle: 버튼 스타일 ('solid' | 'outline', 기본 'solid')
 *  - color: 선택 시 강조색 (기본 #36C96D)
 *  - block: 가로 폭 100% 여부
 *  - style: 추가 스타일
 */
export default function CustomRadio1({
  options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ],
  value,
  defaultValue,
  onChange,
  type = 'default',
  buttonStyle = 'solid',
  color = '#36C96D',
  block = true,
  style,
}) {
  const groupProps =
    type === 'button'
      ? { optionType: 'button', buttonStyle }
      : {};

  return (
    <Flex vertical gap="middle" style={style}>
      <Radio.Group
        block={block}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        {...groupProps}
        style={{
          '--ant-primary-color': color, // 버튼형 라디오 초록색 적용
        }}
      />
    </Flex>
  );
}
