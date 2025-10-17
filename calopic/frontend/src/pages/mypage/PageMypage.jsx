import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons'; // 아이콘은 유지
import './PageMypage.css';

// --- 임시 데이터 ---
const userData = {
  nickname: 'Calopic유저',
  bmr: 1650,
  email: 'xxxxx@gmail.com',
};

const bodyInfoData = {
  gender: 'male',
  height: 175,
  weight: 70,
  bodyFat: 15,
  muscleMass: 35,
  goal: 'maintain',
};

// 신체 정보 수정 폼 컴포넌트
const BodyInfoForm = () => {
  return (
      <form className="mypage-form">
        <div className="form-item">
          <label>성별</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" value="male" defaultChecked /> 남성</label>
            <label><input type="radio" name="gender" value="female" /> 여성</label>
          </div>
        </div>
        <div className="form-item">
          <label>키</label>
          <input type="number" defaultValue={bodyInfoData.height} className="input-field" />
        </div>
        <div className="form-item">
          <label>체중</label>
          <input type="number" defaultValue={bodyInfoData.weight} className="input-field" />
        </div>
        <div className="form-item">
          <label>체지방률</label>
          <input type="number" defaultValue={bodyInfoData.bodyFat} className="input-field" />
        </div>
        <div className="form-item">
          <label>골격근량</label>
          <input type="number" defaultValue={bodyInfoData.muscleMass} className="input-field" />
        </div>
        <div className="form-item">
          <label>목표</label>
          <div className="radio-group">
            <label><input type="radio" name="goal" value="gain" /> 체중증가</label>
            <label><input type="radio" name="goal" value="maintain" defaultChecked /> 유지</label>
            <label><input type="radio" name="goal" value="diet" /> 다이어트</label>
          </div>
        </div>
        <div className="form-button-container">
          <button type="submit" className="form-submit-button">저장</button>
        </div>
      </form>
  );
};

// 개인 정보 수정 폼 컴포넌트
const PersonalInfoForm = () => {
  return (
      <form className="mypage-form">
          <div className="form-item">
              <label>이메일</label>
              <span className="email-text">{userData.email}</span>
          </div>
          <div className="form-item">
              <label>닉네임</label>
              <input type="text" className="input-field"/>
          </div>
          <div className="form-item">
              <label>비밀번호 확인</label>
              <input type="password" className="input-field"/>
          </div>
          <div className="form-item">
              <label>새 비밀번호</label>
              <input type="password" className="input-field"/>
          </div>
          <div className="form-item">
              <label>새 비밀번호 확인</label>
              <input type="password" className="input-field"/>
          </div>
          <div className="form-button-container">
              <button type="submit" className="form-submit-button">변경</button>
          </div>
          <div className="withdraw-link-container">
              <a href="#!" className="withdraw-link">탈퇴하기</a>
          </div>
      </form>
  );
};

// 메인 마이페이지 컴포넌트
const PageMypage = () => {
    // ⭐️ 현재 활성화된 탭을 '기억'하기 위해 useState를 사용합니다.
    const [activeTab, setActiveTab] = useState('bodyInfo'); // 'bodyInfo' 또는 'personalInfo'

  return (
      <div className="mypage-page-container">
        <div className="mypage-card">
          {/* 상단 프로필 영역 */}
          <div className="profile-header">
            <div className="profile-avatar">
              <UserOutlined />
            </div>
            <div className="profile-text">
              <h2>안녕하세요! {userData.nickname} 님</h2>
              <p>현재 기초대사량은 {userData.bmr} 입니다.</p>
            </div>
          </div>

          {/* 탭 메뉴 영역 */}
          <div className="tab-nav">
            <button
                className={`tab-button ${activeTab === 'bodyInfo' ? 'active' : ''}`}
                onClick={() => setActiveTab('bodyInfo')}
            >
              신체 정보 수정
            </button>
            <button
                className={`tab-button ${activeTab === 'personalInfo' ? 'active' : ''}`}
                onClick={() => setActiveTab('personalInfo')}
            >
              개인 정보 수정
            </button>
          </div>

          {/* 탭 내용 영역 (조건부 렌더링) */}
          <div>
            {activeTab === 'bodyInfo' ? <BodyInfoForm /> : <PersonalInfoForm />}
          </div>
        </div>
      </div>
  );
};

export default PageMypage;