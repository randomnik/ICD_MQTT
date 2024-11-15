import time
import paho.mqtt.client as mqtt
import adafruit_dht
from adafruit_blinka.microcontroller.bcm283x import pin

# 라즈베리파이 IP 주소와 포트 번호 설정
mqtt_server = "****(라즈베리파이 ip)"  
mqtt_topic = "dht11"
client_name = "raspberry_pub"

# DHT11 센서 설정 (GPIO20에 연결)
dht_device = adafruit_dht.DHT11(pin.D4)

# MQTT 클라이언트 초기화
client = mqtt.Client(client_id=client_name)

# MQTT 연결 콜백
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("MQTT 연결 성공")
    else:
        print(f"MQTT 연결 실패, 오류 코드: {rc}")

# MQTT 설정 및 연결
client.on_connect = on_connect
client.connect(mqtt_server, 1883, 60)

# MQTT 통신 시작
client.loop_start()

try:
    while True:
        try:
            # DHT11 센서에서 온습도 데이터 읽기
            temperature = dht_device.temperature
            humidity = dht_device.humidity
            
            if humidity is not None and temperature is not None:
                # JSON 형식으로 데이터 형식화 및 MQTT 전송
                message = f'{{"temperature":{temperature:.2f}, "humidity":{humidity:.2f}}}'
                print(f"전송 메시지: {message}")
                client.publish(mqtt_topic, message)
            else:
                print("DHT11 센서 오류: 데이터를 읽을 수 없음")
            
        except RuntimeError as error:
            # 센서 오류 무시하고 계속 실행
            print(f"센서 오류: {error.args[0]}")
        
        time.sleep(3)  # 3초마다 데이터 전송

except KeyboardInterrupt:
    print("종료 중...")

finally:
    client.loop_stop()
    client.disconnect()
    dht_device.exit()  # DHT 센서 객체 정리

