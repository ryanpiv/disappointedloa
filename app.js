//discord bot link: https://discordapp.com/developers/applications/me/316216046107361281

var Discordie = require('discordie');
var mysql = require('mysql');
var moment = require('moment');

const Events = Discordie.Events;
const client = new Discordie();

var loachannel = '237085726208950272'; //real channel
//var loachannel = '266749722692288512'; //test channel

//var token = 'MzE2MjE2MDQ2MTA3MzYxMjgx.DAjXfQ.9UJJewQgiPFgYne--eF2SaL33OE'; //test channel
var token = 'MzI2NDc4ODE4Mjg4MDc0NzUy.DCnYog.nEMacNJyvhX60N7JVmyOu2v6xmg'; //real channel

var connection = mysql.createConnection({
    host: 'mysql4.gear.host',
    user: 'disappointedloa',
    password: 'Nr2s?!FlWSPG',
    database: 'disappointedloa'
});

var versionNum = '1.3';

var helpText = '__**Disappointed Leave of Absensce (LoA) Bot Help**__\n\n' +
    '**!LoA**: Create a basic LoA.\nFormat: !loa <Date>, <Reason (optional)>\n' +
    'Example: !LoA 6/19/17, I will be on vacation.  You do not need to provide a reason, but someone people just like to.  In most cases, not providing a reason is preferred.\nExample wihout a reason: !loa 6/19/17\n\n' +
    '**!LoALate:** Creates a basic LoA, but defines a property to let the officers know you only plan on being late and not missing entirely.\nFormat: !LoALate: <Date>, <Reason (optional)>\nExample: !LoALate 6/19/17, I will be 15 minutes late.  The reason is still optional.\n\n' +
    '**!LoADelete:** Deletes an LoA that has yet to pass.\nFormat: !LoADelete <Date>\nYou may only delete your LoA before or on the date originally entered.  LoAs after that date may not be deleted.\nExample: !LoADelete 6/19/17\n\n' +
    '**!LoAUpdate:** Updates an existing LoA entry.\nFormat: !LoAUpdate <PreviousDate>, <NewDate>, <NewReason (optional)>\nAs with deletes, updates may only be edited before or on the date entered.\nExample: !LoAUpdate 6/19/17, 6/20/17, Work schedule changed.  The LoA for 6/19 was moved to 6/20 and the reason was also changed.\n\n' +
    '**!LoAList:** Lists all LoAs entered for the user who entered the command.\nExample: !LoAList\n\n' +
    '**!LoAListForDate:** Lists all LoAs for a specific date.\nFormat: !LoAListForDate <date>\nExample: !LoAListForDate 6/19/17\n\n' +
    '**!NoLoA:** Creates an LoA for a user.  This command is only useable by members with Administrator access to the LoA channel.\nFormat: !NoLoA <@User>\n Example: !NoLoA @smaktat.';

client.connect({
    token: token
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log('Connected as: ' + client.User.username);
    //console.log(client);
    sendDiscordMessage(loachannel, "Disappointed LoA Bot v" + versionNum + " ready!  Type !LoAHelp to get a message about everything I can do.");
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    if (e.message.channel_id == loachannel) {
        var command = e.message.content.toLowerCase();

        var whitespace = '';
        if (command.substring(0, 1) == '!') {
            console.log('received full command: ' + command);
            if (command.indexOf(' ') > -1) {
                whitespace = command.substring(command.indexOf(' ') + 1, command.length).toLowerCase();
                command = command.substring(0, command.indexOf(' '));
                console.log('received command param 1: ' + command + ', 2: ' + whitespace);
            }
            switch (command) {
                case '!loaabout':
                    sendDiscordMessage(loachannel, "Hello!  I'm a bot to help manage LoAs.  I was created by the genius Smaktat and I'm here to (hopefully) make yours and everyone else's lives easier through effective and consistent management of LoAs.\n  Type !LoAHelp to get a direct message about all of the things I can do!");
                    break;
                case '!noloa':
                    console.log('noloa executing');
                    var permissions = client.User.permissionsFor(client.Channels.get(loachannel));
                    if (permissions.General.ADMIN == true || permissions.General.Admin == true) {
                        var err = "I could not parse a User object from the supplied parameters.  Please pass in a valid User object by using the @ command.  For help or reference formats for creating an LoA, type !LoAHelp."
                        if (e.message.mentions.length > 0) {
                            for (var i = 0; i < e.message.mentions.length; i++) {
                                console.log(e.message.mentions[i]);
                                var message = { author: e.message.mentions[i] };
                                parseLoA(message, 'NoLoA');
                            }
                        } else {
                            sendDiscordMessage(loachannel, err);
                        }
                    } else {
                        sendDiscordMessage(loachannel, "Sorry " + e.message.author.username + ", you don't have the proper permission to do that.");
                    }
                    break;
                case '!loalate':
                    console.log('loalate executing');
                    parseLoA(e.message, 'late');
                    break;
                case '!loa':
                    console.log('loa executing');
                    parseLoA(e.message, 'normal');
                    break;
                case '!loadelete':
                    console.log('loadelete executing');
                    parseLoA(e.message, 'delete');
                    break;
                case '!loaupdate':
                    console.log('loaupdate executing');
                    parseLoA(e.message, 'update');
                    break;
                case '!loahelp':
                    console.log('loahelp executing');
                    sendDirectMessage(e.message.author.id, helpText);
                    break;
                case '!loalist':
                    console.log('loalist executing');
                    listLoAs(e.message);
                    break;
                case '!loalistfordate':
                    console.log('loalistfordate executing');
                    listLoAsForDate(e.message);
                    break;
                default:
                    console.log('default executing');
                    sendDiscordMessage(loachannel, "I couldn't understand that command.  Type !LoAHelp to get a message about everything I can do.");
                    break;
            }
        }

    }
});

