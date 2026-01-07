import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Alert, message, Checkbox, Typography } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authAPI } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const { Text } = Typography;

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);
        try {
            await authAPI.login(values);
            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            let errorMessage = 'Login failed. Please try again.';
            if (error.message === 'Network Error') {
                errorMessage = 'Cannot connect to server. Please check your connection.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Login">
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                    style={{ marginBottom: 24, background: 'rgba(255,0,0,0.1)', border: 'none' }}
                />
            )}

            <Form
                name="login"
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
                size="large"
                className="glass-form"
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                    ]}
                >
                    <Input
                        variant="borderless"
                        suffix={<MailOutlined />}
                        placeholder=""
                        disabled={loading}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password
                        variant="borderless"
                        suffix={<LockOutlined />}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        placeholder=""
                        disabled={loading}
                    />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Checkbox style={{ color: '#333' }}>Remember me</Checkbox>
                    <Link to="/forgot-password" style={{ color: '#333', fontWeight: 500 }}>
                        Forgot Password?
                    </Link>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} className="login-btn">
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text type="secondary" style={{ color: '#555' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#333', fontWeight: 600 }}>Register</Link>
                    </Text>
                </div>
            </Form>
        </AuthLayout>
    );
}

export default Login;
