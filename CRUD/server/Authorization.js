const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

const SECRET = 123;
const PORT = 3000;
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'JoinTask'
})
db.getConnection((err) => {
    if (err) {
        console.error('error in connecting',err);
        
    }
    console.log('Connected');
    
})

app.listen(PORT,() => {
    console.log(`server is listening to the port ${PORT}`);
    
})
