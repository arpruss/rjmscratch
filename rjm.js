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
            {
                    "opcode": "setBlock",
                    "blockType": "command",
                    "text": "At ([x],[y],[z]) put block [b]",
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
                    "opcode": "moveTurtle",
                    "blockType": "command",
                    "text": "Move turtle [n] steps",
                    "arguments": {
                        "n": {
                            "type": "number",
                            "defaultValue": "1"
                        },
                    }
            },            
            ],
        "menus": {}
        };
    };

    connect({ip}){
        this.ip = ip;
        console.log("connecting to "+ip);
        this.socket = new WebSocket("ws://"+ip+":14711");
    };
    
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
    
    drawPoint(x0,y0,z0) {
        var l = this.turtle.nib.length;
        if (l == 0) {
            return;
        }
        else if (l == 1) {
            this.setBlock(x0,y0,z0,this.turtle.block);
            return;
        }

        for (var i = 0 ; i < l ; i++) {
            var p = this.turtle.nib[i];
            var x = p[0] + x0;
            var y = p[1] + y0;
            var z = p[2] + z0;
            this.setBlock(x,y,z,this.turtle.block);
        }
    };

    moveTurtle({n}) {
        var newX = this.turtle.pos[0] + MCPI.matrix[0][2] * n;
        var newY = this.turtle.pos[1] + MCPI.matrix[1][2] * n;
        var newZ = this.turtle.pos[2] + MCPI.matrix[2][2] * n;
        if (this.turtle.penDown)
            this.drawLine(this.turtle.pos[0],this.turtle.pos[1],this.turtle.pos[2],newX,newY,newZ);
        this.turtle.pos[0] = newX;
        this.turtle.pos[0] = newY;
        this.turtle.pos[0] = newZ;
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
            .then(pos => {
                var p = pos.split(",");
                return [parseFloat(p[0]),parseFloat(p[1]),parseFloat(p[2])];
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
            rjm.turtle.matrix = rjm.turtle.yawMatrix(math.floor(0.5+result[1]/90)*90);
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
/*      if (block != "0" && Math.floor(x) == Math.floor(this.playerX) && Math.floor(z) == Math.floor(this.playerZ)
          && (Math.floor(y) >= this.playerShiftedHeight) ) {
            this.playerShiftedHeight = Math.floor(y) + 1;
            this.socket.send("player.setPos("+this.playerX+","+this.playerShiftedHeight+","+this.playerZ+")");
      } */
      console.log("Put "+b+" at "+x+" "+y+" "+z);
      this.socket.send("world.setBlock("+x+","+y+","+z+","+b+")");
    };
}

rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
