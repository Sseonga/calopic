import React, { useState } from 'react';
import { Row, Col, Slider, InputNumber } from 'antd';

/**
 * 공통 슬라이더 + 숫자입력 연동 컴포넌트요
 * props:
 *  - value: 외부 제어 값(숫자), 없으면 내부 상태 사용요
 *  - defaultValue: 초기값요
 *  - onChange: 값 변경 콜백 (nextValue: number)요
 *  - min, max, step: 범위/단계 설정요
 *  - sliderSpan, inputSpan: 그리드 폭 조절요
 *  - inputStyle: 숫자 입력 스타일요
 *  - disabled: 비활성화 여부요
 *  - color: 슬라이더 색상 (기본 #36C96D)
 */
export default function CustomSlider1({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  sliderSpan = 12,
  inputSpan = 6,
  inputStyle = { margin: '0 16px' },
  disabled = false,
  color = '#36C96D', // 추가된 기본 초록색
}) {
  const [internalValue1, setInternalValue1] = useState(
    typeof defaultValue === 'number' ? defaultValue : min
  );

  const currentValue =
    typeof value === 'number' ? value : internalValue1;

  const handleChange = (next) => {
    if (Number.isNaN(next)) return;
    setInternalValue1(next);
    onChange && onChange(next);
  };

  return (
    <Row align="middle">
      <Col span={sliderSpan}>
        <Slider
          min={min}
          max={max}
          step={step}
          value={typeof currentValue === 'number' ? currentValue : min}
          onChange={handleChange}
          disabled={disabled}
          trackStyle={{ backgroundColor: color }}
          handleStyle={{
            borderColor: color,
            backgroundColor: color,
          }}
        />
      </Col>
      <Col span={inputSpan}>
        <InputNumber
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          style={inputStyle}
          disabled={disabled}
        />
      </Col>
    </Row>
  );
}
