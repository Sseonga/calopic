import React from 'react';
import { Select } from 'antd';

/**
 * 공통 Select 컴포넌트
 * props:
 *  - options: [{ value: '', label: '' }] 형태의 배열
 *  - value: 현재 선택된 값
 *  - placeholder: 표시할 안내문구
 *  - onChange: 선택 시 실행할 함수
 *  - onSearch: 검색 시 실행할 함수 (선택)
 *  - style: 추가 스타일 (선택)
 */
export default function CustomSelect2({
  options = [],
  value,
  placeholder = '선택하세요',
  onChange,
  onSearch,
  style = { width: 200 },
}) {
  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      optionFilterProp="label"
      onChange={onChange}
      onSearch={onSearch}
      options={options}
      style={style}
    />
  );
}
