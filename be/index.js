const express = require('express');
const app = express();
var cors = require('cors')
require('dotenv').config();
const port = 8081;
const bodyParser = require('body-parser');
const routerAdmin=require("./routers/admin/routers")
app.use(cors())

app.use(express.json());  
app.use(express.urlencoded({extended:true} ));
app.get('/', (req, res) => {
  res.send('Hello Express!');
});
app.use('/admin',routerAdmin)
process.on('uncaughtException', function (err) {
  console.log(err);
});
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

