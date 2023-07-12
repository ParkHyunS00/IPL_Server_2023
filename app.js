const express = require('express');
const app = express();
const socketConnect = require('./socket.js');
const dotenv = require('dotenv');
const db = require('./config/db.js');

dotenv.config();
app.use('/public', express.static('public'));

// 서버 가동
const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.PORT);

    // Node - Mysql DB 연결 테스트
    db.query('select * from test', (err, result, fields) => {
        if (err){
            console.log(err);
        } else {
            console.log(result[0].id + '  ' + result[0].pwd);
        }
    });
});

// 소켓 연결
socketConnect(server, app);