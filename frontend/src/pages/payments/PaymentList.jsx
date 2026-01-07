import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Space,
    DatePicker,
    Select,
    Typography,
    Card,
    Statistic,
    Popconfirm,
    message,
    Row,
    Col,
} from 'antd';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { paymentAPI } from '../../services/billing';

const { Title } = Typography;
const { RangePicker } = DatePicker;

function PaymentList() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        paymentMode: '',
        dateRange: null,
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.paymentMode) params.paymentMode = filters.paymentMode;
            if (filters.dateRange && filters.dateRange.length === 2) {
                params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
                params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
            }

            const data = await paymentAPI.getAll(params);
            setPayments(data.payments);
        } catch (error) {
            message.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (paymentId) => {
        try {
            await paymentAPI.delete(paymentId);
            message.success('Payment deleted successfully');
            fetchPayments();
        } catch (error) {
            message.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
        },
        {
            title: 'Customer',
            dataIndex: ['customerId', 'name'],
            key: 'customer',
            render: (name, record) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/customers/${record.customerId._id}/ledger`)}
                >
                    {name}
                </Button>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount) => (
                <span style={{ color: '#52c41a', fontWeight: 600 }}>
                    ₹{amount.toFixed(2)}
                </span>
            ),
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Mode',
            dataIndex: 'paymentMode',
            key: 'paymentMode',
            align: 'center',
        },
        {
            title: 'Reference',
            dataIndex: 'referenceNumber',
            key: 'referenceNumber',
            render: (ref) => ref || '-',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title="Delete payment?"
                    description="This will affect customer balance. Continue?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/dashboard')}
                    />
                    <Title level={3} style={{ margin: 0 }}>
                        Payments
                    </Title>
                </Space>
            </div>

            <div style={{ flex: 1 }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card>
                        <Row gutter={16} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="All Payment Modes"
                                    allowClear
                                    onChange={(value) => setFilters({ ...filters, paymentMode: value })}
                                >
                                    <Select.Option value="Cash">Cash</Select.Option>
                                    <Select.Option value="Cheque">Cheque</Select.Option>
                                    <Select.Option value="Online">Online</Select.Option>
                                    <Select.Option value="Card">Card</Select.Option>
                                    <Select.Option value="UPI">UPI</Select.Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Button type="primary" onClick={fetchPayments} block>
                                    Apply Filters
                                </Button>
                            </Col>
                        </Row>
                    </Card>

                    <Card>
                        <Card>
                            <Statistic
                                title="Total Payments"
                                value={totalAmount}
                                precision={2}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<DollarOutlined />}
                                suffix={`(${payments.length} payments)`}
                            />
                        </Card>
                    </Card>

                    <Table
                        columns={columns}
                        dataSource={payments}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} payments`,
                        }}
                    />
                </Space>
            </div>
        </div>
    );
}

export default PaymentList;
