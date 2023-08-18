const express = require('express');
const app = express();
const socketConnect = require('./socket.js');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRouter = require('./routes/login.js');
const postRouter = require('./routes/board.js');
const likeRouter = require('./routes/like.js');

const path = require('path');
const fs = require('fs');

dotenv.config();
app.use(express.urlencoded({limit: '50mb', extended : true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/public', express.static('public'));

/* 안드로이드와 HTTP 통신 */
// 로그인 관련 라우터
app.use('/login', userRouter);
// 게시물 관련 라우터
app.use('/posts', postRouter);
// 좋아요 기능 라우터
app.use('/like', likeRouter);

app.get('/getTest', (req, res) => {
    // try {
    //     console.log(req.body);
    //     // Base64 디코딩
    //     const decodedFile = Buffer.from(req.body.data, 'base64');
    //     const savePath = path.join(__dirname, 'public', 'ttest.obj');

    //     // 파일 저장
    //     fs.writeFile(savePath, decodedFile, (err) => {
    //       if (err){
    //         console.log('Err : ' + err);
    //       } else {
    //         console.log('Save Complete : ' + savePath);
    //       }
    //     });


    //     var isJson = JSON.parse(JSON.stringify(req.body));
    //     console.log(typeof isJson === 'object');
    //   } catch (e) {
    //     console.log(e.message);
    //   }
    
    res.status(200).json({message: 'server'});
})

// 서버 가동
const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.PORT);
});

// 소켓 연결
socketConnect(server, app);