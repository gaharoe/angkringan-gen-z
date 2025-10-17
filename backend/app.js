const express = require('express');
const fs = require("fs");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app)
// const {Server} = require("socket.io");
// io = new Server(http, {cors: {
//   // origin: "http://127.0.0.1:5500",
//   methods: ["GET", "POST"]
// }})


// io.on("connect", (socket) => {
//     // console.log(menu);
//     socket.emit("menu", menu);
// });

let menu = JSON.parse(fs.readFileSync("./data/menus.json"));
// let category = [...new Set(menu.map(item => item.category))]

app.use(cors());
app.use("/assets",express.static(__dirname+"/assets"));
app.use(express.json());


app.get("/api/menus", (req, res) => {
  res.json(menu);
});

http.listen(80, () => {
    console.log("server starting");
})