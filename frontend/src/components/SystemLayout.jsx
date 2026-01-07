import React from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

const SystemLayout = ({ children }) => {
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

            {/* Reused Header (Smart) */}
            <Header />

            {/* Content Area with Glass Effect */}
            <Content
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflowY: 'auto',
                    height: 'calc(100vh - 80px - 100px)' // Approx height minus header/footer
                }}
            >
                <div
                    className="glass-system-container"
                    style={{
                        background: 'rgba(255, 255, 255, 0.65)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 24,
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                        minHeight: '100%',
                        width: '100%',
                        maxWidth: 1600,
                        margin: '0 auto'
                    }}
                >
                    {children}
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default SystemLayout;
