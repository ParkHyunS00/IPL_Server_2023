const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');


module.exports = (server, app) =>{
    const http = require('http').createServer(app);
    const io = socketIO(server, {path:'/socket.io'}, {maxHttpBufferSizke:1e8});
    let data = "";

    // 소켓 연결
    io.on('connection', (socket) => {
        console.log("User connect : " + socket.id);

        io.to(socket.id).emit('test', '...');

        // 클라이언트에서 obj 파일 달라는 이벤트 수신시
        // socket.on('connectReceive', (data) => {
        //     console.log(data);

        //     const filePath = path.join(__dirname, 'public', 'mesh.obj');
        //     console.log(filePath);

        //     fs.readFile(filePath, (err, fileContent) => {
        //       if (err){
        //         console.log(err);
        //       } else {

        //         // Base64 파일 인코딩
        //         let base64File = fileContent.toString('base64');
        //         socket.emit("testFile", {success: true, base64File});
        //       }
        //     })            
        // });

        /* 클라이언트에서 Base64 인코딩된 파일 분할 전송
         * 수신하여 합친 후 디코딩해서 저장
        */
        socket.on('sendFile', (encodedData) => {
          const total = encodedData.total;
          const count = encodedData.count;
          
          if (encodedData.count === encodedData.total){
            data += encodedData.data;
            console.log(`Done.  Length : ${data.length}`);

            const decodedFile = Buffer.from(data, 'base64');
            const savePath = path.join(__dirname, 'public', 'receive.obj');
            fs.writeFile(savePath, decodedFile, (err) => {
              if (err){
                console.log('Err : ' + err);
              } else {
                console.log('Save Complete : ' + savePath);
              }
            });

          } else{
            console.log(`${(count / total * 100.0).toFixed(2)}% Downloaded...`);
            data += encodedData.data;
          }
        });

        // 소켓 연결 해제시
        socket.on('disconnect', () => {
            console.log("user disconnected");
            data = "";
        })
    });
}