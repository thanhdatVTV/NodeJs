require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');

//console.log(process.env);

const app = express();
const port = process.env.PORT || 3004;
const hostname = process.env.HOST_NAME;

//config template engine
configViewEngine(app);

//Khai bao router
app.use('/', webRoutes);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})