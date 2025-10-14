import React, { useState } from 'react';
import dayjs from 'dayjs';

// 공통 컴포넌트 import
import CustomSelect from '../components/common/CustomSelect';
import CustomSelect2 from '../components/common/CustomSelect2';
import CustomSelect3 from '../components/common/CustomSelect3';
import CustomSlider1 from '../components/common/CustomSlider1';
import CustomSlider2 from '../components/common/CustomSlider2';
import CustomSwitch from '../components/common/CustomSwitch';
import CustomUpload1 from '../components/common/CustomUpload1';
import CustomUpload2 from '../components/common/CustomUpload2';
import CustomCheckbox1 from '../components/common/CustomCheckbox1';
import CustomCheckbox2 from '../components/common/CustomCheckbox2';
import CustomSelectDate1 from '../components/common/CustomSelectDate1';
import CustomInputNum from '../components/common/CustomInputNum';
import CustomRadio1 from '../components/common/CustomRadio1';
import CustomPanel1 from '../components/common/CustomPanel1';
import CustomTimeline from '../components/common/CustomTimeline';
import CustomMessage from '../components/common/CustomMessage';
import CustomModal1 from '../components/common/CustomModal1';
import CustomModal2, { ReachableContext, UnreachableContext } from '../components/common/CustomModal2';
import CustomProgressbar1 from '../components/common/CustomProgressbar1';
import CustomProgressbar2 from '../components/common/CustomProgressbar2';

function ComponentView() {
  // Select2에서 사용하는 상태
  const [person, setPerson] = useState('');

  // Select3에서 사용하는 상태 (다중 선택 - 색상 태그)
  const [selectedColors, setSelectedColors] = useState([]);

  //Slider1 사용하는 상태
   // 서로 다른 슬라이더용 상태를 분리해서 변수명 충돌을 피했어요
  const [intSliderValue, setIntSliderValue] = useState(5);      // 정수 슬라이더
  const [decSliderValue, setDecSliderValue] = useState(0.3);    // 소수 슬라이더

  //Slider2
  const [percentA, setPercentA] = useState(25);

  //Switch
  const [isActive, setIsActive] = useState(true);

  //Upload2
  const [upload2Files, setUpload2Files] = useState([]);

  //Checkbox1
  const [isChecked1, setIsChecked1] = useState(false);

  //Checkbox2
  const [checkedFruits, setCheckedFruits] = useState(['Apple', 'Orange']);

  //SelectDate1
  const [selectedDate, setSelectedDate] = useState(dayjs());

  //InputNum
  const [inputValue, setInputValue] = useState(3);

  //Radio1
  const [fruit, setFruit] = useState('Apple');

  // Select2 변경 이벤트
  const handlePersonChange = (value) => {
    console.log('선택된 인물:', value);
    setPerson(value);
  };

  // Select3 변경 이벤트
  const handleColorChange = (value) => {
    console.log('선택된 색상:', value);
    setSelectedColors(value);
  };

  //Upload2
  const handleUpload2Change = (info) => {
  // 업로드 진행 상황/결과 확인 가능
  console.log('upload2 status:', info.file.status, info.file);
  setUpload2Files(info.fileList); // controlled 모드
};

const handleUpload2Preview = (file) => {
  // 필요 시 커스텀 미리보기 로직
  console.log('preview file:', file);
};

//Checkbox2 handler
const handleFruitsChange = (list) => {
  console.log('선택된 과일:', list);
  setCheckedFruits(list);
};

//SelectDate1 handler
const handleDateChange = (date, dateString) => {
  console.log('선택된 날짜:', dateString);
  setSelectedDate(date);
};

//InputNum handler
const handleInputChange = (val) => {
  console.log('숫자 변경:', val);
  setInputValue(val);
};

//Radio handler
const handleFruitChange = (e) => {
  console.log('선택된 과일:', e.target.value);
  setFruit(e.target.value);
};

//Modal1 handler
const handleOkAction = () => {
  console.log('확인 버튼 클릭');
};
const handleCancelAction = () => {
  console.log('취소 버튼 클릭');
};

//Modal2 content
const modalContent = (
  <>
    <ReachableContext.Consumer>{(v) => <>Reachable: {v}!</>}</ReachableContext.Consumer>
    <br />
    <UnreachableContext.Consumer>{(v) => <>Unreachable: {v}!</>}</UnreachableContext.Consumer>
  </>
);

  // Select2용 옵션
  const personOptions = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'orange', label: '오렌지' },
  { value: 'grape', label: '포도' },
  { value: 'peach', label: '복숭아' },
  { value: 'watermelon', label: '수박' },
  { value: 'strawberry', label: '딸기' },
  { value: 'pineapple', label: '파인애플' },
  { value: 'mango', label: '망고' },
  { value: 'kiwi', label: '키위' },
];


  // Select1용 옵션 (단일)
  const fruitOptions = [
    { value: '사과', label: '사과' },
    { value: '바나나', label: '바나나' },
    { value: '당근', label: '당근' },
    { value: '도라지', label: '도라지' },
  ];

  // Select3용 옵션(색상 태그)
  const colorOptions = [
  { value: '#9EE8C2', label: 'Soft Aqua' },
  { value: '#7EE5A3', label: 'Light Mint' },
  { value: '#36C96D', label: 'Mint Green' },
  { value: '#25b16fff', label: 'Lime Teal' },
  { value: '#2e9c59ff', label: 'Deep Green' },
];

