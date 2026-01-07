import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const { Text } = Typography;

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await authAPI.resetPassword(token, values.password);
            message.success('Password reset successful!');
            navigate('/login');
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to reset password. The link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Set New Password">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 16 }}>Your new password must be different to previously used passwords.</Text>
            </div>

            <Form
                name="reset_password"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                className="glass-form"
            >
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please input your new password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input.Password
                        variant="borderless"
                        suffix={<LockOutlined />}
                        placeholder="New Password"
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        variant="borderless"
                        suffix={<LockOutlined />}
                        placeholder="Confirm Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} className="login-btn">
                        Reset Password
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

export default ResetPassword;
