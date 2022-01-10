const amqp = require("amqplib");
var channel, connection;

const connect = async () => {
  try {
    connection = await amqp.connect("amqp://admission_rabbitmq:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("session");
    console.log('Rabbit is connected')
  } catch (error) {
    // console.error(error);
    console.log("Rabbit is down");
    setTimeout(connect, 1000);
  }
}

const sendMessage = async (data) => {
  try {
    await channel.sendToQueue("session", Buffer.from(JSON.stringify(data)));
    console.log("New message sent to RabbitMQ", data);
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
    connect,
    sendMessage
}