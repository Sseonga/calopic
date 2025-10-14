import React from 'react';
import { Slider } from 'antd';

export default function CustomSlider2({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  tooltipFormatter = (v) => `${v}%`,
  tooltipVisible = true,
  style,
  color = '#36C96D', // 기본 초록색
}) {
  const tooltip = tooltipVisible
    ? { formatter: tooltipFormatter }
    : { formatter: null };

  return (
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      tooltip={tooltip}
      style={style}
      trackStyle={{ backgroundColor: color }}
      handleStyle={{
        borderColor: color,
        backgroundColor: color,
      }}
    />
  );
}
