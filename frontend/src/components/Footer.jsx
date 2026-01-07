import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
    return (
        <AntFooter
            style={{
                background: 'transparent',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
                padding: '24px',
                zIndex: 1,
                position: 'relative'
            }}
        >
            <Space direction="vertical" size="small">
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                    © {new Date().getFullYear()} Parag Radadiya (PR). All Rights Reserved.
                </Text>
                <Space size="middle">
                    <Button type="link" href="https://www.linkedin.com/in/parag-radadiya" target="_blank" icon={<LinkedinOutlined />} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <Button type="link" href="https://github.com" target="_blank" icon={<GithubOutlined />} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <Button type="link" href="mailto:parag.180410107091@gmail.com" icon={<MailOutlined />} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <Button type="link" href="https://parag-radadiya.vercel.app/en" target="_blank" icon={<GlobalOutlined />} style={{ color: 'rgba(255,255,255,0.6)' }} />
                </Space>
            </Space>
        </AntFooter>
    );
};

export default Footer;
