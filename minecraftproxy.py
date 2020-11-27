import logging
from websocket_server import WebsocketServer
import threading
import socket
from collections import namedtuple

tcpConnections = {}

def receive_thread(client, sock):
    reader = sock.makefile('r')
    while True:
        line = reader.readline()
        print("sending back "+line)
        server.send_message(client, line.strip())

def new_client(client, server):
    print("new client")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(('localhost', 4711))
    id = client['id']
    tcpConnections[id] = s
    print("new client "+str(client['id']))
    t = threading.Thread(target=receive_thread, args=(client, s))
    t.start()
    
def client_left(client, server):
    print("client gone")
    id = client['id']
    if id in tcpConnections:
        tcpConnections[id].close()
        del tcpConnections[id]
       
def message_received(client,server,data):
    id = client['id']
    print("data "+data)
    if id in tcpConnections:
        tcpConnections[id].sendall((data+'\n').encode())

server = WebsocketServer(14711, host='127.0.0.1')
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()
