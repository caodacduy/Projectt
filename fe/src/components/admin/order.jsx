import React, { useState, useEffect } from 'react';
import { Table, Tabs, Button, Modal, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { TabPane } = Tabs;

const OrderAdmin = () => {
    const [notConfirmedOrders, setNotConfirmedOrders] = useState([]);
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const columns = (onAction, actionLabel) => [
        { title: 'Name', dataIndex: 'customer_name', key: 'customer_name' },
        { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { 
            title: 'Date', 
            dataIndex: 'order_date', 
            key: 'order_date', 
            render: (date) => moment(date).format('DD-MM-YYYY')
        },
        { 
            title: 'Total Price', 
            dataIndex: 'total_price', 
            key: 'total_price', 
            render: (price) => `₫${Number(price).toLocaleString('vi-VN')}`
        },
        { 
            title: 'Items', 
            dataIndex: 'items', 
            key: 'items', 
            render: (items) => (
                <ul>
                    {items.map(item => (
                        <li key={item.id_food}>{item.name} - {item.quantity} x {item.price}</li>
                    ))}
                </ul>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" onClick={() => showModal(record)}>View</Button>
                    {actionLabel && (
                        <Button 
                            type="primary" 
                            onClick={() => onAction(record.id_order)} 
                            style={{ marginLeft: 8 }}
                        >
                            {actionLabel}
                        </Button>
                    )}
                    <Button type="primary" danger onClick={() => handleDeleteOrder(record.id_order)}>

                        Delete
                    </Button>
                </>
            )
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [notConfirmed, confirmed, completed] = await Promise.all([
                axios.get('https://backend-order-8.onrender.com/admin/api/notconfirmed'),
                axios.get('https://backend-order-8.onrender.com/admin/api/confirmed'),
                axios.get('https://backend-order-8.onrender.com/admin/api/completed'),
            ]);
            setNotConfirmedOrders(formatOrders(notConfirmed.data));
            setConfirmedOrders(formatOrders(confirmed.data));
            setCompletedOrders(formatOrders(completed.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const formatOrders = (orders) => {
        return orders.map(({ order, items }) => ({
            ...order,
            items,
        }));
    };

    const handleConfirmOrder = async (id_order) => {
        try {
            await axios.put(`https://backend-order-8.onrender.com/admin/api/order/confirm/${id_order}`);
            message.success('Order confirmed successfully!');
            fetchData();
        } catch (error) {
            console.error('Error confirming order:', error);
            message.error('Failed to confirm order.');
        }
    };

    const handleCompleteOrder = async (id_order) => {
        try {
            await axios.put(`https://backend-order-8.onrender.com/admin/api/order/complete/${id_order}`);
            message.success('Order completed successfully!');
            fetchData();
        } catch (error) {
            console.error('Error completing order:', error);
            message.error('Failed to complete order.');
        }
    };

    const handleDeleteOrder = async (id_order) => {
        try {
            await axios.delete(`https://backend-order-8.onrender.com/admin/api/order/${id_order}`);
            message.success('Order deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting order:', error);
            message.error('Failed to delete order.');
        }
    };

    const showModal = (order) => {
        setCurrentOrder(order);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setCurrentOrder(null);
    };

    return (
        <div>
            <h1 style={{ color: '#1890ff' }}>Order Management</h1>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Not Confirmed Orders" key="1">
                    <Table 
                        columns={columns(handleConfirmOrder, 'Confirm')} 
                        dataSource={notConfirmedOrders} 
                        rowKey="id_order" 
                    />
                </TabPane>
                <TabPane tab="Confirmed Orders" key="2">
                    <Table 
                        columns={columns(handleCompleteOrder, 'Complete')} 
                        dataSource={confirmedOrders} 
                        rowKey="id_order" 
                    />
                </TabPane>
                <TabPane tab="Completed Orders" key="3">
                    <Table 
                        columns={columns()} 
                        dataSource={completedOrders} 
                        rowKey="id_order" 
                    />
                </TabPane>
            </Tabs>

            <Modal
                title="Order Details"
                visible={modalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                {currentOrder && (
                    <div>
                        <p><strong>Name:</strong> {currentOrder.customer_name}</p>
                        <p><strong>Phone:</strong> {currentOrder.phone_number}</p>
                        <p><strong>Address:</strong> {currentOrder.address}</p>
                        <p><strong>Date:</strong> {moment(currentOrder.order_date).format('DD-MM-YYYY')}</p>
                        <p><strong>Total Price:</strong> ₫{Number(currentOrder.total_price).toLocaleString('vi-VN')}</p>
                        <p><strong>Items:</strong></p>
                        <ul>
                            {currentOrder.items.map(item => (
                                <li key={item.id_food}>{item.name} - {item.quantity} x {item.price}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderAdmin;
