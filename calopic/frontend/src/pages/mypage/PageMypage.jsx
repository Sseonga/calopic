import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './PageMypage.css';
import { calculateMifflinStJeorBMR } from '../../utils/bmrCalculator';
import { useNavigate } from 'react-router-dom';


//  신체 정보 수정 폼 컴포넌트 (DB 코드 ID 사용하도록 수정)
const BodyInfoForm = ({ initialData, onSave }) => {
    // 폼 내부의 값을 관리할 state (초기값은 DB 코드 ID 기준으로 설정)
    const [formData, setFormData] = useState(initialData || {
        userGender: 'GENDER01', //
        userHeight: '',
        userWeight: '',
        userBodyfat: '',
        userMuscle: '',
        userGoal: 'GOAL02', // 목표 코드 ID
    });

    //  백엔드에서 데이터를 받아오면 formData 업데이트
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    // ️ 입력 필드 값이 변경될 때마다 formData state 업데이트
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? value : (type === 'number' ? (value ? parseFloat(value) : '') : value) // 숫자 타입 처리
        }));
    };

    //  저장 버튼 클릭 시 처리
    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 form 제출 동작 방지

        // formData.userGoal에 이미 'GOAL01' 등의 값이 들어있습니다.
        const dataToSend = { ...formData };

        console.log("Saving data (using Code ID):", dataToSend); // 디버깅용 로그
        onSave(dataToSend); // 부모 컴포넌트의 onSave 함수 호출
    };

    return (
        // ⭐️ form 태그에 onSubmit 연결
        <form className="mypage-form" onSubmit={handleSubmit}>
            <div className="form-item">
                <label>성별</label>
                <div className="radio-group">
                    {/* ⭐️ value와 checked 속성을 DB 코드 ID 기준으로 변경 */}
                    <label><input type="radio" name="userGender" value="GENDER01" checked={formData.userGender === 'GENDER01'} onChange={handleChange} /> 남성</label>
                    <label><input type="radio" name="userGender" value="GENDER02" checked={formData.userGender === 'GENDER02'} onChange={handleChange} /> 여성</label>
                </div>
            </div>
            <div className="form-item">
                <label>키</label>
                {/* ⭐️ name, value, onChange 추가 */}
                <input type="number" name="userHeight" value={formData.userHeight || ''} onChange={handleChange} className="input-field" placeholder="cm"/>
            </div>
            <div className="form-item">
                <label>체중</label>
                <input type="number" name="userWeight" value={formData.userWeight || ''} onChange={handleChange} className="input-field" placeholder="kg"/>
            </div>
            <div className="form-item">
                <label>체지방률</label>
                <input type="number" name="userBodyfat" value={formData.userBodyfat || ''} onChange={handleChange} className="input-field" placeholder="%"/>
            </div>
            <div className="form-item">
                <label>골격근량</label>
                <input type="number" name="userMuscle" value={formData.userMuscle || ''} onChange={handleChange} className="input-field" placeholder="kg"/>
            </div>
            <div className="form-item">
                <label>목표</label>
                <div className="radio-group">
                    {/* ⭐️ value와 checked 속성을 DB 코드 ID 기준으로 변경 */}
                    <label><input type="radio" name="userGoal" value="GOAL01" checked={formData.userGoal === 'GOAL01'}
                                  onChange={handleChange}/> 체중증가</label>
                    <label><input type="radio" name="userGoal" value="GOAL02" checked={formData.userGoal === 'GOAL02'}
                                  onChange={handleChange}/> 유지</label>
                    <label><input type="radio" name="userGoal" value="GOAL03" checked={formData.userGoal === 'GOAL03'}
                                  onChange={handleChange}/> 다이어트</label>
                </div>
            </div>
            <div className="form-button-container">
                <button type="submit" className="form-submit-button">저장</button>
            </div>
        </form>
    );
};

