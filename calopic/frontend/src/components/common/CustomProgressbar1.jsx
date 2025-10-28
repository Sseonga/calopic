import React from 'react';
import { Flex, Progress } from 'antd';

export default function CustomProgressbar1({
  percent = 50,
  status = 'normal',
  showInfo = true,
  color = '#717BFF',
  trailColor = '#f5f5f5',
  strokeWidth = 8,
  type = 'line',
  steps,
  style,
  multiBars,
}) {
  const colorPalette = ['#FF9FEA', '#4A90E2', '#F5A623', '#36C96D', '#FFDC6B'];

  // 텍스트 커스터마이징: 100% 이상이면 빨간색으로 표시
  const customFormat = (p) => (
    <span style={{ color: p > 100 ? 'red' : 'inherit', fontWeight: 600 }}>
      {`${p}%`}
    </span>
  );

  if (Array.isArray(multiBars) && multiBars.length > 0) {
    return (
      <Flex gap="small" vertical style={style}>
        {multiBars.map((bar, i) => (
          <Progress
            key={i}
            percent={Math.min(bar.percent, 100)} // 막대는 100으로 제한
            status={bar.status || status}
            showInfo={bar.showInfo ?? showInfo}
            strokeColor={bar.color || colorPalette[i % colorPalette.length]}
            trailColor={trailColor}
            strokeWidth={bar.strokeWidth ?? strokeWidth}
            type={type}
            steps={steps}
            format={() => customFormat(bar.percent)} // 실제 텍스트는 원본 percent 사용
            style={{ width: '100%' }}
          />
        ))}
      </Flex>
    );
  }

  return (
    <Progress
      percent={Math.min(percent, 100)} // 막대는 100까지만
      status={status}
      showInfo={showInfo}
      strokeColor={color}
      trailColor={trailColor}
      strokeWidth={strokeWidth}
      type={type}
      steps={steps}
      format={() => customFormat(percent)} // 표시 텍스트는 100% 이상도 가능
      style={{ width: '100%', ...style }}
    />
  );
}
