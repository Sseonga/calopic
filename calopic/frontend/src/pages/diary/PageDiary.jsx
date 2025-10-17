import React, { useState, useMemo } from 'react';
import { Row, Col, DatePicker, Progress, Dropdown, Button, InputNumber, Modal, Tabs, Input, List, Checkbox } from 'antd'
import { CalendarOutlined, PlusOutlined, DownOutlined, SearchOutlined, CameraOutlined } from '@ant-design/icons';
import moment from 'moment';
import './DiaryPage.css';

// =========================================================
//  1. 기록 추가 모달 컴포넌트 (RecordModal) - ⭐️ 삭제 기능 추가!
// =========================================================
const RecordModal = ({ isVisible, onClose, selectedDate }) => {
  const [activeTab, setActiveTab] = useState('breakfast');
  const [uploadedImage, setUploadedImage] = useState(null);

  const [foodList, setFoodList] = useState([
    { id: 1, name: '돼지고기', calorie: 150, checked: true },
    { id: 2, name: '단호박', calorie: 90, checked: true },
    { id: 3, name: '방울토마토', calorie: 70, checked: true },
    { id: 4, name: '양상추', calorie: 10, checked: false },
    { id: 5, name: '소고기', calorie: 200, checked: false },
    { id: 6, name: '닭가슴살', calorie: 120, checked: false },
  ]);

  const handleCheck = (id) => {
    setFoodList(prev =>
      prev.map(food =>
        food.id === id ? { ...food, checked: !food.checked } : food
      )
    );
  };

  // ⭐️ [추가된 기능] 체크된 항목을 foodList에서 제거하는 함수
  const handleDelete = () => {
    // checked: true 가 아닌 항목(체크 해제된 항목)만 남깁니다.
    const newFoodList = foodList.filter(food => !food.checked);
    setFoodList(newFoodList);
  };
  // ⭐️ --------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  const totalCalorie = useMemo(() => foodList
    .filter(food => food.checked)
    .reduce((sum, food) => sum + food.calorie, 0),
    [foodList]
  );

  const tabItems = [
    { key: 'breakfast', label: '아침' },
    { key: 'lunch', label: '점심' },
    { key: 'dinner', label: '저녁' }
    // 간식 탭이 누락되었으므로, 필요한 경우 다시 추가할 수 있습니다.
  ];

  return (
    <Modal
      title="기록 추가"
      open={isVisible}
      onCancel={() => {
        setUploadedImage(null);
        onClose();
      }}
      footer={null}
      className="record-modal-custom"
      width={550}
      centered
      destroyOnHidden
      bodyStyle={{ padding: '0' }}
    >
      {/* 날짜 영역 */}
      <div className="modal-header-content">
         <span className="modal-date-display">
            {selectedDate && moment.isMoment(selectedDate)
                ? selectedDate.format('MM월 DD일')
                : moment().format('MM월 DD일')}
            <CalendarOutlined />
        </span>
      </div>

      <div className="modal-content-wrapper" style={{ padding: '0 24px' }}>

          {/* 1. 식사 탭 네비게이션 */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="meal-tabs-custom"
            type="card"
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />

        {/* 2. 이미지/AI 영역 */}
          <div className="image-upload-area" style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'flex-start', padding: '0' }}>

            {/* 이미지 박스: 120px 정사각형으로 강제 고정 */}
            <div className="image-box" style={{ width: '120px', height: '120px', flexShrink: 0, border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>

              {/* 비율 오버라이드 및 중앙 정렬 */}
              <div className="uploaded-image-placeholder" style={{
                    width: '100%',
                    height: '100%',
                    paddingTop: '0',
                    position: 'relative',
                    backgroundColor: '#f7f7f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {uploadedImage ? (
                    <img
                        src={uploadedImage}
                        alt="업로드된 식단 이미지"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                ) : (
                    <div className="image-placeholder-text" style={{ position: 'static', color: '#aaa', fontSize: '12px', textAlign: 'center' }}>식단 이미지<br/>추가</div>
                )}
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="upload-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1, paddingTop: '5px', flexBasis: 'auto' }}>
                <label htmlFor="photo-upload-input" className="ant-btn upload-btn photo-btn" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}>
                    <PlusOutlined />
                    사진 추가
                    <input
                        id="photo-upload-input"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }}
                    />
                </label>
                <Button icon={<CameraOutlined />} className="upload-btn ai-btn" style={{ height: '40px' }}>
                    AI 식단 인식
                </Button>
            </div>
          </div>

        {/* 3. 검색 입력창 */}
          <div className="food-search-input-container" style={{ margin: '0 0 20px 0' }}>
            <Input
              placeholder="검색어를 입력해주세요...."
              prefix={<SearchOutlined />}
              className="food-search-input"
              size="large"
              style={{ padding: '10px 15px' }}
            />
          </div>

        {/* 4. 음식 목록 */}
          <div className="food-list-container" style={{ padding: '0' }}>
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

        {/* 5. 합계 및 저장/삭제 버튼 */}
        <div className="modal-footer-summary" style={{
            padding: '20px 24px',
            borderTop: '1px solid #eee',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
        }}>
          <div className="total-calorie-display">
            합계 : <span className="calorie-number">{totalCalorie}kcal</span>
          </div>

          {/* 삭제 버튼과 저장 버튼을 나란히 배치 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
                type="default"
                size="large"
                className="del-record-btn"
                style={{ width: '100px' }}
                danger
                // ⭐️ handleDelete 함수 연결
                onClick={handleDelete}
            >
              삭제
            </Button>
            <Button
                type="primary"
                size="large"
                className="save-record-btn"
                style={{ width: '100px' }}
            >
              저장
            </Button>
          </div>
        </div>

      </div> {/* End of modal-content-wrapper */}

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
      variant="borderless"
      classNames={{ popup: "date-picker-dropdown" }}
      inputReadOnly={true}
    />
  );
};

