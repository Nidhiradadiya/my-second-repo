import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Card,
    Form,
    Input,
    Button,
    Space,
    Typography,
    Row,
    Col,
    Upload,
    Switch,
    message,
    Spin,
    Divider,
} from 'antd';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    UploadOutlined,
    PictureOutlined,
    EditOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import { companyAPI, backupAPI } from '../../services/billing';
import '../customers/Customers.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

function CompanySettings() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [company, setCompany] = useState(null);

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        setLoading(true);
        try {
            const data = await companyAPI.get();
            setCompany(data);
            form.setFieldsValue(data);
        } catch (error) {
            if (error.response?.status !== 404) {
                message.error('Failed to load company settings');
            } else {
                // Set default values
                form.setFieldsValue({
                    gstEnabled: false,
                    termsAndConditions: [
                        '1. No Gaurenty No Clame.',
                        '2. Cheque Return Charges 200/- Rs.',
                        '3. Goods Once Sold Will Not Be accepted.'
                    ]
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setSaving(true);

        try {
            // Create a copy of values without logo and signature to avoid sending base64 data
            const companyData = { ...values };
            delete companyData.logo;
            delete companyData.signature;

            await companyAPI.createOrUpdate(companyData);

            if (logoFile) {
                await companyAPI.uploadLogo(logoFile);
            }

            if (signatureFile) {
                await companyAPI.uploadSignature(signatureFile);
            }

            message.success('Company settings saved successfully!');
            fetchCompany();
            setLogoFile(null);
            setSignatureFile(null);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const logoProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
                return false;
            }
            setLogoFile(file);
            return false;
        },
        onRemove: () => {
            setLogoFile(null);
        },
        fileList: logoFile ? [logoFile] : [],
    };

    const signatureProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
                return false;
            }
            setSignatureFile(file);
            return false;
        },
        onRemove: () => {
            setSignatureFile(null);
        },
        fileList: signatureFile ? [signatureFile] : [],
    };

    const handleDownloadBackup = async () => {
        setDownloading(true);
        try {
            await backupAPI.download();
            message.success('Backup downloaded successfully');
        } catch (error) {
            message.error('Failed to download backup');
            console.error(error);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

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
                        Company Settings
                    </Title>
                </Space>
            </Header>

            <Content className="page-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        gstEnabled: false,
                        termsAndConditions: [
                            '1. No Gaurenty No Clame.',
                            '2. Cheque Return Charges 200/- Rs.',
                            '3. Goods Once Sold Will Not Be accepted.'
                        ]
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card title="Basic Information" variant="outlined" extra={<EditOutlined />}>
                            <Row gutter={16}>
                                <Col xs={24}>
                                    <Form.Item
                                        name="name"
                                        label="Company Name"
                                        rules={[{ required: true, message: 'Please enter company name' }]}
                                    >
                                        <Input placeholder="Enter company name" size="large" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item name="address" label="Address">
                                        <TextArea rows={2} placeholder="Enter address" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <Form.Item name="city" label="City">
                                        <Input placeholder="City" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <Form.Item name="state" label="State">
                                        <Input placeholder="State" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <Form.Item name="pincode" label="Pincode">
                                        <Input placeholder="Pincode" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item name="phone" label="Phone" rules={[{ type: 'string' }]}>
                                        <Input placeholder="Phone number" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Invalid email' }]}>
                                        <Input placeholder="Email address" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="GST Information" variant="outlined">
                            <Form.Item name="gstEnabled" label="Enable GST" valuePropName="checked">
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.gstEnabled !== currentValues.gstEnabled}
                            >
                                {({ getFieldValue }) =>
                                    getFieldValue('gstEnabled') ? (
                                        <Form.Item name="gstNumber" label="GST Number">
                                            <Input placeholder="Enter GST number" />
                                        </Form.Item>
                                    ) : null
                                }
                            </Form.Item>
                        </Card>

                        <Card title="Logo & Signature" variant="outlined" extra={<PictureOutlined />}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Company Logo"
                                        extra={company?.logo ? 'Current logo will be replaced if you upload a new one' : 'Max 2MB'}
                                    >
                                        <Upload {...logoProps} maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Select Logo</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Digital Signature"
                                        extra={company?.signature ? 'Current signature will be replaced if you upload a new one' : 'Max 2MB'}
                                    >
                                        <Upload {...signatureProps} maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Select Signature</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="Terms & Conditions" variant="outlined">
                            <Form.List name="termsAndConditions">
                                {(fields) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                {...field}
                                                key={field.key}
                                                label={`Term ${index + 1}`}
                                            >
                                                <Input placeholder={`Enter term ${index + 1}`} />
                                            </Form.Item>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Card>

                        <Card title="Data Management" variant="outlined" extra={<DownloadOutlined />}>
                            <Row align="middle" justify="space-between">
                                <Col>
                                    <Text strong>Database Backup</Text>
                                    <div style={{ color: '#888', fontSize: '12px' }}>
                                        Download a full backup of your data (Customers, Products, Bills, etc.) as a JSON file.
                                    </div>
                                </Col>
                                <Col>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={handleDownloadBackup}
                                        loading={downloading}
                                    >
                                        Download Backup
                                    </Button>
                                </Col>
                            </Row>
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
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </Button>
                                <Button size="large" onClick={() => navigate('/dashboard')}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Space>
                </Form>
            </Content>
        </Layout>
    );
}

export default CompanySettings;