// 개인 정보 수정 폼 컴포넌트
const PersonalInfoForm = ({ userId, onPasswordChange, onWithdraw }) => {
    // ️ 비밀번호 입력 값을 관리할 state 추가
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    //  비밀번호 입력 필드 변경 핸들러
    const handlePasswordChangeInput = (e) => { // 함수 이름 변경 (handleChange 중복 방지)
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // ️ 비밀번호 변경 폼 제출 핸들러
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // 새 비밀번호 확인
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            alert('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
            return;
        }
        // 부모 컴포넌트의 비밀번호 변경 함수 호출
        onPasswordChange(passwordData.currentPassword, passwordData.newPassword);
        // 성공 여부와 관계없이 입력 필드 초기화 (선택적)
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    // ️ 탈퇴하기 클릭 핸들러
    const handleWithdrawClick = (e) => {
        e.preventDefault(); // 기본 링크 동작 방지
        // 사용자에게 재확인
        if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            onWithdraw(); // 부모 컴포넌트의 탈퇴 함수 호출
        }
    };

    return (
        // ️ form 태그에 onSubmit 연결
        <form className="mypage-form" onSubmit={handlePasswordSubmit}>
            <div className="form-item">
                <label>아이디</label>
                {/* ️ props로 받은 userId 표시 */}
                <span className="id-text">{userId || '아이디 정보 없음'}</span>
            </div>
            <div className="form-item">
                <label>비밀번호 확인</label>
                {/* ️ name, value, onChange 추가 */}
                <input
                    type="password"
                    name="currentPassword"
                    className="input-field"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChangeInput} // 핸들러 이름 변경됨
                    required // 필수 입력 필드
                />
            </div>
            <div className="form-item">
                <label>새 비밀번호</label>
                <input
                    type="password"
                    name="newPassword"
                    className="input-field"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChangeInput}
                    required
                />
            </div>
            <div className="form-item">
                <label>새 비밀번호 확인</label>
                <input
                    type="password"
                    name="confirmNewPassword"
                    className="input-field"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChangeInput}
                    required
                />
            </div>
            <div className="form-button-container">
                <button type="submit" className="form-submit-button">변경</button>
            </div>
            <div className="withdraw-link-container">
                {/* ️ a 태그 대신 button 사용 및 onClick 연결 */}
                <button type="button" onClick={handleWithdrawClick} className="withdraw-link">탈퇴하기</button>
            </div>
        </form>
    );
};

