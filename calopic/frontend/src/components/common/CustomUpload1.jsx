import React from 'react';
import './CustomComponent.css';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

/**
 * CustomUpload1 — 공통 파일 업로드 컴포넌트
 *
 * props:
 *  - action: 업로드 요청 경로 (API URL)
 *  - headers: 요청 헤더 (선택)
 *  - onChange: 파일 변경 시 실행 함수 (선택)
 *  - buttonText: 버튼에 표시할 문구
 *  - icon: 버튼 아이콘 (기본 UploadOutlined)
 *  - style: 커스텀 스타일
 */
export default function CustomUpload1({
  action = 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers = { authorization: 'authorization-text' },
  onChange,
  buttonText = 'Click to Upload',
  icon = <UploadOutlined />,
  style,
}) {
  const handleChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 업로드 완료`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 업로드 실패`);
    }
    onChange && onChange(info);
  };

  return (
    <Upload
      name="file"
      action={action}
      headers={headers}
      onChange={handleChange}
      style={style}
    >
      <Button icon={icon}>{buttonText}</Button>
    </Upload>
  );
}
