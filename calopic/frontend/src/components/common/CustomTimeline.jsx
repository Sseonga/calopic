import React from 'react';
import { Timeline } from 'antd';

/**
 * CustomTimeline — 공통 타임라인
 * props
 *  - items: [{ children, color?, label?, dot? }, ...]
 *  - defaultColor: 항목에 color가 없을 때 기본 색 (기본 #36C96D)
 *  - mode: 'left' | 'right' | 'alternate' (기본 'left')
 *  - reverse: 역순 표시 여부
 *  - pending: 마지막에 진행중 노드 표시 (문자열/노드/true)
 *  - style: 컨테이너 스타일
 */
export default function CustomTimeline({
  items = [],
  defaultColor = '#36C96D',
  mode = 'left',
  reverse = false,
  pending = false,
  style,
}) {
  const mapped = items.map(it => ({
    ...it,
    color: it.color ?? defaultColor,
  }));

  return (
    <Timeline
      items={mapped}
      mode={mode}
      reverse={reverse}
      pending={pending}
      style={style}
    />
  );
}
