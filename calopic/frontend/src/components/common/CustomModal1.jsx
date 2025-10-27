import React, { useState } from 'react';
import { Button, Modal } from 'antd';

/**
 * CustomModal1 — 공통 모달 컴포넌트 (내용 외부 제어 가능)
 *
 * props:
 *  - title: 모달 제목
 *  - children: 모달 내부 콘텐츠 (외부에서 전달)
 *  - okText: 확인 버튼 문구
 *  - cancelText: 취소 버튼 문구
 *  - buttonText: 모달을 여는 버튼 문구
 *  - onOk: 확인 버튼 클릭 시 실행할 함수
 *  - onCancel: 취소 버튼 클릭 시 실행할 함수
 *  - color: 확인 버튼 색상 (기본 초록 #36C96D)
 *  - closable: 닫기 버튼 표시 여부 (기본 true)
 *  - width: 모달 너비 (기본 520)
 *  - style: 여는 버튼 스타일
 */
export default function CustomModal1({
  title = '기본 모달',
  children,
  okText = '확인',
  cancelText = '취소',
  buttonText = '모달 열기',
  onOk,
  onCancel,
  color = '#36C96D',
  closable = true,
  width = 520,
  style,
  maskClosable =  true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => setIsOpen(true);

  const handleOk = async () => {
    if (!onOk) {
      setIsOpen(false);
      return;
    }
    try {
      setConfirmLoading(true);
      const shouldClose = await onOk(); // true면 닫기
      if (shouldClose) setIsOpen(false);
    } catch (e) {
      // 검증 실패나 예외 → 닫지 않음
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleCancel = () => {
    onCancel && onCancel();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{
          backgroundColor: color,
          borderColor: color,
          ...style,
        }}
      >
        {buttonText}
      </Button>

      <Modal
        title={title}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
        closable={closable}
        width={width}
        maskClosable={maskClosable}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        {/* children으로 외부 내용 표시 */}
        {children}
      </Modal>
    </>
  );
}
