import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    InputNumber,
    Select,
    message,
    Popconfirm,
    Typography,
    Tag,
    Switch,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { productAPI } from '../../services/billing';
import '../customers/Customers.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

function ProductList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productAPI.getAll();
            setProducts(data.products);
        } catch (error) {
            message.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchText.trim()) {
            fetchProducts();
            return;
        }
        setLoading(true);
        try {
            const data = await productAPI.search(searchText);
            setProducts(data.products);
        } catch (error) {
            message.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        if (product) {
            form.setFieldsValue(product);
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingProduct) {
                await productAPI.update(editingProduct._id, values);
                message.success('Product updated successfully');
            } else {
                await productAPI.create(values);
                message.success('Product created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchProducts();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await productAPI.delete(id);
            message.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            message.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            align: 'center',
        },
        {
            title: 'Default Price',
            dataIndex: 'defaultPrice',
            key: 'defaultPrice',
            align: 'right',
            render: (price) => `₹${price.toFixed(2)}`,
            sorter: (a, b) => a.defaultPrice - b.defaultPrice,
        },
        {
            title: 'GST Rate',
            dataIndex: 'gstRate',
            key: 'gstRate',
            align: 'center',
            render: (rate) => `${rate}%`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title="Delete product?"
                        description="Are you sure you want to delete this product?"
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
        <Layout className="page-layout">
            <Header className="page-header">
                <Space>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/dashboard')}
                    />
                    <Title level={3} style={{ margin: 0 }}>
                        Products
                    </Title>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                    Add Product
                </Button>
            </Header>

            <Content className="page-content">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Input.Search
                        placeholder="Search products..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={handleSearch}
                        enterButton={<SearchOutlined />}
                        size="large"
                        style={{ maxWidth: 400 }}
                    />

                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} products`,
                        }}
                    />
                </Space>

                <Modal
                    title={editingProduct ? 'Edit Product' : 'Add Product'}
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
                            label="Product Name"
                            rules={[{ required: true, message: 'Please enter product name' }]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>

                        <Form.Item
                            name="unit"
                            label="Unit"
                            rules={[{ required: true, message: 'Please enter unit' }]}
                        >
                            <Input placeholder="e.g., MTR, PCS, KG" />
                        </Form.Item>

                        <Form.Item
                            name="defaultPrice"
                            label="Default Price"
                            rules={[{ required: true, message: 'Please enter price' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Enter price"
                                min={0}
                                precision={2}
                                prefix="₹"
                            />
                        </Form.Item>

                        <Form.Item
                            name="gstRate"
                            label="GST Rate (%)"
                            initialValue={0}
                            rules={[{ required: true, message: 'Please enter GST rate' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Enter GST rate"
                                min={0}
                                max={100}
                                suffix="%"
                            />
                        </Form.Item>

                        <Form.Item name="description" label="Description">
                            <TextArea rows={3} placeholder="Enter product description" />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Status"
                            initialValue="Active"
                        >
                            <Select>
                                <Select.Option value="Active">Active</Select.Option>
                                <Select.Option value="Inactive">Inactive</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                                <Button type="primary" htmlType="submit">
                                    {editingProduct ? 'Update' : 'Create'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
}

export default ProductList;