// =========================================================
//  3. 수분 섭취량 컴포넌트 (WaterIntakeControl)
// =========================================================
const WaterIntakeControl = ({ goal = 2.0 }) => {
  const [intake, setIntake] = useState(1.5);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);
  const [inputValue, setInputValue] = useState(1.5);

  const percent = Math.min((intake / goal) * 100, 100);

  const handleMenuClick = (e) => {
    const value = e.key;
    if (value === 'input') {
      setIsInputMode(true);
      setInputValue(intake);
      return;
    }
    setIntake(prev => prev + parseFloat(value));
    setIsInputMode(false);
  };

  const handleInputNumberChange = (value) => {
      if (value !== null && value !== undefined) {
          setInputValue(parseFloat(value));
      }
  }

  const handleConfirmInput = () => {
      if (inputValue !== null && inputValue !== undefined) {
          setIntake(inputValue);
      }
      setIsInputMode(false);
  }

  const menuItems = [
      { key: '0.2', label: '200ml' },
      { key: '0.5', label: '500ml' },
      { type: 'divider' },
      { key: 'input', label: '직접 입력' },
  ];

  return (
    <div className="water-control-group">
      <div className="water-button-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isInputMode ? (
            <>
                <InputNumber
                    min={0}
                    step={0.1}
                    value={inputValue}
                    addonAfter="L"
                    onChange={handleInputNumberChange}
                    onPressEnter={handleConfirmInput}
                    className="custom-water-input"
                    style={{ width: '120px' }}
                />
                <Button
                    type="primary"
                    onClick={handleConfirmInput}
                    style={{ height: '32px', borderRadius: '4px' }}
                >
                    확인
                </Button>
            </>
        ) : (
            <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={['click']}
                open={isOpen}
                onOpenChange={setIsOpen}
            >
              <Button className="water-dropdown-btn" style={{height: '32px'}}>
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
            {isNaN(intake) ? '0.0' : intake.toFixed(1)} / {goal.toFixed(1)}L
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