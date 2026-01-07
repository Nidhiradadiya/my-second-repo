import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Space,
    Tag,
    Typography,
    Popconfirm,
    message,
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    DownloadOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    PrinterOutlined,
} from '@ant-design/icons';
import { billAPI } from '../../services/billing';

const { Title } = Typography;

function BillList() {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const data = await billAPI.getAll({ limit: 50 });
            setBills(data.bills);
        } catch (error) {
            message.error('Failed to load bills');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (billId) => {
        try {
            await billAPI.downloadPDF(billId);
            message.success('PDF downloaded successfully');
        } catch (error) {
            message.error('Failed to download PDF');
        }
    };

    const handlePrintPDF = async (billId) => {
        try {
            await billAPI.print(billId);
        } catch (error) {
            message.error('Failed to open PDF');
        }
    };

    const handleDelete = async (billId) => {
        try {
            await billAPI.delete(billId);
            message.success('Bill deleted successfully');
            fetchBills();
        } catch (error) {
            message.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const columns = [
        {
            title: 'Bill No.',
            dataIndex: 'billNumber',
            key: 'billNumber',
            sorter: (a, b) => a.billNumber.localeCompare(b.billNumber),
        },
        {
            title: 'Type',
            dataIndex: 'billType',
            key: 'billType',
            align: 'center',
            render: (type) => {
                const colorMap = {
                    INVOICE: 'green',
                    CHALLAN: 'blue',
                    QUOTATION: 'orange',
                };
                return <Tag color={colorMap[type]}>{type}</Tag>;
            },
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Amount',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
            render: (total) => (
                <span style={{ color: '#0B57D0', fontWeight: 600 }}>
                    ₹{total.toFixed(2)}
                </span>
            ),
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/bills/${record._id}`)}
                    >
                        View
                    </Button>
                    <Button
                        type="link"
                        icon={<PrinterOutlined />}
                        onClick={() => handlePrintPDF(record._id)}
                    >
                        Print
                    </Button>
                    <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownloadPDF(record._id)}
                    >
                        PDF
                    </Button>
                    <Popconfirm
                        title="Delete bill?"
                        description="This will affect customer balance. Continue?"
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
                        Bills
                    </Title>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/bills/new')}>
                    Create Bill
                </Button>
            </div>

            <div style={{ flex: 1 }}>
                <Table
                    columns={columns}
                    dataSource={bills}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} bills`,
                    }}
                />
            </div>
        </div>
    );
}

export default BillList;
