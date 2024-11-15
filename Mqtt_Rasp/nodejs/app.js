const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
let port = process.env.PORT || 3000;

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, "/public"))); // __dirname을 사용하여 public 폴더 절대 경로 지정

// 라우트 설정
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "about.html"));
});

// 404 페이지 라우트 설정
app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "404.html"));
});

// Express 앱을 HTTP 서버로 감싸기
const server = http.createServer(app);

// 서버 시작 함수
function startServer(port) {
    server.listen(port, (err) => {
        if (err) return console.log(err);
        console.log(`The server is listening on port ${port}`);
    });
}

// 에러 핸들러 설정
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Trying another port...`);
        server.close(() => {
            port += 1;
            setTimeout(() => {
                startServer(port); // 다음 포트로 재시작
            }, 1000);
        });
    } else {
        console.error("Server error:", err);
    }
});

// 정상 종료 시 포트 해제 설정
process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server closed successfully.");
        process.exit(0); // 정상 종료
    });
});

// 서버 시작
startServer(port);



