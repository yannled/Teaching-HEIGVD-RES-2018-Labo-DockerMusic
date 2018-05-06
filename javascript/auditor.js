// import object for protocol
var protocol = require('./protocol');
// import object for UDP
var dgram = require('dgram');
//import object for TCP
var net = require('net');

var s = dgram.createSocket('udp4');

var arrayOfMusician = [];

function remove(from, to) {
    var rest = arrayOfMusician.slice((to || from) + 1 || arrayOfMusician.length);
    arrayOfMusician.length = from < 0 ? arrayOfMusician.length + from : from;
    return arrayOfMusician.push.apply(arrayOfMusician, rest);
}

function udpReception() {
// listen the multicast discution.
    s.bind(protocol.PROTOCOL_PORT, function () {
        console.log("Joining multicast group");
        s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
    });

    // if a message is receive we show it.
    s.on('message', function (msg, source) {
        console.log("Data has arrived: " + msg + ". Source port: " + source.port);

        var message = JSON.parse(msg);

        var musicos = new Object();

        // il there is no message in the array we add one.
        if (!arrayOfMusician.length) {
            musicos.uuid = message.uid;
            musicos.activeSince = message.timestamp;
            musicos.instrument = message.value;
            arrayOfMusician.push(musicos);
        }

        var exist = false;

        // for each message in the array :
        for(var i= 0; i < arrayOfMusician.length; i++) {

            if (arrayOfMusician[i].uuid === message.uid) {
                arrayOfMusician[i].activeSince = message.timestamp;
                exist = true;
            }
        }

        // if the message uuid is a new one we add it.
        if (!exist) {
            musicos.uuid = message.uid;
            musicos.activeSince = message.timestamp;
            musicos.instrument = message.value;
            arrayOfMusician.push(musicos);
        }

    });

}

function tcpServer() {
    var server = net.createServer(function (socket) {
        var payload = JSON.stringify(arrayOfMusician);
        socket.write(payload + '\r\n');
        socket.pipe(socket);
    });

    server.listen(protocol.PROTOCOL_PORT_TCP, protocol.PROTOCOL_HOST);
}

function updateMusicianList() {
    updateMusicianList.prototype.update = function () {
        for(var i= 0; i < arrayOfMusician.length; i++) {
            var now = Date.now();
            var active_since = arrayOfMusician[i].activeSince;
            var delaySeconds = (now - active_since)/1000;
            if (delaySeconds > 5) {
                remove(i);
            }
        }
    }
    setInterval(this.update.bind(this), 500);
}

var udp = new udpReception();
var update = new updateMusicianList();
var tcp = new tcpServer();




