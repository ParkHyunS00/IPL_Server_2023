const express = require('express');
const app = express();
const socketConnect = require('./socket.js');
const dotenv = require('dotenv');
const db = require('./config/db.js');
const loginSystem = require('./services/loginSystem.js');

dotenv.config();
app.use('/public', express.static('public'));

// 서버 가동
const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.PORT);
});

// 소켓 연결
socketConnect(server, app);