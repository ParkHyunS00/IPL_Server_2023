const express = require('express');
const app = express();
const socketConnect = require('./socket.js');
const dotenv = require('dotenv');
const loginSystem = require('./services/loginSystem.js');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const path = require('path');
const board = require('./services/board.js');

dotenv.config();
app.use(express.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));

// 안드로이드와 HTTP 통신
app.post('/test', (req, res) => {
    
    console.log(req.body);
    
    res.status(200).json({message : "Hello POST API TEST"});
   
});

app.get('/getTest', (req, res) => {
    console.log(req.query.name);
    res.status(200).json({message : "Hello GET API TEST"});
});

// 서버 가동
const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.PORT);

});



// 소켓 연결
socketConnect(server, app);

const data = {
    title: 'test',
    content: 'test',
    image_name: 'cake1.jpg',
    user_id: 'test'
}

board.insertPost(data)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log('Error: ', error.message);
    })