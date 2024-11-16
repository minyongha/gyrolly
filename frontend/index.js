const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const WebSocket = require("ws");

const port = new SerialPort({
  path: "/dev/tty.usbmodem1201",
  baudRate: 9600,
});
const wss = new WebSocket.Server({ port: 8083 });

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  console.log("Received data:", data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});
