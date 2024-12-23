const express = require('express');
const app = express();
var cors = require('cors')
const port = 8080;
const bodyParser = require('body-parser');
const routerAdmin=require("./routers/admin/routers")
app.use(cors())

app.use(express.json());  
app.use(express.urlencoded({extended:true} ));
app.get('/', (req, res) => {
  res.send('Hello Express!');
});
app.use('/admin',routerAdmin)
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
