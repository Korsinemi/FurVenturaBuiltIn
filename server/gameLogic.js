import { Server } from 'socket.io';

function setupGame(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('jump', () => {
            console.log('jump event received');
            io.emit('jump');
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

export default setupGame;