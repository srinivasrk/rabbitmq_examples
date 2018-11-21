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
    let ex = `logs`;
    let processTime = "."
    var random = Math.floor(Math.random() * (10 - 0));
    while(random != 0) {
      processTime = processTime + '.'
      random = random - 1
    }
    let msg = `Hello World ${processTime}!`

    ch.assertExchange(ex, 'fanout', {durable : false});
    ch.publish(ex, '', new Buffer(msg));
    console.log(` [x] Sent ${msg}`);
  })
  setTimeout(function () {
    conn.close();
    process.exit(0)
  }, 500);
})
