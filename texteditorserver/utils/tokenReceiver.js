var amqp = require("amqplib/callback_api");
const receiver = (Id, Token, etat, queue) => {
  amqp.connect("amqp://localhost:5672", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = "token";

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            q.queue
          );
          channel.bindQueue(q.queue, exchange, "");

          channel.consume(
            q.queue,
            function (msg) {
              if ((msg.content.ID = Id)) {
                Token.sure = true;
                queue = msg.content.queue;
                etat.etat = "critical_section";
                queue = msg.content.queue;
              }
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });
};
module.exports = receiver;
