// https://combinatronics.com/arpruss/rjmscratch/main/rjm.js

class RaspberryJamMod {
    getInfo() {
        return {
            "id": "RaspberryJamMod",
            "name": "RaspberryJamMod",
            "blocks": [{
                    "opcode": "connect",
                    "blockType": "command",
                    "text": "connect to [ip]",
                    "arguments": {
                        "ip": {
                            "type": "string",
                            "defaultValue": "localhost"
                        },
                    }
                },
            }],
        "menus": { 
        }
    };

    connect({ip}) { 
        rjm.socket = new WebSocket("ws://" + ip  + ":14711");
    }
}
alert("hello");
rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
alert("reg");
