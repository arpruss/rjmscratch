// https://combinatronics.com/arpruss/rjmscratch/main/rjm.js
// https://sheeptester.github.io/scratch-gui/?url=https://combinatronics.com/arpruss/rjmscratch/main/rjm.js

class RJMTurtle {
    constructor() {
        this.block = "1";
        this.nib = [[0,0,0]];
        this.pos = [0,0,0];
        this.penDown = true;
        this.TO_RADIANS = Math.PI / 180;
    }
    
    mmMultiply(a,b) {
        var c = [[0,0,0],[0,0,0],[0,0,0]];
        for (var i = 0; i < 3 ; i++) for (var j = 0; j < 3 ; j++)
          c[i][j] = a[i][0]*b[0][j] + a[i][1]*b[1][j] + a[i][2]*b[2][j];
        return c;
    };
    
    yawMatrix(angleDegrees) {
        var theta = angleDegrees * this.TO_RADIANS;
        return [[Math.cos(theta), 0., -Math.sin(theta)],
                [0.,         1., 0.],
                [Math.sin(theta), 0., Math.cos(theta)]];
    };
    
    rollMatrix(angleDegrees) {
        var theta = angleDegrees * this.TO_RADIANS;
        return [[Math.cos(theta), -Math.sin(theta), 0.],
                [Math.sin(theta), Math.cos(theta),0.],
                [0.,          0.,          1.]];
    };
    
    pitchMatrix(angleDegrees) {
        var theta = angleDegrees * this.TO_RADIANS;
        return [[1.,          0.,          0.],
                [0., Math.cos(theta),Math.sin(theta)],
                [0., -Math.sin(theta),Math.cos(theta)]];
    };
    
}

class RaspberryJamMod {
    constructor() {
        this.socket = null;
        this.turtle = new RJMTurtle();
    }
    
