var amqplib = require('amqplib');

module.exports = exports = function(app) {
  app.rabbit = amqplib.connect('amqp://localhost');

  app.rabbit.publish = function(channelName, message) {
    return app.rabbit.then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var q = channelName;
        var ok = ch.assertQueue(q);
        return ok.then(function() {
          var msg = JSON.stringify(message);
          ch.sendToQueue(q, new Buffer(msg));
          ch.close();
          console.log('sent: ' + JSON.stringify(msg, null, 2));
        });
      });
    });
  };

  app.rabbit.consume = function(channelName, handler) {
    return app.rabbit.then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(channelName, { durable: true });
        ok = ok.then(function() { ch.prefetch(1); });
        ok = ok.then(function() {
          ch.consume(channelName, function(msg) {
            handler(msg.content.toString(), function(err, cb) {
              if (err) { logger.error(err); };
              ch.ack(msg);
              if (_.isFunction(cb)) {
                cb();
              }
            });
          }, { noAck: false });
        });
      });
    });
  };
};
