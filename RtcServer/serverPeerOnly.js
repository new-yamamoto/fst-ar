var https = require("https");
var fs = require("fs");

var wsPort = 4001
var sslKey = "./SSL_certificate/fst-ar-rtc.key";
var sslCert = "./SSL_certificate/fst-ar-rtc.crt";

process.argv
	.forEach(v => {
		if (v.includes("--wsPort=")) {
			wsPort = v.replace("--wsPort=", "");
		}
		if (v.includes("--sslKey=")) {
			sslKey = v.replace("--sslKey=", "");
		}
		if (v.includes("--sslCert=")) {
			sslCert = v.replace("--sslCert=", "");
		}
	});

var httpd = https.createServer(
	{
		key: fs.readFileSync(sslKey),
		cert: fs.readFileSync(sslCert)
	},
	(req, res) => {
	    res.writeHead(200);
	    res.end("dummy");
	}
).listen(wsPort);


var WebSocketServer = require("ws").Server;
var wsServer = new WebSocketServer({ server: httpd });
//var wsServer = new WebSocketServer({ port: wsPort }); //for http

console.log("websocket server start. port=" + wsPort);

wsServer.on("connection", function(ws) {
	// console.log("websocket connected", ws);
	ws.on("message", message => {
    wsServer.clients.forEach(client => {
      if (!isSame(ws, client)) {
        // console.log("websocket received", client, message);
				client.send(message);
			}
		});
	});
});

function isSame(ws1, ws2) {
	return (ws1 === ws2);
}
