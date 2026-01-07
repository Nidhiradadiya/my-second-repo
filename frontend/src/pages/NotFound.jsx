import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const { Content } = Layout;
const { Title, Text } = Typography;

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Background Layer */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `#0f172a url('/bg-nature.png') center/cover no-repeat`,
                    zIndex: 0,
                }}
            />

            <Header />

            <Content
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    padding: 24
                }}
            >
                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 24,
                        padding: '64px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                >
                    <Title style={{ color: '#93c5fd', fontSize: 120, margin: 0, lineHeight: 1 }}>404</Title>
                    <Title level={2} style={{ color: 'white', marginTop: 16 }}>Page Not Found</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, display: 'block', marginBottom: 32 }}>
                        The page you're looking for doesn't exist or has been moved.
                    </Text>
                    <Button type="primary" size="large" onClick={() => navigate('/')} style={{ background: '#0F172A', border: 'none', height: 48, padding: '0 32px' }}>
                        Back to Home
                    </Button>
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default NotFound;
