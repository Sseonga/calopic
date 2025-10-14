import React, { useState } from 'react';
import { Checkbox, Divider } from 'antd';

const CheckboxGroup = Checkbox.Group;

/**
 * CustomCheckbox2 — 전체선택 + 그룹체크 공통 컴포넌트
 *
 * props:
 *  - options: 체크박스 항목 배열 (['사과','배','오렌지'] 또는 [{label:'사과', value:'apple'}])
 *  - defaultCheckedList: 기본 체크된 항목 배열
 *  - onChange: 선택 변경 시 실행 함수 (checkedList) => void
 *  - labelCheckAll: 전체선택 텍스트 (기본: '전체선택')
 *  - color: 체크박스 색상 (기본 초록 #36C96D)
 *  - style: 전체 래퍼 스타일
 */
export default function CustomCheckbox2({
  options = ['Apple', 'Pear', 'Orange'],
  defaultCheckedList = ['Apple', 'Orange'],
  onChange,
  labelCheckAll = '전체선택',
  color = '#36C96D',
  style,
}) {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const checkAll = options.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < options.length;

  const handleGroupChange = (list) => {
    setCheckedList(list);
    onChange && onChange(list);
  };

  const handleCheckAllChange = (e) => {
    const newList = e.target.checked ? options : [];
    setCheckedList(newList);
    onChange && onChange(newList);
  };

  return (
    <div style={style}>
      <Checkbox
        indeterminate={indeterminate}
        onChange={handleCheckAllChange}
        checked={checkAll}
        style={{ accentColor: color }}
      >
        {labelCheckAll}
      </Checkbox>

      <Divider style={{ margin: '8px 0' }} />

      <CheckboxGroup
        options={options}
        value={checkedList}
        onChange={handleGroupChange}
        style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        {options.map((item) => (
          <Checkbox key={item.value || item} style={{ accentColor: color }}>
            {item.label || item}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
