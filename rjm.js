// https://combinatronics.com/arpruss/rjmscratch/main/rjm.js
// https://sheeptester.github.io/scratch-gui/?url=https://combinatronics.com/arpruss/rjmscratch/main/rjm.js

class RaspberryJamMod {
    constructor() {
        this.TO_RADIANS = Math.PI / 180;
        this.block = "1";
        this.penDown = true;
        this.nib = [[0,0,0]];
        this.socket = null;
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
            ],
        "menus": {}
        };
    }

    connect({ip}){
        this.ip = ip;
        console.log("connecting to "+ip);
        this.socket = new WebSocket("ws://"+ip+":14711");
    };
    
    chat({msg}){
        this.socket.send("chat.post("+msg+")");
        console.log("chat: "+msg);
    };
    
    mmMultiply(a,b) {
        var c = [[0,0,0],[0,0,0],[0,0,0]];
        for (var i = 0; i < 3 ; i++) for (var j = 0; j < 3 ; j++)
          c[i][j] = a[i][0]*b[0][j] + a[i][1]*b[1][j] + a[i][2]*b[2][j];
        return c;
    };
    
    yawMatrix(angleDegrees) {
        var theta = angleDegrees * MCPI.TO_RADIANS;
        return [[Math.cos(theta), 0., -Math.sin(theta)],
                [0.,         1., 0.],
                [Math.sin(theta), 0., Math.cos(theta)]];
    };
    
    rollMatrix(angleDegrees) {
        var theta = angleDegrees * MCPI.TO_RADIANS;
        return [[Math.cos(theta), -Math.sin(theta), 0.],
                [Math.sin(theta), Math.cos(theta),0.],
                [0.,          0.,          1.]];
    };
    
    pitchMatrix(angleDegrees) {
        var theta = angleDegrees * MCPI.TO_RADIANS;
        return [[1.,          0.,          0.],
                [0., Math.cos(theta),Math.sin(theta)],
                [0., -Math.sin(theta),Math.cos(theta)]];
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
      console.log("Put "+block+" at "+x+" "+y+" "+z);
      this.socket.send("world.setBlock("+x+","+y+","+z+","+b+")");
    };
}

rjm = new RaspberryJamMod();
Scratch.extensions.register(rjm);
