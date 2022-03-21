import net from "node:net";
import dgram from "node:dgram";
import config from "../config.js";


if (config.protocol === "UDP") {
  // UDP CLIENT
  const startTime = new Date().getTime();
  const client = dgram.createSocket("udp4");
  let messageCount = 0;
  let bytesRead = 0;

  const data = Buffer.from("Message from UDP client");

  client.on("message", (message) => {
    if (message.toString() === "END") {
      client.close();
      return;
    } else {
      messageCount++;
      bytesRead += message.length;

      client.send("ACK", config.port, config.host, (error) => {
        if (error) {
          console.log("ACK error: ", error);
        }
      });
    }
  });

  client.send(data, config.port, config.host, (error) => {
    if (error) {
      console.log(error);
      client.close();
    }
  });

  client.on("error", (error) => {
    console.log(error);
  });

  client.on("close", (error) => {
    const endTime = new Date().getTime();
    const transmissionTimeLength = endTime - startTime;

    console.log("transmissionTime: ", transmissionTimeLength);
    console.log("messagesReceived: ", messageCount);
    console.log("bytesReceived: ", bytesRead);
  });

  
} else if (config.protocol === "TCP"){

  //TCP client
  const startTime = new Date().getTime();

  const client = new net.Socket();
  let messageCount = 0;

  client.connect(config.port, config.address);

  client.on("data", async function (data) {
    messageCount++;
  });

  client.on("close", function () {
    const endTime = new Date().getTime();
    const transmissionTimeLength = endTime - startTime;

    console.log("transmissionTime: ", transmissionTimeLength);
    console.log("messagesReceived: ", messageCount);
    console.log("bytesReceived: ", client.bytesRead);
  });

  client.on("error", (error) => {
    if (error) {
      console.log("Error with TCP client");
    }
  });

  client.end();
}

