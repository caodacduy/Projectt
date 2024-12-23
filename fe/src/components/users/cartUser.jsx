import React, { useState } from "react";
import { Button, List, Form, Input, InputNumber, message } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

const CartUser = ({ cart, setCart, onOrder }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (itemId, newQuantity) => {
    console.log(itemId)
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id_food === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id_food !== itemId));
    console.log(item.id_food,itemId)
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  // Xử lý đặt hàng
  const handleCheckout = async (values) => {
    if (cart.length === 0) {
      message.error('Giỏ hàng trống!');
      return;
    }

    setLoading(true);
    try {
      await onOrder({
        customer_name: values.customer_name,
        phone_number: values.phone_number,
        address: values.address,
      });
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveItem(item.id_food)}
                danger
              />
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => handleQuantityChange(item.id_food, item.quantity - 1)}
                  />
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id_food, value)}
                    style={{ margin: '0 8px', width: '60px' }}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleQuantityChange(item.id_food, item.quantity + 1)}
                  />
                  <span style={{ marginLeft: '16px' }}>
                    {(item.price * item.quantity).toLocaleString()} đ
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {cart.length > 0 && (
        <div>
          <div style={{ margin: '16px 0', textAlign: 'right', fontSize: '18px', fontWeight: 'bold' }}>
            Tổng tiền: {total.toLocaleString()} đ
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleCheckout}
          >
            <Form.Item
              name="customer_name"
              label="Tên khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
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
              name="note"
              label="Ghi chú"
            >
              <Input.TextArea placeholder="Nhập ghi chú đơn hàng (nếu có)" rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Đặt hàng ({total.toLocaleString()} đ)
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      {cart.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Giỏ hàng trống
        </div>
      )}
    </div>
  );
};

export default CartUser;