// 메인 마이페이지 컴포넌트
const PageMypage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bodyInfo');
    // ️ 사용자 정보(닉네임, 이메일 등) state 추가
    const [userData, setUserData] = useState({ userId: '' });
    // ️ 신체 정보 state 추가
    const [userInfo, setUserInfo] = useState(null); // 초기값은 null

    // ️ 백엔드에서 사용자 정보 및 신체 정보 가져오기
    useEffect(() => {
        // 임시로 localStorage에서 닉네임 가져오기 (실제로는 로그인 시 저장된 정보 사용)
        const storedUserId = localStorage.getItem('userId');

        if (!storedUserId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        setUserData({ userId: storedUserId });

        const fetchUserInfo = async () => {
            try {
                // 백엔드 API 호출 (세션 쿠키가 자동으로 전송됨)
                const response = await axios.get('http://localhost:18090/api/mypage/userinfo', {
                    withCredentials: true // 쿠키를 함께 보내도록 설정
                });
                console.log("Fetched user info:", response.data); // 디버깅 로그
                setUserInfo(response.data); // 받아온 데이터로 state 업데이트
            } catch (error) {
                console.error("신체 정보를 불러오는 중 오류 발생:", error);
                if (error.response && error.response.status === 401) {
                    alert("세션이 만료되었거나 로그인이 필요합니다. 다시 로그인해주세요.");
                    localStorage.clear(); //  잘못된 티켓 정보 삭제
                    navigate('/login');
                }
                // 에러 발생 시 초기 폼을 보여주기 위해 빈 객체 설정 (선택적)
                setUserInfo({});
            }
        };
        fetchUserInfo();
    }, [navigate]); // [] : 처음 한 번만 실행

    //  신체 정보 저장 함수
    const handleSaveUserInfo = async (dataToSave) => {
        try {
            console.log("Sending data to save:", dataToSave); // 디버깅 로그
            // 백엔드 API 호출 (세션 쿠키가 자동으로 전송됨)
            const response = await axios.put('http://localhost:18090/api/mypage/userinfo', dataToSave, {
                withCredentials: true // 쿠키를 함께 보내도록 설정
            });
            console.log("Save response:", response.data); // 디버깅 로그
            if (response.data.success) {
                alert(response.data.message);
                // 저장 성공 후 다시 데이터를 불러오거나, 로컬 state를 직접 업데이트
                setUserInfo(dataToSave);
            } else {
                alert(response.data.message || '저장에 실패했습니다.');
            }
        } catch (error) {
            console.error("신체 정보 저장 중 오류 발생:", error);
            if (error.response && error.response.status === 401) {
                alert("로그인이 필요합니다.");
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        }
    };

    //   비밀번호 변경 함수 추가 (API 호출)
    const handlePasswordChange = async (currentPassword, newPassword) => {
        try {
            // ️ API 경로는 백엔드에 만들 경로로 수정해야 합니다. (예: /api/mypage/password)
            const response = await axios.put('http://localhost:18090/api/mypage/password',
                { currentPassword, newPassword }, // 요청 본문
                { withCredentials: true }
            );
            if (response.data.success) {
                alert(response.data.message || '비밀번호가 변경되었습니다.');
            } else {
                alert(response.data.message || '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error("비밀번호 변경 중 오류 발생:", error);
            if (error.response && error.response.status === 401) {
                alert("로그인이 필요합니다.");
                navigate('/login');
            } else if (error.response && error.response.data && error.response.data.message) {
                alert(`오류: ${error.response.data.message}`); // 백엔드 에러 메시지 표시
            } else {
                alert('비밀번호 변경 중 오류가 발생했습니다.');
            }
        }
    };

    // ️ 2. 회원 탈퇴 함수 추가 (API 호출)
    const handleWithdraw = async () => {
        try {
            // ️ API 경로는 백엔드에 만들 경로로 수정해야 합니다. (예: /api/mypage/account)
            const response = await axios.delete('http://localhost:18090/api/mypage/account', {
                withCredentials: true
            });
            if (response.data.success) {
                alert(response.data.message || '회원 탈퇴가 완료되었습니다.');
                localStorage.clear(); // ️ 로컬 스토리지 비우기
                navigate('/login'); // ️ 로그인 페이지로 이동
            } else {
                alert(response.data.message || '회원 탈퇴에 실패했습니다.');
            }
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생:", error);
            if (error.response && error.response.status === 401) {
                alert("로그인이 필요합니다.");
                navigate('/login');
            } else {
                alert('회원 탈퇴 중 오류가 발생했습니다.');
            }
        }
    };

    //  calculateBMR 함수를 Mifflin-St Jeor 함수 호출로 변경
    const calculatedBMR = userInfo ? calculateMifflinStJeorBMR(
        userInfo.userGender,
        userInfo.userWeight,
        userInfo.userHeight
        // 나이는 기본값 30 사용
    ) : '-'; // userInfo가 로드되지 않았으면 'XXX' 표시

    const tabItems = [
        {
            key: 'bodyInfo',
            label: '신체 정보 수정',
            // ️ BodyInfoForm에 props 전달
            children: <BodyInfoForm initialData={userInfo} onSave={handleSaveUserInfo} />,
        },
        {
            key: 'personalInfo',
            label: '개인 정보 수정',
            // ️  PersonalInfoForm에 필요한 props 전달
            children: <PersonalInfoForm
                userId={userData.userId} // 아이디 전달
                onPasswordChange={handlePasswordChange} // 비밀번호 변경 함수 전달
                onWithdraw={handleWithdraw} // 회원 탈퇴 함수 전달
            />,
        },
    ];

    return (
        <div className="mypage-page-container">
            <div className="mypage-card">
                {/* 상단 프로필 영역 */}
                <div className="profile-header">
                    <div className="profile-avatar"><UserOutlined /></div>
                    <div className="profile-text">
                        <h2>안녕하세요! {userData.userId} 님</h2>
                        <p>현재 기초대사량은 {calculatedBMR} Kcal 입니다.</p>
                    </div>
                </div>

                {/* 탭 메뉴 영역 */}
                <div className="tab-nav">
                    <button className={`tab-button ${activeTab === 'bodyInfo' ? 'active' : ''}`} onClick={() => setActiveTab('bodyInfo')}>신체 정보 수정</button>
                    <button className={`tab-button ${activeTab === 'personalInfo' ? 'active' : ''}`} onClick={() => setActiveTab('personalInfo')}>개인 정보 수정</button>
                </div>

                {/* 탭 내용 영역 */}
                <div>
                    {/* ⭐️ 로딩 상태 표시 (선택적) */}
                    {userInfo === null ? (
                        <div style={{ padding: '32px', textAlign: 'center' }}>로딩 중...</div>
                    ) : (
                        activeTab === 'bodyInfo' ? tabItems[0].children : tabItems[1].children
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageMypage;