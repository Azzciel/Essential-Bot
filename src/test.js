"use strict";
exports.__esModule = true;
var test = function (message, question, callback) {
    var user = message.author;
    var answer;
    message.channel.send(question)
        .then(function (message) {
        var filter = function (m) { return user == m.author; };
        message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: ['time'] })
            .then(function (collected) {
            answer = collected.first();
            callback(answer);
            message["delete"]({ timeout: 5000 });
        })["catch"](function (collected) {
            console.log("After a minute, only " + collected.size + " out of 4 voted.");
            message.channel.send('No se escribio una respuesta.');
        });
    });
};
exports["default"] = test;
