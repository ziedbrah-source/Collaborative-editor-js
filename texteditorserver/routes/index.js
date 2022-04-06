var express = require("express");
var router = express.Router();
var produceRequest = require("../utils/sendRequest");
var sendToken = require("../utils/sendToken");
var tokenReceiver = require("../utils/tokenReceiver");
var requestReceiver = require("../utils/requestReceiver");

const ID = 1;
const Token = { sure: ID == 1 ? true : false };

let Etat = { etat: "not_requesting" };
const Rn = [0, 0, 0, 0];
const Ln = [0, 0, 0, 0];
const queue = [];
tokenReceiver(ID, Token, Etat, Ln, queue);
requestReceiver(ID, Token, Etat, queue, Rn, Ln);
function Request_Cs() {
  Etat.etat = "requesting";
  if (Token.sure == false) {
    Rn[ID - 1] = Rn[ID - 1] + 1;
    produceRequest(ID, Rn[ID - 1]);
  }
}
function Release_CS() {
  Ln[ID - 1] = Rn[ID - 1];
  for (var i = 1; i <= 5; i++) {
    if (i != ID && queue.indexOf(i) == -1 && Rn[i - 1] > Ln[i - 1]) {
      queue.push(i);
    }
  }
  if (queue.length > 0) {
    Token.sure = false;
    let id = queue.pop();
    sendToken(queue, Ln, id);
  }
  Etat.etat = "not_requesting";
}
router.get("/", function (req, res, next) {
  return res.json({ number: ID });
});
router.post("/", function (req, res, next) {
  Request_Cs();
  return res.json({ number: Etat.etat });
});

module.exports = router;
