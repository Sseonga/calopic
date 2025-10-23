// RecordModal.js

import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Tabs, Input, List, Checkbox, Button, message, Spin } from 'antd';
import { CalendarOutlined, PlusOutlined, SearchOutlined, CameraOutlined } from '@ant-design/icons';
import moment from 'moment';

const FOOD_SEARCH_API_URL = '/api/foods/search';

// 🚨 [변경] initialActiveTab prop을 추가하고 기본값을 'breakfast'로 설정합니다.
const RecordModal = ({ isVisible, onClose, selectedDate, dateKeyString, onSave, mealRecords, initialActiveTab = 'breakfast' }) => {

  // 🚨 [변경] activeTab 상태를 initialActiveTab prop과 동기화하기 위해 useState의 초기값을 initialActiveTab으로 설정합니다.
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [uploadedImage, setUploadedImage] = useState(null);

  // 1. 선택된 음식 목록
  const [selectedFoodList, setSelectedFoodList] = useState([]);

  // 2. 검색 관련 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedFoods, setSearchedFoods] = useState([]); // DB에서 검색된 음식 목록
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

// 🚨 [추가] initialActiveTab prop이 변경될 때마다 activeTab 상태를 동기화하여 탭을 전환합니다. (카드 클릭 시)
useEffect(() => {
    if (initialActiveTab) {
        setActiveTab(initialActiveTab);
    }
}, [initialActiveTab]);


useEffect(() => {
    // mealRecords는 PageDiary에서 계산된 '현재 날짜'의 기록입니다.
    if (isVisible && mealRecords && mealRecords[activeTab]) {
      const currentItems = mealRecords[activeTab].items || [];
      const currentImage = mealRecords[activeTab].image || null;

      const initialSelected = currentItems.map(item => ({
        foodCode: item.foodCode,
        foodName: item.foodName,
        foodKcal: item.foodKcal,
        id: item.foodCode,
        name: item.foodName,
        calorie: item.foodKcal,
      }));

      setSelectedFoodList(initialSelected);
      setUploadedImage(currentImage);
    } else if (isVisible) {
       setSelectedFoodList([]);
       setUploadedImage(null);
    }

    // 탭이 바뀔 때마다 검색 상태는 초기화
    setSearchQuery('');
    setSearchedFoods([]);
    setIsSearching(false);

    // 🚨 [변경] 의존성 배열에 initialActiveTab을 추가합니다.
  }, [isVisible, activeTab, mealRecords, dateKeyString, initialActiveTab])


  // 임시: 현재 표시할 음식 목록 (검색 중이면 검색 결과를, 아니면 선택된 목록을 표시)
  const displayFoodList = useMemo(() => {
    if (isSearching) {
      // 검색 중이면, searchedFoods에 selectedFoodList의 체크 상태를 병합하여 보여줍니다.
      return searchedFoods.map(searchItem => {
          // foodCode가 일치하는 항목이 selectedFoodList에 있는지 확인하여 체크 상태 결정
          const isChecked = selectedFoodList.some(selectedItem => selectedItem.foodCode === searchItem.id);
          return { ...searchItem, checked: isChecked };
      });
    }
    // 검색 중이 아니면, 현재 선택된 음식 목록만 보여줍니다.
    // 검색 모드가 아닐 때는 selectedFoodList의 모든 항목을 체크된 상태로 보여줍니다.
    return selectedFoodList.map(item => ({...item, checked: true, id: item.foodCode, name: item.foodName, calorie: item.foodKcal}));
  }, [isSearching, searchedFoods, selectedFoodList]);


  // ------------------------- 검색 및 리스트 로직 -------------------------

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * 백엔드 API를 호출하여 음식 정보를 검색하는 함수
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchedFoods([]);
      setIsSearching(false);
      message.info('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setSearchedFoods([]);
    setIsSearching(true);

    try {
      const response = await fetch(`${FOOD_SEARCH_API_URL}?query=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        throw new Error('음식 검색에 실패했습니다. (HTTP 상태코드 불량)');
      }

      const data = await response.json();

      // DB 응답 형식에 맞춰 데이터 가공 및 저장
      const formattedFoods = data.map(food => ({
        // DTO 필드명 저장
        foodCode: food.foodCode,
        foodName: food.foodName,
        foodKcal: food.foodKcal || 0,
        // UI 표시용 필드 저장
        id: food.foodCode,
        name: food.foodName,
        calorie: food.foodKcal || 0,
      }));

      setSearchedFoods(formattedFoods);

      if (formattedFoods.length === 0) {
        message.warning(`"${searchQuery}"에 대한 검색 결과가 없습니다.`);
      }

    } catch (error) {
      console.error('검색 오류:', error);
      message.error(`음식 정보를 불러오는 중 오류가 발생했습니다: ${error.message}`);
      setSearchedFoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 음식 목록에서 항목을 체크/체크 해제하는 함수
   */
  const handleCheck = (foodItem, isSelected) => {
    const { id, name, calorie, foodCode, foodName, foodKcal } = foodItem;
    // DTO 구조로 저장
    const foodDtoLikeItem = { foodCode: foodCode || id, foodName: foodName || name, foodKcal: foodKcal || calorie };

    if (isSelected) {
      // 체크 해제: selectedFoodList에서 foodCode가 일치하는 항목 제거
      setSelectedFoodList(prev => prev.filter(f => f.foodCode !== (foodCode || id)));

      // 검색 결과 리스트가 표시 중이라면, 해당 항목의 checked 상태도 업데이트
      if (isSearching) {
         setSearchedFoods(prev =>
            prev.map(food =>
              food.id === (foodCode || id) ? { ...food, checked: false } : food
            )
          );
      }

    } else {
      // 체크: selectedFoodList에 추가 (FoodDto 구조로 저장)
      setSelectedFoodList(prev => {
        // 이미 있으면 추가 안 함
        if (!prev.find(f => f.foodCode === (foodCode || id))) {
            return [...prev, foodDtoLikeItem];
        }
        return prev;
      });

      // 검색 결과 리스트가 표시 중이라면, 해당 항목의 checked 상태도 업데이트
      if (isSearching) {
        setSearchedFoods(prev =>
           prev.map(food =>
             food.id === (foodCode || id) ? { ...food, checked: true } : food
           )
         );
     }
    }
  };


  // ------------------------- 기타 로직 -------------------------

  // 🚨 [수정] 탭 변경 핸들러
  const handleTabChange = (key) => {
    setActiveTab(key);
  }

  const handleDelete = () => {
    // 현재 UI에 표시된 리스트에서 체크된 항목의 foodCode를 수집
    const itemsToDelete = displayFoodList.filter(item => item.checked).map(item => item.foodCode || item.id);

    // selectedFoodList에서 해당 항목들을 제거
    setSelectedFoodList(prev => prev.filter(f => !itemsToDelete.includes(f.foodCode)));

    // 검색 결과 리스트의 체크 상태 업데이트 (즉시 반영을 위해)
    if (isSearching) {
        // NOTE: 이 로직은 selectedFoodList의 이전 상태에 의존할 수 있으므로,
        // 실제로는 삭제 후 남은 항목을 기준으로 체크 상태를 다시 계산하는 것이 더 안전합니다.
        // 여기서는 임시로 간단한 업데이트를 유지합니다.
        setSearchedFoods(prev =>
            prev.map(food => ({
                ...food,
                checked: selectedFoodList.filter(f => !itemsToDelete.includes(f.foodCode)).some(f => f.foodCode === food.id)
            }))
        );
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  // 총 칼로리 계산
  const totalCalorie = useMemo(
    () =>
      selectedFoodList
        .reduce((sum, f) => sum + f.foodKcal, 0), // foodKcal 필드 사용
    [selectedFoodList]
  );

  const handleSave = () => {
    const foodDtoItems = selectedFoodList;

    const recordData = {
      image: uploadedImage,
      calorie: totalCalorie,
      items: foodDtoItems, // FoodDto 객체 배열 전달
    };
    if (onSave) onSave(activeTab, recordData);
    onClose(); // 저장 후 모달 닫기
  };

  // 날짜 문자열 계산 로직
const formattedDate = useMemo(() => {
        // dateKeyString (YYYY-MM-DD)을 사용하여 Moment 객체를 생성하고 포맷
        if (dateKeyString) {
            return moment(dateKeyString, 'YYYY-MM-DD').format('MM월 DD일');
        }
        // 안전을 위한 기존 로직 유지
        return selectedDate && moment.isMoment(selectedDate)
            ? selectedDate.format('MM월 DD일')
            : moment().format('MM월 DD일');
    }, [dateKeyString, selectedDate]);

  const tabItems = [
    { key: 'breakfast', label: '아침' },
    { key: 'lunch', label: '점심' },
    { key: 'dinner', label: '저녁' },
  ];

  return (
    <Modal
      title="기록 추가"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className="record-modal-custom"
      width={650}
      centered
      destroyOnHidden={true}
      styles={{ body: { padding: '0' } }}
    >
      <div className="modal-header-content" style={{ padding: '10px 24px 0' }}>
        <span className="modal-date-display" style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {formattedDate}
          <CalendarOutlined style={{ marginLeft: '8px' }} />
        </span>
      </div>

      <div className="modal-content-wrapper" style={{ padding: '0 24px' }}>
        {/* 1. 식사 탭 */}
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className="meal-tabs-custom"
          type="card"
          style={{ marginTop: '20px', marginBottom: '20px' }}
        />

        {/* 2. 이미지 업로드 (생략) */}
        <div
          className="image-upload-area"
          style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '15px',
            alignItems: 'flex-start',
            padding: '0',
          }}
        >
          <div
            className="image-box"
            style={{
              width: '416px',
              height: '416px',
              flexShrink: 0,
              border: '1px solid #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f7f7f7',
            }}
          >
            <div
              className="uploaded-image-placeholder"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="업로드된 식단 이미지"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  className="image-placeholder-text"
                  style={{ color: '#aaa', fontSize: '12px', textAlign: 'center' }}
                >
                  식단 이미지<br />추가
                </div>
              )}
            </div>
          </div>

          <div
            className="upload-buttons"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flexGrow: 1,
              paddingTop: '5px',
            }}
          >
            <label
              htmlFor="photo-upload-input"
              className="ant-btn upload-btn photo-btn"
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '40px',
                cursor: 'pointer',
              }}
            >
              <PlusOutlined /> 사진 추가
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
                  border: '0',
                }}
              />
            </label>
            <Button icon={<CameraOutlined />} className="upload-btn ai-btn" style={{ height: '40px' }}>
              AI 식단 인식
            </Button>
          </div>
        </div>


       {/* 3. 검색창과 버튼 */}
        <div
          className="food-search-control-container"
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            alignItems: 'center'
          }}
        >
          <div className="food-search-input-container" style={{ flexGrow: 1 }}>
            <Input
              placeholder="검색어를 입력해주세요...."
              prefix={<SearchOutlined />}
              className="food-search-input"
              size="large"
              style={{ width: '100%' }}
              value={searchQuery}
              onChange={handleSearchChange}
              onPressEnter={handleSearch}
            />
          </div>

          <div>
            <Button
              type="primary"
              size="large"
              style={{ height: '40px' }}
              onClick={handleSearch}
              loading={isLoading}
            >
              검색
            </Button>
          </div>
        </div>

        {/* 4. 음식 목록 - 검색 결과 표시 */}
        <div className="food-list-container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><Spin tip="음식 검색 중..." /></div>
          ) : (
            <List
              dataSource={displayFoodList}
              bordered
              style={{ maxHeight: '200px', overflowY: 'auto' }}
              renderItem={(item) => {
                // isSelected는 displayFoodList의 checked 상태를 사용
                const isSelected = item.checked;

                return (
                  <List.Item className="food-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px' }}>
                    <span className="food-name" style={{ flexGrow: 1 }}>{item.name}</span>
                    <span className="food-calorie" style={{ marginRight: '15px', color: '#555' }}>{item.calorie}kcal</span>
                    <Checkbox
                      // foodItem 전체 객체와 현재 체크 상태를 전달
                      checked={isSelected}
                      onChange={() => handleCheck(item, isSelected)}
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </div>

        {/* 5. 합계 및 버튼 */}
        <div
          className="modal-footer-summary"
          style={{
            padding: '20px 24px',
            borderTop: '1px solid #eee',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div className="total-calorie-display" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            합계 : <span className="calorie-number" style={{ color: '#faad14' }}>{totalCalorie}kcal</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="default" size="large" danger onClick={handleDelete}>
              선택 삭제
            </Button>
            <Button type="primary" size="large" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecordModal;