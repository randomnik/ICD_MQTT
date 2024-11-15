const express = require("express");
const mongoose = require("mongoose");
const server = express();
const User = require("./models/User");
require("dotenv").config({ path: "variables.env" });

server.get("/", (req, res) => {
    const newUser = new User();
    newUser.email = "bitcocom@empas.com";
    newUser.name = "bitcocom";
    newUser.age = "25";

    newUser
        .save()
        .then((data) => {
            console.log(data);
            res.json({
                message: "User Created Successfully",
            });
        })
        .catch((err) => {
            console.error(err); // 오류 메시지 출력 추가
            res.json({
                message: "User was not created successfully",
            });
        });
});

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to database successfully");
        server.listen(3000, (err) => {
            if (err) {
                console.log("Server failed to start:", err);
            } else {
                console.log("Server running on http://localhost:3000");
            }
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
