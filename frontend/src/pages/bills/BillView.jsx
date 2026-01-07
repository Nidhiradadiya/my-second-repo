import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout,
    Card,
    Table,
    Button,
    Space,
    Typography,
    Descriptions,
    Divider,
    Tag,
    Spin,
    message,
    Row,
    Col,
} from 'antd';
import {
    ArrowLeftOutlined,
    DownloadOutlined,
    FileTextOutlined,
    PrinterOutlined,
} from '@ant-design/icons';
import { billAPI } from '../../services/billing';
import '../customers/Customers.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function BillView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBill();
    }, [id]);

    const fetchBill = async () => {
        setLoading(true);
        try {
            const data = await billAPI.getById(id);
            setBill(data);
        } catch (error) {
            message.error('Bill not found');
            navigate('/bills');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintPDF = async () => {
        try {
            await billAPI.print(id);
        } catch (error) {
            message.error('Failed to open PDF');
        }
    };

    const handleDownloadPDF = async () => {
        try {
            await billAPI.downloadPDF(id);
            message.success('PDF downloaded successfully');
        } catch (error) {
            message.error('Failed to download PDF');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!bill) {
        return null;
    }

    const billTypeColor = {
        INVOICE: 'green',
        CHALLAN: 'blue',
        QUOTATION: 'orange',
    };

    const itemColumns = [
        {
            title: 'Sr.',
            dataIndex: 'srNo',
            key: 'srNo',
            width: 60,
            align: 'center',
        },
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
            align: 'center',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            width: 80,
            align: 'center',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            width: 120,
            align: 'right',
            render: (rate) => `₹${rate.toFixed(2)}`,
        },
        {
            title: 'GST%',
            dataIndex: 'gstRate',
            key: 'gstRate',
            width: 80,
            align: 'center',
            render: (rate) => `${rate}%`,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 140,
            align: 'right',
            render: (amount) => (
                <Text strong style={{ color: '#ED4192' }}>
                    ₹{amount.toFixed(2)}
                </Text>
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
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            Bill #{bill.billNumber}
                        </Title>
                        <Space>
                            <Tag color={billTypeColor[bill.billType]} icon={<FileTextOutlined />}>
                                {bill.billType}
                            </Tag>
                            <Text type="secondary">
                                {new Date(bill.date).toLocaleDateString()}
                            </Text>
                        </Space>
                    </div>
                </Space>
                <Space>
                    <Button
                        icon={<PrinterOutlined />}
                        onClick={handlePrintPDF}
                    >
                        Print
                    </Button>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </Button>
                </Space>
            </Header>

            <Content className="page-content">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card title="Customer Details" variant="outlined">
                        <Descriptions column={2}>
                            <Descriptions.Item label="Name">{bill.customerName}</Descriptions.Item>
                            <Descriptions.Item label="Mobile">{bill.customerMobile}</Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card title="Items" variant="outlined">
                        <Table
                            columns={itemColumns}
                            dataSource={bill.items}
                            rowKey="srNo"
                            pagination={false}
                            summary={() => (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} align="right">
                                            <Text strong>Subtotal</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">
                                            <Text>₹{bill.subtotal.toFixed(2)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    {bill.gstTotal > 0 && (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={6} align="right">
                                                <Text strong>GST</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1} align="right">
                                                <Text>₹{bill.gstTotal.toFixed(2)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    )}
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} align="right">
                                            <Text strong style={{ fontSize: 16 }}>Total</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">
                                            <Text strong style={{ fontSize: 16, color: '#ED4192' }}>
                                                ₹{bill.total.toFixed(2)}
                                            </Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )}
                        />
                        <Divider />
                        <Text italic>{bill.amountInWords}</Text>
                    </Card>

                    {bill.previousBalance > 0 && (
                        <Card title="Balance Information" variant="outlined">
                            <Descriptions column={1}>
                                <Descriptions.Item label="Previous Balance">
                                    <Text>₹{bill.previousBalance.toFixed(2)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Closing Balance">
                                    <Text strong style={{ color: '#ED4192', fontSize: 16 }}>
                                        ₹{bill.closingBalance.toFixed(2)}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    )}

                    {bill.notes && (
                        <Card title="Notes" variant="outlined">
                            <Text>{bill.notes}</Text>
                        </Card>
                    )}
                </Space>
            </Content>
        </Layout>
    );
}

export default BillView;
