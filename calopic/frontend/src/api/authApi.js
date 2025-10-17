import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:18090",
    withCredentials: true,              //  세션 쿠키 전송 허용
    timeout:10000,                      //  요청 제한 10초
});

export const postLogin = (formData) => api.post("/auth/login", formData);
export const postLogout = () => api.post("/auth/logout");