    getInfo() {
        return {
            "id": "RaspberryJamMod",
            "name": "RaspberryJamMod",
            
            "blocks": [{
                    "opcode": "connect_p",
                    "blockType": "command",
                    "text": "connect to [ip]",
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
                    "text": "say in chat [msg]",
                    "arguments": {
                        "msg": {
                            "type": "string",
                            "defaultValue": "Hello, World!"
                        },
                    }
            },            
            {
                    "opcode": "blockByName",
                    "blockType": "reporter",
                    "text": "block [name]",
                    "arguments": {
                        "name": {
                            "type": "string",
                            "defaultValue": "1",
                            "menu": "blockMenu"
                        }
                    }
            },            
            {
                    "opcode": "getBlock",
                    "blockType": "reporter",
                    "text": "block at ([x],[y],[z])",
                    "arguments": {
                        "x": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                        "y": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                        "z": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                    }
            },            
            {
                    "opcode": "getPlayerCoord",
                    "blockType": "reporter",
                    "text": "player [i]-coordinate",
                    "arguments": {
                        "i": {
                            "type": "number",
                            "defaultValue": 0,
                            "menu": "coordinateMenu"
                        }
                    }
            },            
            {
                    "opcode": "setBlock",
                    "blockType": "command",
                    "text": "put block [b] at ([x],[y],[z])",
                    "arguments": {
                        "x": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                        "y": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                        "z": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                        "b": {
                            "type": "string",
                            "defaultValue": "1"
                        },
                    }
            },            
            {
                    "opcode": "setPlayerPos",
                    "blockType": "command",
                    "text": "move player to ([x],[y],[z])",
                    "arguments": {
                        "x": {
                            "type": "number",
                            "defaultValue": 0
                        },
                        "y": {
                            "type": "number",
                            "defaultValue": 0
                        },
                        "z": {
                            "type": "number",
                            "defaultValue": 0
                        },
                    }
            },            
            {
                    "opcode": "moveTurtle",
                    "blockType": "command",
                    "text": "turtle forward [n]",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "1"
                        },
                    }
            },            
            {
                    "opcode": "backTurtle",
                    "blockType": "command",
                    "text": "turtle back [n]",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "1"
                        },
                    }
            },            
            {
                    "opcode": "yawTurtle",
                    "blockType": "command",
                    "text": "turtle turn yaw [n]\u00B0",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                    }
            },            
            {
                    "opcode": "pitchTurtle",
                    "blockType": "command",
                    "text": "turtle turn pitch [n]\u00B0",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                    }
            },            
            {
                    "opcode": "rollTurtle",
                    "blockType": "command",
                    "text": "turtle turn roll [n]\u00B0",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                    }
            },            
            {
                    "opcode": "leftTurtle",
                    "blockType": "command",
                    "text": "turtle left [n]\u00B0",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                    }
            },            
            {
                    "opcode": "rightTurtle",
                    "blockType": "command",
                    "text": "turtle right [n]\u00B0",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "0"
                        },
                    }
            },            
            {
                    "opcode": "penDown",
                    "blockType": "command",
                    "text": "turtle pen down",
                    "arguments": {
                    }
            },            
            {
                    "opcode": "penUp",
                    "blockType": "command",
                    "text": "turtle pen up",
                    "arguments": {
                    }
            },            
            {
                    "opcode": "turtleBlock",
                    "blockType": "command",
                    "text": "turtle pen block [b]",
                    "arguments": {
                        "b": {
                            "type": "string",
                            "defaultValue": "1",
                        }
                    }
            },            
            {
                    "opcode": "turtleThickness",
                    "blockType": "command",
                    "text": "turtle pen thickness [n]",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": 1,
                        }
                    }
            },            
            ],
        "menus": {
            coordinateMenu: [{text:"x",value:0}, {text:"y",value:1}, {text:"z",value:2}],
            blockMenu: [
                {text:"air",value:"0"},
                {text:"bed",value:"26"},
                {text:"bedrock",value:"7"},
                {text:"bookshelf",value:"47"},
                {text:"brick block",value:"45"},
                {text:"cactus",value:"81"},
                {text:"carpet black",value:"171,15"},
                {text:"carpet blue",value:"171,11"},
                {text:"carpet brown",value:"171,12"},
                {text:"carpet cyan",value:"171,9"},
                {text:"carpet gray",value:"171,7"},
                {text:"carpet green",value:"171,13"},
                {text:"carpet light blue",value:"171,3"},
                {text:"carpet light gray",value:"171,8"},
                {text:"carpet lime",value:"171,5"},
                {text:"carpet magenta",value:"171,2"},
                {text:"carpet orange",value:"171,1"},
                {text:"carpet pink",value:"171,6"},
                {text:"carpet purple",value:"171,10"},
                {text:"carpet red",value:"171,14"},
                {text:"carpet white",value:"171"},
                {text:"carpet yellow",value:"171,4"},
                {text:"chest",value:"54"},
                {text:"clay",value:"82"},
                {text:"coal block",value:"173"},
                {text:"coal ore",value:"16"},
                {text:"cobblestone",value:"4"},
                {text:"cobweb",value:"30"},
                {text:"crafting table",value:"58"},
                {text:"diamond block",value:"57"},
                {text:"diamond ore",value:"56"},
                {text:"dirt",value:"3"},
                {text:"door iron",value:"71"},
                {text:"door wood",value:"64"},
                {text:"double tallgrass",value:"175,2"},
                {text:"farmland",value:"60"},
                {text:"fence gate",value:"107"},
                {text:"fence",value:"85"},
                {text:"fire",value:"51"},
                {text:"flower cyan",value:"38"},
                {text:"flower yellow",value:"37"},
                {text:"furnace active",value:"62"},
                {text:"furnace inactive",value:"61"},
                {text:"glass pane",value:"102"},
                {text:"glass",value:"20"},
                {text:"glowstone block",value:"89"},
                {text:"gold block",value:"41"},
                {text:"gold ore",value:"14"},
                {text:"grass tall",value:"31"},
                {text:"grass",value:"2"},
                {text:"gravel",value:"13"},
                {text:"hardened clay stained black",value:"159,15"},
                {text:"hardened clay stained blue",value:"159,11"},
                {text:"hardened clay stained brown",value:"159,12"},
                {text:"hardened clay stained cyan",value:"159,9"},
                {text:"hardened clay stained gray",value:"159,7"},
                {text:"hardened clay stained green",value:"159,13"},
                {text:"hardened clay stained light blue",value:"159,3"},
                {text:"hardened clay stained light gray",value:"159,8"},
                {text:"hardened clay stained lime",value:"159,5"},
                {text:"hardened clay stained magenta",value:"159,2"},
                {text:"hardened clay stained orange",value:"159,1"},
                {text:"hardened clay stained pink",value:"159,6"},
                {text:"hardened clay stained purple",value:"159,10"},
                {text:"hardened clay stained red",value:"159,14"},
                {text:"hardened clay stained white",value:"159"},
                {text:"hardened clay stained yellow",value:"159,4"},
                {text:"ice",value:"79"},
                {text:"iron block",value:"42"},
                {text:"iron ore",value:"15"},
                {text:"ladder",value:"65"},
                {text:"lapis lazuli block",value:"22"},
                {text:"lapis lazuli ore",value:"21"},
                {text:"large fern",value:"175,3"},
                {text:"lava flowing",value:"10"},
                {text:"lava stationary",value:"11"},
                {text:"leaves birch",value:"18,6"},
                {text:"leaves jungle",value:"18,7"},
                {text:"leaves oak",value:"18,4"},
                {text:"leaves spruce",value:"18,5"},
                {text:"leaves",value:"18"},
                {text:"lilac",value:"175,1"},
                {text:"melon",value:"103"},
                {text:"moss stone",value:"48"},
                {text:"mushroom brown",value:"39"},
                {text:"mushroom red",value:"40"},
                {text:"obsidian",value:"49"},
                {text:"peony",value:"175,5"},
                {text:"quartz block",value:"155"},
                {text:"redstone block",value:"152"},
                {text:"redstone lamp active",value:"124"},
                {text:"redstone lamp inactive",value:"123"},
                {text:"redstone ore",value:"73"},
                {text:"rose bush",value:"175,4"},
                {text:"sand",value:"12"},
                {text:"sandstone",value:"24"},
                {text:"sapling",value:"6"},
                {text:"sea lantern",value:"169"},
                {text:"snow block",value:"80"},
                {text:"snow",value:"78"},
                {text:"stained glass black",value:"95,15"},
                {text:"stained glass blue",value:"95,11"},
                {text:"stained glass brown",value:"95,12"},
                {text:"stained glass cyan",value:"95,9"},
                {text:"stained glass gray",value:"95,7"},
                {text:"stained glass green",value:"95,13"},
                {text:"stained glass light blue",value:"95,3"},
                {text:"stained glass light gray",value:"95,8"},
                {text:"stained glass lime",value:"95,5"},
                {text:"stained glass magenta",value:"95,2"},
                {text:"stained glass orange",value:"95,1"},
                {text:"stained glass pink",value:"95,6"},
                {text:"stained glass purple",value:"95,10"},
                {text:"stained glass red",value:"95,14"},
                {text:"stained glass white",value:"95"},
                {text:"stained glass yellow",value:"95,4"},
                {text:"stairs cobblestone",value:"67"},
                {text:"stairs wood",value:"53"},
                {text:"stone brick",value:"98"},
                {text:"stone button",value:"77"},
                {text:"stone slab double",value:"43"},
                {text:"stone slab",value:"44"},
                {text:"stone",value:"1"},
                {text:"sugar cane",value:"83"},
                {text:"sunflower",value:"175"},
                {text:"TNT",value:"46"},
                {text:"torch",value:"50"},
                {text:"water flowing",value:"8"},
                {text:"water stationary",value:"9"},
                {text:"wood button",value:"143"},
                {text:"wood planks",value:"5"},
                {text:"wood",value:"17"},
                {text:"wool black",value:"35,15"},
                {text:"wool blue",value:"35,11"},
                {text:"wool brown",value:"35,12"},
                {text:"wool cyan",value:"35,9"},
                {text:"wool gray",value:"35,7"},
                {text:"wool green",value:"35,13"},
                {text:"wool light blue",value:"35,3"},
                {text:"wool light gray",value:"35,8"},
                {text:"wool lime",value:"35,5"},
                {text:"wool magenta",value:"35,2"},
                {text:"wool orange",value:"35,1"},
                {text:"wool pink",value:"35,6"},
                {text:"wool purple",value:"35,10"},
                {text:"wool red",value:"35,14"},
                {text:"wool white",value:"35"},
                {text:"wool yellow",value:"35,4"}
            ]            
            }
        };
    };

    connect({ip}){
        this.ip = ip;
        console.log("connecting to "+ip);
        this.socket = new WebSocket("ws://"+ip+":14711");
    };
    
    blockByName({name}){
        console.log("name "+name);
        return name;
    }
    
    sendAndReceive(msg) {
        var rjm = this;
        return new Promise(function(resolve, reject) {            
            rjm.socket.onmessage = function(event) {
                resolve(event.data.trim());
            };
            rjm.socket.onerror = function(err) {
                reject(err);
            };
            console.log("sending "+msg);
            rjm.socket.send(msg);
        });
    };

    drawLine(x1,y1,z1,x2,y2,z2) {
        var l = this.getLine(x1,y1,z1,x2,y2,z2);
        for (var i=0; i<l.length ; i++) {
            this.drawPoint(l[i][0],l[i][1],l[i][2]);
        }
    };
    
    yawTurtle({n}) {
        this.turtle.matrix = this.turtle.mmMultiply(this.turtle.matrix, this.turtle.yawMatrix(n));    
    };
    
    leftTurtle({n}) {
        this.turtle.matrix = this.turtle.mmMultiply(this.turtle.matrix, this.turtle.yawMatrix(-n));    
    };
    
    rightTurtle({n}) {
        this.turtle.matrix = this.turtle.mmMultiply(this.turtle.matrix, this.turtle.yawMatrix(n));    
    };
    
    pitchTurtle({n}) {
        console.log("pitch "+n);
        console.log(this.turtle.matrix);
        this.turtle.matrix = this.turtle.mmMultiply(this.turtle.matrix, this.turtle.pitchMatrix(n));    
        console.log(this.turtle.matrix);
    };
    
    rollTurtle({n}) {
        this.turtle.matrix = this.turtle.mmMultiply(this.turtle.matrix, this.turtle.rollMatrix(n));    
    };
    
    penUp() {
        this.turtle.penDown = false;
    }
    
    turtleBlock({b}) {
        this.turtle.block = b;
    }
    
    turtleThickness({n}) {
        if (n==0) {
            this.turtle.nib = [];
        }
        else if (n==1) {
            this.turtle.nib = [[0,0,0]];
        }
        else if (n==2) {
            this.turtle.nib = [];
            for (var x=0; x<=1; x++) 
                for (var y=0; y<=1; y++) 
                    for (var z=0; z<=1; z++) 
                        this.turtle.nib.push([x,y,z]);
        }
        else {
            var r2 = n*n/4;
            var d = Math.ceil(n/2);
            this.turtle.nib = [];
            for (var x=-d; x<=d; x++) 
                for (var y=-d; y<=d; y++) 
                    for (var z=-d; z<=d; z++) 
                        if (x*x+y*y+z*z <= r2)
                            this.turtle.nib.push([x,y,z]);
        }
    }
    
    penDown() {
        this.turtle.penDown = true;
    }
    
    drawPoint(x0,y0,z0) {
        var l = this.turtle.nib.length;
        if (l == 0) {
            return;
        }
        else if (l == 1) {
            this.setBlock({x:x0,y:y0,z:z0,b:this.turtle.block});
            return;
        }

        for (var i = 0 ; i < l ; i++) {
            var p = this.turtle.nib[i];
            var x = p[0] + x0;
            var y = p[1] + y0;
            var z = p[2] + z0;
            this.setBlock({x:x,y:y,z:z,b:this.turtle.block});
        }
    };

    moveTurtle({n}) {
        var newX = this.turtle.pos[0] + this.turtle.matrix[0][2] * n;
        var newY = this.turtle.pos[1] + this.turtle.matrix[1][2] * n;
        var newZ = this.turtle.pos[2] + this.turtle.matrix[2][2] * n;
        if (this.turtle.penDown)
            this.drawLine(this.turtle.pos[0],this.turtle.pos[1],this.turtle.pos[2],newX,newY,newZ);
        this.turtle.pos[0] = newX;
        this.turtle.pos[1] = newY;
        this.turtle.pos[2] = newZ;
    }; 
    
    backTurtle({n}) {
        moveTurtle({n:n});
    }; 
    
    getPosition() {
        return this.sendAndReceive("player.getPos()")
            .then(pos => {
                var p = pos.split(",");
                return [parseFloat(p[0]),parseFloat(p[1]),parseFloat(p[2])];
            });
    };
    
    getRotation() {
        return this.sendAndReceive("player.getRotation()")
            .then(r => {
                return parseFloat(r);
            });
    };
    
    getBlock({x,y,z}) {
        return this.sendAndReceive("world.getBlockWithData("+Math.floor(x)+","+Math.floor(y)+","+Math.floor(z)+")")
            .then(b => {
                console.log("block "+b);
                return b;
            });
    };

    getPlayerCoord({i}) {
        return this.sendAndReceive("player.getPos()")
            .then(pos => {
                console.log(p);
                var p = pos.split(",");
                return parseFloat(p[i]);
            });
    };

    connect_p({ip}){
        this.ip = ip;
        console.log("connecting to "+ip);
        var rjm = this;
        return new Promise(function(resolve, reject) {            
            rjm.socket = new WebSocket("ws://"+ip+":14711");
            rjm.socket.onopen = function() {                
                console.log("opened");
                resolve();
            };
            rjm.socket.onerror = function(err) {
                reject(err);
            };
        }).then(result => rjm.getPosition().then( result => {
            rjm.playerPos = result;
            rjm.turtle.pos = result;
            console.log("player position "+rjm.playerPos);
        })).then (result => rjm.getRotation().then( result => {
            rjm.playerRot = result;
            rjm.turtle.matrix = rjm.turtle.yawMatrix(Math.floor(0.5+result/90)*90);
            console.log("player rotation "+rjm.playerRot);
        }));
    };
    
    chat({msg}){
        this.socket.send("chat.post("+msg+")");
        console.log("chat: "+msg);
    };
    
    getLine(x1,y1,z1,x2,y2,z2) {
        var line = [];
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        z1 = Math.floor(z1);
        x2 = Math.floor(x2);
        y2 = Math.floor(y2);
        z2 = Math.floor(z2);
        var point = [x1,y1,z1];
        var dx = x2 - x1;
        var dy = y2 - y1;
        var dz = z2 - z1;
        var x_inc = dx < 0 ? -1 : 1;
        var l = Math.abs(dx);
        var y_inc = dy < 0 ? -1 : 1;
        var m = Math.abs(dy);
        var z_inc = dz < 0 ? -1 : 1;
        var n = Math.abs(dz);
        var dx2 = l * 2;
        var dy2 = m * 2;
        var dz2 = n * 2;

        if (l >= m && l >= n) {
            var err_1 = dy2 - l;
            var err_2 = dz2 - l;
            for (var i=0; i<l; i++) {
                line.push([point[0],point[1],point[2]]);
                if (err_1 > 0) {
                    point[1] += y_inc;
                    err_1 -= dx2;
                }
                if (err_2 > 0) {
                    point[2] += z_inc;
                    err_2 -= dx2;
                }
                err_1 += dy2;
                err_2 += dz2;
                point[0] += x_inc;
            }
        }
        else if (m >= l && m >= n) {
            err_1 = dx2 - m;
            err_2 = dz2 - m;
            for (var i=0; i<m; i++) {
                line.push([point[0],point[1],point[2]]);
                if (err_1 > 0) {
                    point[0] += x_inc;
                    err_1 -= dy2;
                }
                if (err_2 > 0) {
                    point[2] += z_inc;
                    err_2 -= dy2;
                }
                err_1 += dx2;
                err_2 += dz2;
                point[1] += y_inc;
            }
        }
        else {
            err_1 = dy2 - n;
            err_2 = dx2 - n;
            for (var i=0; i < n; i++) {
                line.push([point[0],point[1],point[2]]);
                if (err_1 > 0) {
                    point[1] += y_inc;
                    err_1 -= dz2;
                }
                if (err_2 > 0) {
                    point[0] += x_inc;
                    err_2 -= dz2;
                }
                err_1 += dy2;
                err_2 += dx2;
                point[2] += z_inc;
            }
        }
        line.push([point[0],point[1],point[2]]);
        if (point[0] != x2 || point[1] != y2 || point[2] != z2) {
            line.push([x2,y2,z2]);
        }
        return line;
    };
    
    setBlock({x,y,z,b}) {
      x = Math.floor(x);
      y = Math.floor(y);
      z = Math.floor(z);
      if (b != "0" && x == Math.floor(this.playerPos[0]) && z == Math.floor(this.playerPos[2]) && 
            y == Math.floor(this.playerPos[1])+1) {
                this.playerPos[1]++; 
                this.socket.send("player.setPos("+this.playerPos[0]+","+this.playerPos[1]+","+this.playerPos[2]);
      }
      this.socket.send("world.setBlock("+x+","+y+","+z+","+b+")");
    };

    setPlayerPos({x,y,z}) {
      this.socket.send("player.setPos("+x+","+y+","+z+")");
    };
}

rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
