import amqp from 'amqplib/callback_api.js'
import { RSA_NO_PADDING } from 'constants';
import fs from 'fs';
const FILENAME = '../../../data/data.txt'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
    
  await sleep(4000);

  fs.writeFileSync(FILENAME, '');

  amqp.connect('amqp://rabbitmq:5672', (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const exchange = 'my'
      const topicListen = '#';

      channel.assertExchange(exchange, 'topic',{
        durable: false
      })

      channel.assertQueue(exchange, {exclusive: true }, (err, q) => {
        if (err) throw err;
   
        channel.bindQueue(q.queue, exchange, topicListen);

        channel.consume(q.queue, async (msg) => {
          await sleep(1000);
          const message = `${msg.content.toString()}`;
          const writableMsg = `${new Date().toISOString(Date.now())} Topic ${msg.fields.routingKey}: ${message}\n`

          fs.appendFile(FILENAME, writableMsg, 'utf8',(err) => {
            if (err) throw err;
            console.log('New message received. Writing content to file data.txt')
          });
        })
      })
    })
  })
}

init();