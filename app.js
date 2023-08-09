const express = require('express');
const app = express();
const socketConnect = require('./socket.js');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRouter = require('./routes/login.js');
const postRouter = require('./routes/board.js');
const likeRouter = require('./routes/like.js');

dotenv.config();
app.use(express.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));

/* 안드로이드와 HTTP 통신 */
// 로그인 관련 라우터
app.use('/login', userRouter);
// 게시물 관련 라우터
app.use('/posts', postRouter);
// 좋아요 기능 라우터
app.use('/like', likeRouter);


// 서버 가동
const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.PORT);
});

// 소켓 연결
socketConnect(server, app);