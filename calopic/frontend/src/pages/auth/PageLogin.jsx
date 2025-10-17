import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { postLogin } from "../../api/authApi";
import "./PageLogin.css";

const PageLogin = () =>{
    //  
    const navigate = useNavigate();
    
    //  전역 상태 제어
    const { setUser } = useAuth();
    //  로그인 입력 정보 상태로 관리(아이디, 비밀번호)
    const [formData, setFormData] = useState({
        userId:'',
        userPassword:'',
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if(errorMsg) setErrorMsg("");
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if(loading) return;
        
        try{
            setLoading(true);

            const payload = new FormData();
            payload.append("userId", formData.userEmail);
            payload.append("userPassword", formData.userPassword);

            const response = await postLogin(payload);

            if(response.data.success) {
                const loginUser = response.data.user;
                setUser(loginUser);
                alert("로그인 성공");
                navigate("/");
            } else {
                setErrorMsg(response.data.message || "로그인 실패");
            }
        } catch(error) {
            console.error("로그인 오류:", error);
            setErrorMsg(
                error?.response?.data?.message || error?.message || "서버와의 통신 중 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="login-container">
            <div className="login-card">
                <div className="logo-box">
                    <img 
                        src="/images/Calopic-logo2.png" 
                        alt="calopic 로고" 
                        className="logo-img"
                        draggable="false"
                        onError={(e) => (e.currentTarget.style.display="none")}
                    />
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="input-label" htmlFor="text">아이디</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        placeholder="아이디를 입력하세요."
                        className="input-field"
                        value={formData.userId}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />

                    <label className="input-label" htmlFor="password">비밀번호</label>
                    <input 
                        type="password"
                        id="userPassword"
                        name="userPassword"
                        placeholder="비밀번호를 입력하세요."
                        className="input-field"
                        value={formData.userPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    <button 
                        type="submit" 
                        className="login-btn" 
                        disabled={loading}
                    >
                    {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="helper-row">
                    <span className="muted">비밀번호를 잊으셨나요?</span>
                    <Link to="/findPassword" className="link">비밀번호 찾기</Link>
                </div>
                <div className="helper-row">
                    <span className="muted">아직 계정이 없으신가요?</span>
                    <Link to="/signIn" className="link strong">회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default PageLogin;