import React from 'react';
import { DatePicker } from 'antd';

/**
 * CustomSelectDate1 — 기본 날짜 선택 컴포넌트
 *
 * props:
 *  - value: 외부 제어용 날짜(moment/dayjs 객체)
 *  - onChange: 날짜 변경 시 실행 함수 (date, dateString)
 *  - placeholder: 입력창 안내 문구
 *  - disabled: 비활성화 여부
 *  - format: 날짜 포맷 (기본 'YYYY-MM-DD')
 *  - style: 추가 스타일
 */
export default function CustomSelectDate1({
  value,
  onChange,
  placeholder = '날짜를 선택하세요',
  disabled = false,
  format = 'YYYY-MM-DD',
  style,
}) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      format={format}
      style={style}
    />
  );
}
