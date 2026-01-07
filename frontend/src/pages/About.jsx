import React from 'react';
import { Layout, Typography, Space, Button, Tag, Divider, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GithubOutlined, LinkedinOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

import Header from '../components/Header';

import Footer from '../components/Footer';

const About = () => {
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
                    className="glass-card-about"
                    style={{
                        maxWidth: 900,
                        margin: '0 auto',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 24,
                        padding: 48,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                >
                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <Title level={1} style={{ color: 'white', marginBottom: 8 }}>Parag Radadiya</Title>
                        <Text style={{ color: '#93c5fd', fontSize: 20, fontWeight: 500 }}>Full-Stack Developer</Text>
                        <div style={{ marginTop: 24 }}>
                            <Space size="large">
                                <Button shape="circle" icon={<LinkedinOutlined />} size="large" href="https://www.linkedin.com/in/parag-radadiya" target="_blank" />
                                <Button shape="circle" icon={<GithubOutlined />} size="large" href="https://github.com" target="_blank" />
                                <Button shape="circle" icon={<MailOutlined />} size="large" href="mailto:parag.180410107091@gmail.com" />
                                <Button shape="circle" icon={<GlobalOutlined />} size="large" href="https://parag-radadiya.vercel.app/en" target="_blank" />
                            </Space>
                        </div>
                    </div>

                    <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                    {/* Bio Section */}
                    <div style={{ marginBottom: 40 }}>
                        <Title level={3} style={{ color: 'white' }}>About Me</Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.8 }}>
                            I am a highly skilled Full-Stack Developer with over 4 years of experience specializing in building scalable web applications and innovative digital experiences.
                            I have successfully completed 25+ projects for over 20 clients worldwide. My expertise lies in both front-end and back-end development,
                            with a deep interest in emerging technologies like Blockchain, Web3, and Generative AI. I am committed to writing clean, efficient, and maintainable code.
                        </Paragraph>
                    </div>

                    <Row gutter={[48, 48]}>
                        <Col xs={24} md={12}>
                            <Title level={4} style={{ color: 'white', marginBottom: 24 }}>Technical Skills</Title>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Blockchain'].map(skill => (
                                    <Tag key={skill} color="blue" style={{ padding: '6px 12px', fontSize: 14 }}>{skill}</Tag>
                                ))}
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <Title level={4} style={{ color: 'white', marginBottom: 24 }}>Experience</Title>
                            <div style={{ color: 'rgba(255,255,255,0.85)' }}>
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong style={{ color: 'white', fontSize: 16 }}>Web Developer</Text>
                                    <div style={{ color: '#93c5fd' }}>MN techgroup • Sep 2023 – March 2025</div>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong style={{ color: 'white', fontSize: 16 }}>Full-Stack Developer</Text>
                                    <div style={{ color: '#93c5fd' }}>RANA DEV • Dec 2023 – May 2024</div>
                                </div>
                                <div>
                                    <Text strong style={{ color: 'white', fontSize: 16 }}>Back-end Developer</Text>
                                    <div style={{ color: '#93c5fd' }}>Matlab Infotech • Jan 2021 – Aug 2023</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default About;
