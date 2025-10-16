import React, { useState } from 'react';
import { Row, Col, DatePicker, Progress, Dropdown, Button, InputNumber, Modal, Tabs, Input, List, Checkbox } from 'antd'
import { CalendarOutlined, PlusOutlined, DownOutlined, SearchOutlined, CameraOutlined as CameraIcon } from '@ant-design/icons';
import moment from 'moment';
import './DiaryPage.css';

// =========================================================
//  1. 기록 추가 모달 컴포넌트 (RecordModal)
// =========================================================
const RecordModal = ({ isVisible, onClose, selectedDate }) => {
  const [activeTab, setActiveTab] = useState('breakfast');
  // ⭐️ 1. 업로드된 이미지의 URL을 저장할 상태 추가
  const [uploadedImage, setUploadedImage] = useState(null);

  // 예시 음식 목록 (실제로는 API에서 가져옴)
  const [foodList, setFoodList] = useState([
    { id: 1, name: '돼지고기', calorie: 150, checked: true },
    { id: 2, name: '단호박', calorie: 90, checked: true },
    { id: 3, name: '방울토마토', calorie: 70, checked: true },
    { id: 4, name: '양상추', calorie: 10, checked: false },
  ]);

  const handleCheck = (id) => {
    setFoodList(prev =>
      prev.map(food =>
        food.id === id ? { ...food, checked: !food.checked } : food
      )
    );
  };

  // 파일 선택 핸들러: FileReader를 사용하여 이미지 미리보기 구현
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
    event.target.value = null;
  };

  const totalCalorie = foodList
    .filter(food => food.checked)
    .reduce((sum, food) => sum + food.calorie, 0);

  const tabItems = [
    { key: 'breakfast', label: '아침' },
    { key: 'lunch', label: '점심' },
    { key: 'dinner', label: '저녁' },
    { key: 'snack', label: '간식' },
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
      //  경고 수정: destroyOnClose -> destroyOnHidden
      destroyOnHidden
    >
      {/*  날짜 표시를 Modal Body의 최상단에 배치하고, selectedDate prop을 사용합니다. */}
      <div className="modal-header-content">
         <span className="modal-date-display">
            {selectedDate && moment.isMoment(selectedDate)
                ? selectedDate.format('MM월 DD일')
                : moment().format('MM월 DD일')}
            <CalendarOutlined />
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
          <div className="uploaded-image-placeholder">
            {/*  uploadedImage 상태에 따라 이미지 소스를 결정 */}
            {uploadedImage ? (
                <img
                    src={uploadedImage}
                    alt="업로드된 식단 이미지"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <div className="image-placeholder-text">식단 이미지를 추가해주세요.</div>
            )}
          </div>
        </div>
        <div className="upload-buttons">
            <label htmlFor="photo-upload-input" className="ant-btn upload-btn photo-btn">
                <PlusOutlined />
                사진 추가
                <input
                    id="photo-upload-input"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
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
            <Button icon={<CameraIcon />} className="upload-btn ai-btn">
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


// =========================================================
//  2. 캘린더 기능을 담당하는 컴포넌트 (DateSelect)
// =========================================================
const DateSelect = ({ value, onChange }) => {
  const displayFormat = 'MM월 DD일';

  return (
    <DatePicker
      value={value}
      onChange={onChange}
      format={displayFormat}
      suffixIcon={<CalendarOutlined style={{ color: '#333' }} />}
      // ⭐️ 경고 수정: bordered -> variant="borderless"
      variant="borderless"
      // ⭐️ 경고 수정: dropdownClassName -> classNames.popup
      classNames={{ popup: "date-picker-dropdown" }}
      inputReadOnly={true}
    />
  );
};

// =========================================================
//  3. 수분 섭취량 컴포넌트 구현 (WaterIntakeControl)
// =========================================================
const WaterIntakeControl = ({ goal = 2.0 }) => {
  const [intake, setIntake] = useState(1.5);
  // ⭐️ 경고 수정: isDropdownVisible -> isOpen
  const [isOpen, setIsOpen] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);
  const percent = Math.min((intake / goal) * 100, 100);

  const handleMenuClick = (e) => {
    const value = e.key;
    if (value === 'input') {
      setIsInputMode(true);
      return;
    }
    setIntake(prev => prev + parseFloat(value));
    setIsInputMode(false);
  };

  const handleInputChange = (value) => {
      if (value !== null && value !== undefined) {
          setIntake(parseFloat(value));
          setIsInputMode(false);
      }
  }

  // Dropdown의 menu items
  const menuItems = [
      { key: '0.2', label: '200ml' },
      { key: '0.5', label: '500ml' },
      { type: 'divider' },
      { key: 'input', label: '직접 입력' },
  ];

  return (
    <div className="water-control-group">
      <div className="water-button-row">
        {isInputMode ? (
            <InputNumber
                min={0}
                step={0.1}
                defaultValue={intake}
                addonAfter="L"
                onBlur={handleInputChange}
                onPressEnter={handleInputChange}
                className="custom-water-input"
            />
        ) : (
            <Dropdown
                // ⭐️ 경고 수정: overlay -> menu
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={['click']}
                // ⭐️ 경고 수정: visible -> open
                open={isOpen}
                // ⭐️ 경고 수정: onVisibleChange -> onOpenChange
                onOpenChange={setIsOpen}
            >
              <Button className="water-dropdown-btn">
                수분 섭취 <DownOutlined />
              </Button>
            </Dropdown>
        )}
      </div>

      <div className="water-gauge">
        <div className="water-drop-icon">
             <div className="water-fill" style={{ height: `${percent}%` }}></div>
        </div>
        <div className="water-text-display">
            {intake.toFixed(1)} / {goal.toFixed(1)}L
        </div>
      </div>
    </div>
  );
};


