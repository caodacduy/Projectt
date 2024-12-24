const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();  // Tải các biến môi trường từ tệp .env



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'learn_nodejs',
        format: async (req, file) => ['jpg', 'png'].includes(file.mimetype.split('/')[1]) ? file.mimetype.split('/')[1] : null, // Kiểm tra format
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
