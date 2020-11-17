class RaspberryJamMod {
}
Scratch.extensions.register(new RaspberryJamMod());

getInfo() {
    return {
        "id": "RaspberryJamMod",
        "name": "RaspberryJamMod",
        "blocks": [
        ],
        "menus": { /
        }
    };
}

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
rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
