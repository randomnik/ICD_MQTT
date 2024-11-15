const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

console.log("MONGODB_URL:", process.env.MONGODB_URL); // 변수 확인용 출력

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
