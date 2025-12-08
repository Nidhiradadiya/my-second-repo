import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import './Auth.css';

const { Title, Text } = Typography;

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        if (values.password !== values.confirmPassword) {
            message.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authAPI.register({
                name: values.name,
                email: values.email,
                password: values.password,
            });
            message.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            let errorMessage = 'Registration failed. Please try again.';

            if (error.message === 'Network Error') {
                errorMessage = 'Cannot connect to server. Please check your connection.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card" bordered={false}>
                <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                    <div>
                        <Title level={2}>Create Account</Title>
                        <Text type="secondary">Get started with your billing system</Text>
                    </div>

                    <Form
                        name="register"
                        onFinish={handleSubmit}
                        layout="vertical"
                        requiredMark={false}
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            rules={[
                                { required: true, message: 'Please enter your name' },
                                { min: 2, message: 'Name must be at least 2 characters' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Full name"
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email address"
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter a password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password (min 6 characters)"
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm password"
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Space>
                        <Text type="secondary">Already have an account?</Text>
                        <Link to="/login">Sign In</Link>
                    </Space>
                </Space>
            </Card>
        </div>
    );
}

export default Register;
