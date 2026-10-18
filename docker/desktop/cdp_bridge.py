#!/usr/bin/env python3
"""Transparent TCP proxy to bridge Chromium loopback CDP to container 0.0.0.0.

Chromium in Linux binds strictly to 127.0.0.1:9223.
This bridge accepts incoming connections on 0.0.0.0:9222 (accessible via Docker port mapping)
and forwards them bidirectionally to 127.0.0.1:9223.
"""
import socket
import threading
import sys

def forward(src, dst):
    try:
        while True:
            data = src.recv(16384)
            if not data:
                break
            dst.sendall(data)
    except Exception:
        pass
    finally:
        try:
            src.close()
        except Exception:
            pass
        try:
            dst.close()
        except Exception:
            pass

def main():
    listen_host = "0.0.0.0"
    listen_port = 9222
    target_host = "127.0.0.1"
    target_port = 9223

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((listen_host, listen_port))
    server.listen(20)
    print(f"CDP Bridge listening on {listen_host}:{listen_port} -> {target_host}:{target_port}", flush=True)

    while True:
        try:
            client, _ = server.accept()
            target = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            target.connect((target_host, target_port))
            t1 = threading.Thread(target=forward, args=(client, target), daemon=True)
            t2 = threading.Thread(target=forward, args=(target, client), daemon=True)
            t1.start()
            t2.start()
        except Exception as e:
            pass

if __name__ == "__main__":
    main()
