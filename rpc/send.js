var amqp = require('amqplib');

var args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

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
    ch.assertQueue('', {exclusive: true}).then((q) => {
      var corr = generateUuid();
      var num = parseInt(args[0]);

      console.log(' [x] Requesting fib(%d)', num);

      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId === corr) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

      ch.sendToQueue('rpc_queue',
        new Buffer(num.toString()),
        { correlationId: corr, replyTo: q.queue });
    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}
