// orderController.js

const { createOrder, createItem, getOrderById, getAllOrders } = require('../models/orderModel');
const { getFoodPrices } = require('../models/foodModel');
const pool = require('../configs/database');

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
    try {
        const { customer_name, phone_number, address, items } = req.body;

        // Kiểm tra dữ liệu món ăn
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid items array' });
        }

        // Lấy giá món ăn từ bảng food
        const foodPrices = await getFoodPrices(items.map(item => item.id_food));
        const foodMap = new Map(foodPrices.map(food => [food.id_food, food.price]));

        // Validate all items before processing
        for (const item of items) {
            const foodPrice = foodMap.get(item.id_food);
            if (!foodPrice || isNaN(item.quantity) || item.quantity <= 0) {
                console.error(`Invalid data for food ID: ${item.id_food}, foodPrice: ${foodPrice}, quantity: ${item.quantity}`);
                return res.status(400).json({ message: 'Invalid food data' });
            }
        }

        let total_price = 0;
        const itemData = items.map(item => {
            const foodPrice = foodMap.get(item.id_food);
            const itemPrice = foodPrice * item.quantity;
            total_price += itemPrice;
            return { ...item, price: itemPrice };
        });

        // Lưu đơn hàng
        const orderId = await createOrder(customer_name, phone_number, address, total_price);

        // Lưu từng item vào bảng item
        for (const item of itemData) {
            await createItem(item.id_food, orderId, item.quantity, item.price);
        }

        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Lấy thông tin đơn hàng
exports.getOrder = async (req, res) => {
    try {
        const { id_order } = req.params;
        const orderData = await getOrderById(id_order);

        if (!orderData) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(orderData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Lấy toàn bộ danh sách đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.status(200).json(orders);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Lấy danh sách đơn hàng chưa xác nhận
// Lấy danh sách đơn hàng chưa xác nhận (có thêm thông tin items)
exports.getNotConfirmedOrders = async (req, res) => {
    try {
        const orderQuery = `
            SELECT id_order, customer_name, phone_number, address, total_price, confirmed, completed, order_date
            FROM "order"
            WHERE confirmed = false;
        `;
        const resultOrders = await pool.query(orderQuery);

        if (resultOrders.rows.length === 0) {
            return res.status(404).json({ message: 'No unconfirmed orders found' });
        }

        const itemQuery = `
            SELECT i.id_order, i.id_food, i.quantity, i.price, f.name
            FROM item i
            JOIN food f ON i.id_food = f.id_food;
        `;
        const resultItems = await pool.query(itemQuery);

        const itemsByOrder = resultItems.rows.reduce((acc, item) => {
            if (!acc[item.id_order]) {
                acc[item.id_order] = [];
            }
            acc[item.id_order].push(item);
            return acc;
        }, {});

        const orders = resultOrders.rows.map(order => ({
            order,
            items: itemsByOrder[order.id_order] || []
        }));

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching unconfirmed orders:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Lấy danh sách đơn hàng đã xác nhận nhưng chưa hoàn thành (có thêm thông tin items)
exports.getConfirmedOrders = async (req, res) => {
    try {
        const orderQuery = `
            SELECT id_order, customer_name, phone_number, address, total_price, confirmed, completed, order_date
            FROM "order"
            WHERE confirmed = true AND completed = false;
        `;
        const resultOrders = await pool.query(orderQuery);

        if (resultOrders.rows.length === 0) {
            return res.status(404).json({ message: 'No confirmed but not completed orders found' });
        }

        const itemQuery = `
            SELECT i.id_order, i.id_food, i.quantity, i.price, f.name
            FROM item i
            JOIN food f ON i.id_food = f.id_food;
        `;
        const resultItems = await pool.query(itemQuery);

        const itemsByOrder = resultItems.rows.reduce((acc, item) => {
            if (!acc[item.id_order]) {
                acc[item.id_order] = [];
            }
            acc[item.id_order].push(item);
            return acc;
        }, {});

        const orders = resultOrders.rows.map(order => ({
            order,
            items: itemsByOrder[order.id_order] || []
        }));

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching confirmed orders:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Lấy danh sách đơn hàng đã hoàn thành (có thêm thông tin items)
exports.getCompletedOrders = async (req, res) => {
    try {
        const orderQuery = `
            SELECT id_order, customer_name, phone_number, address, total_price, confirmed, completed, order_date
            FROM "order"
            WHERE completed = true;
        `;
        const resultOrders = await pool.query(orderQuery);

        if (resultOrders.rows.length === 0) {
            return res.status(404).json({ message: 'No completed orders found' });
        }

        const itemQuery = `
            SELECT i.id_order, i.id_food, i.quantity, i.price, f.name
            FROM item i
            JOIN food f ON i.id_food = f.id_food;
        `;
        const resultItems = await pool.query(itemQuery);

        const itemsByOrder = resultItems.rows.reduce((acc, item) => {
            if (!acc[item.id_order]) {
                acc[item.id_order] = [];
            }
            acc[item.id_order].push(item);
            return acc;
        }, {});

        const orders = resultOrders.rows.map(order => ({
            order,
            items: itemsByOrder[order.id_order] || []
        }));

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching completed orders:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Xác nhận đơn hàng
exports.confirmOrder = async (req, res) => {
    try {
        const { id_order } = req.params;

        // Kiểm tra xem đơn hàng đã được xác nhận chưa
        const checkQuery = `SELECT confirmed FROM "order" WHERE id_order = $1`;
        const checkResult = await pool.query(checkQuery, [id_order]);

        if (checkResult.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (checkResult.rows[0].confirmed) {
            return res.status(400).json({ message: 'Order already confirmed' });
        }

        // Cập nhật xác nhận đơn hàng
        const query = `
            UPDATE "order"
            SET confirmed = true
            WHERE id_order = $1
            RETURNING *;
        `;
        const result = await pool.query(query, [id_order]);

        res.json({ message: 'Order confirmed successfully', order: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Hoàn thành đơn hàng
exports.completeOrder = async (req, res) => {
    try {
        const { id_order } = req.params;

        const checkQuery = `SELECT confirmed FROM "order" WHERE id_order = $1`;
        const checkResult = await pool.query(checkQuery, [id_order]);

        if (checkResult.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!checkResult.rows[0].confirmed) {
            return res.status(400).json({ message: 'Order not confirmed yet' });
        }

        const query = `
            UPDATE "order"
            SET completed = true
            WHERE id_order = $1 AND confirmed = true
            RETURNING *;
        `;
        const result = await pool.query(query, [id_order]);

        res.json({ message: 'Order completed successfully', order: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        const { id_order } = req.params;

        // Xóa các item liên quan đến đơn hàng
        const deleteItemsQuery = `
            DELETE FROM item WHERE id_order = $1;
        `;
        await pool.query(deleteItemsQuery, [id_order]);

        // Xóa đơn hàng
        const deleteOrderQuery = `
            DELETE FROM "order" WHERE id_order = $1 RETURNING *;
        `;
        const result = await pool.query(deleteOrderQuery, [id_order]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order deleted successfully', order: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

