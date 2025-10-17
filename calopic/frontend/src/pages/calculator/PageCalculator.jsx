import React, { useState } from 'react';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './PageCalculator.css'; // 우리가 만든 CSS 파일 불러오기

// --- 임시 데이터 ---
const foodData = [
  { key: '1', name: '닭갈비', calories: 95 },
  { key: '2', name: '치킨', calories: 165 },
  { key: '3', name: '삼겹살', calories: 215 },
  { key: '4', name: '보쌈', calories: 580 },
  { key: '5', name: '사과', calories: 450 },
  { key: '6', name: '계란', calories: 95 },
  { key: '7', name: '닭가슴살', calories: 165 },
  { key: '8', name: '현미밥', calories: 215 },
  { key: '9', name: '비빔밥', calories: 580 },
  { key: '10', name: '불고기', calories: 450 },
];

const PageCalculator = () => {
  const [selectedFoods, setSelectedFoods] = useState([
    { key: 'initial-1', name: '비빔밥', amount: '100g', carbs: '22.5g', protein: '22.5g', fat: '22.5g', calories: '350Kcal' },
  ]);

  const handleAddFood = (food) => {
    const newFood = {
      key: Date.now(),
      name: food.name,
      amount: '100g',
      carbs: '22.5g',
      protein: '21.5g',
      fat: '22.5g',
      calories: `${food.calories}Kcal`,
    };
    setSelectedFoods([...selectedFoods, newFood]);
  };

  const handleDeleteFood = (keyToDelete) => {
    const updatedFoods = selectedFoods.filter(food => food.key !== keyToDelete);
    setSelectedFoods(updatedFoods);
  };

  return (
      <div className="calculator-page">
        {/* --- 상단 영역: Row와 Col을 div로 대체 --- */}
        <div className="row">
          <div className="col col-lg-12">
            {/* Card를 div로 대체 */}
            <div className="card">
              <div className="card-body">
                {/* Input을 div와 input으로 대체 */}
                <div className="input-wrapper">
                  <SearchOutlined className="input-icon" />
                  <input
                      type="text"
                      placeholder="식품명을 입력하세요."
                      className="input-field"
                  />
                </div>
                {/* Table을 table로 대체하고, map 함수로 데이터 렌더링 */}
                <table className="custom-table food-list-table">
                  <thead>
                  <tr>
                    <th>음식</th>
                    <th>칼로리</th>
                  </tr>
                  </thead>
                  <tbody>
                  {foodData.slice(0, 7).map(food => (
                      <tr key={food.key} onClick={() => handleAddFood(food)}>
                        <td>{food.name}</td>
                        <td>{food.calories}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
                <div className="pagination">...</div>
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
                  {selectedFoods.map(food => (
                      <tr key={food.key}>
                        <td>{food.name}</td>
                        <td>{food.amount}</td>
                        <td>{food.carbs}</td>
                        <td>{food.protein}</td>
                        <td>{food.fat}</td>
                        <td>{food.calories}</td>
                        <td>
                          <CloseCircleOutlined
                              className="delete-icon"
                              onClick={() => handleDeleteFood(food.key)}
                          />
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
                <div className="pagination">...</div>
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