/*

    client.Users.fetchMembers().then(() => {
        var users = client.Users.toArray();
        for(var i = 0; i < users.length; i++){
            
        }
    });

*/

function parseLoA(message, type) {
    var loa = {
        date: '',
        reason: '',
        type: type,
        discordId: message.author.id,
        discordUsername: message.author.username,
        updateDate: '',
        updateReason: ''
    };
    if (type.toLowerCase() !== 'noloa') {
        var messageContent = message.content.replace('!loa' + type, '');
        var messageArr = messageContent.toLowerCase().split(',');
        if (Date.parse(messageArr[0]) || messageArr[0] == 'today') {
        	if(messageArr[0] == 'today'){
        		messageArr[0] = moment().format('YYYY-MM-DD');
        	}
        	if(moment().isSameOrAfter(messageArr[0], 'year')){
        		messageArr[0] = moment(messageArr[0]).set('year', moment().get('year'));
        	}
            if (moment().isSameOrBefore(new Date(messageArr[0]).toISOString(), 'day')) {
                //loa.date = moment(messageArr[0]).format('dddd, MMMM Do YYYY');
                loa.date = moment(new Date(messageArr[0]).toISOString()).format('YYYY-MM-DD');
                if (messageArr[1] && type !== 'update') {
                    loa.reason = messageArr[1];
                }
                if (type == 'update') {
                    parseLoaUpdate(loa, messageArr);
                } else {
                    loaTypeSwitch(loa);
                }
            } else {
                sendDiscordMessage(loachannel, 'Please enter a future or current date for your LoA.  You cannot edit or delete past LoAs.  Commas are important.  Please refer to the formats presented in !LoAHelp for clarification.');
            }
        } else if (messageArr[0].includes('-')) {
            // date range
        } else {
            sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested.  LoA not added.  Please make your LoA request is in the correct format for the job you are requesting.  Reasons are not mandatory, but the comma is important!  For help or reference formats for creating an LoA, type !LoAHelp.");
        }
    } else {
        loa.date = moment().format('YYYY-MM-DD');
        loaTypeSwitch(loa);
    }
}

function loaTypeSwitch(loaObj) {
    switch (loaObj.type.toLowerCase()) {
        case 'normal':
            addloa(loaObj);
            break;
        case 'update':
            updateloa(loaObj);
            break;
        case 'delete':
            deleteloa(loaObj);
            break;
        case 'noloa':
            addloa(loaObj);
            break;
    }
}

function parseLoaUpdate(loaObj, messageArr) {
    console.log(messageArr);
    if (messageArr[0]) {
        if (Date.parse(messageArr[1])) {
            if (moment().isSameOrBefore(new Date(messageArr[1]).toISOString(), 'day')) {
                loaObj.updateDate = moment(new Date(messageArr[1]).toISOString()).format('YYYY-MM-DD');
                if (messageArr[2]) {
                    loaObj.updateReason = messageArr[2];
                }
                loaTypeSwitch(loaObj);
            } else {
                sendDiscordMessage(loachannel, 'Please enter a future or current date for your LoA to update to and ensure you are using the correct format.  For LoA formatting help, type !LoAHelp.');
            }
    	} else {
            loaObj.updateReason = messageArr[1];
        	loaObj.updateDate = messageArr[0];
        	loaTypeSwitch(loaObj);
            //sendDiscordMessage(loachannel, 'I could not parse the second date entered. Please enter a valid second date to update to and ensure you are using the correct format.  For LoA formatting help, type !LoAHelp.');
        }
    } else {
        sendDiscordMessage(loachannel, 'I could not find a second date for the update.  Please enter a second date and ensure you are using the correct format.  For LoA formatting help, type !LoAHelp.');
    }

}

