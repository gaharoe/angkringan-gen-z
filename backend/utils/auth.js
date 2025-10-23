const jwt = require('jsonwebtoken');
const fs = require("fs");

let customer = JSON.parse(fs.readFileSync("./data/customer.json"));

module.exports = {
    login: function (req, res, next){
        const meja = req.body.meja;
        const nama = req.body.nama;
        const tableInUse = customer.find(obj => obj.meja == meja);
        if(tableInUse){
            res.json(0);
            return;
        }
    
        req.token = jwt.sign({nama, meja}, "angkringan gen-z", {expiresIn:'1h'});
        console.log(req.token);
        next();
    },
    confirm: function (req, res, next){
        const token = req.cookies.token;
        if (!token) return res.redirect("/login");
        jwt.verify(token, "angkringan gen-z", (err, decoded) => {
            if (err) return res.redirect("/login");
            req.user = decoded;
            next();
        });
    }
}
