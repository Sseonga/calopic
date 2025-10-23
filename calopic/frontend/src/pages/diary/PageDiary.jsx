// PageDiary.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Progress, DatePicker, Dropdown, Button, InputNumber } from 'antd';
import { CalendarOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import './DiaryPage.css';
import RecordModal from './RecordModal';

// =========================================================
// 🚨 [수정] INITIAL_DAILY_RECORD로 변경하고 waterIntake 추가
// =========================================================
const INITIAL_MEAL_RECORDS = {
    breakfast: { items: [], calorie: 0, image: null },
    lunch: { items: [], calorie: 0, image: null },
    dinner: { items: [], calorie: 0, image: null },
};

const INITIAL_DAILY_RECORD = {
    ...INITIAL_MEAL_RECORDS,
    waterIntake: 0.0, // 👈 수분 섭취량 초기값 (날짜별 관리를 위함)
};

// =========================================================
//  A. 캘린더 기능을 담당하는 컴포넌트 (DateSelect) 🚨 [최종 수정] picker="date" 추가
// =========================================================
const DateSelect = ({ value, onChange, allRecords }) => {
    const displayFormat = 'MM월 DD일';

    const dateRender = (current) => {
        const dateKey = current.format('YYYY-MM-DD');
        const dayRecords = allRecords[dateKey];

        const hasRecord = dayRecords && (
            dayRecords.breakfast?.calorie > 0 ||
            dayRecords.lunch?.calorie > 0 ||
            dayRecords.dinner?.calorie > 0
        );

        return (
            <div className="ant-picker-cell-inner">
                {current.date()}
                {hasRecord && <div className="diary-record-dot" />}
            </div>
        );
    };

    return (
        <DatePicker
            value={value}
            onChange={onChange}
            format={displayFormat}
            suffixIcon={<CalendarOutlined style={{ color: '#333' }} />}
            variant="borderless"
            classNames={{ popup: 'date-picker-dropdown' }}
            inputReadOnly={true}
            // 🚨 [핵심 수정] picker="date"를 명시하여 날짜 선택 모드를 강제합니다.
            picker="date"
            dateRender={dateRender}
        />
    );
};

// =========================================================
//  B. 수분 섭취량 컴포넌트 (WaterIntakeControl) - Props 기반
// =========================================================
const WaterIntakeControl = ({ goal = 2.0, intake, onIntakeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);
  const [inputValue, setInputValue] = useState(intake);

  useEffect(() => {
      setInputValue(intake);
  }, [intake]);

  const percent = Math.min((intake / goal) * 100, 100);

  const handleMenuClick = (e) => {
    const value = e.key;
    if (value === 'input') {
      setIsInputMode(true);
      setInputValue(intake);
      return;
    }
    onIntakeChange(intake + parseFloat(value));
    setIsInputMode(false);
  };

  const handleInputNumberChange = (value) => {
    if (value !== null && value !== undefined) {
      setInputValue(parseFloat(value));
    }
  };

  const handleConfirmInput = () => {
    if (inputValue !== null && inputValue !== undefined) {
      onIntakeChange(inputValue);
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
    const [selectedDate, setSelectedDate] = useState(moment('2025-10-23'));
    const [selectedMealType, setSelectedMealType] = useState('breakfast');

    // 🚨 1-1. 전체 기록 상태: 로컬 스토리지에서 전체 기록을 불러와 초기 상태 설정
    const [allDailyRecords, setAllDailyRecords] = useState(() => {
        const savedRecords = localStorage.getItem('dailyMealRecords');
        const initialData = savedRecords ? JSON.parse(savedRecords) : {};
        if (Object.keys(initialData).length === 0) {
            // 예시로 22일 기록을 추가 (2025-10-22)
            initialData['2025-10-22'] = {
                ...INITIAL_DAILY_RECORD, // 👈 waterIntake 포함
                breakfast: { items: [{foodCode: 'E001', foodName: '삶은 계란', foodKcal: 80}], calorie: 80, image: null },
                lunch: { items: [{foodCode: 'C001', foodName: '닭가슴살 샐러드', foodKcal: 350}], calorie: 350, image: null },
            };
        }
        return initialData;
    });

    // 1-2. 로컬 저장소 동기화 (allDailyRecords가 변경될 때마다)
    useEffect(() => {
        localStorage.setItem('dailyMealRecords', JSON.stringify(allDailyRecords));
    }, [allDailyRecords]);

    // 🚨 1-3. 현재 선택된 날짜의 기록 계산 (currentDayRecord, mealRecords, waterIntake)
    const dateKey = selectedDate.format('YYYY-MM-DD'); // YYYY-MM-DD 형식의 문자열 키

    const currentDayRecord = useMemo(() => {
        // 기존 기록에 waterIntake 등의 필드가 없을 경우 INITIAL_DAILY_RECORD로 보완
        return allDailyRecords[dateKey] ? { ...INITIAL_DAILY_RECORD, ...allDailyRecords[dateKey] } : INITIAL_DAILY_RECORD;
    }, [allDailyRecords, dateKey]);

    // 식단 기록만 추출
    const mealRecords = useMemo(() => ({
        breakfast: currentDayRecord.breakfast,
        lunch: currentDayRecord.lunch,
        dinner: currentDayRecord.dinner,
    }), [currentDayRecord]);

    // 수분 섭취량 추출
    const waterIntake = currentDayRecord.waterIntake;


    // 2. 핸들러 함수
    const handleCloseModal = () => setIsModalVisible(false);
    const handleOpenModalForAdd = () => {
        setSelectedMealType('breakfast');
        setIsModalVisible(true);
    };
    const handleCardClickForEdit = (mealType) => {
        setSelectedMealType(mealType);
        setIsModalVisible(true);
    };

    // 2-1. 날짜 변경 핸들러
    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    // 2-2. 식단 기록 저장 핸들러
    const handleSaveRecord = (mealType, recordData) => {
        setAllDailyRecords((prevAllRecords) => {
            const currentDayRecords = prevAllRecords[dateKey] || INITIAL_DAILY_RECORD;

            const newDayRecords = {
                ...currentDayRecords,
                [mealType]: {
                    items: recordData.items || [],
                    calorie: recordData.calorie,
                    image: recordData.image,
                },
            };

            return {
                ...prevAllRecords,
                [dateKey]: newDayRecords,
            };
        });
        handleCloseModal();
    };

    // 🚨 2-3. 수분 섭취량 변경 핸들러
    const handleWaterIntakeChange = (newIntake) => {
        setAllDailyRecords((prevAllRecords) => {
            const currentDayRecords = prevAllRecords[dateKey] || INITIAL_DAILY_RECORD;

            // 0.0 미만으로 내려가지 않도록 처리
            const finalIntake = Math.max(0.0, newIntake);

            const newDayRecords = {
                ...currentDayRecords,
                waterIntake: finalIntake,
            };

            return {
                ...prevAllRecords,
                [dateKey]: newDayRecords,
            };
        });
    };


    // 3. 일일 총 칼로리 합산 계산 (useMemo 사용)
    const totalDailyCalorie = useMemo(() => {
        return Object.values(mealRecords).reduce(
            (sum, record) => sum + record.calorie,
            0
        );
    }, [mealRecords]);

    // 4. 정적 데이터
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
                            <DateSelect
                                value={selectedDate}
                                onChange={handleDateChange}
                                allRecords={allDailyRecords}
                            />
                        </div>
                        <button className="add-record-btn" onClick={handleOpenModalForAdd}>
                            <PlusOutlined style={{ marginRight: '5px' }} /> 기록추가
                        </button>
                    </div>
                </Col>

                {/* -------------------- Col 2: 식단 기록 리스트 영역 (span=14) -------------------- */}
                <Col className="col-record-list" span={14}>
                    <div className="record-list">
                        {Object.entries(mealRecords).map(([mealType, record]) => (
                            <div
                                key={mealType}
                                className="record-card"
                                onClick={() => handleCardClickForEdit(mealType)}
                                style={{ cursor: 'pointer' }}
                            >
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
                                            <li key={item.foodCode || index}>
                                                {item.foodName} ({item.foodKcal}kcal)
                                            </li>
                                        ))}
                                        {record.items.length === 0 && <li className="no-record-text">기록된 음식이 없습니다.</li>}
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
                                <span className="big-number">{totalDailyCalorie.toLocaleString()}</span>
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
                            <WaterIntakeControl
                                intake={waterIntake}
                                onIntakeChange={handleWaterIntakeChange}
                            />
                        </div>
                    </div>
                </Col>
            </Row>

            {/* RecordModal */}
            <RecordModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                selectedDate={selectedDate}
                dateKeyString={dateKey}
                onSave={handleSaveRecord}
                mealRecords={mealRecords}
                initialActiveTab={selectedMealType}
            />
        </div>
    );
}