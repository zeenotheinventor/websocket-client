var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {

        if (message.type === 'utf8') {
            console.log("Server sent: '" + message.utf8Data + "'");
        }

        if (message.type === 'binary') {

            console.log((message.binaryData[0] >>> 0).toString(2));
        }
    });

    function sendNumber() {
        if (connection.connected) {
            const buffer = Buffer.alloc(1, 0b0000);

            const deskLightMask = 0b1;
            const musicMask = 0b10;

            // use or to turn on flags
            buffer[0] = buffer[0] | deskLightMask;

            // use or to turn on flags
            buffer[0] = buffer[0] | musicMask;

            // use xor to turn off flags
            buffer[0] = buffer[0] ^ deskLightMask;

            buffer[0] = Math.floor(Math.random() * Math.floor(255));

            connection.sendBytes(buffer);
            setTimeout(sendNumber, 2000);
        }
    }
    sendNumber();
});

client.connect('ws://localhost:8080/', 'echo-protocol');