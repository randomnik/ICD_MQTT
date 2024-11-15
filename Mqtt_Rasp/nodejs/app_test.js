const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.write("<h1>Hello from nodejs</h1>");
    } else {
        res.write(`<h1>You have entered this url : ${req.url}</h1>`);
    }
    res.end();
});

// 서버 시작 함수
function startServer(port) {
    server.listen(port, () => {
        console.log(`The Server is listening on port ${port}`);
    });
}

// 에러 핸들러 설정
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        server.close(() => {
            // 1초 후에 다음 포트로 재시도
            setTimeout(() => {
                startServer(PORT + 1);
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
startServer(PORT);

