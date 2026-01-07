import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Space,
    Statistic,
    Row,
    Col,
    Tag,
    Typography,
    message,
    Spin,
} from 'antd';
import {
    ArrowLeftOutlined,
    DollarOutlined,
    FileTextOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { customerAPI, paymentAPI } from '../../services/billing';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

function CustomerLedger() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ledgerData, setLedgerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchLedger();
    }, [id]);

    const fetchLedger = async () => {
        setLoading(true);
        try {
            const data = await customerAPI.getLedger(id);
            setLedgerData(data);
        } catch (error) {
            message.error('Customer not found');
            navigate('/customers');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (values) => {
        try {
            await paymentAPI.create({
                customerId: id,
                amount: values.amount,
                paymentMode: values.paymentMode,
                paymentDate: values.paymentDate.format('YYYY-MM-DD'),
                notes: values.notes || '',
            });
            message.success('Payment recorded successfully');
            setModalVisible(false);
            form.resetFields();
            fetchLedger();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to record payment');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!ledgerData) {
        return null;
    }

    const { customer, ledger, summary } = ledgerData;

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            render: (type) => (
                <Tag color={type === 'bill' ? 'blue' : 'green'}>
                    {type === 'bill' ? 'Bill' : 'Payment'}
                </Tag>
            ),
        },
        {
            title: 'Reference',
            dataIndex: 'type',
            key: 'reference',
            render: (type, record) => type === 'bill' ? record.billNumber : record.paymentMode,
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            align: 'right',
            render: (debit) => debit > 0 ? (
                <span style={{ color: '#0B57D0', fontWeight: 600 }}>
                    ₹{debit.toFixed(2)}
                </span>
            ) : '-',
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            align: 'right',
            render: (credit) => credit > 0 ? (
                <span style={{ color: '#52c41a', fontWeight: 600 }}>
                    ₹{credit.toFixed(2)}
                </span>
            ) : '-',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '-',
        },
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/customers')}
                    />
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            {customer.name}
                        </Title>
                        <Text type="secondary">{customer.mobile}</Text>
                    </div>
                </Space>
                <Button type="primary" icon={<DollarOutlined />} onClick={() => setModalVisible(true)}>
                    Record Payment
                </Button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Total Bills"
                                    value={summary.totalBills}
                                    prefix={<FileTextOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Total Amount"
                                    value={summary.totalAmount}
                                    precision={2}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{ color: '#ED4192' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Total Paid"
                                    value={summary.totalPaid}
                                    precision={2}
                                    prefix={<WalletOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Outstanding"
                                    value={summary.balance}
                                    precision={2}
                                    prefix="₹"
                                    valueStyle={{ color: summary.balance > 0 ? '#ED4192' : '#52c41a' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Ledger Entries">
                        <Table
                            columns={columns}
                            dataSource={ledger}
                            rowKey="_id"
                            pagination={{
                                pageSize: 20,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} entries`,
                            }}
                        />
                    </Card>
                </Space>

                <Modal
                    title="Record Payment"
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                    width={500}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handlePaymentSubmit}
                        initialValues={{
                            paymentMode: 'Cash',
                            paymentDate: dayjs(),
                        }}
                    >
                        <Form.Item
                            name="amount"
                            label="Amount"
                            rules={[{ required: true, message: 'Please enter amount' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                precision={2}
                                prefix="₹"
                                placeholder="Enter amount"
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="paymentMode"
                                    label="Payment Mode"
                                    rules={[{ required: true }]}
                                >
                                    <Select>
                                        <Select.Option value="Cash">Cash</Select.Option>
                                        <Select.Option value="Cheque">Cheque</Select.Option>
                                        <Select.Option value="Online">Online</Select.Option>
                                        <Select.Option value="Card">Card</Select.Option>
                                        <Select.Option value="UPI">UPI</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="paymentDate"
                                    label="Payment Date"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="notes" label="Notes">
                            <TextArea rows={3} placeholder="Enter notes (optional)" />
                        </Form.Item>

                        <Form.Item>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                                <Button type="primary" htmlType="submit">
                                    Record Payment
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default CustomerLedger;
