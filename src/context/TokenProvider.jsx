import React, { createContext, useState, useContext, useEffect } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const mitoken = localStorage.getItem("mi_token_gestor_apps");
        return mitoken ? JSON.parse(mitoken) : null;
    });

    const saveToken = (objtoken) => {

        setToken(objtoken);

        if (objtoken)
            localStorage.setItem("mi_token_gestor_apps", JSON.stringify(objtoken));
        else
            localStorage.removeItem("mi_token_gestor_apps");
    }

    return (
        <TokenContext.Provider value={{ token, saveToken }}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => {
    return useContext(TokenContext);
};