# ICD_MQTT
인터넷통신설계 프로젝트 과제: MQTT 활용 온습도 센서 모니터링 시스템  
<br> 
<br> 
<br> 

## 동작 
1. MQTT 사용해 라즈베리파이4 - PC간 DHT11 온습도 데이터 송수신 
2. PC에서 수신한 온습도 데이터 MongoDB 저장  
3. PC에서 Node.js 기반 웹서버 구동 및 MongoDB 데이터 화면 갱신  
<br> 
4. ESP32-CAM 웹서버 구동 - 영상 스트리밍
<br> 
<br> 
5. 안드로이드 앱 - MongoDB 데이터, 스트리밍 영상 연동
<br> 
<br> 
<br> 

## HW  
1. 스마트폰(안드로이드)  
2. PC  
3. 라즈베리파이4 + DHT11  
4. ESP32-CAM +  업로드 보드(AI Thinker ESP32-CAM)  
<br>
<br> 
<br> 

## SW
1. Node.js(웹서버)  
2. MQTT(데이터 송수신)    
3. Web Socket  