// import object for protocol
var protocol = require('./protocol');
// import object for UDP
var dgram = require('dgram');
//import object for TCP
var net = require('net');

var s = dgram.createSocket('udp4');

var arrayOfMusician = [];

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
        if (!arrayOfMusician.length) {
            musicos.uuid = message.uid;
            musicos.activeSince = message.timestamp;
            musicos.instrument = message.value;
            arrayOfMusician.push(musicos);
        }
        arrayOfMusician.forEach(function (key, value) {
            if (0 != (key.uuid.localeCompare(message.uid))) {
                musicos.uuid = message.uid;
                musicos.activeSince = message.timestamp;
                musicos.instrument = message.value;
                arrayOfMusician.push(musicos);
            }
            else{
                key.timestamp = message.timestamp;
            }
        });
    });
}

function tcpServer() {
    var server = net.createServer(function(socket) {
        var payload = JSON.stringify(arrayOfMusician);
        socket.write(payload+'\r\n');
        socket.pipe(socket);
    });

    server.listen(protocol.PROTOCOL_PORT_TCP, protocol.PROTOCOL_HOST);
}

function updateMusicianList() {
    updateMusicianList.prototype.update = function(){
        arrayOfMusician.forEach(function(key,value){
            if(( Date.now()/1000 - key.activeSince/1000) > 5){
                var index = value;
                if (index > -1) {
                    arrayOfMusician.splice(index, 1);
                }
            }
        });
    }
    setInterval(this.update.bind(this), 1000);
}

var udp = new udpReception();
//var update = new updateMusicianList();
var tcp = new tcpServer();




