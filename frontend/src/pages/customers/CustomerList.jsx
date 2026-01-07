import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    message,
    Popconfirm,
    Typography,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    FileTextOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { customerAPI } from '../../services/billing';

const { Title } = Typography;

function CustomerList() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerAPI.getAll();
            setCustomers(data.customers);
        } catch (error) {
            message.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchText.trim()) {
            fetchCustomers();
            return;
        }
        setLoading(true);
        try {
            const data = await customerAPI.search(searchText);
            setCustomers(data.customers);
        } catch (error) {
            message.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (customer = null) => {
        setEditingCustomer(customer);
        if (customer) {
            form.setFieldsValues(customer);
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingCustomer) {
                await customerAPI.update(editingCustomer._id, values);
                message.success('Customer updated successfully');
            } else {
                await customerAPI.create(values);
                message.success('Customer created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchCustomers();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await customerAPI.delete(id);
            message.success('Customer deleted successfully');
            fetchCustomers();
        } catch (error) {
            message.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Total Bills',
            dataIndex: 'totalBills',
            key: 'totalBills',
            align: 'center',
            render: (count) => <Tag color="blue">{count}</Tag>,
        },
        {
            title: 'Outstanding',
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            render: (balance) => (
                <span style={{ color: balance > 0 ? '#0B57D0' : '#52c41a', fontWeight: 600 }}>
                    ₹{balance.toFixed(2)}
                </span>
            ),
            sorter: (a, b) => a.balance - b.balance,
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<FileTextOutlined />}
                        onClick={() => navigate(`/customers/${record._id}/ledger`)}
                    >
                        Ledger
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title="Delete customer?"
                        description="This will delete all related data. Continue?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
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
                        Customers
                    </Title>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                    Add Customer
                </Button>
            </div>

            <div style={{ flex: 1 }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Input.Search
                        placeholder="Search customers..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={handleSearch}
                        enterButton={<SearchOutlined />}
                        size="large"
                        style={{ maxWidth: 400 }}
                    />

                    <Table
                        columns={columns}
                        dataSource={customers}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} customers`,
                        }}
                    />
                </Space>

                <Modal
                    title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                    width={500}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="name"
                            label="Customer Name"
                            rules={[{ required: true, message: 'Please enter customer name' }]}
                        >
                            <Input placeholder="Enter name" />
                        </Form.Item>

                        <Form.Item
                            name="mobile"
                            label="Mobile Number"
                            rules={[
                                { required: true, message: 'Please enter mobile number' },
                                { pattern: /^\+?[0-9]{10,15}$/, message: 'Invalid mobile number' },
                            ]}
                        >
                            <Input placeholder="+91XXXXXXXXXX" />
                        </Form.Item>

                        <Form.Item name="address" label="Address">
                            <Input.TextArea rows={3} placeholder="Enter address" />
                        </Form.Item>

                        <Form.Item name="gstNumber" label="GST Number">
                            <Input placeholder="Enter GST number (optional)" />
                        </Form.Item>

                        <Form.Item>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                                <Button type="primary" htmlType="submit">
                                    {editingCustomer ? 'Update' : 'Create'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default CustomerList;
