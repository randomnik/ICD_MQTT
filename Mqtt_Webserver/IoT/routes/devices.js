var express = require("express");
var router = express.Router();
const mqtt = require("mqtt");
const DHT11 = require("../models/DHT11");

// MQTT Server 접속
const client = mqtt.connect("mqtt://****(라즈베리파이ip)");

router.post("/device", function (req, res, next) {
  console.log("Received sensor request for:", req.body.sensor);  // 어떤 센서 요청이 들어왔는지 확인
  if (req.body.sensor === "dht11") {
      DHT11.find({}).sort({ created_at: -1 }).limit(1).then(data => {
          console.log("Data from database:", data);  // 데이터가 제대로 반환되는지 확인
          res.json(data);  // 서버에서 응답 전송
      }).catch(err => {
          console.log("Error fetching data:", err);  // 데이터베이스 오류 확인
          res.status(500).json({ error: "Error fetching data" });  // 오류 응답
      });
  } else {
      res.status(400).json({ error: "Invalid sensor type" });  // 센서 타입이 잘못된 경우
  }
});


module.exports = router;
