var amqp = require("amqplib/callback_api");
const sendToken = require("./sendToken");
const receiver = (Id, Token, etat, queue, rn, ln) => {
  amqp.connect("amqp://localhost:5672", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = "requests";

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
              if (msg.content) {
                console.log(" [x] %s", msg.content.toString());
                rn[msg.content.ID - 1] = Math.max([
                  rn[msg.content.ID - 1],
                  msg.content.rni,
                ]);
                if (
                  Token.sure == true &&
                  etat.etat == "not_requesting" &&
                  rn[msg.content.ID - 1] > ln[msg.content.ID - 1]
                ) {
                  Token.sure = false;
                  sendToken(queue, ln, msg.content.ID);
                }
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
