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
  conn.createChannel(function(err, ch) {
    let i = 0;
    for(i = 0; i < 10; i ++) {
      let processTime = "."
      var q = 'task_queue';
      var random = Math.floor(Math.random() * (10 - 0));
      console.log(random);
      while(random != 0) {
        processTime = processTime + '.'
        random = random - 1
      }
      var msg = `Hello World ${processTime}! Message number : ${i}`
      ch.assertQueue(q, {durable: true});
      ch.sendToQueue(q, new Buffer(msg), {persistent: true});
      console.log(" [x] Sent '%s'", msg);
    }

  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
