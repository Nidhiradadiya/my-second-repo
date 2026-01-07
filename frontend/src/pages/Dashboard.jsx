import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import {
    DollarOutlined,
    UserOutlined,
    FileTextOutlined,
    ShoppingOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeProvider';
import { authAPI } from '../services/api';
import { customerAPI, productAPI, billAPI } from '../services/billing';

const { Title, Text } = Typography;

function Dashboard() {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalProducts: 0,
        totalBills: 0,
        totalRevenue: 0,
    });
    const [recentBills, setRecentBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const currentUser = authAPI.getCurrentUser();
            setUser(currentUser);

            const [customersStats, productsStats, billsStats, recentBillsRes] = await Promise.all([
                customerAPI.getStats(),
                productAPI.getStats(),
                billAPI.getStats(),
                billAPI.getAll({ limit: 5 }),
            ]);

            setStats({
                totalCustomers: customersStats.total || 0,
                totalProducts: productsStats.total || 0,
                totalBills: billsStats.totalBills || 0,
                totalRevenue: billsStats.totalRevenue || 0,
            });

            setRecentBills(recentBillsRes.bills || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>Welcome back, {user?.name}! 👋</Title>
                <Text type="secondary">Here's what's happening with your business today.</Text>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card variant="outlined" loading={loading}>
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalRevenue}
                            precision={2}
                            styles={{ value: { color: '#0B57D0' } }}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card variant="outlined" loading={loading}>
                        <Statistic
                            title="Total Bills"
                            value={stats.totalBills}
                            styles={{ value: { color: '#3f8600' } }}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card variant="outlined" loading={loading}>
                        <Statistic
                            title="Total Customers"
                            value={stats.totalCustomers}
                            styles={{ value: { color: '#1890ff' } }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card variant="outlined" loading={loading}>
                        <Statistic
                            title="Total Products"
                            value={stats.totalProducts}
                            styles={{ value: { color: '#cf1322' } }}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Quick Actions" variant="outlined" style={{ marginTop: 24 }}>
                <Space wrap size="middle">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => navigate('/bills/new')}
                    >
                        Create Bill
                    </Button>
                    <Button icon={<UserOutlined />} size="large" onClick={() => navigate('/customers')}>
                        Manage Customers
                    </Button>
                    <Button icon={<ShoppingOutlined />} size="large" onClick={() => navigate('/products')}>
                        Manage Products
                    </Button>
                    <Button icon={<FileTextOutlined />} size="large" onClick={() => navigate('/bills')}>
                        View Bills
                    </Button>
                    <Button icon={<DollarOutlined />} size="large" onClick={() => navigate('/payments')}>
                        View Payments
                    </Button>
                </Space>
            </Card>

            {recentBills.length > 0 && (
                <Card title="Recent Bills" variant="outlined" style={{ marginTop: 24 }}>
                    <div>
                        {recentBills.map((bill) => (
                            <Card
                                key={bill._id}
                                size="small"
                                hoverable
                                onClick={() => navigate(`/bills/${bill._id}`)}
                                style={{ marginBottom: 12 }}
                            >
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Space direction="vertical" size={0}>
                                            <Text strong>{bill.billNumber}</Text>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {bill.customerName}
                                            </Text>
                                        </Space>
                                    </Col>
                                    <Col>
                                        <Space direction="vertical" size={0} align="end">
                                            <Text strong style={{ color: '#0B57D0' }}>
                                                ₹{bill.total.toFixed(2)}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {new Date(bill.date).toLocaleDateString()}
                                            </Text>
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default Dashboard;
