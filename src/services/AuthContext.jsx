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
            // Check if Telegram WebApp is available
            if (!window.Telegram?.WebApp) {
                console.warn('This app is not opened in Telegram, using default JWT');
                setLogin({
                    username: null,
                    user_id: '1051176747',
                    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTA1MTE3Njc0NyIsImV4cCI6MTc1OTY2MjE1MX0.Akqn-ml70ZkIBY8MM625ltMPWnApAzlp7A_XAvg5tZQ',
                });
                return;
            }

            // Initialize Telegram WebApp
            const webApp = window.Telegram.WebApp;
            try {
                webApp.ready();
            } catch (error) {
                console.warn('Failed to initialize Telegram WebApp, using default JWT:', error);
                setLogin({
                    username: null,
                    user_id: '1051176747',
                    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTA1MTE3Njc0NyIsImV4cCI6MTc1OTY2MjE1MX0.Akqn-ml70ZkIBY8MM625ltMPWnApAzlp7A_XAvg5tZQ',
                });
                return;
            }

            // Check for initData
            const initData = webApp.initData;
            if (!initData) {
                console.warn('initData is not available, using default JWT');
                setLogin({
                    username: null,
                    user_id: '1051176747',
                    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTA1MTE3Njc0NyIsImV4cCI6MTc1OTY2MjE1MX0.Akqn-ml70ZkIBY8MM625ltMPWnApAzlp7A_XAvg5tZQ',
                });
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
                console.error('Authentication error, using default JWT:', error);
                setLogin({
                    username: null,
                    user_id: '1051176747',
                    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTA1MTE3Njc0NyIsImV4cCI6MTc1OTY2MjE1MX0.Akqn-ml70ZkIBY8MM625ltMPWnApAzlp7A_XAvg5tZQ',
                });
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