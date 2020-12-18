const express = require("express");
const app = express();

app.get("/api/info", (req, res) => {
    res.json({
        hello: 'express'
    })
})

app.listen("9092")