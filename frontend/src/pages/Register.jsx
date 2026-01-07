import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Space, message, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const { Text } = Typography;

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
        <AuthLayout title="Create Account">
            <Form
                name="register"
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
                size="large"
                className="glass-form"
            >
                <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[
                        { required: true, message: 'Please enter your name' },
                        { min: 2, message: 'Name must be at least 2 characters' }
                    ]}
                >
                    <Input
                        variant="borderless"
                        suffix={<UserOutlined />}
                        placeholder=""
                        disabled={loading}
                    />
                </Form.Item>

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
                    rules={[
                        { required: true, message: 'Please enter a password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password
                        variant="borderless"
                        suffix={<LockOutlined />}
                        placeholder=""
                        disabled={loading}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password
                        variant="borderless"
                        suffix={<LockOutlined />}
                        placeholder=""
                        disabled={loading}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} className="login-btn">
                        {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text type="secondary" style={{ color: '#555' }}>
                        Already have an account? <Link to="/login" style={{ color: '#333', fontWeight: 600 }}>Login</Link>
                    </Text>
                </div>
            </Form>
        </AuthLayout>
    );
}

export default Register;
