"use strict";
exports.__esModule = true;
var numberTickets = 0;
var createTicket = function (message, user, roles) {
    var oldChannel = message.channel;
    createChannel(message, "ticket " + numberTickets, function (channel) {
        numberTickets++;
        var str = '';
        roles.each(function (rol) {
            str += "" + rol;
        });
        channel.send(user + " viene del canal: " + oldChannel + " \n" + str); //escribe el nombre del canal del ticket en el nuevo canal
    });
};
var createChannel = function (message, name, callback) {
    message.guild.channels.create(name)
        .then(function (channel) { return callback(channel); })["catch"](function (err) { return console.log(err); });
};
exports["default"] = createTicket;