// Panel1 데이터 정의
const panelItems = [
  {
    key: '1',
    label: '공지사항',
    children: <p>최근 업데이트 안내 및 공지사항 내용입니다.</p>,
  },
  {
    key: '2',
    label: '이용 안내',
    children: <p>서비스 이용 방법과 자주 묻는 질문을 확인하세요.</p>,
  },
  {
    key: '3',
    label: '기타 문의',
    children: <p>기타 문의사항은 고객센터로 연락 바랍니다.</p>,
  },
];

//Timeline 데이터
const timelineItems = [
  { children: '서비스 사이트 생성 2015-09-01' },
  { children: '초기 네트워크 이슈 해결 2015-09-01' },
  { children: '기술 테스트 2015-09-01' },
  { children: '네트워크 문제 해결 중 2015-09-01' },
];

//Panel1 handler
// 3) handler
const handlePanelChange = (keys) => {
  console.log('현재 열린 패널 key:', keys);
};


  return (
    <div className="App" style={{ padding: 40 }}>
      <h2>공통 컴포넌트 테스트</h2>
      <p>CustomSelect</p>
      {/* 1) CustomSelect (기본 단일 선택) */}
      <CustomSelect
        options={fruitOptions}
        onChange={(v) => console.log('과일 선택:', v)}
      />
      <br/>
      <br/>
      <p>CustomSelect2</p>
      {/* 2) CustomSelect2 (검색 가능 단일 선택) */}
      <CustomSelect2
        value={person}
        options={personOptions}
        placeholder="인물을 선택하세요"
        onChange={handlePersonChange}
      />
      <br/>
      <br/>
      <p>CustomSelect3</p>
      {/* 3) CustomSelect3 (색상 태그 멀티 선택) */}
      <CustomSelect3
        options={colorOptions}
        value={selectedColors}
        onChange={handleColorChange}
        placeholder="색상을 선택하세요"
        style={{ width: 300 }}
      />
      <br/>
      <br/>
      <p>CustomSlider1</p>
      <CustomSlider1
          value={intSliderValue}
          onChange={setIntSliderValue}
          min={1}
          max={20}
          step={1}
          sliderSpan={12}
          inputSpan={6}
        />
        <br/>
        <br/>
      <CustomSlider1
          value={decSliderValue}
          onChange={setDecSliderValue}
          min={0}
          max={1}
          step={0.01}
          sliderSpan={12}
          inputSpan={6}
        />
        <br/>
        <br/>
        <p>CustomSlider2</p>
      <CustomSlider2
        value={percentA}
        onChange={setPercentA}
        min={0}
        max={100}
        step={1}
      />
      <br/>
      <br/>
      <p>CustomSwitch</p>
      <CustomSwitch
        checked={isActive}
        onChange={(checked) => {
          console.log('스위치 상태:', checked);
          setIsActive(checked);
        }}
        color="#36C96D" // 초록색 (기본값이지만 명시 가능)
        style={{ marginTop: 20 }}
      />
      <br/>
      <br/>
      <p>CustomUpload1</p>
      <CustomUpload1
        action="https://example.com/api/upload"  // 업로드 경로
        buttonText="파일 업로드"
        onChange={(info) => console.log('업로드 상태:', info.file.status)}
        style={{ marginTop: 20 }}
      />
      <br/>
      <br/>
      <p>CustomUpload2(오류, 수정필요)</p>
      <CustomUpload2
        action="https://example.com/api/upload"   // 업로드 엔드포인트
        fileList={upload2Files}                   // controlled 모드
        onChange={handleUpload2Change}
        onPreview={handleUpload2Preview}
        maxCount={5}
        listType="picture-card"
        accept="image/*"
        multiple={false}
        crop={{ rotationSlider: true, aspect: 1 }} // 1:1 크롭 예시
        childrenText="+ Upload"
      />
      <br/>
      <br/>
      <p>Checkbox1</p>
      <CustomCheckbox1
        checked={isChecked1}
        onChange={(e) => {
          console.log('체크박스 상태:', e.target.checked);
          setIsChecked1(e.target.checked);
        }}
        label="약관에 동의합니다"
        color="#36C96D"
        style={{ marginTop: 20 }}
      />
      <br/>
      <br/>
      <p>Checkbox2</p>
      <CustomCheckbox2
        options={['Apple', 'Pear', 'Orange']}
        defaultCheckedList={checkedFruits}
        onChange={handleFruitsChange}
        labelCheckAll="전체 과일 선택"
        color="#36C96D"
        style={{ marginTop: 20 }}
      />
      <br/>
      <br/>
      <p>CustomSelectDate1</p>
      <CustomSelectDate1
        value={selectedDate}
        onChange={handleDateChange}
        placeholder="날짜 선택"
        style={{ width: 250, marginTop: 20 }}
      />
      <br/>
      <br/>
      <p>CustomInputNum</p>
      <CustomInputNum
        value={inputValue}
        onChange={handleInputChange}
        min={1}
        max={99}
        step={1}
        style={{ width: 120, marginTop: 20 }}
      />
      <br/>
      <br/>
      <div style={{ marginTop: 20 }}>
        <p>CustomRadio1 (기본형)</p>
        {/* 기본형 라디오 */}
        <CustomRadio1
          value={fruit}
          onChange={handleFruitChange}
          options={[
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange' },
          ]}
          color="#36C96D"
        />
        <p>CustomRadio1 (버튼형)</p>
        {/* 버튼형 라디오 */}
        <CustomRadio1
          type="button"
          value={fruit}
          onChange={handleFruitChange}
          options={[
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange' },
          ]}
          buttonStyle="solid"
          color="#36C96D"
          style={{ marginTop: 16 }}
        />
        <br/>
        <br/>
        <p>CustomPanel1</p>
        <CustomPanel1
          items={panelItems}
          defaultActiveKey={['1']}      // 첫 번째 패널 기본 열림
          onChange={handlePanelChange}  // 열림/닫힘 시 실행
          bordered={false}              // 테두리 제거
          style={{ marginTop: 30 }}
        />
        <br/>
        <br/>
        <p>CustomTimeline</p>
        <CustomTimeline
          items={timelineItems}
          defaultColor="#36C96D"
          mode="left"           // 'alternate'로 바꾸면 좌우 교차
          reverse={false}
          pending={false}
          style={{ marginTop: 24 }}
        />
        <br/>
        <br/>
        <p>CustomMessage</p>
        <div style={{ marginTop: 20 }}>
          {/* 정보 메시지 */}
          <CustomMessage
            type="info"
            content="안녕하세요! 기본 정보 메시지입니다."
            buttonText="정보 메시지 보기"
            color="#5686eeff"
          />

          {/* 성공 메시지 */}
          <CustomMessage
            type="success"
            content="업로드가 성공적으로 완료되었습니다!"
            buttonText="성공 메시지 보기"
            color="#36C96D"
            style={{ marginLeft: 10 }}
          />

          {/* 오류 메시지 */}
          <CustomMessage
            type="error"
            content="오류가 발생했습니다. 다시 시도해주세요."
            buttonText="에러 메시지 보기"
            color="#e74c3c"
            style={{ marginLeft: 10 }}
          />
        </div>
        <br/>
        <br/>
        <p>CustomModal1</p>
        <CustomModal1
          title="회원 정보 수정"
          buttonText="모달 열기"
          okText="저장"
          cancelText="닫기"
          color="#36C96D"
          onOk={handleOkAction}
          onCancel={handleCancelAction}
          style={{ marginTop: 20 }}
        >
          {/* 👇 이 영역은 다른 파일에서 자유롭게 변경 가능 */}
          <p>회원 정보를 수정하시겠습니까? 변경된 내용은 저장 후 즉시 반영됩니다.</p>
        </CustomModal1>
        <br/>
        <br/>
        <p>CustomModal2</p>
        <CustomModal2
          title="Hook Modal Demo"
          content={modalContent}
          buttons={['confirm', 'warning', 'info', 'error']}
          texts={{ confirm: 'Confirm', warning: 'Warning', info: 'Info', error: 'Error' }}
          reachableValue="Light"
          unreachableValue="Bamboo"
          configOverrides={{
            confirm: { okText: 'OK', cancelText: 'Cancel', centered: true },
            warning: { centered: true },
            info: { width: 520 },
            error: { okText: 'Close' },
          }}
          buttonProps={{
            confirm: { type: 'primary', style: { background: '#36C96D', borderColor: '#36C96D' } },
            warning: { type: 'default' },
            info: { type: 'dashed' },
            error: { type: 'default' },
          }}
          spaceProps={{ style: { marginTop: 20 }, size: 'middle' }}
        />
        <br/>
        <br/>
        <p>CustomProgressbar1 (게이지 바 색 수정)</p>
        <div style={{ marginTop: 20 }}>
            {/* 단일 진행바 */}
            <CustomProgressbar1 percent={45} status="active" color="#36C96D" />

            {/* 여러 개 한 번에 */}
            <CustomProgressbar1
              multiBars={[
                { percent: 30 },
                { percent: 50, status: 'active' },
                { percent: 70, status: 'exception' },
                { percent: 100, status: 'success' },
                { percent: 50, showInfo: false },
              ]}
              style={{ marginTop: 16 }}
            />
        </div>
        <br/>
        <br/>
        <p>CustomProgressbar2(게이지 바 색 수정)</p>
        <div style={{ marginTop: 20 }}>
          {/* 단일 원형 진행바 */}
          <CustomProgressbar2
            percent={75}
            format={(p) => `${p} Days`}
            color="#36C96D"
          />

          {/* 여러 개 원형 진행바 */}
          <CustomProgressbar2
            multiCircles={[
              { percent: 75, format: (p) => `${p} Days` },
              { percent: 100, format: () => 'Done' },
              { percent: 40, format: (p) => `${p}%`, color: '#23B88A' },
            ]}
            color="#36C96D"
            style={{ marginTop: 16 }}
          />
        </div>
        <br/>
        <br/>

        <br/>
        <br/>
      </div>
    </div>
  );
}

export default ComponentView;
