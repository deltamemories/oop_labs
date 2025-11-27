import socket

HOST = 'localhost'
PORT = 5000

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
	s.bind((HOST, PORT))
	s.listen()
	print(f"Server on {HOST}:{PORT}...")

	conn, addr = s.accept()
	with conn:
		print(f"Connection established {addr}")

		data = conn.recv(1024)
		if data:
			message = data.decode('utf-8')
			print(f"Message received: {message}")
