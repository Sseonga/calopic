import React from 'react';
import { Button, message } from 'antd';

/**
 * CustomMessage — 공통 알림 메시지 컴포넌트
 *
 * props:
 *  - type: 메시지 유형 ('info' | 'success' | 'error' | 'warning' | 'loading')
 *  - content: 표시할 텍스트
 *  - buttonText: 버튼에 표시할 문구
 *  - duration: 메시지 표시 시간 (초 단위, 기본 2)
 *  - placement: 표시 위치 ('top' | 'bottom' 등, 기본 top)
 *  - style: 버튼 스타일
 *  - color: 버튼 포인트 색상 (기본 #36C96D)
 */
export default function CustomMessage({
  type = 'info',
  content = 'Hello, Ant Design!',
  buttonText = '메시지 보기',
  duration = 2,
  placement = 'top',
  style,
  color = '#36C96D',
}) {
  const [messageApi, contextHolder] = message.useMessage();

  const handleClick = () => {
    if (messageApi[type]) {
      messageApi.open({
        type,
        content,
        duration,
        style: { color: '#333' },
      });
    } else {
      messageApi.info(content);
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={handleClick}
        style={{
          backgroundColor: color,
          borderColor: color,
          ...style,
        }}
      >
        {buttonText}
      </Button>
    </>
  );
}
