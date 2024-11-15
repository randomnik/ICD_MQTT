const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");
const http = require("http");
const mongoose = require("mongoose");
const DHT11 = require("./models/DHT11");
const devicesRouter = require("./routes/devices");
require('dotenv').config();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/devices", devicesRouter);

// MQTT 접속
const client = mqtt.connect("mqtt://****(라즈베리파이ip)");
client.on("connect", () => {
  console.log("mqtt connect");
  client.subscribe("dht11");
});
client.on("message", async (topic, message) => {
  var obj = JSON.parse(message);
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  obj.created_at = new Date(Date.UTC(year, month, today, hours, minutes, seconds));
  console.log(obj);
  const dht11 = new DHT11({
    tmp: obj.temperature,
    hum: obj.humidity,
    created_at: obj.created_at
  });
  try {
    const saveDHT11 = await dht11.save();
    console.log("insert OK");
  } catch (err) {
    console.log({ message: err });
  }
});

app.set("port", "3000");
var server = http.createServer(app);
var io = require("socket.io")(server);
io.on("connection", (socket) => {
  // 웹에서 소켓을 이용한 DHT11 센서 데이터 모니터링
  socket.on("socket_evt_mqtt", function (data) {
    DHT11.find({}).sort({ _id: -1 }).limit(1).then(data => {
      socket.emit("socket_evt_mqtt", JSON.stringify(data[0]));
    });
  });
});

// 비동기 데이터베이스 연결 설정
async function connectToDatabase() {
    const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://****"; // 기본 URL 설정
    try {
      await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB!');
    } catch (err) {
      console.error('Database connection error:', err);
    }
  }

// 서버 구동 및 데이터베이스 연결
server.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log("server ready");
    connectToDatabase(); // 데이터베이스 연결 호출
  }
});