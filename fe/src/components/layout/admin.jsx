import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
    ForwardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import UserAdmin from '../admin/user';
import FoodAdmin from '../admin/food';
import OrderAdmin from '../admin/order';

const { Header, Sider, Content } = Layout;


const Apps = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('0');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: 'Users',
            path: '/admin',
        },
        {
            key: '2',
            icon: <ForwardOutlined />,
            label: 'Food',
            path: '/admin/food',
        },
        {
            key: '3',
            icon: <MenuFoldOutlined />,
            label: 'Order',
            path: '/admin/order',
        },
    ];

    useEffect(() => {
        // Lấy key được lưu trữ trong localStorage nếu có
        const storedKey = localStorage.getItem('selectedKey');
        if (storedKey) {
            setSelectedKey(storedKey);
        }
    }, []);

    const handleMenuClick = (menu) => {
        const selectedItem = items.find((item) => item.key === menu.key);
        if (selectedItem) {
            navigate(selectedItem.path);
            setSelectedKey(menu.key);
            localStorage.setItem('selectedKey', menu.key); // Lưu key vào localStorage
        }
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]} // Sử dụng selectedKey từ state
                    onClick={handleMenuClick}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 16px',
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<UserAdmin />} />
                        <Route path="/food" element={<FoodAdmin />} />
                        <Route path="/order" element={<OrderAdmin />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};



export default Apps;
