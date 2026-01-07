import React from 'react';
import { Layout, Typography, Space, Button, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CodeOutlined, ShoppingOutlined, DatabaseOutlined, MobileOutlined, RocketOutlined, ApiOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

import Header from '../components/Header';

import Footer from '../components/Footer';

const Services = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: 'Custom Web Development',
            icon: <CodeOutlined style={{ fontSize: 32, color: '#93c5fd' }} />,
            description: 'Building responsive, high-performance web applications using React, Next.js, and modern branding.'
        },
        {
            title: 'E-Commerce Solutions',
            icon: <ShoppingOutlined style={{ fontSize: 32, color: '#93c5fd' }} />,
            description: 'Scalable online stores with secure payment gateways, inventory management, and user-friendly interfaces.'
        },
        {
            title: 'Enterprise Software',
            icon: <DatabaseOutlined style={{ fontSize: 32, color: '#93c5fd' }} />,
            description: 'Robust ERP, CRM, and Billing systems (like this demo!) tailored to streamline your business operations.'
        },
        {
            title: 'Mobile App Development',
            icon: <MobileOutlined style={{ fontSize: 32, color: '#93c5fd' }} />,
            description: 'Cross-platform mobile applications for iOS and Android using React Native and Flutter.'
        },
        {
            title: 'API Integration',
            icon: <ApiOutlined style={{ fontSize: 32, color: '#93c5fd' }} />,
            description: 'Seamless integration of third-party APIs (Stripe, PayPal, Google Maps) into your existing systems.'
        },
        {
            title: 'Startup MVP',
            icon: <RocketOutlined style={{ fontSize: 32, color: '#93c5fd' }} />,
            description: 'Rapid prototyping and MVP development to help startups launch their ideas quickly and efficiently.'
        }
    ];

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

            {/* Reusable Responsive Header */}
            <Header />

            <Content
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '40px 24px',
                    overflowY: 'auto',
                    flex: 1
                }}
            >
                <div
                    className="glass-card-services"
                    style={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 24,
                        padding: 48,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>Our Services</Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, maxWidth: 700, margin: '0 auto' }}>
                            We provide comprehensive digital solutions tailored to elevate your business.
                            From concept to deployment, we handle it all.
                        </Paragraph>
                    </div>

                    <Row gutter={[24, 24]}>
                        {services.map((service, index) => (
                            <Col xs={24} md={12} lg={8} key={index}>
                                <Card
                                    className="service-card"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: 16,
                                        height: '100%'
                                    }}
                                    hoverable
                                >
                                    <div style={{ marginBottom: 16 }}>{service.icon}</div>
                                    <Title level={4} style={{ color: 'white', marginBottom: 12 }}>{service.title}</Title>
                                    <Paragraph style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                        {service.description}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default Services;
