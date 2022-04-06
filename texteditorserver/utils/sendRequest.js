var amqp = require("amqplib/callback_api");
const produce = (ID, Rni) => {
  amqp.connect("amqp://localhost:5672", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = "requests";
      var msg = {
        ID: ID,
        rni: Rni,
      };

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });
      channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)));
      console.log(" [x] Sent %s", msg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
};
module.exports = produce;
