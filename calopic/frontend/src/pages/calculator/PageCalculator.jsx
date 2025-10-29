import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './PageCalculator.css';
import { calculateMifflinStJeorBMR } from '../../utils/bmrCalculator';


// ⭐️ 페이지네이션 컴포넌트 (그룹 이동 및 처음/끝 이동 기능 추가)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지가 1개 이하면 페이지네이션 숨김
  if (totalPages <= 1) return null;

  const PAGES_PER_GROUP = 10; // 한 번에 보여줄 페이지 번호 개수
  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP); // 현재 페이지가 속한 그룹 번호

  // 현재 그룹의 시작 페이지와 끝 페이지 계산
  let startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  let endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 이전 그룹의 마지막 페이지 ( < 버튼용)
  const prevGroupPage = Math.max(1, startPage - 1);
  // 다음 그룹의 첫 페이지 ( > 버튼용)
  const nextGroupPage = Math.min(totalPages, endPage + 1);

  return (
      <nav className="pagination-container">
        {/* 맨 처음(<<) 버튼 */}
        <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="pagination-button pagination-arrow" // 화살표 스타일 추가
        >
          &lt;&lt;
        </button>
        {/* 이전 그룹(<) 버튼 */}
        <button
            onClick={() => onPageChange(prevGroupPage)}
            disabled={currentGroup === 1}
            className="pagination-button pagination-arrow"
        >
          &lt;
        </button>

        {/* 계산된 페이지 번호 버튼들 */}
        {pageNumbers.map(number => (
            <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
        ))}

        {/* 다음 그룹(>) 버튼 */}
        <button
            onClick={() => onPageChange(nextGroupPage)}
            disabled={endPage === totalPages}
            className="pagination-button pagination-arrow"
        >
          &gt;
        </button>
        {/* 맨 끝(>>) 버튼 */}
        <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-button pagination-arrow"
        >
          &gt;&gt;
        </button>
      </nav>
  );
};


