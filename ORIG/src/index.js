import amqp from 'amqplib/callback_api.js'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
  await sleep(3000);

  amqp.connect('amqp://rabbitmq:5672', (err, connection) => {
    if (err) throw err;
    connection.createChannel(async (err, channel) => {
      if (err) throw err;
      const exchange = 'my'
      const key = 'my.o';
      channel.assertExchange(exchange, 'topic',{
        durable: false
      })

      for (let i = 1; i < 4; i++) {
        await sleep(3000)
        const message = `MSG_${i}`;
        channel.publish(exchange, key, Buffer.from(message));
      }
    })
  })

}

init();