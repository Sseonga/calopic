// src/component/CustomModal2.jsx
import React, { createContext } from 'react';
import { Button, Modal, Space } from 'antd';

// 필요하면 외부에서 Consumer로도 쓸 수 있게 export
export const ReachableContext = createContext(null);
export const UnreachableContext = createContext(null);

/**
 * CustomModal2 — useModal 훅 기반 공통 모달 트리거
 *
 * props:
 *  - title: 기본 타이틀 (각 타입별 override 가능)
 *  - content: 기본 콘텐츠(ReactNode). Context Consumer 사용 가능
 *  - buttons: 노출할 버튼 목록 ['confirm','warning','info','error']
 *  - texts: 버튼 라벨 { confirm, warning, info, error }
 *  - configOverrides: 각 타입별 Modal config override
 *      예) { confirm: { okText:'확인', cancelText:'취소' }, warning: { width:600 } }
 *  - reachableValue: ReachableContext 값(Consumer로 접근)
 *  - unreachableValue: UnreachableContext 값(예제 호환용)
 *  - spaceProps: 버튼들 감쌀 <Space> props
 *  - buttonProps: 각 버튼의 antd Button props 맵
 */
export default function CustomModal2({
  title = 'Use Hook!',
  content,
  buttons = ['confirm', 'warning', 'info', 'error'],
  texts = {
    confirm: 'Confirm',
    warning: 'Warning',
    info: 'Info',
    error: 'Error',
  },
  configOverrides = {},
  reachableValue = 'Light',
  unreachableValue = 'Bamboo',
  spaceProps,
  buttonProps = {},
}) {
  const [modal, contextHolder] = Modal.useModal();

  // 기본 콘텐츠 (예제와 동일하게 Context Consumer 사용)
  const defaultContent = (
    <>
      <ReachableContext.Consumer>
        {(name) => `Reachable: ${name}!`}
      </ReachableContext.Consumer>
      <br />
      <UnreachableContext.Consumer>
        {(name) => `Unreachable: ${name}!`}
      </UnreachableContext.Consumer>
    </>
  );

  const baseConfig = { title, content: content ?? defaultContent };

  const actions = {
    confirm: async () => {
      // confirm은 Promise를 반환(OK/Cancel 확인 가능)
      const ret = await modal.confirm({ ...baseConfig, ...(configOverrides.confirm || {}) });
      return ret;
    },
    warning: () => modal.warning({ ...baseConfig, ...(configOverrides.warning || {}) }),
    info: () => modal.info({ ...baseConfig, ...(configOverrides.info || {}) }),
    error: () => modal.error({ ...baseConfig, ...(configOverrides.error || {}) }),
  };

  return (
    <ReachableContext.Provider value={reachableValue}>
      <Space {...spaceProps}>
        {buttons.includes('confirm') && (
          <Button onClick={actions.confirm} {...(buttonProps.confirm || {})}>
            {texts.confirm}
          </Button>
        )}
        {buttons.includes('warning') && (
          <Button onClick={actions.warning} {...(buttonProps.warning || {})}>
            {texts.warning}
          </Button>
        )}
        {buttons.includes('info') && (
          <Button onClick={actions.info} {...(buttonProps.info || {})}>
            {texts.info}
          </Button>
        )}
        {buttons.includes('error') && (
          <Button danger onClick={actions.error} {...(buttonProps.error || {})}>
            {texts.error}
          </Button>
        )}
      </Space>

      {/* contextHolder는 접근하려는 컨텍스트 하위에 위치해야 함 */}
      {contextHolder}

      {/* 이 Provider는 contextHolder 바깥이라 Consumer에서 접근 불가(예제 유지용) */}
      <UnreachableContext.Provider value={unreachableValue} />
    </ReachableContext.Provider>
  );
}
