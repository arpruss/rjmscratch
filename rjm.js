class RaspberryJamMod {
    getInfo() {
        return {
            "id": "RaspberryJamMod",
            "name": "RaspberryJamMod",
            
            "blocks": [{
                    "opcode": "connect",
                    "blockType": "command",
                    "text": "Connect to [ip]",
                    "arguments": {
                        "ip": {
                            "type": "string",
                            "defaultValue": "localhost"
                        },
                    }
            }],
        "menus": {}
    };
    }

    connect({ip}){
        rjm.ip = ip;
        console.log("connecting to "+rjm.ip);
        rjm.ws = new WebSocket("ws://"+ip+":14711");
        console.log(rjm.ws);
    };
}

rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
