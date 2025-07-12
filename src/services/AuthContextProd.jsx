import React, { createContext, useContext, useState, useEffect } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [login, setLogin] = useState({
        username: null,
        user_id: null,
        jwt: null,
    });

    useEffect(() => {
        const authenticate = async () => {
            if (!window.Telegram?.WebApp) {
                console.error('This app must be opened in Telegram');
                return;
            }

            const webApp = window.Telegram.WebApp;
            webApp.ready();

            const initData = webApp.initData;
            if (!initData) {
                console.error('initData is not available');
                return;
            }

            try {
                const response = await fetch('https://213.176.65.159.nip.io/auth/telegram', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ init_data: initData }),
                });

                if (!response.ok) {
                    throw new Error('Failed to authenticate');
                }

                const data = await response.json();
                const tgUser = data.user;
                setLogin({
                    username: tgUser?.username || null,
                    user_id: tgUser?.id || null,
                    jwt: data.token,
                });
            } catch (error) {
                console.error('Authentication error:', error);
            }
        };

        authenticate();
    }, []);

    const setJwt = (jwt) => {
        setLogin((prev) => ({ ...prev, jwt }));
    };

    return (
        <LoginContext.Provider value={{ login, setJwt }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};
