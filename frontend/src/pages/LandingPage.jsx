import React from 'react';
import { Layout, Typography, Button, Space, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout; // Header is now custom
const { Title, Text } = Typography;

import Header from '../components/Header';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import bgNature from '../assets/bg-nature.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const {
        token: { colorPrimary },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Background Layer (Matches AuthLayout) */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `#0f172a url(${bgNature}) center/cover no-repeat`,
                    zIndex: 0,
                }}
            />

            {/* Reusable Responsive Header */}
            <Header />

            <Content
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 24px',
                    flex: 1, // Allow content to expand
                }}
            >
                <div style={{ maxWidth: 900, padding: 40 }} className="glass-card-home">
                    <Title level={1} style={{ color: 'white', fontSize: 64, marginBottom: 24, fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        Smart Billing for <br />
                        <span style={{ color: '#93c5fd' }}>Modern Business</span>
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 20, display: 'block', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
                        Streamline your invoicing, manage customers, and track payments with the Parag Radadiya (PR) professional billing solution.
                    </Text>
                    <Space size="large">
                        {authAPI.isAuthenticated() ? (
                            <Button type="primary" size="large" style={{ height: 56, padding: '0 48px', fontSize: 18, background: '#0F172A', border: 'none' }} onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button type="primary" size="large" style={{ height: 56, padding: '0 48px', fontSize: 18, background: '#0F172A', border: 'none' }} onClick={() => navigate('/register')}>
                                    Get Started
                                </Button>
                                <Button size="large" ghost style={{ height: 56, padding: '0 42px', fontSize: 18, color: 'white', borderColor: 'rgba(255,255,255,0.6)' }} onClick={() => navigate('/login')}>
                                    Live Demo
                                </Button>
                            </>
                        )}
                    </Space>
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default LandingPage;
