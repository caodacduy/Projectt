const pool=require('../configs/database');
const { getAll, update, post, deleted, getAllUser, postUserModel, getMoreFood, deletedModelUser } = require('../models/foodModel');
exports.getAllFood=async(req,res)=>{
    getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results.rows);
    }
)
}
exports.getFood=async(req,res)=>{
    const { id_category } = req.params;
    console.log(id_category)
    getMoreFood(id_category,(err, results) => {

        if (err) return res.status(500).send(err);
        res.json(results.rows);
    }
)
}
exports.postFood = async (req, res) => {
    try {
        const img = req.file; // Lấy thông tin file từ req.file
        const { name, price, id_category } = req.body;

        if (!img || !img.path) {
            return res.status(400).json({ message: 'Image upload failed' });
        }

        post(name, img.path, price, id_category, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error inserting food item');
            }
            res.json({
                id: result.insertId,
                name,
                img: img.path, // URL ảnh trên Cloudinary
                price,
                id_category,
                completed: 0,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updateFood = async (req, res) => {
    const { name, price, id_category } = req.body;
    const { id } = req.params;

    // Kiểm tra nếu có file được upload
    const imgPath = req.file ? req.file.path : null;

    update(name, imgPath, price, id_category, id, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ 
            id: result.insertId, 
            name, 
            img: imgPath, // Đường dẫn ảnh (hoặc null nếu không có ảnh mới)
            price, 
            id_category, 
            completed: 0 
        });
    });
};

exports.deleteFood=async(req,res)=>{
    const { id } = req.params;
    deleted(id, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Todo deleted successfully' });
    }) 

}
exports.getUser=async(req,res)=>{
    getAllUser((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results.rows);
    }
)
}
exports.postUsers=async(req,res)=>{
    const {username,phone,address } = req.body;
    postUserModel(username,phone,address, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, username,phone,address, completed: 0});
    }) 
};
exports.deleteUser=async(req,res)=>{
    const { id } = req.params;
    deletedModelUser(id, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Todo deleted successfully' });
    }) 
}