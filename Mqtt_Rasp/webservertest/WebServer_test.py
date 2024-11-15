import socket

#네트워크 접속 정보 설정
#****(ip):8080
ssid = "WebServer"
password = "****"  # 라즈베리파이에서는 Wi-Fi 연결 자동 설정이 일반적

#1.서버 초기화 및 네트워크 설정
#서버 포트 번호
PORT = 8080

#소켓을 생성하고 서버 포트를 바인딩
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind(('', PORT))
server_socket.listen(5)
print("Server started")

#2.클라이언트 연결 대기 및 연결이 들어올 경우 처리
def handle_client(client_socket):
    #클라이언트가 요청을 보낼 때까지 대기
    request = client_socket.recv(1024).decode('utf-8')
    print(f"Request received:\n{request}")

    #3.응답할 HTML 콘텐츠 준비
    response = """HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<html>
<meta name='viewport' content='width=device-width, initial-scale=1.0'/>
<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />
<head></head><body>안녕하세요!</body></html>
"""
    #응답 전송
    client_socket.sendall(response.encode('utf-8'))
    client_socket.close()
    print("Client disconnected")

#4.메인 루프에서 클라이언트 접속 처리
try:
    while True:
        #클라이언트 연결 대기
        client_socket, addr = server_socket.accept()
        print(f"New connection from {addr}")
        handle_client(client_socket)
except KeyboardInterrupt:
    print("Server shutting down...")
finally:
    server_socket.close()
