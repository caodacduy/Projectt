const pool=require('../configs/database');
exports.getAll=(callback)=>{
    pool.query('SELECT * FROM food',callback);
}
exports.getMoreFood=(id_category,callback)=>{
    pool.query('SELECT * FROM food where id_category =$1',[id_category],callback);
}

exports.post=(name,img,price,id_category,callback)=>{
    pool.query('INSERT INTO food (name,img,price,id_category) VALUES ($1, $2, $3,$4)', [name,img,price,id_category],callback)
}
exports.update=(name,img,price,id_category,id,callback)=>{
    pool.query('UPDATE food SET name=$1,img=$2,price=$3 , id_category=$4 WHERE id_food=$5', [name,img,price,id_category,id],callback)
}
exports.deleted=(id,callback)=>{
    pool.query('DELETE FROM food WHERE id_food = $1', [id],callback)
}
exports.getAllUser=(callback)=>{
    pool.query('SELECT * FROM users',callback);
}

exports.postUserModel=(username,phone,address,callback)=>{
    pool.query('INSERT INTO users (username,phone,address) VALUES ($1, $2, $3)', [username,phone,address],callback)
}
exports.deletedModelUser=(id,callback)=>{
    pool.query('DELETE FROM users WHERE id = $1', [id],callback)
}
exports.getMoreFood = async (id_category) => {
    const query = 'SELECT * FROM food WHERE id_category = $1';
    const result = await pool.query(query, [id_category]); // Thực hiện truy vấn
    return result.rows; // Trả về danh sách món ăn theo category
};
exports.getFoodPrices = async (foodIds) => {
    const query = `
        SELECT id_food, price
        FROM food
        WHERE id_food = ANY($1);
    `;
    const values = [foodIds];
    const result = await pool.query(query, values);
    return result.rows;
};