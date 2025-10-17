import React, { useState } from 'react';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './PageCalculator.css';

// --- 임시 데이터 ---
const foodData = [
  { key: '1', name: '닭갈비', calories: 95 }, { key: '2', name: '치킨', calories: 165 },
  { key: '3', name: '삼겹살', calories: 215 }, { key: '4', name: '보쌈', calories: 580 },
  { key: '5', name: '사과', calories: 450 }, { key: '6', name: '계란', calories: 95 },
  { key: '7', name: '닭가슴살', calories: 165 }, { key: '8', name: '현미밥', calories: 215 },
  { key: '9', name: '비빔밥', calories: 580 }, { key: '10', name: '불고기', calories: 450 },
];

// ⭐️ 1. 페이지네이션 컴포넌트를 이 파일 안에 직접 만듭니다.
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 데이터가 없을 경우 페이지네이션을 보여주지 않음
  if (totalPages === 0) {
    return null;
  }

  return (
      <nav className="pagination-container">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
        >
          &lt;
        </button>
        {pageNumbers.map(number => (
            <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
        ))}
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
        >
          &gt;
        </button>
      </nav>
  );
};


const PageCalculator = () => {
  const [selectedFoods, setSelectedFoods] = useState([
    { key: 'initial-1', name: '비빔밥', amount: '100g', carbs: '22.5g', protein: '22.5g', fat: '22.5g', calories: '350Kcal' },
  ]);

  //  각 테이블의 '현재 페이지'를 기억할 state 추가
  const [foodListPage, setFoodListPage] = useState(1);
  const [selectedListPage, setSelectedListPage] = useState(1);

  const ITEMS_PER_PAGE = 7;

  const totalFoodPages = Math.ceil(foodData.length / ITEMS_PER_PAGE);
  const totalSelectedPages = Math.ceil(selectedFoods.length / ITEMS_PER_PAGE);

  //  현재 페이지에 맞는 데이터만 '잘라서' 보여주기 위한 변수들
  const currentFoodData = foodData.slice(
      (foodListPage - 1) * ITEMS_PER_PAGE,
      foodListPage * ITEMS_PER_PAGE
  );
  const currentSelectedFoods = selectedFoods.slice(
      (selectedListPage - 1) * ITEMS_PER_PAGE,
      selectedListPage * ITEMS_PER_PAGE
  );

  // 부족한 행의 개수를 계산합니다.x
  const emptyFoodRows = ITEMS_PER_PAGE - currentFoodData.length;
  const emptySelectedRows = ITEMS_PER_PAGE - currentSelectedFoods.length;

  const handleAddFood = (food) => {
    const newFood = {
      key: Date.now(), name: food.name, amount: '100g', carbs: '22.5g',
      protein: '21.5g', fat: '22.5g', calories: `${food.calories}Kcal`,
    };
    setSelectedFoods([...selectedFoods, newFood]);
  };

  const handleDeleteFood = (keyToDelete) => {
    const updatedFoods = selectedFoods.filter(food => food.key !== keyToDelete);
    setSelectedFoods(updatedFoods);
  };

  return (
      <div className="calculator-page">
        <div className="row">
          <div className="col col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="input-wrapper">
                  <SearchOutlined className="input-icon" />
                  <input type="text" placeholder="식품명을 입력하세요." className="input-field" />
                </div>
                <table className="custom-table food-list-table">
                  <thead>
                  <tr><th>음식</th><th>칼로리</th></tr>
                  </thead>
                  <tbody>
                  {/*  전체 데이터 대신 '잘라낸' 데이터(currentFoodData)를 사용 */}
                  {currentFoodData.map(food => (
                      <tr key={food.key} onClick={() => handleAddFood(food)}>
                        <td>{food.name}</td>
                        <td>{food.calories}</td>
                      </tr>
                  ))}
                  {/*  부족한 만큼 '투명한 빈 행'을 추가합니다. */}
                  {emptyFoodRows > 0 && Array.from({ length: emptyFoodRows }).map((_, index) => (
                      <tr key={`empty-${index}`} className="empty-row">
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
                {/* ⭐️ 5. 기존의 '...' div를 우리가 만든 Pagination 컴포넌트로 교체 */}
                <Pagination
                    currentPage={foodListPage}
                    totalPages={totalFoodPages}
                    onPageChange={setFoodListPage}
                />
              </div>
            </div>
          </div>
          <div className="col col-lg-12">
            <div className="card">
              <div className="card-title">선택 리스트</div>
              <div className="card-body">
                <table className="custom-table">
                  <thead>
                  <tr>
                    <th>식품명</th><th>양(g)</th><th>탄수화물</th>
                    <th>단백질</th><th>지방</th><th>칼로리</th><th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {currentSelectedFoods.map(food => (
                      <tr key={food.key}>
                        <td>{food.name}</td><td>{food.amount}</td><td>{food.carbs}</td>
                        <td>{food.protein}</td><td>{food.fat}</td><td>{food.calories}</td>
                        <td><CloseCircleOutlined className="delete-icon" onClick={() => handleDeleteFood(food.key)} /></td>
                      </tr>
                  ))}
                  {/*  선택 리스트 테이블에도 똑같이 적용합니다. */}
                  {emptySelectedRows > 0 && Array.from({ length: emptySelectedRows }).map((_, index) => (
                      <tr key={`empty-selected-${index}`} className="empty-row">
                        <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                        <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
                <Pagination
                    currentPage={selectedListPage}
                    totalPages={totalSelectedPages}
                    onPageChange={setSelectedListPage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- 중간/하단 영역: 동일한 방식으로 div로 대체 --- */}
        <div className="row" style={{ marginTop: '24px', rowGap: '16px' }}>
          <div className="col col-sm-8">
            <div className="card statistic-card"><div className="card-body">
              <div className="statistic-title">기초대사량</div>
              <div className="statistic-value">1300 Kcal</div>
            </div></div>
          </div>
          <div className="col col-sm-8">
            <div className="card"><div className="card-body">
              <p style={{ color: 'rgba(0,0,0,0.45)'}}>활동대사량</p>
              <div className="activity-buttons">
                <button>활동량 적음</button> <button>활동량 보통</button> <button>활동량 많음</button>
              </div>
              <h2 className="activity-kcal-header">2100 Kcal</h2>
            </div></div>
          </div>
          <div className="col col-sm-8">
            <div className="card statistic-card"><div className="card-body">
              <div className="statistic-title">총 음식 칼로리</div>
              <div className="statistic-value">2200 Kcal</div>
              <p className="warning-text">*다이어트를 목표로 한다면...</p>
            </div></div>
          </div>
        </div>

        <div className="row" style={{ marginTop: '16px', rowGap: '16px' }}>
          <div className="col col-sm-8">
            <div className="card statistic-card"><div className="card-body">
              <div className="statistic-title">총 단백질</div>
              <div className="statistic-value">50 g</div>
              <p className="warning-text">*약 100g의 단백질을...</p>
            </div></div>
          </div>
          <div className="col col-sm-8">
            <div className="card statistic-card"><div className="card-body">
              <div className="statistic-title">총 탄수화물</div>
              <div className="statistic-value">150 g</div>
              <p className="warning-text">*탄수화물의 비율을...</p>
            </div></div>
          </div>
          <div className="col col-sm-8">
            <div className="card statistic-card"><div className="card-body">
              <div className="statistic-title">총 지방</div>
              <div className="statistic-value">100 g</div>
            </div></div>
          </div>
        </div>
      </div>
  );
};

export default PageCalculator;