// src/pages/PageUpload/components/ImgUpload.jsx
import React, { useState, useCallback } from 'react';
import './ImgUpload.css';
import { Upload, Button } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import CustomUpload2 from '../common/CustomUpload2';

const { Dragger } = Upload;

export default function ImgUpload({
  action = '/api/upload',           // 실제 업로드 엔드포인트로 교체
  defaultFileList = [],             // 초기 썸네일 목록
  maxCount = 5,
  accept = 'image/*',
  multiple = true,
  onChange,                         // 상위 페이지로 현재 파일 리스트 전달
  onPreview,                        // 미리보기 훅(선택)
}) {
  const [fileList, setFileList] = useState(defaultFileList);

  const handleChange = useCallback(
    (info) => {
      const next = info.fileList.slice(0, maxCount);
      setFileList(next);
      onChange && onChange(next);
    },
    [maxCount, onChange]
  );

  // Dragger에서 사용하는 props (동일 리스트 공유)
  const draggerProps = {
    name: 'file',
    action,
    multiple,
    accept,
    fileList,
    maxCount,
    onChange: handleChange,
    showUploadList: false, // 상단은 안내 영역만, 리스트는 하단에서 표시
  };

  return (
    <div className="img-upload-wrap" style={{ display: 'grid', gap: 16 }}>
        <h2>식단 이미지 업로드</h2>
      {/* 상단 대형 드래그&드롭 영역 */}
      <div
        className="drop-area"
        style={{
          border: '2px dashed #d9d9d9',
          borderRadius: 12,
          padding: 32,
          background: '#fafafa',
        }}
      >
        <Dragger {...draggerProps} height={220} rootClassName="img-upload-root" className="img-upload-dragger" style={{ background: 'transparent' }}>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            음식 이미지를 여기로 업로드하세요.
          </p>
          <p style={{ color: '#8c8c8c', marginBottom: 16 }}>
            파일을 드래그 앤 드롭 또는 아래 버튼으로 업로드
          </p>
          <Button type="primary" icon={<UploadOutlined />} className="img-upload-btn">이미지 업로드</Button>
        </Dragger>
      </div>

      {/* 하단 썸네일 리스트 + 플러스 카드 */}
      <div
        className="thumb-list"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >

        <div style={{ flex: 1 }}>
          <CustomUpload2
            action={action}
            fileList={fileList}
            onChange={handleChange}
            onPreview={onPreview}
            maxCount={maxCount}
            listType="picture-card"
            accept={accept}
            multiple={multiple}
            crop={{ rotationSlider: true }}
            childrenText="+"
          />
        </div>
      </div>
    </div>
  );
}