function addloa(loaObj) {
    var sql = "SELECT * FROM loas WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error);
        } else {
            if (results.length > 0) {
                sendDiscordMessage(loachannel, "You've already got an LoA for this date.  You can delete an LoA with !LoADelete or change an LoA with !LoAUpdate.  For more information about commands, type !LoAHelp");
            } else {
                var sql = "INSERT INTO loas (discordid, discordusername, reason, date, type) VALUES ('" + loaObj.discordId + "', '" + loaObj.discordUsername + "', '" + loaObj.reason + "', '" + loaObj.date + "', '" + loaObj.type + "')";
                connection.query(sql, function(error, results, fields) {
                    if (error) {
                        sendDiscordMessage(loachannel, error);
                    } else {
                        sendDiscordMessage(loachannel, 'The LoA on ' + moment(loaObj.date).format("dddd, MMMM Do YYYY") + ' for <@' + loaObj.discordId + '> has been added.');
                    }
                });
            }
        }
    });
}

function deleteloa(loaObj) {
    var sql = "DELETE FROM loas WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error);
        } else {
            sendDiscordMessage(loachannel, 'The LoA on ' + moment(loaObj.date).format("dddd, MMMM Do YYYY") + ' for <@' + loaObj.discordId + '> was deleted.');
        }
    });
}

function updateloa(loaObj) {
    var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "') AND type <> 'noloa' AND discordid='" + loaObj.discordId + "'";
    console.log(sql);
    console.log(loaObj);
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error);
        } else {
            if (results.length > 0) {
                sql = "UPDATE loas SET date = DATE('" + moment(loaObj.updateDate).format('YYYY-MM-DD') + "'), reason = '" + loaObj.updateReason + "' WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
                connection.query(sql, function(error, results, fields) {
                    if (error) {
                        sendDiscordMessage(loachannel, error);
                    } else {
                        sendDiscordMessage(loachannel, 'Thanks <@' + loaObj.discordId + '>, your LoA for ' + moment(loaObj.date).format("dddd, MMMM Do YYYY") + ' was successfully changed to ' + moment(loaObj.updateDate).format("dddd, MMMM Do YYYY") + '.');
                    }
                });
            } else {
                sendDiscordMessage(loachannel, "There were no existing LoAs found for the date " + moment(loaObj.date).format("dddd, MMMM Do YYYY") + " for <@" + loaObj.discordId + ">.  No entries updated.  Type !LoAList to get all LoA entries for any current or future date for your user account.");
            }
        }

    });
}

function listLoAs(message) {
    var sql = "SELECT * FROM loas WHERE discordid = '" + message.author.id + "' AND date >= DATE('" + moment().format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error);
        } else {
            if (results.length > 0) {
                var strMessage = 'Active LoAs found for <@' + message.author.id + '>\n';
                for (var i = 0; i < results.length; i++) {
                    strMessage += 'Date: ' + moment(results[i].date).format('dddd, MMMM Do YYYY') + ', Reason: ' + results[i].reason + '\n';
                }
                sendDiscordMessage(loachannel, strMessage);
            } else {
                sendDiscordMessage(loachannel, 'Sorry ' + message.author.username + ', I did not find any active LoAs for you.');
            }
        }
    });
}

function listLoAsForDate(message) {
    var messageContent = message.content.replace('!loalistfordate ', '');
    if (Date.parse(messageContent)) {
        var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(new Date(messageContent).toISOString()).format('YYYY-MM-DD') + "')";
        connection.query(sql, function(error, results, fields) {
            if (error) {
                sendDiscordMessage(loachannel, error);
            } else {
                if (results.length > 0) {
                    var strMessage = 'Active LoAs found for ' + moment(new Date(messageContent).toISOString()).format('dddd, MMMM Do YYYY') + '\n';
                    for (var i = 0; i < results.length; i++) {
                        strMessage += 'User: ' + results[i].discordusername + ', Reason: ' + results[i].reason + '\n';
                    }
                    sendDiscordMessage(loachannel, strMessage);
                } else {
                    sendDiscordMessage(loachannel, 'There are no active LoAs for ' + moment(new Date(messageContent).toISOString()).format('dddd, MMMM Do YYYY') + '.');
                }
            }
        });
    } else {
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested. Please sure you're entering a valid date value.");
    }

}

function sendDiscordMessage(channelId, message) {
    client.Channels.get(channelId).sendMessage(message);
}

function sendDirectMessage(userId, message) {
    client.DirectMessageChannels.open(userId).then((dm) => {
        dm.sendMessage(helpText);
    });
}
