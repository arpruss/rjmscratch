//https://combinatronics.com/arpruss/rjmscratch/main/rjm.js

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
        rjm.ip = ip;
        console.log("connecting to "+rjm.ip);
        rjm.ws = new WebSocket("ws://"+ip+":14711");
    };
    
    chat({msg}){
        rjm.ws.send("chat.post("+msg+")");
        console.log("chat: "+msg);
    };
    
    
}

rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
