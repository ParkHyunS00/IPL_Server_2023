const express = require('express');
const app = express();

require('dotenv').config({path : './.env'});
app.use('/public', express.static('public'));

const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.PORT);
});
const socketConnect = require('./socket.js');

socketConnect(server, app);