
// import object for UDP
var protocol = require('protocol');

var dgram = require('dgram');
// import object for generate uuid
const uuidv1 = require('uuid/v1');

var s = dgram.createSocket('udp4');

var sound = new Object();
sound.timestamp = Date.now();
sound.uid = uuidv1();

switch(process.argv[2]) {
    case "piano":
        sound.value = "ti-ta-ti";
        break;
    case "trumpet":
        sound.value = "pouet";
        break;
    case "flute":
        sound.value = "trulu";
        break;
    case "violin":
        sound.value = "gzi-gzi";
        break;
    case "drum":
        sound.value = "boum-boum";
        break;
    default:
        sound.value = "prout";
}

var payload = sound.JSON.stringify(sound);

message = new Buffer(payload);
s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes){
    console.log("Sending payload: " + payload + "via port " + s.address().port);
});