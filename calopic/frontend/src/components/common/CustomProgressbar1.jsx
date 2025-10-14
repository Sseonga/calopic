import React from 'react';
import { Flex, Progress } from 'antd';

/**
 * CustomProgressbar1 — 공통 진행률 표시 컴포넌트
 *
 * props:
 *  - percent: 진행률 (0~100)
 *  - status: 상태 ('normal' | 'active' | 'exception' | 'success')
 *  - showInfo: 퍼센트 텍스트 표시 여부
 *  - color: 진행 색상 (기본 #36C96D)
 *  - trailColor: 남은 부분 색상
 *  - strokeWidth: 바 두께 (기본 8)
 *  - type: 'line' | 'circle' | 'dashboard'
 *  - steps: 분할선 수 (선형 전용)
 *  - style: 추가 스타일
 *  - multiBars: 여러 개를 한 번에 보여줄 배열 [{ percent, status, showInfo, color }]
 *      => multiBars가 있으면 배열 기반으로 여러 Progress 렌더링, 하나만 쓰고싶으면 설정 x 
 */
export default function CustomProgressbar1({
  percent = 50,
  status = 'normal',
  showInfo = true,
  color = '#717bffff',
  trailColor = '#f5f5f5',
  strokeWidth = 8,
  type = 'line',
  steps,
  style,
  multiBars,
}) {
  // 색상 팔레트 (원하는 색상 추가 가능)
  const colorPalette = ['#ff9feaff', '#4A90E2', '#F5A623', '#36c96d', '#ffdc6bff'];

  if (Array.isArray(multiBars) && multiBars.length > 0) {
    return (
      <Flex gap="small" vertical style={style}>
        {multiBars.map((bar, i) => (
          <Progress
            key={i}
            percent={bar.percent}
            status={bar.status || status}
            showInfo={bar.showInfo ?? showInfo}
            strokeColor={bar.color || colorPalette[i % colorPalette.length]}
            trailColor={trailColor}
            strokeWidth={strokeWidth}
            type={type}
            steps={steps}
          />
        ))}
      </Flex>
    );
  }

  return (
    <Progress
      percent={percent}
      status={status}
      showInfo={showInfo}
      strokeColor={color}
      trailColor={trailColor}
      strokeWidth={strokeWidth}
      type={type}
      steps={steps}
      style={style}
    />
  );
}
