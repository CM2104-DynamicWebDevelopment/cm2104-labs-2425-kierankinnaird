var socket = io();

$('#form').submit(function () {
    var username = $('#username').val().trim();
    var message = $('#input').val().trim();

    if (username && message) {
        socket.emit('chat message', { user: username, text: message });
        $('#input').val(""); // Clear message input
    }
    return false; // Prevent page refresh
});

socket.on('chat message', function(data) {
    $('#messages').append(`<li><strong>${data.user}:</strong> ${data.text}</li>`);
    window.scrollTo(0, document.body.scrollHeight);
});