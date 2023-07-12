const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');

module.exports = (server, app) =>{
    const http = require('http').createServer(app);
    const io = socketIO(server, {path:'/socket.io'}, {maxHttpBufferSizke:1e8});

    // 소켓 연결
    io.on('connection', (socket) => {
        console.log("user connect : " + socket.id);

        // 클라이언트에서 obj 파일 달라는 이벤트 수신시
        socket.on('connectReceive', (data) => {
            console.log(data);

            const filePath = path.join(__dirname, 'public', 'mesh.obj');
            console.log(filePath);

            fs.readFile(filePath, (err, fileContent) => {
              if (err){
                console.log(err);
              } else {

                // Base64 파일 인코딩
                let base64File = fileContent.toString('base64');
                socket.emit("testFile", {success: true, base64File});
              }
            })            
        });

        // 소켓 연결 해제시
        socket.on('disconnect', () => {
            console.log("user disconnected");
        })

    });
}