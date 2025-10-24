import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkDuplicateId, postJoin } from "../../api/authApi";
import './PageJoin.css';

const PageJoin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId:"",
        userPwd:"",
        userPwdConfirm:"",
        question:"",
        answer:"",
    });

    const [dupMsg, setDupMsg] = useState("");                 //  중복 확인 메세지
    const [dupStatus, setDupStatus] = useState("");           //  중복 확인 상태
    const [errorMsg, setErrorMsg] = useState("");             //  제출 에러
    const [submitting, setSubmitting] = useState(false);      //  제출 로딩
    const [checking, setChecking] = useState(false);          //  중복 확인 로딩

    const pwdMatched = useMemo(() => {
        return (
            formData.userPwd.trim().length > 0 && 
            formData.userPwd === formData.userPwdConfirm
        );},
        [formData.userPwd, formData.userPwdConfirm]
    );
    
    const canSubmit = useMemo(() => {
        const okId = dupStatus === "success";
        const okPwd = formData.userPwd.length >= 8 && formData.userPwd.length <= 24 && pwdMatched;
        const okQa = formData.question && formData.answer.trim().length > 0;
        
        return okId && okPwd && okQa && !submitting;
        },
        [dupStatus, formData, pwdMatched, submitting]
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if(name === "userId" && dupMsg) {
            setDupMsg("");       //  입력 바뀌면 중복 메시지 초기화
            setDupStatus("");
        }

        if(errorMsg) setErrorMsg("");
    };

    const handleCheckDuplicate = async() => {
        const userId = formData.userId.trim();

        if(!userId) {
            setDupMsg("아이디를 입력하세요.")
            setDupStatus("error");
            return;
        }

        const valid = /^[^\s]{4,16}$/.test(userId);
        
        if(!valid) {
            setDupMsg("아이디는 4~16자만 가능합니다.(공백 제외)")
            setDupStatus("error")
            return;
        }

        try {
            setChecking(true);
            const { data } = await checkDuplicateId(userId)
            const available = 
                data?.available ?? 
                (data?.success === true && data?.available !== false) ?? 
                (data?.result === true && data?.available !== false);

            if(available) {
                setDupMsg(data?.message || "사용 가능한 아이디입니다 :)");
                setDupStatus("success");
            } else {
                setDupMsg(data?.message || "이미 사용 중인 아이디입니다.");
                setDupStatus("error");
            }            
        } catch(error) {
            setDupMsg(error.userMessage || "중복 확인 중 오류가 발생했습니다.");
            setDupStatus("error");
        } finally {
            setChecking(false);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!canSubmit) return;

        try {
            setSubmitting(true);
            
            const payload = {
                userId: formData.userId.trim(),
                userPwd: formData.userPwd,
                question: formData.question,
                answer: formData.answer.trim(),
            };

            const { data } = await postJoin(payload);
            const success = data?.success ?? data?.result ?? false;

            if(success) {
                navigate("/login", { replace: true });
            } else {
                setErrorMsg(data?.message || "회원가입에 실패했습니다.");
            }
        } catch(error) {
            setErrorMsg(error.userMessage || "회원가입 처리 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    const questionOptions = [
        { value: "COLOR", label: "가장 좋아하는 색상은?"},
        { value: "FOOD", label: "가장 좋아하는 음식은?"},
        { value: "HOBBY", label: "즐겨하는 취미생활은?"},
        { value: "NUTRITION", label: "탄단지 중 가장 중요하게 생각하는 것은?"},
        { value: "RESPECT", label: "가장 존경하는 인물은?"},
    ];

    return(
        <div className="join-container">
            <div className="join-card">
                <h1 className="join-title">회원가입</h1>

                <form onSubmit={handleSubmit} className="join-form">
                    <div className="join-input-row">
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            placeholder="아이디를 입력하세요."
                            className="join-input-field"
                            value={formData.userId}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                        <button
                            type="button"
                            className="join-check-btn"
                            onClick={handleCheckDuplicate}
                            disabled={checking}
                        >
                            {checking ? "확인중..." : "중복확인"}
                        </button>
                    </div>
                    {dupMsg && (
                        <p className={`hint ${dupStatus === "success" ? "ok" : "bad"}`}>
                            {dupMsg}
                        </p>
                    )}

                    <input
                        type="password"
                        id="userPwd"
                        name="userPwd"
                        placeholder="비밀번호를 입력하세요."
                        className="join-input-field"
                        value={formData.userPwd}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />

                    <input
                        type="password"
                        id="userPwdConfirm"
                        name="userPwdConfirm"
                        placeholder="비밀번호를 다시 입력하세요."
                        className="join-input-field"
                        value={formData.userPwdConfirm}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                    {!pwdMatched && formData.userPwdConfirm && (
                        <p className="hint bad">비밀번호가 일치하지 않습니다</p>
                    )}

                    <label className="join-input-label" htmlFor="question">비밀번호 찾기 보안 질문</label>
                    
                    <select
                        id="question"
                        name="question"
                        className="join-select"
                        onChange={handleChange}
                        value={formData.question}
                        required
                    >
                        <option value="">질문을 선택해주세요.</option>
                        {questionOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        id="answer"
                        name="answer"
                        placeholder="답변을 입력하세요."
                        className="join-input-field"
                        value={formData.answer}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="join-btn"
                        disabled={!canSubmit || submitting}
                    >
                        {submitting ? "가입 중..." : "회원가입"}
                    </button>
                    {errorMsg && <p className="hint bad center">{errorMsg}</p>}
                </form>

                <div className="join-helper-row">
                    <span className="join-muted">이미 계정이 있으신가요?</span>
                    <Link to="/login" className="link strong">로그인</Link>
                </div>
            </div>
        </div>
    );
};

export default PageJoin;