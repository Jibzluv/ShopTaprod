const client = require('./connection.js')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const userRoutes=require('./routes/user');
app.use(express.json());

//empêcher les erreurs CORS (permettre au front et back d'intéragir entre eux.)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('',userRoutes);
client.connect();
module.exports=app;