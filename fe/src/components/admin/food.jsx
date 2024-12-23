import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Modal, Input, Select, InputNumber, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const FoodAdmin = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    price: null,
    category: null,
    img: null,
  });
  const [editingRecord, setEditingRecord] = useState(null);

  // Hiển thị modal thêm
  const showAddModal = () => {
    setIsModalOpen(true);
  };

  // Hiển thị modal sửa
  const showEditModal = (record) => {
    setEditingRecord(record);
    setFormValues({
      name: record.name,
      price: record.price,
      category: record.id_category,
      img: record.img,
    });
    setIsEditModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormValues({
      name: '',
      price: null,
      category: null,
      img: null,
    });
    setEditingRecord(null);
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/api/food');
      const formattedData = response.data.map((item) => ({
        ...item,
        key: item.id_food,
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  // Xử lý thêm món ăn
  const handleAdd = async () => {
    const { name, price, category, img } = formValues;
    if (!name || !price || !category || !img) {
      message.error('Vui lòng điền đầy đủ thông tin và chọn ảnh!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('id_category', category);
    formData.append('img', img);

    try {
      await axios.post('http://localhost:8080/admin/api/food', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData();
      message.success('Thêm món ăn thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm món ăn:', error);
      message.error('Thêm món ăn thất bại!');
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Xử lý sửa món ăn
  const handleEdit = async () => {
    const { name, price, category, img } = formValues;
    if (!editingRecord || !name || !price || !category) {
      message.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('id_category', category);
    if (img instanceof File) {
      // Nếu có ảnh mới, thêm ảnh vào formData
      formData.append('img', img);
    } else {
      // Nếu không, giữ nguyên ảnh cũ
      formData.append('img', editingRecord.img);
    }
  
    try {
      await axios.put(`http://localhost:8080/admin/api/food/${editingRecord.id_food}`, formData);
      fetchData();
      message.success('Cập nhật món ăn thành công!');
    } catch (error) {
      console.error('Lỗi khi sửa món ăn:', error);
      message.error('Cập nhật món ăn thất bại!');
    }
  
    setIsEditModalOpen(false);
    resetForm();
  };
  
  // Xử lý xóa món ăn
  const handleDelete = (id_food) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa món ăn này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8080/admin/api/food/${id_food}`);
          fetchData();
          message.success('Xóa món ăn thành công!');
        } catch (error) {
          console.error('Lỗi khi xóa món ăn:', error);
          message.error('Xóa món ăn thất bại!');
        }
      },
    });
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'Tên món ăn',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'id_category',
      key: 'category',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Ảnh',
      dataIndex: 'img',
      key: 'img',
      render: (img) => <img src={img} alt="food" style={{ width: 70, height: 50 }} />,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id_food)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>Quản lý món ăn</h1>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
        Thêm món ăn mới
      </Button>

      {/* Modal thêm món ăn */}
      <Modal
        title="Thêm món ăn mới"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <FoodForm formValues={formValues} setFormValues={setFormValues} />
      </Modal>

      {/* Modal sửa món ăn */}
      <Modal
        title="Sửa món ăn"
        open={isEditModalOpen}
        onOk={handleEdit}
        onCancel={handleCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <FoodForm formValues={formValues} setFormValues={setFormValues} />
      </Modal>

      <Table columns={columns} dataSource={data} />
    </>
  );
};

const FoodForm = ({ formValues, setFormValues }) => {
  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <span>Tên món ăn</span>
        <Input
          placeholder="Nhập tên món ăn"
          value={formValues.name}
          onChange={(e) => handleChange('name', e.target.value)}
          style={{ marginTop: 8 }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <span>Giá</span>
        <InputNumber
          placeholder="Nhập giá"
          value={formValues.price}
          onChange={(value) => handleChange('price', value)}
          min={0}
          max={10000000}
          style={{ width: '100%', marginTop: 8 }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <span>Loại</span>
        <Select
          placeholder="Chọn loại"
          style={{ width: '100%', marginTop: 8 }}
          value={formValues.category}
          onChange={(value) => handleChange('category', value)}
        >
          <Option value={1}>Tokbokki</Option>
          <Option value={2}>Mì Indomie
          </Option>
          <Option value={3}>Topping </Option>
          <Option value={4}>Trà </Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <span>Ảnh</span>
        <Upload
          beforeUpload={(file) => {
            handleChange('img', file); // Cập nhật ảnh mới vào formValues
            return false; // Không tải lên ngay lập tức
          }}
          maxCount={1}
          listType="picture"
          defaultFileList={
            formValues.img && typeof formValues.img === 'string'
              ? [{ uid: '-1', name: 'Ảnh hiện tại', status: 'done', url: formValues.img }]
              : []
          }
          onRemove={() => handleChange('img', null)} // Xử lý khi người dùng xóa ảnh
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>

      </div>
    </>
  );
};

export default FoodAdmin;

