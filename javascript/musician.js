
// import object for UDP
var dgram = require('dgram');
// import object for generate uuid
const uuidv1 = require('uuid/v1');

var s = dgram.createSocket('udp4');

var sound = new Object();
sound.timestamp = Date.now();
sound.value = "lalalaa";
sound.uid = uuidv1();

var payload = sound.JSON.stringify(sound);

message = new Buffer(payload);
s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes){
    console.log("Sending payload: " + payload + "via port " + s.address().port);
});

//TODO: Voir pour ajouter  protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS comme il a fait dans son exemple avec un fichier externe sous forme de module (voir son exemple github.