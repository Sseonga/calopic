import React from 'react';
import { Flex, Progress } from 'antd';

/**
 * CustomProgressbar2 — 원형(circle) 진행률 표시 컴포넌트
 *
 * props:
 *  - percent: 진행률 (0~100)
 *  - format: 퍼센트 텍스트 표시 함수 (percent) => string
 *  - color: 진행 색상 (기본 #36C96D)
 *  - trailColor: 남은 부분 색상
 *  - size: 크기 ('small' | 'default' | 'large' | number)
 *  - status: 상태 ('normal' | 'exception' | 'success' | 'active')
 *  - strokeWidth: 두께 (기본 6)
 *  - style: Flex 컨테이너 스타일
 *  - multiCircles: 여러 개를 한 번에 표시 [{ percent, format, color, status }]
 */
export default function CustomProgressbar2({
  percent = 75,
  format = (p) => `${p}%`,
  color = '#36C96D',
  trailColor = '#f5f5f5',
  size = 'default',
  status = 'normal',
  strokeWidth = 6,
  style,
  multiCircles,
}) {
  if (Array.isArray(multiCircles) && multiCircles.length > 0) {
    return (
      <Flex gap="small" wrap style={style}>
        {multiCircles.map((circle, i) => (
          <Progress
            key={i}
            type="circle"
            percent={circle.percent}
            format={circle.format || format}
            strokeColor={circle.color || color}
            trailColor={trailColor}
            size={circle.size || size}
            status={circle.status || status}
            strokeWidth={circle.strokeWidth || strokeWidth}
          />
        ))}
      </Flex>
    );
  }

  return (
    <Progress
      type="circle"
      percent={percent}
      format={format}
      strokeColor={color}
      trailColor={trailColor}
      size={size}
      status={status}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
}
