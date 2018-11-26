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
    let ex = 'direct_logs';
    let processTime = "."
    var random = Math.floor(Math.random() * (10 - 0));
    while(random != 0) {
      processTime = processTime + '.'
      random = random - 1
    }
    console.log(process.argv);
    let msg = `Hello World ${processTime}!`
    let severity = (process.argv.length > 0) ? process.argv[2] : 'info';
    ch.assertExchange(ex, 'direct', {durable : false});
    ch.publish(ex, severity, new Buffer(msg));
    console.log(` [x] Sent ${msg} with ${severity}`);
  })
  setTimeout(function () {
    conn.close();
    process.exit(0)
  }, 500);
})
