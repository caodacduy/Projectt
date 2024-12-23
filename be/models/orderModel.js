// orderModel.js

const pool = require('../configs/database'); // Nhập kết nối cơ sở dữ liệu

// Hàm tạo đơn hàng mới
exports.createOrder = async (customer_name, phone_number, address, total_price) => {
    const query = `
        INSERT INTO "order" (customer_name, phone_number, address, total_price, confirmed, completed, order_date)
        VALUES ($1, $2, $3, $4, false, false, NOW()) RETURNING id_order;
    `;
    const values = [customer_name, phone_number, address, total_price];
    const result = await pool.query(query, values); // Thực hiện truy vấn
    return result.rows[0].id_order; // Trả về id đơn hàng vừa tạo
};

// Hàm lấy thông tin đơn hàng theo id
exports.getOrderById = async (id_order) => {
    const orderQuery = `
        SELECT id_order, customer_name, phone_number, address, total_price, confirmed, completed, order_date
        FROM "order"
        WHERE id_order = $1;
    `;  
    const resultOrder = await pool.query(orderQuery, [id_order]);

    if (resultOrder.rows.length === 0) {
        return null; // Nếu không tìm thấy đơn hàng
    }

    // Lấy thông tin các món ăn trong đơn hàng
    const itemQuery = `
        SELECT i.id_food, i.quantity, i.price, f.name
        FROM item i
        JOIN food f ON i.id_food = f.id_food
        WHERE i.id_order = $1;
    `;
    const resultItems = await pool.query(itemQuery, [id_order]);

    // Trả về thông tin đơn hàng và các món ăn
    return {
        order: resultOrder.rows[0],
        items: resultItems.rows
    };
};

// Hàm tạo item trong đơn hàng
exports.createItem = async (id_food, id_order, quantity, price) => {
    const query = `
        INSERT INTO item (id_food, id_order, quantity, price)
        VALUES ($1, $2, $3, $4);
    `;
    const values = [id_food, id_order, quantity, price];
    await pool.query(query, values); // Thực hiện truy vấn
};

// orderModel.js

// Hàm lấy thông tin toàn bộ các đơn hàng
exports.getAllOrders = async () => {
    // Truy vấn danh sách tất cả các đơn hàng
    const orderQuery = `
        SELECT id_order, customer_name, phone_number, address, total_price, confirmed, completed, order_date
        FROM "order";
    `;
    const resultOrders = await pool.query(orderQuery);

    if (resultOrders.rows.length === 0) {
        return []; // Nếu không có đơn hàng nào
    }

    // Truy vấn tất cả các món ăn thuộc các đơn hàng
    const itemQuery = `
        SELECT i.id_order, i.id_food, i.quantity, i.price, f.name
        FROM item i
        JOIN food f ON i.id_food = f.id_food;
    `;
    const resultItems = await pool.query(itemQuery);

    // Nhóm món ăn theo từng đơn hàng
    const itemsByOrder = resultItems.rows.reduce((acc, item) => {
        if (!acc[item.id_order]) {
            acc[item.id_order] = [];
        }
        acc[item.id_order].push(item);
        return acc;
    }, {});

    // Kết hợp thông tin đơn hàng và danh sách món ăn
    return resultOrders.rows.map(order => ({
        order,
        items: itemsByOrder[order.id_order] || [] // Gán danh sách món ăn hoặc mảng rỗng nếu không có
    }));
};

// orderModel.js

exports.getCompletedOrders = async () => {
    try {
      const query = 'SELECT * FROM orders WHERE confirmed = true'; // Truy vấn các đơn hàng đã được xác nhận
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
  };
  
// orderModel.js

exports.getConfirmedOrders = async () => {
    try {
      const query = 'SELECT * FROM orders WHERE confirmed = true'; // Truy vấn đơn hàng xác nhận
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
  };
  // orderModel.js

exports.getNotConfirmedOrders = async () => {
    try {
      const query = 'SELECT * FROM orders WHERE confirmed = false'; // Truy vấn đơn hàng chưa xác nhận
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
  };
  