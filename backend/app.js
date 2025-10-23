const express = require('express');
const fs = require("fs");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const auth = require("./utils/auth");

app.use(cookieParser());
app.use(cors());
app.use("/assets",express.static(__dirname+"/assets"));
app.use("/public",express.static(__dirname+"/public"));
app.use(express.json());
app.set('view engine', 'ejs');

let menu = JSON.parse(fs.readFileSync("./data/menus.json"));
let tables = JSON.parse(fs.readFileSync("./data/meja.json"));
let customer = JSON.parse(fs.readFileSync("./data/customer.json"));

app.post("/api/meja", (req, res) => {
  res.json(tables);
});

app.post("/api/login", auth.login, (req, res) => {
  res.cookie("token", req.token, {
    maxAge: 1000 * 60 * 60, // 1 jam
    httpOnly: true,         // biar gak bisa diakses JS client
    secure: false,          // ubah ke true kalau udah HTTPS
    sameSite: "lax"
  });
  const name = req.body.nama;
  const table = req.body.meja;
  tables.find(obj => obj.id == table).status = 0;
  customer.push({
    pelanggan: name,
    meja: table,
    status: "memilih pesanan"
  });
  fs.writeFileSync("data/customer.json", JSON.stringify(customer));
  fs.writeFileSync("data/meja.json", JSON.stringify(tables));
  
  res.redirect("/menu");
});

app.post("/api/order", (req,res) => {
  const userOrder = customer.find(obj => obj.pelanggan == req.body.pelanggan && obj.meja == req.body.meja);
  userOrder.order = req.body.order;
  userOrder.total = req.body.total;
  userOrder.status = req.body.status;
  fs.writeFileSync("data/customer.json", JSON.stringify(customer));
  res.json(1);
  


  // prod = ""
  // userOrder.forEach(item => {
  //   prod += item.id+"-";
  // });
  // console.log(prod.split("-"));
});


app.get("/api/menus", (req, res) => {
  res.json(menu);
});

app.get("/login", (req,res) => {
  res.render("login");
});

app.get("/", (req, res) => {
  res.redirect("/menu");
});

app.get("/menu", auth.confirm, (req, res) => {
  res.render("menu", {data: req.user});
});

app.get("/order", auth.confirm, (req, res) => {
  const userOrder = customer.find(obj => obj.pelanggan == req.user.nama && obj.meja == req.user.meja);
  console.log(userOrder.order);
  res.render("order", {user:req.user ,order: userOrder.order, total: userOrder.total, status: userOrder.status})
});


// ---------- DEVSPACE ------------
app.get("/reset/table", (req, res) => {
  tables.forEach(table => {
    table.status = 1;
  });
  fs.writeFileSync("data/meja.json", JSON.stringify(tables));
  res.redirect("/login");
});

http.listen(80, () => {
    console.log("server starting");
})