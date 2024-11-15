#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>  // 웹 서버 라이브러리 추가

const char* ssid = "WiFi Name";
const char* password = "PW";

WebServer server(80);  // 웹 서버 객체 생성

void streamCamera() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.setContentLength(CONTENT_LENGTH_UNKNOWN);
  server.send(200, "multipart/x-mixed-replace; boundary=frame");

  while (server.client().connected()) {
    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      server.client().stop();
      return;
    }
    server.sendContent("--frame\r\nContent-Type: image/jpeg\r\n\r\n");
    server.sendContent((const char*)fb->buf, fb->len);
    server.sendContent("\r\n");
    esp_camera_fb_return(fb);

    delay(30);  // 프레임 간 지연을 추가하여 부하를 줄임
  }
}

void startCameraServer() {
  // 스트림 경로에 대한 핸들러 설정
  server.on("/stream", HTTP_GET, streamCamera);
  server.begin();  // 웹 서버 시작
  Serial.println("Camera streaming at /stream");
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = 5;
  config.pin_d1 = 18;
  config.pin_d2 = 19;
  config.pin_d3 = 21;
  config.pin_d4 = 36;
  config.pin_d5 = 39;
  config.pin_d6 = 34;
  config.pin_d7 = 35;
  config.pin_xclk = 0;
  config.pin_pclk = 22;
  config.pin_vsync = 25;
  config.pin_href = 23;
  config.pin_sccb_sda = 26;
  config.pin_sccb_scl = 27;
  config.pin_pwdn = 32;
  config.pin_reset = -1;  // 사용하지 않는 핀은 -1로 설정
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_QVGA;  // 더 낮은 해상도로 설정해 전송 성능 향상
  config.pixel_format = PIXFORMAT_JPEG;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  // 카메라 초기화
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  startCameraServer();

  Serial.print("Camera Ready! Stream URL: http://");
  Serial.print(WiFi.localIP());
  Serial.println("/stream");
}

void loop() {
  server.handleClient();  // 웹 서버 클라이언트 요청 처리
  delay(10);
}