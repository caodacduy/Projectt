const { Pool } = require('pg');
const db= {
    user: 'postgres', 
    database: 'odderFood', 
    password: 'dacduy2005', 
    host: 'localhost', 
    port: 5432, 
};
const pool = new Pool(db);
// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log('Connection successful:', res.rows);
//     }
//     pool.end();
//   });
 module.exports=pool;