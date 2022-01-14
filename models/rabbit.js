const mqtt = require('mqtt')
let client

const connect = async () => {
  try {
    client = mqtt.connect('mqtt://admission_rabbitmq:1883')
    client.on('connect', () => {
      console.log('Rabbit is connected')
    })
  } catch (error) {
    // console.error(error);
    console.log('Rabbit is down')
    setTimeout(connect, 1000)
  }
}

const sendMessage = async (data) => {
  try {
    client.publish('session', JSON.stringify(data))
    console.log('New message sent to RabbitMQ', data)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  connect,
  sendMessage
}
