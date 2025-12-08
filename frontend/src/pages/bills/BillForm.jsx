import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Card,
    Form,
    Select,
    InputNumber,
    Button,
    Table,
    Space,
    Typography,
    Row,
    Col,
    Input,
    message,
    Tag,
    Divider,
} from 'antd';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import { billAPI, customerAPI, productAPI } from '../../services/billing';
import '../customers/Customers.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

function BillForm() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [items, setItems] = useState([
        { key: 0, productId: '', productName: '', quantity: 1, unit: 'Pcs', rate: 0, gstRate: 0 }
    ]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [customersData, productsData] = await Promise.all([
                customerAPI.getAll({ limit: 100 }),
                productAPI.getAll({ limit: 100 })
            ]);
            setCustomers(customersData.customers || []);
            setProducts(productsData.products || []);
        } catch (error) {
            message.error('Failed to load data');
        }
    };

    const handleCustomerChange = (customerId) => {
        const customer = customers.find(c => c._id === customerId);
        setSelectedCustomer(customer);
    };

    const handleProductChange = (index, productId) => {
        const product = products.find(p => p._id === productId);
        if (product) {
            const newItems = [...items];
            newItems[index] = {
                ...newItems[index],
                productId: product._id,
                productName: product.name,
                unit: product.unit,
                rate: product.defaultPrice,
                gstRate: product.gstRate || 0,
            };
            setItems(newItems);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            { key: items.length, productId: '', productName: '', quantity: 1, unit: 'Pcs', rate: 0, gstRate: 0 }
        ]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    };

    const calculateGST = () => {
        return items.reduce((sum, item) => {
            const amount = item.quantity * item.rate;
            return sum + (amount * (item.gstRate / 100));
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateGST();
    };

    const handleSubmit = async (values) => {
        if (!selectedCustomer) {
            message.error('Please select a customer');
            return;
        }

        if (items.some(item => !item.productName)) {
            message.error('Please fill all product details');
            return;
        }

        setSaving(true);

        try {
            const billData = {
                customerId: selectedCustomer._id,
                billType: values.billType,
                items: items.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: parseFloat(item.quantity),
                    unit: item.unit,
                    rate: parseFloat(item.rate),
                    gstRate: parseFloat(item.gstRate) || 0,
                })),
                notes: values.notes || '',
            };

            const bill = await billAPI.create(billData);
            message.success('Bill created successfully!');
            navigate(`/bills/${bill._id}`);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to create bill');
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: 'Sr.',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Product *',
            dataIndex: 'productId',
            key: 'productId',
            width: 250,
            render: (value, record, index) => (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select Product"
                    value={value || undefined}
                    onChange={(productId) => handleProductChange(index, productId)}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={products.map(p => ({ value: p._id, label: p.name }))}
                />
            ),
        },
        {
            title: 'Qty *',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            render: (value, record, index) => (
                <InputNumber
                    min={0.01}
                    step={0.01}
                    value={value}
                    onChange={(val) => handleItemChange(index, 'quantity', val)}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            width: 80,
            align: 'center',
        },
        {
            title: 'Rate *',
            dataIndex: 'rate',
            key: 'rate',
            width: 120,
            render: (value, record, index) => (
                <InputNumber
                    min={0}
                    step={0.01}
                    value={value}
                    onChange={(val) => handleItemChange(index, 'rate', val)}
                    prefix="₹"
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'GST%',
            dataIndex: 'gstRate',
            key: 'gstRate',
            width: 100,
            render: (value, record, index) => (
                <InputNumber
                    min={0}
                    max={100}
                    value={value}
                    onChange={(val) => handleItemChange(index, 'gstRate', val)}
                    suffix="%"
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Amount',
            key: 'amount',
            width: 140,
            align: 'right',
            render: (_, record) => (
                <Text strong style={{ color: '#ED4192' }}>
                    ₹{(record.quantity * record.rate).toFixed(2)}
                </Text>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 60,
            align: 'center',
            render: (_, record, index) => (
                items.length > 1 && (
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(index)}
                    />
                )
            ),
        },
    ];

    return (
        <Layout className="page-layout">
            <Header className="page-header">
                <Space>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/bills')}
                    />
                    <Title level={3} style={{ margin: 0 }}>
                        Create New Bill
                    </Title>
                </Space>
            </Header>

            <Content className="page-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ billType: 'CHALLAN' }}
                >
                    <Card title="Bill Details" variant="outlined" style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="billType"
                                    label="Bill Type"
                                    rules={[{ required: true }]}
                                >
                                    <Select size="large">
                                        <Select.Option value="CHALLAN">
                                            <Tag color="blue">CHALLAN</Tag>
                                        </Select.Option>
                                        <Select.Option value="INVOICE">
                                            <Tag color="green">INVOICE</Tag>
                                        </Select.Option>
                                        <Select.Option value="QUOTATION">
                                            <Tag color="orange">QUOTATION</Tag>
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="customerId"
                                    label="Customer"
                                    rules={[{ required: true, message: 'Please select a customer' }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Select Customer"
                                        onChange={handleCustomerChange}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={customers.map(c => ({
                                            value: c._id,
                                            label: `${c.name} - ${c.mobile}`
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {selectedCustomer && selectedCustomer.balance > 0 && (
                            <Tag color="warning" style={{ fontSize: 14, padding: '4px 12px' }}>
                                Previous Balance: ₹{selectedCustomer.balance.toFixed(2)}
                            </Tag>
                        )}
                    </Card>

                    <Card
                        title="Items"
                        variant="outlined"
                        style={{ marginBottom: 24 }}
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} onClick={addItem}>
                                Add Item
                            </Button>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={items}
                            rowKey={(record, index) => index}
                            pagination={false}
                            scroll={{ x: 900 }}
                        />

                        <Divider />

                        <Row justify="end">
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Space direction="vertical" style={{ width: '100%' }} size="small">
                                    <Row justify="space-between">
                                        <Text>Subtotal:</Text>
                                        <Text>₹{calculateSubtotal().toFixed(2)}</Text>
                                    </Row>
                                    {calculateGST() > 0 && (
                                        <Row justify="space-between">
                                            <Text>GST:</Text>
                                            <Text>₹{calculateGST().toFixed(2)}</Text>
                                        </Row>
                                    )}
                                    <Row justify="space-between">
                                        <Text strong style={{ fontSize: 16 }}>Total:</Text>
                                        <Text strong style={{ fontSize: 16, color: '#ED4192' }}>
                                            ₹{calculateTotal().toFixed(2)}
                                        </Text>
                                    </Row>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Additional Information" variant="outlined" style={{ marginBottom: 24 }}>
                        <Form.Item name="notes" label="Notes">
                            <TextArea
                                rows={3}
                                placeholder="Add any notes for this bill..."
                            />
                        </Form.Item>
                    </Card>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                size="large"
                                loading={saving}
                            >
                                {saving ? 'Creating Bill...' : 'Create Bill'}
                            </Button>
                            <Button size="large" onClick={() => navigate('/bills')}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

export default BillForm;
