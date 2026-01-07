import React from 'react';
import { Layout, Typography, Space, Button, Form, Input, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';
import bgNature from '../assets/bg-nature.png';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

import Header from '../components/Header';
import Footer from '../components/Footer';


const Contact = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        message.success('Message sent successfully! We will get back to you soon.');
        form.resetFields();
    };

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
                    padding: '40px 24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                }}
            >
                <div
                    className="glass-card-contact"
                    style={{
                        width: '100%',
                        maxWidth: 1000,
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 24,
                        padding: 0, // Split padding for row
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        overflow: 'hidden'
                    }}
                >
                    <Row>
                        {/* Contact Info Column */}
                        <Col xs={24} md={10} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Title level={2} style={{ color: 'white', marginBottom: 24 }}>Get in Touch</Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 40 }}>
                                Have a project in mind or want to discuss a new idea? I'd love to hear from you.
                            </Paragraph>

                            <Space direction="vertical" size="large">
                                <Space align="start">
                                    <MailOutlined style={{ fontSize: 20, color: '#93c5fd', marginTop: 4 }} />
                                    <div>
                                        <Text style={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: 12 }}>Email</Text>
                                        <Text style={{ color: 'white', fontSize: 16 }}>parag.180410107091@gmail.com</Text>
                                    </div>
                                </Space>
                                <Space align="start">
                                    <PhoneOutlined style={{ fontSize: 20, color: '#93c5fd', marginTop: 4 }} />
                                    <div>
                                        <Text style={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: 12 }}>Phone</Text>
                                        <Text style={{ color: 'white', fontSize: 16 }}>+91 8347500280</Text>
                                    </div>
                                </Space>
                                <Space align="start">
                                    <EnvironmentOutlined style={{ fontSize: 20, color: '#93c5fd', marginTop: 4 }} />
                                    <div>
                                        <Text style={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: 12 }}>Location</Text>
                                        <Text style={{ color: 'white', fontSize: 16 }}>Remote / Worldwide</Text>
                                    </div>
                                </Space>
                            </Space>
                        </Col>

                        {/* Contact Form Column */}
                        <Col xs={24} md={14} style={{ padding: 48 }}>
                            <Title level={3} style={{ color: 'white', marginBottom: 32 }}>Send a Message</Title>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                className="glass-form"
                            >
                                <Form.Item
                                    name="name"
                                    label={<span style={{ color: 'white' }}>Name</span>}
                                    rules={[{ required: true, message: 'Please input your name!' }]}
                                >
                                    <Input placeholder="Your Name" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px' }} />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label={<span style={{ color: 'white' }}>Email</span>}
                                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email!' }]}
                                >
                                    <Input placeholder="Your Email" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px' }} />
                                </Form.Item>
                                <Form.Item
                                    name="message"
                                    label={<span style={{ color: 'white' }}>Message</span>}
                                    rules={[{ required: true, message: 'Please input your message!' }]}
                                >
                                    <TextArea rows={4} placeholder="Your Message" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px' }} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" icon={<SendOutlined />} size="large" block style={{ background: '#0F172A', border: 'none', height: 48 }}>
                                        Send Message
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer />
        </Layout>
    );
};

export default Contact;
