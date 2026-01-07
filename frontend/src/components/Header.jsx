import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Drawer, Grid, Dropdown, Avatar, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import logo from '../assets/logo.png';

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const screens = useBreakpoint();
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);
    }, [location]); // Re-check on nav change

    // active link logic
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Services', path: '/services' },
        { label: 'Contact', path: '/contact' },
    ];

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'dashboard',
            icon: <UserOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/dashboard'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Company Settings',
            onClick: () => navigate('/settings/company'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <AntHeader
            style={{
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: screens.md ? '0 48px' : '0 24px', // Adjust padding for mobile
                height: 80,
                zIndex: 1000,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                flexShrink: 0,
                width: '100%',
                position: 'relative'
            }}
        >



            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src={logo} alt="PR Logo" style={{ height: '40px' }} />
                <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>PR</span>
            </div>

            {/* Desktop Navigation */}
            {screens.md ? (
                <Space size="middle">
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            type="text"
                            style={{
                                color: isActive(item.path) ? '#93c5fd' : 'white',
                                fontSize: 16,
                                fontWeight: isActive(item.path) ? 'bold' : 'normal'
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </Button>
                    ))}
                    {user ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                            <Button type="text" style={{ color: 'white', fontSize: 16, display: 'flex', alignItems: 'center' }}>
                                <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8, backgroundColor: '#0B57D0' }} />
                                {user.name}
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button
                            ghost
                            style={{ color: 'white', borderColor: 'white', borderRadius: 4, marginLeft: 16 }}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    )}
                </Space>
            ) : (
                /* Mobile Navigation Toggle */
                <Button type="text" icon={<MenuOutlined style={{ color: 'white', fontSize: 24 }} />} onClick={showDrawer} />
            )}

            {/* Mobile Drawer */}
            <Drawer
                title={<span style={{ color: 'white' }}>Menu</span>}
                placement="right"
                onClose={onClose}
                open={visible}
                styles={{
                    header: { background: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.1)' },
                    body: { background: '#0F172A', padding: 0 },
                    content: { background: '#0F172A' }
                }}
                closeIcon={<span style={{ color: 'white' }}>✕</span>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            type="text"
                            style={{
                                color: isActive(item.path) ? '#93c5fd' : 'white',
                                fontSize: 18,
                                textAlign: 'left',
                                marginBottom: 16,
                                paddingLeft: 0,
                                fontWeight: isActive(item.path) ? 'bold' : 'normal'
                            }}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                    {user ? (
                        <>
                            <Button
                                key="dashboard-mobile"
                                type="text"
                                icon={<UserOutlined />}
                                style={{ color: 'white', fontSize: 18, textAlign: 'left', marginBottom: 16, paddingLeft: 0 }}
                                onClick={() => { navigate('/dashboard'); onClose(); }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                key="settings-mobile"
                                type="text"
                                icon={<SettingOutlined />}
                                style={{ color: 'white', fontSize: 18, textAlign: 'left', marginBottom: 16, paddingLeft: 0 }}
                                onClick={() => { navigate('/settings/company'); onClose(); }}
                            >
                                Company Settings
                            </Button>
                            <Button
                                block
                                size="large"
                                danger
                                icon={<LogoutOutlined />}
                                style={{ marginTop: 24 }}
                                onClick={() => {
                                    handleLogout();
                                    onClose();
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button
                            ghost
                            block
                            size="large"
                            style={{ color: 'white', borderColor: 'white', marginTop: 24 }}
                            onClick={() => {
                                navigate('/login');
                                onClose();
                            }}
                        >
                            Login
                        </Button>
                    )}
                </div>
            </Drawer>
        </AntHeader>
    );
};

export default Header;
