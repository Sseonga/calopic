import React, { useState } from 'react';
import { Row, Col, Progress, DatePicker, Dropdown, Button, InputNumber } from 'antd';
import { CalendarOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import './DiaryPage.css';

// 수정된 RecordModal import
import RecordModal from './RecordModal';

// =========================================================
//  A. 캘린더 기능을 담당하는 컴포넌트 (DateSelect)
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
      classNames={{ popup: 'date-picker-dropdown' }}
      inputReadOnly={true}
    />
  );
};

// =========================================================
//  B. 수분 섭취량 컴포넌트 (WaterIntakeControl)
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
    setIntake((prev) => prev + parseFloat(value));
    setIsInputMode(false);
  };

  const handleInputNumberChange = (value) => {
    if (value !== null && value !== undefined) {
      setInputValue(parseFloat(value));
    }
  };

  const handleConfirmInput = () => {
    if (inputValue !== null && inputValue !== undefined) {
      setIntake(inputValue);
    }
    setIsInputMode(false);
  };

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
            <Button type="primary" onClick={handleConfirmInput} style={{ height: '32px', borderRadius: '4px' }}>
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
            <Button className="water-dropdown-btn" style={{ height: '32px' }}>
              수분 섭취 <DownOutlined />
            </Button>
          </Dropdown>
        )}
      </div>

      <div className="water-gauge">
        <div className="water-drop-icon">
          <div className="water-fill" style={{ height: `${percent}%` }}></div>
        </div>
        <div className="water-text-display">{isNaN(intake) ? '0.0' : intake.toFixed(1)} / {goal.toFixed(1)}L</div>
      </div>
    </div>
  );
};

// =========================================================
//  C. 메인 컴포넌트 (PageDiary)
// =========================================================
export default function PageDiary() {
  // 1. 상태 관리
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

  const [mealRecords, setMealRecords] = useState({
    breakfast: {
      items: ['계란', '고구마'],
      calorie: 500,
      image: null,
    },
    lunch: {
      items: ['양상추, 고구마', '계란, 파프리카', '견과류'],
      calorie: 374,
      image: null,
    },
    dinner: {
      items: ['단호박, 돼지고기', '방울토마토'],
      calorie: 310,
      image: null,
    },
  });

  // 2. 핸들러 함수
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleSaveRecord = (mealType, recordData) => {
    setMealRecords((prevRecords) => ({
      ...prevRecords,
      [mealType]: {
        items: recordData.items || prevRecords[mealType].items,
        calorie: recordData.calorie,
        image: recordData.image,
      },
    }));
    handleCloseModal();
  };

  // 3. 정적 데이터
  const macroData = [
    { name: '탄수화물', percent: 45, color: '#D1C4E9' },
    { name: '단백질', percent: 35, color: '#B3E5BC' },
    { name: '지방', percent: 20, color: '#FFCDD2' },
  ];

  return (
    <div className="diary-page-container">
      <Row gutter={[80, 0]} className="diary-main-content">
        {/* -------------------- Col 1: 날짜/기록 버튼 영역 (span=3) -------------------- */}
        <Col className="col-controls" span={3}>
          <div className="top-control-row">
            <div className="date-info">
              <DateSelect value={selectedDate} onChange={setSelectedDate} />
            </div>
            <button className="add-record-btn" onClick={handleOpenModal}>
              <PlusOutlined style={{ marginRight: '5px' }} /> 기록추가
            </button>
          </div>
        </Col>

        {/* -------------------- Col 2: 식단 기록 리스트 영역 (span=14) -------------------- */}
        <Col className="col-record-list" span={14}>
          <div className="record-list">
            {Object.entries(mealRecords).map(([mealType, record]) => (
              <div key={mealType} className="record-card">
                <div className="card-image-box">
                  <img
                    src={record.image || `/path/to/default_${mealType}_image.jpg`}
                    alt={`${mealType} 식단 이미지`}
                  />
                </div>
                <div className="card-details">
                  <h4 className="meal-time">
                    {mealType === 'breakfast' ? '아침' : mealType === 'lunch' ? '점심' : '저녁'}
                  </h4>
                  <ul className="food-list">
                    {record.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-summary">
                  <p className="total-text">
                    합계 <span className="check-icon">☑️</span>
                  </p>
                  <p className="total-calorie">{record.calorie}kcal</p>
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* -------------------- Col 3: 요약 정보 영역 (span=7) -------------------- */}
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
                {macroData.map((macro) => (
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

      {/* 수정된 RecordModal */}
      <RecordModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        onSave={handleSaveRecord}
        mealRecords={mealRecords}
      />
    </div>
  );
}
