var https = require("https");
var fs = require("fs");

var wsPort = 4002
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
    res.end("hello i am rtc server");
  }
);

var io = require("socket.io")(httpd);

io.on("connection", socket => {
  socket.on("enter", roomId => {
    socket.roomId = roomId;
    socket.join(roomId);
    console.log("id=" + socket.id + " enter room=" + roomId);
  });

  function emitMessage(type, message) {
    if (!!socket.roomId) {
      console.log("===== message broadcast to room -->" + roomId);
      socket.broadcast.to(socket.roomId).emit(type, message);
    }
    else {
      console.log("===== message broadcast all");
      socket.broadcast.emit(type, message);
    }
  }

  socket.on("message", function (message) {
    message.from = socket.id;
    // console.log(new Date() + " id=" + socket.id + " Received Message: " + JSON.stringify(message));

    var target = message.sendto;
    if (target) {
      console.log("===== message emit to -->" + target);
      socket.to(target).emit("message", message);
      return;
    }

    emitMessage("message", message);
  });

  socket.on("disconnect", function () {
    console.log(new Date() + " Peer disconnected. id=" + socket.id);

    emitMessage("user disconnected", { id: socket.id });

    if (!!socket.roomId) {
      socket.leave(socket.roomId);
    }
  });
});

httpd.listen(wsPort, () => console.log("websocket server start. port=" + wsPort));

function isSame(ws1, ws2) {
	return (ws1 === ws2);
}
