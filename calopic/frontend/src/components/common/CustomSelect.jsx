// src/components/common/CustomSelect.jsx
import { Select } from 'antd';

export default function CustomSelect({ options, onChange, placeholder }) {
  return (
    <Select
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: 200 }}
    />
  );
}
