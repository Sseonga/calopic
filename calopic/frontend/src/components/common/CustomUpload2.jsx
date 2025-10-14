// src/component/CustomUpload2.jsx
import React, { useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

/**
 * CustomUpload2 — 이미지 크롭(회전 포함) + picture-card 리스트 업로드
 *
 * props:
 *  - action: 업로드 API 엔드포인트
 *  - fileList: 외부 제어용 파일 리스트 (제어 컴포넌트로 사용 시)
 *  - defaultFileList: 초기 파일 리스트 (비제어 사용 시)
 *  - onChange: 업로드 리스트 변경 콜백 (info) => void
 *  - onPreview: 미리보기 콜백 (file) => void
 *  - maxCount: 최대 업로드 개수 (기본 5)
 *  - listType: 업로드 리스트 타입 (기본 'picture-card')
 *  - accept: 허용 파일 타입 (예: 'image/*')
 *  - multiple: 다중 업로드 여부
 *  - crop: { rotationSlider?: boolean, aspect?: number } 크롭 옵션
 *  - childrenText: 버튼/카드 내부 텍스트 (기본 '+ Upload')
 */
export default function CustomUpload2({
  action = 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  fileList,
  defaultFileList = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ],
  onChange,
  onPreview,
  maxCount = 5,
  listType = 'picture-card',
  accept = 'image/*',
  multiple = false,
  crop = { rotationSlider: true },
  childrenText = '+ Upload',
}) {
  // 비제어(내부 상태) 모드용
  const [internalList, setInternalList] = useState(defaultFileList);

  const isControlled = Array.isArray(fileList);
  const currentList = isControlled ? fileList : internalList;

  const handleChange = (info) => {
    if (!isControlled) setInternalList(info.fileList);
    onChange && onChange(info);
  };

  const handlePreview = async (file) => {
    if (onPreview) return onPreview(file);

    // 기본 미리보기 동작
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <ImgCrop {...crop}>
      <Upload
        action={action}
        listType={listType}
        fileList={currentList}
        onChange={handleChange}
        onPreview={handlePreview}
        accept={accept}
        multiple={multiple}
      >
        {currentList.length < maxCount && childrenText}
      </Upload>
    </ImgCrop>
  );
}
