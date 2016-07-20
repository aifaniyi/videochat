var io = function (io) {
    'use strict';
    io.on('connection', function (socket) {
        console.log("received connection from client id: %s", socket.id);
        /* handle events */

        /* disconnect event */
        socket.on('disconnect', function(){
            console.log("user id  %s disconnected", socket.id);
        });

        /* call */
        socket.on('videodata', function(msg){
            socket.broadcast.emit('videodata', msg);
        });

        socket.on('endCall', function(msg){
            socket.broadcast.emit('endCall', msg);
        });

        socket.on('call', function(msg){
            socket.broadcast.emit('call', msg);
        });

        socket.on('accept', function(msg){
            socket.broadcast.emit('accept', msg);
        });

        socket.on('reject', function(msg){
            socket.broadcast.emit('reject', msg);
        });

    });
};

module.exports = io;
