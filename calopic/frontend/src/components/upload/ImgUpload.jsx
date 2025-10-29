import React, { useState, useCallback } from 'react';
import './ImgUpload.css';
import { Upload, Button } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import CustomUpload2 from '../common/CustomUpload2';
import axios from 'axios';

const { Dragger } = Upload;

export default function ImgUpload({
  action = '/api/upload',
  defaultFileList = [],
  maxCount = 5,
  accept = 'image/*',
  multiple = true,
  onChange,
  onPreview,
  onDetections,
}) {
  const [fileList, setFileList] = useState(defaultFileList);

  const handleChange = useCallback(
    (info) => {
      const next = info.fileList.slice(0, maxCount);
      setFileList(next);
      onChange && onChange(next);

      // 썸네일 개별 삭제 연동
      if (info.file?.status === 'removed') {
        onDetections && onDetections({ type: 'removeByUid', uid: info.file.uid });
      }
    },
    [maxCount, onChange, onDetections]
  );

  const draggerProps = {
    name: 'file',
    action,                 // 프록시를 쓰면 '/api/upload', 아니면 8080 절대주소
    multiple,
    accept,
    fileList,
    maxCount,
    onChange: handleChange,
    showUploadList: false,
  };

  const handleBeforeUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const detections = res.data?.detections || [];
      const withUid = detections.map(d => ({ ...d, sourceUid: file.uid })); // ← 핵심
      onDetections && onDetections({ type: 'add', items: withUid });
      console.log("AI 분석 결과:", res.data.detections);
    } catch (error) {
      onDetections && onDetections({ type: 'add', items: [] });
      console.error("AI 분석 실패:", error);
    }
    return false; // 네트워크 업로드 차단
  };

  return (
    <div className="img-upload-wrap" style={{ display: 'grid', gap: 16 }}>
      <h2>식단 이미지 업로드</h2>

      <div
        className="drop-area"
        style={{
          border: '2px dashed #d9d9d9',
          borderRadius: 12,
          padding: 32,
          background: '#fafafa',
        }}
      >
        <Dragger
          {...draggerProps}
          height={220}
          rootClassName="img-upload-root"
          className="img-upload-dragger"
          style={{ background: 'transparent' }}
          beforeUpload={handleBeforeUpload}
        >
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            음식 이미지를 여기로 업로드하세요.
          </p>
          <p style={{ color: '#8c8c8c', marginBottom: 16 }}>
            파일을 드래그 앤 드롭 또는 아래 버튼으로 업로드
          </p>
          <Button type="primary" icon={<UploadOutlined />} className="img-upload-btn">
            이미지 업로드
          </Button>
        </Dragger>
      </div>

      <div
        className="thumb-list"
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <div style={{ flex: 1 }}>
          <CustomUpload2
            // action은 전달돼도 customRequest가 네트워크를 막습니다
            className="img-upload-card"
            action={action}
            fileList={fileList}
            onChange={handleChange}
            onPreview={onPreview}
            beforeUpload={handleBeforeUpload}     // Dragger와 동일하게 분석 후 업로드 차단
            maxCount={maxCount}
            listType="picture-card"
            accept={accept}
            multiple={multiple}
            crop={{ rotationSlider: true }}
            childrenText={
              <PlusOutlined style={{ fontSize: 24, color: '#999' }} className="img-upload-plus-btn" />
            }
          />
        </div>
      </div>
    </div>
  );
}
