var amqp = require('amqplib/callback_api');

amqp.connect({
  protocol: 'amqp',
  hostname: `${process.env.RABBITMQ_SERVER}`,
  port: 5672,
  username: 'srini',
  password: 'srini',
  locale: 'en_US',
  frameMax: 0,
  heartbeat: 0
}, function(err, conn) {
  if(err) {
    console.log(`${err}`);
    process.exit(0)
  }
  conn.createChannel(function(err, ch) {
    var q = 'hello'

    ch.assertQueue(q, {durable : false});
    ch.sendToQueue(q, new Buffer('Hello World!'));
    console.log(" [x] Sent 'Hello World!'");
  })
  // END AFTER 0.5 SECONDS
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
})
