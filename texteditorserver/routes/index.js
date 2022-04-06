var express = require("express");
var router = express.Router();
var prod = require("../utils/send");
var produceRequest = require("../utils/sendRequest");
var sendToken = require("../utils/sendToken");
const ID = 1;
const Token = false;
let Etat = "not_requesting";
const Rn = [0, 0, 0, 0];
const Ln = [0, 0, 0, 0];
const queue = [];
function Request_Cs() {
  Etat = "requesting";
  if (Token == false) {
    Rn[ID - 1] = Rn[ID - 1] + 1;
    produceRequest();
    console.log("cbon !");
    while (Token == false);
  }
  Etat = "critical_section";
}
function Release_CS() {
  Ln[ID - 1] = Rn[ID - 1];
  for (var i = 1; i <= 5; i++) {
    if (i != ID && queue.indexOf(i) == -1 && Rn[i - 1] > Ln[i - 1]) {
      queue.push(i);
    }
  }
  if (queue.length > 0) {
    Token = false;
    let id = queue.pop();
    sendToken(queue, Ln);
  }
}
router.get("/", function (req, res, next) {
  prod();
  Request_Cs();
  res.json({ number: ID });
});

module.exports = router;
