const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render('pages/index');
});

io.on('connection', function(socket){
    console.log('a user connected');

    // ✅ FIX: Move socket.on('disconnect') inside the connection event
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(8080, function(){
    console.log('listening on port 8080');
});
<<<<<<< Tabnine <<<<<<<
/**//+
 * Binds the server to listen on the specified port and starts the server.//+
 *//+
 * @param {number} port - The port number on which the server should listen.//+
 * @param {function} callback - A function to be called when the server starts listening.//+
 *//+
 * @returns {http.Server} - The server instance.//+
 *//+
 * @example//+
 * http.listen(8080, function() {//+
 *     console.log('listening on port 8080');//+
 *     socket.on('disconnect', function() {//+
 *         console.log('user disconnected');//+
 *     });//+
 * });//+
 *///+
http.listen(8080, function() {//+
    console.log('listening on port 8080');//+
    socket.on('disconnect', function() {//+
        console.log('user disconnected');//+
    });//+
});//+
>>>>>>> Tabnine >>>>>>>// {"conversationId":"7450aa64-7f31-4629-a037-a60e2d6f81f1","source":"instruct"}