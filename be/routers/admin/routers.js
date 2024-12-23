const express = require('express');
const router = express.Router();
const pool=require('../../configs/database');
const { Pool } = require('pg');
const { getAllFood, postFood, updateFood, deleteFood, getUser, postUsers, getFood, deleteUser } = require('../../controllers/foodController');

const uploadCloud =require('../../configs/cloudinary');
const {
    confirmOrder,
    completeOrder,
    deleteOrder,
    getAllOrders,
    getOrderById, 
    createOrder, 
    getOrder,
    getNotConfirmedOrders,
    getConfirmedOrders,
    getCompletedOrders,
} = require('../../controllers/orderController');
//Food
router.get('/api/food',getAllFood);
router.get('/api/food/:id_category',getFood )
router.post('/api/food',uploadCloud.single('img'),postFood)
router.put('/api/food/:id',uploadCloud.single('img'),updateFood);
router.delete('/api/food/:id',deleteFood);
//Users
router.get('/api/users',getUser)
router.post('/api/users',postUsers)
router.delete('/api/users/:id',deleteUser)
//

router.post('/api/order', createOrder);

// Route lấy thông tin đơn hàng theo id
router.get('/api/order/:id_order', getOrder);

router.get('/api/order',getAllOrders)
// Router để xác nhận đơn hàng
router.put('/api/order/confirm/:id_order', confirmOrder);

// Router để hoàn thành đơn hàng
router.put('/api/order/complete/:id_order', completeOrder);

// Router để xóa đơn hàng
router.delete('/api/order/:id_order', deleteOrder);

router.get('/api/notconfirmed', getNotConfirmedOrders);

// Lấy danh sách đơn hàng đã xác nhận
router.get('/api/confirmed', getConfirmedOrders);

// Lấy danh sách đơn hàng đã hoàn thành
router.get('/api/completed', getCompletedOrders);

// router.put('/:id', updateTodo);
// router.delete('/:id', deleteTodo);

module.exports = router;