import React, { useEffect, useState } from "react";
import { Layout, Menu, Tabs, Card, Button, Row, Col, Input, Spin, Drawer, message } from "antd";
import { HomeOutlined, ShoppingCartOutlined, SearchOutlined, FacebookOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import "../../../public/User.css";
import CartUser from "./cartUser";

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
const { Meta } = Card;

const User = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = Cookies.get("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://backend-order-8.onrender.com/admin/api/food");
        const foodData = response.data || [];
        if (Array.isArray(foodData)) {
          setFoods(foodData);
        } else {
          message.error("Dữ liệu không đúng định dạng");
        }
      } catch (error) {
        if (error.response) {
          message.error(`Lỗi server: ${error.response.status}`);
        } else if (error.request) {
          message.error("Không thể kết nối đến server");
        } else {
          message.error("Có lỗi xảy ra khi tải dữ liệu");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 0 || food.id_category === category;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (key) => {
    setCategory(Number(key));
  };

  const showCart = () => {
    setOpen(true);
    setLoading2(true);
    setTimeout(() => {
      setLoading2(false);
    }, 500);
  };

  const handleAddToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id_food === food.id_food);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id_food === food.id_food
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...food, quantity: 1 }];
      }
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
      return updatedCart;
    });
    message.success("Đã thêm vào giỏ hàng!");
  };

  const handleOrder = async (orderData) => {
    try {
      const response = await axios.post("https://backend-order-8.onrender.com/admin/api/order", {
        ...orderData,
        items: cart.map((item) => ({
          id_food: item.id_food,
          quantity: item.quantity,
        })),
      });
      if (response.status === 201) {
        message.success("Đặt hàng thành công!");
        setCart([]);  // Reset giỏ hàng
        setOpen(false); // Đóng Drawer
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt hàng!");
    }
  };
  

  const categories = [
    { id: 0, name: "Tất cả" },
    { id: 1, name: "Tokkboki" },
    { id: 2, name: "Mì" },
    { id: 3, name: "Topping" },
    { id: 4, name: "Trà" },
  ];

  return (
    <Layout>
      <div className="banner">
        <h2 className="banner-title">SIÊU THỊ ĂN ĐÊM</h2>
        <h1 className="banner-subtitle">ORDER NGAY!</h1>
        <p className="banner-phone">096 380 07 10</p>
      </div>

      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "24px", color: "#fff" }}>
          <HomeOutlined /> Trang chủ
        </div>
        
        <div>
        <Input
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          style={{ width: window.innerWidth < 768 ? 150 : 200 }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ShoppingCartOutlined
          style={{
            fontSize: window.innerWidth < 768 ? "20px" : "24px",
            marginLeft: "12px",
            color: "white",
            cursor: "pointer",
          }}
          onClick={showCart}
        />

        </div>
      </Header>

      <Drawer
  title="Giỏ hàng"
  placement="right"
  width={window.innerWidth < 768 ? "100%" : 500} // Toàn màn hình trên di động
  onClose={() => setOpen(false)}
  open={open}
>
        {loading2 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <CartUser
            cart={cart}
            setCart={setCart}
            onOrder={handleOrder}
          />
        )}
      </Drawer>

      <Content style={{ padding: "24px" }}>
        <Tabs defaultActiveKey="0" centered onChange={handleCategoryChange}>
          {categories.map((cat) => (
            <TabPane tab={cat.name} key={cat.id}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredFoods.map((food) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={food.id}>
                      <Card
                        hoverable
                        cover={<img alt={food.name} src={food.img} style={{ height: 200, objectFit: "cover" }} />}
                        actions={[
                          <Button type="primary" onClick={() => handleAddToCart(food)}>
                            Thêm vào giỏ
                          </Button>,
                          <Button
                            type="link"
                            onClick={() => {
                              handleAddToCart(food);
                              setOpen(true);
                            }}
                          >
                            Mua ngay
                          </Button>,
                        ]}
                      >
                        <Meta
                          title={food.name}
                          description={`${food.price.toLocaleString()} đ`}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </TabPane>
          ))}
        </Tabs>
      </Content>

      <Footer style={{ textAlign: "center", backgroundColor: "#001529", color: "#fff", padding: "20px" }}>
        <p>Địa chỉ: 120 đường Phan Xích ,Tân Hội ,Đan Phượng </p>
        <p>Số điện thoại: 098 7654 321 </p>
        <p>
          Facebook: <a href="https://www.facebook.com/profile.php?id=61569230120614&locale=vi_VN" target="_blank" rel="noopener noreferrer" style={{ color: "#1890ff" }}><FacebookOutlined /> Facebook</a>
        </p>
      </Footer>
    </Layout>
  );
};

export default User;