const PageCalculator = () => {
  //  백엔드에서 받아올 전체 음식 목록을 저장할 state
  const [allFoodData, setAllFoodData] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [foodListPage, setFoodListPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  //  Add state to remember the search query
  const [searchQuery, setSearchQuery] = useState('');

  //   무한 스크롤 관련 설정
  const selectedListRef = useRef(null); // 스크롤 감지할 div를 가리킬 변수
  const [displayedSelectedFoods, setDisplayedSelectedFoods] = useState([]); // 화면에 보여줄 선택 목록
  const ITEMS_PER_LOAD = 7; // 한 번에 로드할 항목 개수

  //  사용자 신체 정보를 저장할 state 추가
  const [userInfo, setUserInfo] = useState(null);

  //  계산된 BMR 값을 저장할 state 추가
  const [bmrValue, setBmrValue] = useState(0); // 초기값 설정

  //  현재 선택된 활동량 수준(level)을 기억할 state 추가
  const [activityLevel, setActivityLevel] = useState(1.55);

  // ️ 활동량 수준에 따른 이름과 값 매핑
  const activityLevels = {
    low: { name: '활동량 적음', value: 1.35 },
    normal: { name: '활동량 보통', value: 1.55 },
    high: { name: '활동량 많음', value: 1.8 },
  };

    //  백엔드에서 데이터를 가져오는 부분
    useEffect(() => {
        const apiUrl = 'http://localhost:18090/api/calculator/foods';

        axios.get(apiUrl)
            .then(response => {
                // 백엔드 VO (foodId, foodName, foodKcal) -> 프론트 테이블 (key, name, calories) 형태로 변환
                const formattedData = response.data.map(food => ({
                    key: food.foodId.toString(), // key는 문자열
                    name: food.foodName,
                    calories: food.foodKcal,
                    carbs: food.foodCarbo,
                    protein: food.foodProtein,
                    fat: food.foodFat
                }));
                setAllFoodData(formattedData); // 받아온 데이터로 state 업데이트
                setFoodListPage(1);
            })
            .catch(error => {
                console.error("음식 데이터를 불러오는 중 오류 발생:", error);
            });
    }, []); // [] : 처음 한 번만 실행

  //  백엔드에서 사용자 신체 정보 가져오기 (마이페이지와 동일 로직)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:18090/api/mypage/userinfo', {
          withCredentials: true
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("계산기 페이지: 신체 정보 로딩 오류:", error);
        // 오류 발생 시 기본값 또는 빈 객체 설정 가능
        setUserInfo({});
      }
    };
    fetchUserInfo();
  }, []); // [] : 처음 한 번만 실행

  //  userInfo state가 변경될 때마다 BMR을 다시 계산하는 useEffect 추가
  useEffect(() => {
    if (userInfo) {
      const calculated = calculateMifflinStJeorBMR(
          userInfo.userGender,
          userInfo.userWeight,
          userInfo.userHeight
      );
      // ⭐️ BMR이 'XXX'가 아닐 때만 숫자로 state 업데이트
      if (calculated !== 'XXX') {
        setBmrValue(calculated);
      } else {
        setBmrValue(0); // 정보가 없으면 BMR을 0으로 설정
      }
    } else {
      setBmrValue(0);
    }
  }, [userInfo]); //  userInfo가 바뀔 때마다 이 useEffect 실행

  //  활동대사량(TDEE) 계산
  //  bmrValue나 activityLevel이 변경될 때마다 자동으로 다시 계산됨
  const calculatedTDEE = Math.round(bmrValue * activityLevel);

  // 칼로리 총합 계싼
  const totalSelectedCalories = useMemo(() => {
    // selectedFoods 배열을 순회하며 'calories' 값을 합산합니다.
    return selectedFoods.reduce((total, food) => {
      //  '350Kcal' 같은 문자열에서 숫자(350)만 추출합니다.
      const calories = parseFloat(food.calories) || 0;
      return total + calories;
    }, 0); // 초기값은 0
  }, [selectedFoods]);

  //  Filter the food data based on the search query
  const filteredFoodData = allFoodData.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  3. 페이지 계산 로직을 다시 추가합니다 (allFoodData 기준).
  const totalFoodPages = Math.ceil(filteredFoodData.length / ITEMS_PER_PAGE);
  // const totalSelectedPages = Math.ceil(selectedFoods.length / ITEMS_PER_PAGE);

  //  4. 현재 페이지에 맞는 데이터만 '잘라서' 보여주는 로직을 다시 추가합니다.
  const currentFoodData = filteredFoodData.slice((foodListPage - 1) * ITEMS_PER_PAGE, foodListPage * ITEMS_PER_PAGE);
  // const currentSelectedFoods = selectedFoods.slice((selectedListPage - 1) * ITEMS_PER_PAGE, selectedListPage * ITEMS_PER_PAGE);

  //  5. 빈 행 계산 로직도 다시 추가합니다.
  const emptyFoodRows = ITEMS_PER_PAGE - currentFoodData.length;
  // const emptySelectedRows = ITEMS_PER_PAGE - currentSelectedFoods.length;

  //  Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setFoodListPage(1); // Reset to the first page when searching
  };

    const handleAddFood = (food) => {
        //  food 객체에는 이미 name, calories, carbs, protein, fat이 모두 들어있습니다.
        //    (이전 단계의 useEffect - axios.get 에서 DB 데이터를 매핑해 두었습니다.)
        const newFood = {
            key: Date.now(), // 고유한 key 생성
            name: food.name,
            amount: '100g', // 기본값

            //  백엔드에서 받은 실제 데이터(food)를 사용하도록 수정
            carbs: `${food.carbs || 0}g`,     // 예: 22.5 -> "22.5g"
            protein: `${food.protein || 0}g`, // 예: 21.5 -> "21.5g"
            fat: `${food.fat || 0}g`,         // 예: 22.5 -> "22.5g"
            calories: `${food.calories || 0}Kcal`,
        };
        setSelectedFoods(prev => [...prev, newFood]); //  prev => [...prev, newFood] 사용 권장
    };

  const handleDeleteFood = (keyToDelete) => {
    const updatedFoods = selectedFoods.filter(food => food.key !== keyToDelete);
    setSelectedFoods(updatedFoods);
  };

  // 선택 리스트 초기화 함수 추가
  const handleResetSelectedFoods = () => {
    setSelectedFoods([]); // 선택 목록을 빈 배열로 만듭니다.
  };

  return (
      <div className="calculator-page">
        <div className="row top-row">
          <div className="col col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="input-wrapper">
                  <SearchOutlined className="input-icon"/>
                  <input
                      type="text"
                      placeholder="식품명을 입력하세요."
                      className="input-field"
                      value={searchQuery} //  Connect input value to state//
                      onChange={handleSearchChange} //  Connect onChange to handler function
                  />
                </div>
                <table className="custom-table food-list-table">
                  <thead>
                  <tr>
                    <th>음식</th>
                    <th>칼로리</th>
                  </tr>
                  </thead>
                  <tbody>
                  {/*  Use the filtered and paginated data (currentFoodData) */}
                  {currentFoodData.map(food => (
                      <tr key={food.key} onClick={() => handleAddFood(food)}>
                        <td>{food.name}</td>
                        <td>{food.calories}</td>
                      </tr>
                  ))}
                  {emptyFoodRows > 0 && Array.from({length: emptyFoodRows}).map((_, index) => (
                      <tr key={`empty-${index}`} className="empty-row">
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
                <Pagination currentPage={foodListPage} totalPages={totalFoodPages} onPageChange={setFoodListPage}/>
              </div>
            </div>
          </div>
          {/* ... (선택 리스트 부분은 동일하게 currentSelectedFoods 사용) ... */}
          {/* --- 선택 리스트 컬럼 --- */}
          <div className="col col-lg-12">
            {/*  Card에 'selected-list-card' 클래스 추가 */}
            <div className="card selected-list-card">
              <div className="card-title">선택 리스트</div>
              <div className="card-body">
                {/*  테이블을 감싸는 스크롤 wrapper div 추가 */}
                <div className="selected-list-table-wrapper">
                  <table className="custom-table">
                    <thead>
                    <tr>
                      <th>식품명</th>
                      <th>양(g)</th>
                      <th>탄수화물</th>
                      <th>단백질</th>
                      <th>지방</th>
                      <th>칼로리</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* selectedFoods가 비어있는지 확인합니다. */}
                    {selectedFoods.length === 0 ? (
                        //  비어있을 경우: 안내 문구를 표시하는 행을 렌더링합니다.
                        <tr className="empty-list-message-row">
                          <td colSpan="7">음식을 클릭하여 추가하세요.</td>
                        </tr>
                    ) : (
                        //  비어있지 않을 경우: 기존 목록을 렌더링합니다.
                        selectedFoods.map(food => (
                            <tr key={food.key}>
                              <td>{food.name}</td>
                              <td>{food.amount}</td>
                              <td>{food.carbs}</td>
                              <td>{food.protein}</td>
                              <td>{food.fat}</td>
                              <td>{food.calories}</td>
                              <td><CloseCircleOutlined className="delete-icon"
                                                       onClick={() => handleDeleteFood(food.key)}/></td>
                            </tr>
                        ))
                    )}
                    </tbody>
                  </table>
                </div>
                {/* <--- selected-list-table-wrapper 끝 */}

                {/* 초기화 버튼을 추가*/}
                {/* 스크롤 영역(wrapper) 바깥, 카드 본문(card-body) 안쪽에 위치시킵니다. */}
                <button
                    className="reset-button"
                    onClick={handleResetSelectedFoods} // 이 함수는 PageCalculator 컴포넌트 내에 정의되어 있어야 합니다.
                    disabled={selectedFoods.length === 0} // 선택된 항목이 없을 때 비활성화
                >
                  초기화
                </button>
              </div>
              {/* <--- card-body 끝 */}
            </div>
            {/* <--- card 끝 */}
          </div>
          {/* <--- col 끝 */}
        </div>

        {/* --- 중간/하단 영역 --- */}
        <div className="row" style={{marginTop: '24px', rowGap: '16px'}}>
          <div className="col col-sm-8">
            <div className="card statistic-card">
              <div className="card-body">
              <div className="statistic-title">기초대사량</div>
                {/* ️ bmrValue가 0이면 '정보 없음' 또는 기본값을 표시 (선택적) */}
                <div className="statistic-value">{bmrValue === 0 ? '정보 없음' : `${bmrValue} Kcal`}</div>
              </div>
            </div>
          </div>
          <div className="col col-sm-8">
            <div className="card">
              <div className="card-body">
                <p className="card-title">활동대사량</p>
                <div className="activity-buttons">
                  {/*  버튼 클릭 시 activityLevel state를 변경하도록 onClick 이벤트 추가 */}
                  {/* ️ 현재 선택된 버튼은 'active-button' 클래스를 갖도록 설정 */}
                  <button
                      className={`activity-button ${activityLevel === activityLevels.low.value ? 'active' : ''}`}
                      onClick={() => setActivityLevel(activityLevels.low.value)}
                  >
                    {activityLevels.low.name}
                  </button>
                  <button
                      className={`activity-button ${activityLevel === activityLevels.normal.value ? 'active' : ''}`}
                      onClick={() => setActivityLevel(activityLevels.normal.value)}
                  >
                    {activityLevels.normal.name}
                  </button>
                  <button
                      className={`activity-button ${activityLevel === activityLevels.high.value ? 'active' : ''}`}
                      onClick={() => setActivityLevel(activityLevels.high.value)}
                  >
                    {activityLevels.high.name}
                  </button>
                </div>
                {/*  계산된 활동대사량(calculatedTDEE) 표시 */}
                <h2 className="activity-kcal-header">{calculatedTDEE} Kcal</h2>
              </div>
            </div>
          </div>
          <div className="col col-sm-8">
              <div className="card statistic-card">
                  <div className="card-body">
                      <div className="statistic-title">총 음식 칼로리</div>
                      <div className="statistic-value">{totalSelectedCalories} Kcal</div>
                      <p className="warning-text">*다이어트를 목표로 한다면...</p>
                  </div>
              </div>
          </div>
        </div>

          <div className="row" style={{marginTop: '16px', rowGap: '16px'}}>
              <div className="col col-sm-8">
                  <div className="card statistic-card">
                      <div className="card-body">
                          <div className="statistic-title">총 단백질</div>
                          <div className="statistic-value">50 g</div>
                <p className="warning-text">*약 100g의 단백질을...</p>
              </div>
            </div>
          </div>
          <div className="col col-sm-8">
            <div className="card statistic-card">
              <div className="card-body">
                <div className="statistic-title">총 탄수화물</div>
                <div className="statistic-value">150 g</div>
                <p className="warning-text">*탄수화물의 비율을...</p>
              </div>
            </div>
          </div>
          <div className="col col-sm-8">
            <div className="card statistic-card">
              <div className="card-body">
                <div className="statistic-title">총 지방</div>
                <div className="statistic-value">100 g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PageCalculator;