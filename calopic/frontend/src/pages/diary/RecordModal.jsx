// RecordModal.jsx

// ⭐️ import 문 수정: useState를 import합니다.
import React, { useState } from 'react';
import { Modal, Tabs, Input, Button, List, Checkbox } from 'antd';
import { SearchOutlined, CameraOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';

// ⭐️ selectedDate prop을 추가했습니다.
const RecordModal = ({ isVisible, onClose, selectedDate }) => {
  // 현재 선택된 식사 탭 (기본값: 아침)
  const [activeTab, setActiveTab] = useState('breakfast');
  // ⭐️ 1. 업로드된 이미지의 URL을 저장할 상태 추가
  const [uploadedImage, setUploadedImage] = useState(null);

  // 예시 음식 목록
  const [foodList, setFoodList] = useState([
    { id: 1, name: '돼지고기', calorie: 150, checked: true },
    { id: 2, name: '단호박', calorie: 90, checked: true },
    { id: 3, name: '방울토마토', calorie: 70, checked: true },
    { id: 4, name: '양상추', calorie: 10, checked: false },
  ]);

  // 체크박스 핸들러
  const handleCheck = (id) => {
    setFoodList(prev =>
      prev.map(food =>
        food.id === id ? { ...food, checked: !food.checked } : food
      )
    );
  };

  // ⭐️ 3. 파일이 선택되었을 때 실행할 핸들러 (이미지 미리보기 로직 추가)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('선택된 파일:', file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
          // 파일 읽기가 완료되면 상태를 업데이트하여 미리보기 표시
          setUploadedImage(e.target.result);
      };

      // 파일을 Data URL 형식(base64)으로 읽기
      reader.readAsDataURL(file);
    }
    // 파일을 선택한 후 input의 value를 초기화하여 같은 파일을 다시 선택할 수 있게 합니다.
    event.target.value = null;
  };

  // 선택된 음식의 칼로리 합계 계산
  const totalCalorie = foodList
    .filter(food => food.checked)
    .reduce((sum, food) => sum + food.calorie, 0);

  // 탭 항목 정의
  const tabItems = [
    { key: 'breakfast', label: '아침', children: '아침 식단 내용' },
    { key: 'lunch', label: '점심', children: '점심 식단 내용' },
    { key: 'dinner', label: '저녁', children: '저녁 식단 내용' },
    { key: 'snack', label: '간식', children: '간식 식단 내용' },
  ];

  return (
    <Modal
      title="기록 추가"
      open={isVisible}
      onCancel={() => {
        // 모달 닫을 때 이미지 상태 초기화
        setUploadedImage(null);
        onClose();
      }}
      footer={null}
      className="record-modal-custom"
      width={700}
      centered
      //  수정: 모달의 최대 높이를 화면 높이의 90%로 제한합니다.
      style={{ maxHeight: '90vh', overflowY: 'hidden' }}
      //  최종 수정: ref 연결 문제를 해결하기 위해 destroyOnHidden 사용
      destroyOnHidden
    >
      {/*  날짜 표시를 Modal Body의 최상단으로 옮기고, selectedDate prop을 사용합니다. */}
      <div className="modal-header-content">
         <span className="modal-date-display">
            {selectedDate ? selectedDate.format('MM월 DD일') : moment().format('MM월 DD일')} <CalendarOutlined />
        </span>
      </div>

      {/* 1. 식사 탭 네비게이션 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="meal-tabs-custom"
        type="card"
      />

    {/* 2. 이미지/AI 영역 */}
      <div className="image-upload-area">
        <div className="image-box">
          {/* uploaded-image-placeholder 클래스에 CSS로 비율을 고정하여 구겨짐을 방지합니다. */}
          <div className="uploaded-image-placeholder">
            {/* ️ uploadedImage 상태에 따라 이미지 또는 플레이스홀더 텍스트 표시 */}
            {uploadedImage ? (
                <img
                    src={uploadedImage}
                    alt="업로드된 식단 이미지"
                    // 인라인 스타일 제거
                />
            ) : (
                <div className="image-placeholder-text">식단 이미지를 추가해주세요.</div>
            )}
          </div>
        </div>
        <div className="upload-buttons">
            {/*  4. 파일 인풋을 AntD 버튼처럼 스타일링하여 직접 클릭하게 만듭니다. */}
            <label htmlFor="photo-upload-input" className="ant-btn upload-btn photo-btn">
                <PlusOutlined />
                사진 추가
                <input
                    id="photo-upload-input"
                    type="file"
                    onChange={handleFileChange} // 파일 선택 시 핸들러 호출
                    accept="image/*" // 이미지 파일만 허용
                    // 실제 파일 입력 필드는 화면에서 숨기되, label을 통해 클릭 가능
                    style={{
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: '0',
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        border: '0'
                    }}
                />
            </label>
            {/* 기존 버튼 태그는 삭제되었습니다. */}
            <Button icon={<CameraOutlined />} className="upload-btn ai-btn">
                AI 식단 인식
            </Button>
        </div>
      </div>

      {/* 3. 검색 입력창 */}
      <Input
        placeholder="검색어를 입력해주세요."
        prefix={<SearchOutlined />}
        className="food-search-input"
        size="large"
      />

      {/* 4. 음식 목록 */}
      {/* 이 영역에만 스크롤이 생기도록 CSS에서 높이를 flex-grow로 조정합니다. */}
      <div className="food-list-container">
        <List
          dataSource={foodList}
          renderItem={(item) => (
            <List.Item className="food-list-item">
              <span className="food-name">{item.name}</span>
              <span className="food-calorie">{item.calorie}kcal</span>
              <Checkbox
                checked={item.checked}
                onChange={() => handleCheck(item.id)}
                className="food-checkbox"
              />
            </List.Item>
          )}
        />
      </div>

      {/* 5. 합계 및 저장 버튼 */}
      <div className="modal-footer-summary">
        <div className="total-calorie-display">
          합계 : <span className="calorie-number">{totalCalorie}kcal</span>
        </div>
        <Button type="primary" size="large" className="save-record-btn">
          저장
        </Button>
      </div>
    </Modal>
  );
};

export default RecordModal;