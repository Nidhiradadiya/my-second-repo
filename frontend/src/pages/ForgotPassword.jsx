import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const { Text } = Typography;

function ForgotPassword() {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await authAPI.forgotPassword(values.email);
            message.success(response.message || 'If that email exists, a reset link has been sent.');
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password?">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 16 }}>No worries, we'll send you reset instructions.</Text>
            </div>

            <Form
                name="forgot_password"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                className="glass-form"
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input
                        variant="borderless"
                        suffix={<MailOutlined />}
                        placeholder="Enter your email"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} className="login-btn">
                        Send Reset Link
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#333', fontWeight: 500 }}>
                        <ArrowLeftOutlined /> Back to Login
                    </Link>
                </div>
            </Form>
        </AuthLayout>
    );
}

export default ForgotPassword;
