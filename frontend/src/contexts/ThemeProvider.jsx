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
            colorPrimary: '#0B57D0', // Google Blue
            borderRadius: 16, // Rounded corners (Blossom style)
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: 14,
            colorBgLayout: isDarkMode ? '#000000' : '#f0f4f9', // Black vs Light Blue-Gray
            colorBgContainer: isDarkMode ? '#1F1F1F' : '#ffffff', // Dark Gray vs White
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
            Layout: {
                headerBg: isDarkMode ? '#1F1F1F' : '#ffffff',
                siderBg: isDarkMode ? '#1F1F1F' : '#ffffff',
                bodyBg: isDarkMode ? '#000000' : '#f0f4f9',
            },
            Card: {
                borderRadiusLG: 16,
                colorBgContainer: isDarkMode ? '#1F1F1F' : '#ffffff',
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
