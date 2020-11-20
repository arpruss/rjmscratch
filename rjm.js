//https://combinatronics.com/arpruss/rjmscratch/main/rjm.js

class RaspberryJamMod {
    constructor() {
        this.TO_RADIANS = Math.PI / 180;
        this.block = "1";
        this.penDown = true;
        this.nib = [[0,0,0]];
        this.ws = null;
    }
    
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
            },
            {
                    "opcode": "chat",
                    "blockType": "command",
                    "text": "Say in chat [msg]",
                    "arguments": {
                        "msg": {
                            "type": "string",
                            "defaultValue": "Hello, World!"
                        },
                    }
            },            
            ],
        "menus": {}
        };
    }

    connect({ip}){
        this.ip = ip;
        console.log("connecting to "+ip);
        this.ws = new WebSocket("ws://"+ip+":14711");
    };
    
    chat({msg}){
        this.ws.send("chat.post("+msg+")");
        console.log("chat: "+msg);
    };
    
    
}

rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
