import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Tabs, Input, List, Checkbox, Button, message, Spin } from 'antd';
import { CalendarOutlined, PlusOutlined, SearchOutlined, CameraOutlined } from '@ant-design/icons';
import moment from 'moment';

const FOOD_SEARCH_API_URL = '/api/foods/search';

const RecordModal = ({ isVisible, onClose, selectedDate, onSave, mealRecords }) => {
  const [activeTab, setActiveTab] = useState('breakfast');
  const [uploadedImage, setUploadedImage] = useState(null);

  // 1. 선택된 음식 목록 (사용자가 기록에 추가한 항목)
  const [selectedFoodList, setSelectedFoodList] = useState([
    { id: 'custom-1', name: '돼지고기', calorie: 150, checked: true }, // id는 DB에서 온 FOOD_CODE 또는 임시 값
    { id: 'custom-2', name: '단호박', calorie: 90, checked: true },
  ]);

  // 2. 검색 관련 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedFoods, setSearchedFoods] = useState([]); // DB에서 검색된 음식 목록
  const [isLoading, setIsLoading] = useState(false);

  // 임시: 현재 표시할 음식 목록 (선택된 목록 + 검색된 목록 등을 결합할 때 사용)
  const displayFoodList = useMemo(() => {
    // 검색 결과가 있으면 검색 결과를 보여주고, 없으면 선택된 목록을 보여줌 (필요에 따라 로직 변경 가능)
    // 여기서는 검색 버튼을 눌렀을 때만 searchedFoods를 보여주고, 아닐 때는 selectedFoodList만 보여주는 것으로 가정합니다.
    return searchedFoods.length > 0 ? searchedFoods : selectedFoodList;
  }, [searchedFoods, selectedFoodList]);

  // 탭 변경 시 기존 기록 불러오기 (기존 로직 유지)
  useEffect(() => {
    if (isVisible && mealRecords && mealRecords[activeTab]) {
      setUploadedImage(mealRecords[activeTab].image || null);
    }
  }, [isVisible, activeTab, mealRecords]);

  // ------------------------- 검색 및 리스트 로직 -------------------------

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

/**
   * 백엔드 API를 호출하여 음식 정보를 검색하는 함수
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // 검색어가 없으면 검색 결과 초기화
      setSearchedFoods([]);
      message.info('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setSearchedFoods([]); // 검색 시작 시 이전 결과 초기화

    try {
      // [STEP 1: API 호출]
      // (이전에 프록시 설정을 하지 않았다면, 절대 경로로 변경해야 할 수 있습니다:
      //  const response = await fetch(`http://localhost:18090${FOOD_SEARCH_API_URL}?query=...`);)
      const response = await fetch(`${FOOD_SEARCH_API_URL}?query=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        // 서버에서 200이 아닌 상태 코드(예: 404, 500)를 반환했을 경우 에러 처리
        throw new Error('음식 검색에 실패했습니다. (HTTP 상태코드 불량)');
      }

      // [STEP 2: 응답 데이터 파싱]
      const data = await response.json();

      // [STEP 3: 상태 업데이트] DB 응답 형식에 맞춰 데이터 가공 및 저장
      const formattedFoods = data.map(food => ({
        // 💡 수정: DTO의 카멜 케이스 필드명 사용
        id: food.foodCode,    // FOOD_CODE -> foodCode로 수정
        name: food.foodName,  // FOOD_NAME -> foodName으로 수정
        calorie: food.foodKcal || 0, // FOOD_KCAL -> foodKcal로 수정
        checked: false, // 검색된 항목은 기본적으로 체크 해제 상태
      }));

      setSearchedFoods(formattedFoods);

      if (formattedFoods.length === 0) {
        message.warning(`"${searchQuery}"에 대한 검색 결과가 없습니다.`);
      }

    } catch (error) {
      console.error('검색 오류:', error);
      // 에러 메시지를 좀 더 명확하게 표시
      message.error(`음식 정보를 불러오는 중 오류가 발생했습니다: ${error.message}`);

    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 음식 목록에서 항목을 체크/체크 해제하는 함수 (검색 결과/선택 목록 모두 사용)
   * 검색된 음식 목록에서 항목을 선택하면 selectedFoodList에 추가하는 로직이 필요
   */
  const handleCheck = (foodId, foodName, foodCalorie, isChecked) => {
    if (searchedFoods.length > 0) {
      // 검색 결과 리스트에서 체크하는 경우
      setSearchedFoods(prev =>
        prev.map(food =>
          food.id === foodId ? { ...food, checked: !food.checked } : food
        )
      );

      // 선택된 음식 목록에도 추가/제거
      if (isChecked) {
        // 체크 해제 -> selectedFoodList에서 제거
        setSelectedFoodList(prev => prev.filter(f => f.id !== foodId));
      } else {
        // 체크 -> selectedFoodList에 추가 (이미 있으면 추가 안 함)
        setSelectedFoodList(prev => {
            if (!prev.find(f => f.id === foodId)) {
                return [...prev, { id: foodId, name: foodName, calorie: foodCalorie, checked: true }];
            }
            return prev;
        });
      }
    } else {
      // 기본 selectedFoodList에서 체크를 변경하는 경우
      setSelectedFoodList(prev =>
        prev.map((food) =>
          food.id === foodId ? { ...food, checked: !food.checked } : food
        )
      );
    }
  };


  // ------------------------- 기타 로직 -------------------------

  const handleTabChange = (key) => setActiveTab(key);

  const handleDelete = () => {
    setSelectedFoodList((prev) => prev.filter((food) => !food.checked));
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

  // 총 칼로리는 최종 저장될 selectedFoodList를 기준으로 계산
  const totalCalorie = useMemo(
    () =>
      selectedFoodList
        .filter((f) => f.checked)
        .reduce((sum, f) => sum + f.calorie, 0),
    [selectedFoodList]
  );

  const handleSave = () => {
    const checkedFoodItems = selectedFoodList
      .filter((f) => f.checked)
      .map((f) => f.name);
    const recordData = {
      image: uploadedImage,
      calorie: totalCalorie,
      items: checkedFoodItems,
    };
    if (onSave) onSave(activeTab, recordData);
    onClose(); // 저장 후 모달 닫기
  };

  // 날짜 문자열 계산 로직
  const formattedDate = useMemo(() => {
    return selectedDate && moment.isMoment(selectedDate)
        ? selectedDate.format('MM월 DD일')
        : moment().format('MM월 DD일');
  }, [selectedDate]);


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
        {/* ... 이미지 업로드 관련 JSX는 그대로 유지 ... */}
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


       {/* 3. 검색창과 버튼 - **검색 로직 연결** */}
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
              onChange={handleSearchChange} // 검색어 상태 업데이트
              onPressEnter={handleSearch}   // 엔터 키로 검색
            />
          </div>

          <div>
            <Button
              type="primary"
              size="large"
              style={{ height: '40px' }}
              onClick={handleSearch} // 클릭 시 검색 실행
              loading={isLoading}    // 로딩 상태 표시
            >
              검색
            </Button>
          </div>
        </div>

        {/* 4. 음식 목록 - **검색 결과 표시** */}
        <div className="food-list-container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><Spin tip="음식 검색 중..." /></div>
          ) : (
            <List
              dataSource={displayFoodList} // searchedFoods를 표시하거나, selectedFoodList를 표시
              bordered
              style={{ maxHeight: '200px', overflowY: 'auto' }}
              renderItem={(item) => {
                // 현재 항목이 selectedFoodList에 있는지 확인하여 체크 상태 결정
                const isSelected = !!selectedFoodList.find(f => f.id === item.id && f.checked);

                return (
                  <List.Item className="food-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px' }}>
                    <span className="food-name" style={{ flexGrow: 1 }}>{item.name}</span>
                    <span className="food-calorie" style={{ marginRight: '15px', color: '#555' }}>{item.calorie}kcal</span>
                    <Checkbox
                      checked={isSelected} // selectedFoodList 상태를 기준으로 체크 상태 표시
                      onChange={(e) => handleCheck(item.id, item.name, item.calorie, isSelected)}
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