import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import './Auth.css';

const { Title, Text } = Typography;

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        console.log('Form submitted with:', values);
        setLoading(true);
        setError(null);

        try {
            console.log('Attempting login...');
            const response = await authAPI.login(values);
            console.log('Login response:', response);
            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            console.log('Login error caught:', error);
            console.log('Error response:', error.response);
            console.log('Error message:', error.message);

            let errorMessage = 'Login failed. Please try again.';

            if (error.message === 'Network Error') {
                errorMessage = 'Cannot connect to server. Please check your connection.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMessage = 'User not found';
            }

            console.log('Setting error message:', errorMessage);
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card" variant="outlined">
                <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                    <div>
                        <Title level={2}>Welcome Back</Title>
                        <Text type="secondary">Sign in to your billing account</Text>
                    </div>

                    {error && (
                        <Alert
                            message="Error"
                            description={error}
                            type="error"
                            closable
                            onClose={() => setError(null)}
                            showIcon
                            style={{ textAlign: 'left' }}
                        />
                    )}

                    <Form
                        name="login"
                        onFinish={handleSubmit}
                        layout="vertical"
                        requiredMark={false}
                        size="large"
                    >
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
                                { required: true, message: 'Please enter your password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Space separator="·">
                        <Link to="/forgot-password">Forgot Password?</Link>
                        <Link to="/register">Create Account</Link>
                    </Space>
                </Space>
            </Card>
        </div>
    );
}

export default Login;