// =========================================================
//  4. 메인 컴포넌트 (PageDiary)
// =========================================================
export default function PageDiary() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const macroData = [
    { name: '탄수화물', percent: 45, color: '#D1C4E9' },
    { name: '단백질', percent: 35, color: '#B3E5BC' },
    { name: '지방', percent: 20, color: '#FFCDD2' },
  ];

  return (
    <div className="diary-page-container">

      <Row gutter={[90, 0]} className="diary-main-content">

        {/* -------------------- Col 1: 날짜/기록 버튼 영역 -------------------- */}
        <Col className="col-controls" span={3}>
            <div className="top-control-row">
                <div className="date-info">
                    <DateSelect
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                </div>
                <button className="add-record-btn" onClick={handleOpenModal}>
                    <PlusOutlined style={{ marginRight: '5px' }} /> 기록추가
                </button>
            </div>
        </Col>

        {/* -------------------- Col 2 식단 기록 리스트 영역 -------------------- */}
        <Col className="col-record-list" span={14}>
            <div className="record-list">
              {/* Card 컴포넌트가 없으므로 bodyStyle 경고는 여기에는 해당되지 않으나, Card 사용 시 styles.body로 변경 필요 */}
              <div className="record-card">
                <div className="card-image-box">
                    <img src="/path/to/breakfast_image.jpg" alt="아침 식단 이미지" />
                </div>
                <div className="card-details">
                    <h4 className="meal-time">아침</h4>
                    <ul className="food-list">
                        <li>계란</li>
                        <li>고구마</li>
                    </ul>
                </div>
                <div className="card-summary">
                    <p className="total-text">합계 <span className="check-icon">☑️</span></p>
                    <p className="total-calorie">500kcal</p>
                </div>
              </div>

              <div className="record-card">
                  <div className="card-image-box">
                      <img src="/path/to/lunch_image.jpg" alt="점심 식단 이미지" />
                  </div>
                  <div className="card-details">
                      <h4 className="meal-time">점심</h4>
                      <ul className="food-list">
                          <li>양상추, 고구마</li>
                          <li>계란, 파프리카</li>
                          <li>견과류</li>
                      </ul>
                  </div>
                  <div className="card-summary">
                      <p className="total-text">합계 <span className="check-icon">☑️</span></p>
                      <p className="total-calorie">374kcal</p>
                  </div>
              </div>

              <div className="record-card">
                  <div className="card-image-box">
                      <img src="/path/to/dinner_image.jpg" alt="저녁 식단 이미지" />
                  </div>
                  <div className="card-details">
                      <h4 className="meal-time">저녁</h4>
                      <ul className="food-list">
                          <li>단호박, 돼지고기</li>
                          <li>방울토마토</li>
                      </ul>
                  </div>
                  <div className="card-summary">
                      <p className="total-text">합계 <span className="check-icon">☑️</span></p>
                      <p className="total-calorie">310kcal</p>
                  </div>
              </div>
            </div>
        </Col>

        {/* -------------------- Col 3: 요약 정보 영역 -------------------- */}
         <Col className="col-summary" span={7}>
                 <div className="summary-card">
                   <div className="section-calorie-goal">
                     <h3 className="summary-title">오늘의 기록</h3>
                     <div className="calorie-display">
                         <span className="big-number">1,134</span>
                         <span className="small-text">/1,800kcal</span>
                     </div>
                   </div>

                   {/* 탄단지 비율 영역 */}
                   <div className="section-macro-ratio">
                     <h4 className="section-title">탄단지 비율</h4>
                     <div className="macro-bars">
                        {macroData.map(macro => (
                            <div key={macro.name} className="macro-item">
                                <span className="macro-name">{macro.name}</span>
                                <Progress
                                  percent={macro.percent}
                                  strokeColor={macro.color}
                                  showInfo={false}
                                  // ⭐️ 경고 수정: strokeWidth (Deprecated) 대신 size="small" 또는 size 속성 사용
                                  size="small"
                                  className="macro-bar"
                                />
                            </div>
                        ))}
                     </div>
                   </div>

                   {/* 수분 섭취량 영역 */}
                   <div className="section-water-intake">
                     <h4 className="section-title">수분 섭취량</h4>
                     <WaterIntakeControl />
                   </div>
                 </div>
        </Col>
      </Row>

      {/* 5. RecordModal 컴포넌트 렌더링 */}
      <RecordModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />

    </div>
  );
}