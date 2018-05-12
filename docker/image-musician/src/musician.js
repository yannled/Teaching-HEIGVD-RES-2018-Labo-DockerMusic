// import object for protocol
var protocol = require('./protocol');
// import object for UDP
var dgram = require('dgram');
// import object for generate uuid
const uuidv1 = require('uuid/v1');

var s = dgram.createSocket('udp4');

var musicianUuid = uuidv1();
function musician(instrument) {
    this.instrument = instrument;

    musician.prototype.update = function() {
        // set the payload to send.
        var sound = new Object();
        var temp = new Date();
        sound.timestamp = temp.toISOString();
        sound.uid = musicianUuid;

        // set the sound according to the instrument.
        switch (instrument) {
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

        var payload = JSON.stringify(sound);

        // set the message and send it
        message = new Buffer(payload);
        s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function (err, bytes) {
            console.log("Sending payload: " + payload + "via port " + s.address().port);
        });
    }
    setInterval(this.update.bind(this), 5000);
}

var instrument = process.argv[2];

var m1 = new musician(instrument);