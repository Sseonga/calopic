import React, { useState } from 'react';
import { Row, Col, DatePicker, Progress, Dropdown, Menu, Button, InputNumber } from 'antd'
import { CalendarOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import './DiaryPage.css';

// 캘린더 기능을 담당하는 컴포넌트
const DateSelect = () => {
  // 오늘 날짜를 기본값으로 설정
  const [selectedDate, setSelectedDate] = useState(moment());

  const displayFormat = '오늘 : MM월 DD일';

  return (
    <DatePicker
      // 선택된 날짜
      value={selectedDate}
      // 날짜 변경 핸들러
      onChange={setSelectedDate}
      // 표시될 날짜 포맷
      format={displayFormat}

      // 캘린더 아이콘 표시
      suffixIcon={<CalendarOutlined style={{ color: '#333' }} />}

      // 입력창 주변의 테두리 제거
      bordered={false}

      // DatePicker 팝업의 위치 조정을 위한 클래스
      dropdownClassName="date-picker-dropdown"

      // DatePicker의 기본 텍스트 필드를 읽기 전용으로 유지하여 편집 방지
      inputReadOnly={true}
    />
  );
};

// 수분 섭취량 컴포넌트 구현
const WaterIntakeControl = ({ goal = 2.0 }) => {
  // 현재 수분 섭취량 상태 (기본값: 1.5L)
  const [intake, setIntake] = useState(1.5);
  // 드롭다운 메뉴 상태
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  // 직접 입력 모드 상태
  const [isInputMode, setIsInputMode] = useState(false);
  // 퍼센트 계산
  const percent = Math.min((intake / goal) * 100, 100);

  const handleMenuClick = (e) => {
    const value = e.key;

    if (value === 'input') {
      setIsInputMode(true);
      return;
    }

    // 선택된 값을 현재 섭취량에 더합니다.
    setIntake(prev => prev + parseFloat(value));
    setIsInputMode(false);
  };

  const handleInputChange = (value) => {
      // 직접 입력 모드에서 엔터를 누르거나 입력이 완료되면 처리
      if (value !== null && value !== undefined) { // null 또는 undefined 체크 추가
          setIntake(parseFloat(value));
          setIsInputMode(false);
      }
  }

  const menu = (
    <Menu onClick={handleMenuClick} className="water-intake-menu">
      <Menu.Item key="0.2">200ml</Menu.Item>
      <Menu.Item key="0.5">500ml</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="input">직접 입력</Menu.Item>
    </Menu>
  );

  return (
    <div className="water-control-group">
      <div className="water-button-row">
        {isInputMode ? (
            //  직접 입력 모드 InputNumber
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
            //  드롭다운 버튼
            <Dropdown overlay={menu} trigger={['click']} visible={isDropdownVisible} onVisibleChange={setIsDropdownVisible}>
              <Button className="water-dropdown-btn">
                수분 섭취 <DownOutlined />
              </Button>
            </Dropdown>
        )}
      </div>

      <div className="water-gauge">
        {/*  물방울 아이콘 (CSS로 모양 구현) */}
        <div className="water-drop-icon">
             {/* 물 게이지를 채우는 부분 */}
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
//  메인 컴포넌트
// =========================================================
export default function PageDiary() {
  const macroData = [
    { name: '탄수화물', percent: 45, color: '#D1C4E9' },
    { name: '단백질', percent: 35, color: '#B3E5BC' },
    { name: '지방', percent: 20, color: '#FFCDD2' },
  ];

  return (
    // 페이지 전체 컨테이너
    <div className="diary-page-container">

      {/* 3단 레이아웃: span 3, 14, 7 유지 */}
      <Row gutter={[90, 0]} className="diary-main-content">

        {/* -------------------- Col 1: 날짜/기록 버튼 영역 -------------------- */}
        <Col className="col-controls" span={3}>
            <div className="top-control-row">
                <div className="date-info">
                    <DateSelect />
                </div>
                <button className="add-record-btn">
                    <PlusOutlined style={{ marginRight: '5px' }} /> 기록추가
                </button>
            </div>
        </Col>

        {/* -------------------- Col 2 식단 기록 리스트 영역 -------------------- */}
        <Col className="col-record-list" span={14}>
            <div className="record-list">
              {/* 아침 식단 기록 카드 */}
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

              {/* 점심 식단 기록 카드 */}
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

              {/* 저녁 식단 기록 카드 */}
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

                   {/* ⭐️ 탄단지 비율 영역 */}
                   <div className="section-macro-ratio">
                     <h4 className="section-title">탄단지 비율</h4>
                     <div className="macro-bars">
                        {macroData.map(macro => (
                            <div key={macro.name} className="macro-item">
                                <span className="macro-name">{macro.name}</span>
                                {/* AntD Progress 컴포넌트로 비율 막대 구현 */}
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

                   {/* ⭐️ 수분 섭취량 영역 */}
                   <div className="section-water-intake">
                     <h4 className="section-title">수분 섭취량</h4>
                     {/* ⭐️ WaterIntakeControl 컴포넌트 사용 */}
                     <WaterIntakeControl />
                   </div>
                 </div>

        </Col>
      </Row>
    </div>
  );
}