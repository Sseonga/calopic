import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = sessionStorage.getItem("user");
        if(!stored || stored === "undefined") return null;
        try{
            return JSON.parse(stored);
        } catch(error) {
            console.error("사용자 정보 파싱 실패:", error);
            return null;
        }
    });

    const handleSetUser = (data) => {
        setUser(data);
        if(data) {
            sessionStorage.setItem("user", JSON.stringify(data))
        } else {
            sessionStorage.removeItem("user")
        };
    };

    return(
        <AuthContext.Provider value={{user, setUser:handleSetUser}} >
            {children}
        </AuthContext.Provider>
    );
};

// 어디서든 간단히 불러쓰기
export const useAuth = () => useContext(AuthContext);