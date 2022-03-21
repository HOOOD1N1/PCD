import net from "node:net";
import { Buffer } from "node:buffer";
import dgram from "node:dgram";
import config from "../config.js";

function createBufferArray(gb, messageSize) {
  const buffer = [];
  let bytes = gb * config.bytesInGb;
  const messageCount = Math.ceil(bytes / messageSize);

  for (let i = 0; i < messageCount; i++) {
    const bufferLength = bytes > messageSize ? messageSize : bytes;

    buffer.push(Buffer.alloc(bufferLength));

    bytes -= messageSize;
  }

  return buffer;
}



const gbtsSent = config.gbSent;
const messageSize = config.messageSize;


if (config.protocol === "UDP") {
  // UDP SERVER

const bufferArray = createBufferArray(gbtsSent, messageSize);
let msgCount = 0;
let bytesSent = 0;

const server = dgram.createSocket("udp4");

server.on("message", (message, info) => {
  const messageString = message.toString();

  if (msgCount === bufferArray.length) {

    server.send(Buffer.from("END"), info.port, info.address, (error) => {
      if (error) {
        console.log(error);
        return;
      }
      server.close();
    });

    return;
  }

  server.send(bufferArray[msgCount], info.port, info.address, (error) => {
    if (error) {
      console.log(error);
      return;
    }

    if (msgCount !== bufferArray.length) {
      bytesSent += bufferArray[msgCount].length;
    }
  });

  if (messageString === "ACK") {
    msgCount++;
  }
});

server.on("close", () => {
  console.log("Protocol used: UDP");
  console.log("Messages sent: ", msgCount);
  console.log("Bytes sent: ", bytesSent);
});

server.bind(config.port);

} else if(config.protocol === "TCP"){
  //Server TCP

  let msgCount = 0;
  let bytesSent = 0;

  const bufferArray = createBufferArray(gbtsSent, messageSize);

  const server = net.createServer(function (socket) {
    for (let i = 0; i < bufferArray.length; i++) {
      socket.write(bufferArray[msgCount]);
      bytesSent += bufferArray[msgCount].length;
      msgCount++;
    }

    if (msgCount === bufferArray.length) {
      server.close();
    }
  });

  server.listen(config.port, config.address);

  server.on("close", () => {
    console.log("Protocol used: TCP");
    console.log("Messages sent: ", msgCount);
    console.log("Bytes sent", bytesSent);
  });
}


