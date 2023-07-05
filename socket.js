
module.exports = (server, app) =>{
    const http = require('http').createServer(app);
    const {Server} = require('socket.io');
    const io = new Server(http);

    io.on('connection', (socket) => {
        console.log('Client Connected');

        socket.on('data', (data) => {
            console.log(data);

            socket.emit('data', 'Send');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected');
        });
    });
}