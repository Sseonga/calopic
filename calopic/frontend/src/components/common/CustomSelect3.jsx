import React from 'react';
import { Select, Tag } from 'antd';

/**
 * CustomSelect3 — 태그 형태로 표시되는 다중 선택 Select
 * props:
 *  - options: [{ value: '', label: '' }] 형태의 배열
 *  - value: 현재 선택된 값
 *  - defaultValue: 기본 선택값
 *  - onChange: 선택 변경 시 실행 함수
 *  - placeholder: 안내 문구
 *  - style: Select 스타일 지정 (기본 width 250)
 */
export default function CustomSelect3({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = '선택하세요',
  style = { width: 250 },
}) {
  // 선택된 항목을 태그 형태로 렌더링
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label || value}
      </Tag>
    );
  };

  return (
    <Select
      mode="multiple"
      tagRender={tagRender}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      options={options}
    />
  );
}
