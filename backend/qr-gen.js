const qr = require("qr-image");
const os = reqiore("os")
const fs = require("fs")


function getLocalIP(){
  const nets = os.networkInterfaces()['Wi-Fi'].filter(obj => obj.family == "IPv4")[0];
  return nets.cidr.split("/")[0];
}

let serverIp = getLocalIP();
qr.image(serverIp, {type: "png",size: 10}).pipe(fs.createWriteStream("qr-code.png"));