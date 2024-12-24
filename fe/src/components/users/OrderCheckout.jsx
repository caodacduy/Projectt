import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const OrderCheckout = ({ cart, onOrderSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const orderData = {
        customer_name: values.customer_name,
        phone_number: values.phone_number,
        address: values.address,
        delivery_method: values.delivery_method,
        delivery_time: values.delivery_time,
        note: values.note,
        items: cart.map(item => ({
          id_food: item.id_food || item.id, // Handle both possible property names
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0
        }))
      };

      const response = await axios.post('https://backend-order-8.onrender.com/admin/api/order', orderData);
      
      if (response.status === 200) {
        message.success('Đặt hàng thành công!');
        form.resetFields();
        if (onOrderSuccess) {
          onOrderSuccess();
        }
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      message.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="customer_name"
        label="Họ và tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
      >
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item
        name="phone_number"
        label="Số điện thoại"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
      >
        <Input placeholder="Nhập địa chỉ giao hàng" />
      </Form.Item>

      <Form.Item
        name="delivery_method"
        label="Hình thức giao hàng"
        rules={[{ required: true, message: 'Vui lòng chọn hình thức giao hàng!' }]}
      >
        <Select placeholder="Chọn hình thức giao hàng">
          <Option value="delivery">Giao tận nơi</Option>
          <Option value="pickup">Lấy tại cửa hàng</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="delivery_time"
        label="Thời gian giao hàng"
        rules={[{ required: true, message: 'Vui lòng chọn thời gian giao hàng!' }]}
      >
        <Select placeholder="Chọn thời gian giao hàng">
          <Option value="asap">Giao ngay</Option>
          <Option value="schedule">Đặt trước</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="note"
        label="Ghi chú"
      >
        <TextArea rows={4} placeholder="Nhập ghi chú đơn hàng (nếu có)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Thanh toán
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderCheckout;
