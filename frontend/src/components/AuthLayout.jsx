import React from 'react';
import { Layout } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages/Auth.css';
import bgNature from '../assets/bg-nature.png';

const { Content } = Layout;

const AuthLayout = ({ children, title }) => {
    return (
        <Layout style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Background Image Layer */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    /* Single, clean background declaration using the local asset */
                    background: `#0f172a url(${bgNature}) center/cover no-repeat`,
                    zIndex: 0,
                }}
            />

            {/* Reused Header */}
            <Header />

            {/* Centered Content Area */}
            <Content
                style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '24px',
                    flex: 1
                }}
            >
                <div className="glass-card">
                    {/* Decorative Close Button */}
                    <div style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer', color: 'rgba(0,0,0,0.5)' }}>
                        ✕
                    </div>

                    <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 32, color: '#111', fontWeight: 600 }}>
                        {title}
                    </h2>

                    {children}
                </div>
            </Content>

            {/* Reused Footer */}
            <Footer />
        </Layout>
    );
};

export default AuthLayout;
