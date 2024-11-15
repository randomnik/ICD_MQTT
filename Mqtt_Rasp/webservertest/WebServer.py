import socket
import RPi.GPIO as GPIO

# Wi-Fi 네트워크 정보 설정 (Wi-Fi 연결은 라즈베리파이에서 자동으로 설정됨)
#****(ip):8080
ssid = "WebServer"
password = "****"

# 서버 포트 번호 설정
PORT = 8080

# LED 핀 설정
LED_PIN = 6
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.output(LED_PIN, GPIO.LOW)

# 소켓 생성 및 서버 포트 바인딩
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind(('', PORT))
server_socket.listen(5)
print("Server started on port", PORT)

def handle_client(client_socket):
    # 클라이언트 요청 수신
    request = client_socket.recv(1024).decode('utf-8')
    print(f"Request received:\n{request}")

    # 요청 경로 확인 및 LED 제어
    if "GET / " in request:
        GPIO.output(LED_PIN, GPIO.HIGH)
        content = "<h1>켜짐</h1><br>"
    elif "GET /inline " in request:
        GPIO.output(LED_PIN, GPIO.LOW)
        content = "<h1>꺼짐</h1><br>"
    else:
        content = "<h1>File Not Found</h1><br>"

    # HTML 응답 생성
    response = f"""HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<html>
<meta name='viewport' content='width=device-width, initial-scale=1.0'/>
<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />
<head></head><body>{content}</body></html>
"""

    # 응답 전송 및 소켓 종료
    client_socket.sendall(response.encode('utf-8'))
    client_socket.close()
    print("Client disconnected")

# 메인 루프에서 클라이언트 접속 처리
try:
    while True:
        # 클라이언트 연결 대기
        client_socket, addr = server_socket.accept()
        print(f"New connection from {addr}")
        handle_client(client_socket)
except KeyboardInterrupt:
    print("Server shutting down...")
finally:
    # 서버 종료 시 GPIO 정리 및 소켓 종료
    GPIO.cleanup()
    server_socket.close()
