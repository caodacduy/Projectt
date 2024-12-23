const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dkqcblgvv',
    api_key: '812268937388485',
    api_secret: 'uxW-yCxDSEsEUQMvm_0rxikUmC8', // Xóa thông tin nhạy cảm trước khi đẩy lên public repository
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
