const mongoose = require("mongoose");
const MONGODB_URL = "****";

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
