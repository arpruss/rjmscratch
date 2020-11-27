import logging
from websocket_server import WebsocketServer
import threading
import socket
import select
from collections import namedtuple

tcpConnections = {}

def socket_readline(sock,id):
    out = ""
    while True:
        ready = select.select([sock], [], [], 1)
        if id not in tcpConnections:
            return None
        if ready[0]:
            c = sock.recv(1)
            if len(c):
                if c == b'\n':
                    return out
                elif c != b'\r':
                    out += c.decode()

def receive_thread(client, sock):
    id = client['id']
    out = bytearray()
    while True:
        ready = select.select([sock], [], [], 1)
        if id not in tcpConnections:
            print("closed")
            return
        if ready[0]:
            data = sock.recv(128)
            for i in range(len(data)):
                c = data[i]
                if c == 10:
                    server.send_message(client, out.decode())  # TODO: think about encodings
                    out = bytearray()
                elif c != 13:
                    out.append(c)

def new_client(client, server):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(('localhost', 4711))
    id = client['id']
    tcpConnections[id] = s
    print("new client",id)
    t = threading.Thread(target=receive_thread, args=(client, s))
    t.daemon = True
    t.start()
    
def client_left(client, server):
    id = client['id']
    if id in tcpConnections:
        print("client gone",id)
        tcpConnections[id].close()
        del tcpConnections[id]
       
def message_received(client,server,data):
    id = client['id']
    if id in tcpConnections:
        if data == "player.getRotation()":
            server.send_message(client, "0")
        tcpConnections[id].sendall((data+'\n').encode())

server = WebsocketServer(14711, '0.0.0.0')
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()
