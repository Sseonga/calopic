import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:18090",
    withCredentials: true,              //  세션 쿠키 전송 허용
    timeout:10000,                      //  요청 제한 10초
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const msg =
            error?.response?.data?.message ||
            (error.code === "ECONNABORTED" ? "요청 시간이 초과되었습니다." : "") || 
            error?.message || 
            "서버와 통신 중 오류가 발생했습니다.";
        
        error.userMessage = msg;
        return Promise.reject(error);
    }
);

export const postLogin = (body) => api.post("/auth/login", body);
export const postLogout = () => api.post("/auth/logout");
export const checkDuplicateId = (userId) => api.get("/auth/check-id", { params: { userId }});
export const postJoin = (body) => api.post("/auth/join", body).then(r => r.data);