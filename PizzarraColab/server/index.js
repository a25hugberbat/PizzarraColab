const { createServer } = require('node:http');
const { Server } = require('socket.io');

const server = createServer();
const io = new Server(server, {
    cors: { origin: '*' }
});

const sales = {};

function llistaUsuaris(roomName) {
    return Object.values(sales[roomName].usuaris);
}

io.on('connection', (socket) => {

    console.log('a user connected');
    //Entrar a una sala (si no existeix, es crea)
    socket.on('join_room', ({ roomName, username}, callback) => {
        if (!sales[roomName]) {
            sales[roomName] = { usuaris: {}, tracos: [] };
        }

        socket.join(roomName);

        socket.data.roomName = roomName;
        socket.data.username = username;
        socket.data.color = 'hsl(' + Math.floor(Math.random() * 360) + ', 70%, 50%)';
        socket.data.tracActual = null;

        sales[roomName].usuaris[socket.id] = {
            username: username,
            color: socket.data.color
        };

        //Nova llista d'usuaris per a tota la sala
        io.to(roomName).emit('room_users', llistaUsuaris(roomName));
    });

    //Desconnexió
    socket.on('disconnect', () =>{
        const roomName = socket.data.roomName;
        if (!roomName) return;

        delete sales[roomName].usuaris[socket.id];
        io.to(roomName).emit('room_users'. llistaUsuaris(roomName));
        io.to(roomName).emit('user_left', {id: socket.id});
    });

});


server.listen(3000, () => {
    console.log('http://localhost:3000');
});