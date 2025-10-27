import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postChangePassword, postResetPassword, postVerifyQA } from "../../api/authApi";
import "./PagePasswordReset.css";

const PagePasswordReset = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState("verify");
    const [formData, setFormData] = useState({
        userId: "",
        question: "",
        answer: "",
        newPwd:"",
        newPwdConfirm:""
    });
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [okMsg, setOkMsg] = useState("");
    const [showModal, setShowModal] = useState(false);


    const canVerify = useMemo(() => {
        return (
            formData.userId.trim() && 
            formData.question.trim() && 
            formData.answer.trim() && 
            !submitting
        );}, 
        [formData, submitting]
    );

    const pwdValid = useMemo(() =>
        formData.newPwd.length >= 8 && formData.newPwd.length <= 24,
        [formData.newPwd]
    );

    const pwdMatched = useMemo(() =>
        formData.newPwd && formData.newPwd === formData.newPwdConfirm,
        [formData.newPwd,formData.newPwdConfirm]
    );

    const canChange = useMemo(() =>
        phase === "set" && pwdValid && pwdMatched && !submitting,
        [phase, pwdValid, pwdMatched, submitting]
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, 
            [name]: value 
        }));

        if (errorMsg) setErrorMsg("");
        if (okMsg) setOkMsg("");
    };

    const handleVerify = async(e) => {
        e.preventDefault();
        if (!canVerify) return;

        try {
            setSubmitting(true);

            const { data } = await postVerifyQA({
                userId: formData.userId.trim(),
                question: formData.question,
                answer: formData.answer.trim(),
            });

            const success = data?.success ?? data?.result ?? false;
            const message =
                data?.message ?? 
                (success ? "본인 확인이 완료되었습니다." : "정보가 일치하지 않습니다.");

            if (success) {
                setOkMsg(message);
                setPhase("set")
            } else {
                setErrorMsg(message);
            }
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.message || 
                error?.message || 
                "검증 중 오류가 발생했습니다."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePassword = async(e) => {
        e.preventDefault();
        if(!canChange) return;
        try{
            setSubmitting(true);
            const { data } = await postChangePassword({
                userId: formData.userId.trim(),
                newPwd: formData.newPwd,
            });
            const success = data?.success ?? data?.result ?? false;
            const message = 
                data?.message ??
                (success ? "비밀번호가 변경되었습니다." : "비밀번호 변경에 실패했습니다.");
            if(success) {
                setOkMsg(message);
                setShowModal(true);
            } else setErrorMsg(message);
        } catch(error) {
            setErrorMsg(
                error?.response?.data?.message ||
                error?.message ||
                "변경 중 오류가 발생했습니다."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate("/login");
    }

    const questionOptions = [
        { value: "QUESTION01", label:"가장 좋아하는 색상은?"},
        { value: "QUESTION02", label:"가장 좋아하는 음식은?"},
        { value: "QUESTION03", label:"즐겨하는 취미생활은?"},
        { value: "QUESTION04", label:"탄단지 중 가장 중요하게 생각하는 것은?"},
        { value: "QUESTION05", label:"가장 존경하는 인물은?"},
    ];

    return (
        <div className="pwdreset-container">
            <div className="pwdreset-card">
                <h1 className="pwdreset-title">비밀번호 변경</h1>

                <form className="pwdreset-form">
                    <label className="pwdreset-label" htmlFor="userId">ID</label>
                    <input
                        id="userId"
                        name="userId"
                        type="text"
                        className="pwdreset-input-field"
                        placeholder="아이디를 입력하세요."
                        value={formData.userId}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                        disabled={phase === "set"}
                    />

                    <div className="pwdreset-help" htmlFor="question">비밀번호 찾기 보안질문</div>
                    <select
                        id="question"
                        name="question"
                        className="pwdreset-select"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        disabled={phase === "set"}
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
                        className="pwdreset-input-field"
                        placeholder="답변을 입력해주세요."
                        value={formData.answer}
                        onChange={handleChange}
                        required
                    />

                    {phase === "verify" && (
                        <button
                            type="button"
                            className={`pwdreset-submit ${canVerify ? "active" : ""}`}
                            disabled={!canVerify}
                            onClick={handleVerify}
                        >
                            {submitting ? "확인 중..." : "비밀번호 초기화"}
                        </button>
                    )}

                    {phase === "set" && (
                        <>
                            <input
                                type="password"
                                id="nwePwd"
                                name="newPwd"
                                className="pwdreset-input-field"
                                placeholder="새 비밀번호 (8~24자)"
                                value={formData.newPwd}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />

                            <input
                                type="password"
                                id="nwePwdConfirm"
                                name="newPwdConfirm"
                                className="pwdreset-input-field"
                                placeholder="새 비밀번호 확인"
                                value={formData.newPwdConfirm}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        
                            {!pwdValid && formData.newPwd && (
                                <p className="pwdreset-msg error">비밀번호는 8자 이상 24자 이하로 입력해 주세요.</p>
                            )}
                            
                            {formData.newPwdConfirm && !pwdMatched && (
                                <p className="pwdreset-msg error">비밀번호가 일치하지 않습니다.</p>
                            )}

                            <button
                                type="button"
                                className={`pwdreset-submit ${canChange ? "active" : ""}`}
                                disabled={!canChange}
                                onClick={handleChangePassword}
                            >
                                {submitting ? "변경 중..." : "비밀번호 변경"}
                            </button>
                        </>
                    )}

                    {errorMsg && <p className="pwreset-msg error">{errorMsg}</p>}
                    {okMsg && <p className="pwreset-msg ok">{okMsg}</p>}
                </form>

                <div className="pwdreset-links">
                    <Link to="/login">로그인</Link>
                    <span className="dot">·</span>
                    <Link to="/join">회원가입</Link>
                </div>
            </div>

            {showModal && (
                <div className="pwdreset-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="pwdreset-modal">
                        <h2>비밀번호 변경 완료</h2>
                        <p>새 비밀번호로 로그인해 주세요.</p>
                        <button className="pwdreset-modal-btn" onClick={closeModal}>
                            로그인으로 이동
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagePasswordReset;
