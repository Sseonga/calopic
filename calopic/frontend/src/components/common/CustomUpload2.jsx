import React, { useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

/**
 * CustomUpload2 — 이미지 크롭(회전 포함) + picture-card 리스트 업로드
 * 실제 업로드를 막고 로컬 리스트만 관리하려면 beforeUpload를 전달하세요.
 * (customRequest가 즉시 onSuccess를 호출하여 네트워크 요청을 하지 않습니다)
 */
export default function CustomUpload2({
  action = '/api/upload',          // 프록시/절대주소 사용 시만 의미 있음 (intercept 시 무시됨)
  fileList,
  defaultFileList = [],
  onChange,
  onPreview,
  beforeUpload,                    // 추가: 업로드 전 인터셉트
  maxCount = 5,
  listType = 'picture-card',
  accept = 'image/*',
  multiple = false,
  crop = { rotationSlider: true },
  childrenText = '+ Upload',
  name = 'file',
  className,
  style,
}) {
  const [internalList, setInternalList] = useState(defaultFileList);
  const isControlled = Array.isArray(fileList);
  const currentList = isControlled ? fileList : internalList;

  const handleChange = (info) => {
    if (!isControlled) setInternalList(info.fileList);
    onChange && onChange(info);
  };

  const handlePreview = async (file) => {
    if (onPreview) return onPreview(file);

    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const w = window.open(src);
    w?.document.write(image.outerHTML);
  };

  // 네트워크 요청을 아예 하지 않도록 가짜 업로드 처리
  const noNetworkCustomRequest = ({ onProgress, onSuccess }) => {
    // 진행률 흉내 (선택)
    onProgress?.({ percent: 100 });
    // 즉시 성공 처리 -> antd가 리스트 상태를 'done'으로 만듭니다
    onSuccess?.({ ok: true });
  };

  return (
    <ImgCrop {...crop}>
      <Upload
        action={action}                 // customRequest 사용 중이라도 prop은 유지
        listType={listType}
        fileList={currentList}
        onChange={handleChange}
        onPreview={handlePreview}
        accept={accept}
        multiple={multiple}
        name={name}
        beforeUpload={beforeUpload}     // Dragger와 동일하게 인터셉트
        customRequest={noNetworkCustomRequest} // 실제 POST 방지
        className={className}
        style={style}
      >
        {currentList.length < maxCount && childrenText}
      </Upload>
    </ImgCrop>
  );
}
