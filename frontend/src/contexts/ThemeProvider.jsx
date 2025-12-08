import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const themeConfig = {
        token: {
            colorPrimary: '#ED4192', // Pink primary color
            borderRadius: 16, // Rounded corners (Blossom style)
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: 14,
            colorBgLayout: isDarkMode ? '#141414' : '#f5f5f5',
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
            Layout: {
                headerBg: isDarkMode ? '#1f1f1f' : '#ffffff',
                siderBg: isDarkMode ? '#1f1f1f' : '#ffffff',
                bodyBg: isDarkMode ? '#141414' : '#f5f5f5',
            },
            Card: {
                borderRadiusLG: 16,
                boxShadowTertiary: isDarkMode
                    ? '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.2)'
                    : '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            },
            Table: {
                borderRadius: 16,
            },
            Button: {
                borderRadius: 8,
                controlHeight: 40,
                controlHeightLG: 48,
            },
            Input: {
                borderRadius: 8,
                controlHeight: 40,
            },
            Select: {
                borderRadius: 8,
                controlHeight: 40,
            },
        },
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ConfigProvider theme={themeConfig}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
