import React, { useState } from 'react'; // ⭐️ 1. useState를 import합니다.
import { Input, Table, Card, Col, Row, Statistic, Button, Space } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './PageCalculator.css';

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
  // ⭐️ 2. 선택된 음식 목록을 '기억'할 state를 만듭니다.
  const [selectedFoods, setSelectedFoods] = useState([
    // 처음에는 비빔밥이 선택된 상태로 시작
    { key: 'initial-1', name: '비빔밥', amount: '100g', carbs: '22.5g', protein: '22.5g', fat: '22.5g', calories: '350Kcal' },
  ]);

  // ⭐️ 3. 선택 리스트에 음식을 '추가'하는 함수를 만듭니다.
  const handleAddFood = (food) => {
    // 추가할 새로운 음식 객체를 만듭니다. (key는 중복되지 않게 현재 시간으로)
    const newFood = {
      key: Date.now(), // 고유한 key 생성
      name: food.name,
      amount: '100g', // 기본값
      carbs: '22.5g', // 실제로는 계산된 값이 들어가야 합니다.
      protein: '22.5g',
      fat: '22.5g',
      calories: `${food.calories}Kcal`,
    };

    // 기존 목록(...selectedFoods)에 새로운 음식(newFood)을 추가하여 state를 업데이트합니다.
    setSelectedFoods([...selectedFoods, newFood]);
  };

  // ⭐️ 4. 선택 리스트에서 음식을 '삭제'하는 함수를 만듭니다.
  const handleDeleteFood = (keyToDelete) => {
    // 삭제할 key와 다른 key를 가진 음식들만 남겨 새로운 배열을 만듭니다.
    const updatedFoods = selectedFoods.filter(food => food.key !== keyToDelete);
    // 걸러진 새로운 배열로 state를 업데이트합니다.
    setSelectedFoods(updatedFoods);
  };

  const selectedColumns = [
    { title: '식품명', dataIndex: 'name', key: 'name' },
    { title: '양(g)', dataIndex: 'amount', key: 'amount' },
    { title: '탄수화물', dataIndex: 'carbs', key: 'carbs' },
    { title: '단백질', dataIndex: 'protein', key: 'protein' },
    { title: '지방', dataIndex: 'fat', key: 'fat' },
    { title: '칼로리', dataIndex: 'calories', key: 'calories' },
    {
      title: '',
      key: 'action',
      // ⭐️ 5. 삭제 버튼에 onClick 이벤트를 연결합니다.
      render: (text, record) => (
          <CloseCircleOutlined
              className="delete-icon"
              onClick={() => handleDeleteFood(record.key)}
          />
      ),
    },
  ];

  return (
      <div className="calculator-page">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card className="fill-height-card">
              <Input
                  placeholder="식품명을 입력하세요."
                  prefix={<SearchOutlined />}
                  size="large"
              />
              <Table
                  dataSource={foodData}
                  columns={[
                    { title: '음식', dataIndex: 'name', key: 'name' },
                    { title: '칼로리', dataIndex: 'calories', key: 'calories' },
                  ]}
                  pagination={{ pageSize: 5, total: 14, showSizeChanger: false }}
                  className="search-results-table"
                  // ⭐️ 6. 음식 목록의 각 행을 클릭했을 때 handleAddFood 함수를 실행합니다.
                  onRow={(record) => ({
                    onClick: () => handleAddFood(record),
                  })}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="선택 리스트" className="fill-height-card">
              <Table
                  // ⭐️ 7. dataSource를 고정된 데이터가 아닌, 우리가 만든 state로 변경합니다.
                  dataSource={selectedFoods}
                  columns={selectedColumns}
                  pagination={false}
              />
            </Card>
          </Col>
        </Row>

        {/* --- 중간 영역: 칼로리 정보 --- */}
        {/* ⭐️ style 속성을 className으로 변경 */}
        <Row gutter={[16, 16]} className="calorie-info-row">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="기초대사량" value={1300} suffix="Kcal" />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <p className="card-title">활동대사량</p>
              <Space wrap>
                <Button type="primary" danger>활동량 적음</Button>
                <Button>활동량 보통</Button>
                <Button>활동량 많음</Button>
              </Space>
              <h2 className="activity-kcal-header">2100 Kcal</h2>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="총 음식 칼로리" value={2200} suffix="Kcal" />
              <p className="warning-text">*다이어트를 목표로 한다면 약 1400~1600Kcal를 유지하십시오.</p>
            </Card>
          </Col>
        </Row>

        {/* --- 하단 영역: 영양소 정보 --- */}
        {/* ⭐️ style 속성을 className으로 변경 */}
        <Row gutter={[16, 16]} className="macro-info-row">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="총 단백질" value={50} suffix="g" />
              <p className="warning-text">*약 100g의 단백질을 더 섭취하기를 권장합니다.</p>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="총 탄수화물" value={150} suffix="g" />
              <p className="warning-text">*탄수화물의 비율을 낮추기를 권장합니다.</p>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="총 지방" value={100} suffix="g" />
            </Card>
          </Col>
        </Row>
      </div>
  );
};

export default PageCalculator;