var amqp = require('amqplib');

amqp.connect({
  protocol: 'amqp',
  hostname: `${process.env.RABBITMQ_SERVER}`,
  port: 5672,
  username: 'srini',
  password: 'srini',
  locale: 'en_US',
  frameMax: 0,
  heartbeat: 0
}).then((conn) => {
  conn.createChannel().then((ch) => {
    var ex = `logs`;
    return Promise.all([
      ch.assertExchange(ex, 'fanout', {durable : false}),
      ch.assertQueue('', {exclusive : true})
    ]).then(([exchange, q]) => {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
       return Promise.all([
         ch.bindQueue(q.queue, ex, ''),
         ch.consume(q.queue)
       ]).then(([bind, msg]) => {
          console.log(msg);
           // console.log(" [x] %s", msg.content.toString());

       })
    })
  });
})
