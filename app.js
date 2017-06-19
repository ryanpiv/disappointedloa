//discord bot link: https://discordapp.com/developers/applications/me/316216046107361281

var Discordie = require('discordie');
var mysql = require('mysql');
var moment = require('moment');

const Events = Discordie.Events;
const client = new Discordie();

var loachannel = '237085726208950272'; //real channel
//var loachannel = '266749722692288512'; //test channel

var connection = mysql.createConnection({
    host: 'mysql4.gear.host',
    user: 'disappointedloa',
    password: 'Nr2s?!FlWSPG',
    database: 'disappointedloa'
});

var helpText = '__**Disappointed Leave of Absensce (LoA) Bot Help**__\n\n' + 
'**!LoA**: Create a basic LoA.\nFormat: !loa <Date>, <Reason (optional)>\n' +
'Example: !LoA 6/19/17, I will be on vacation.  You do not need to provide a reason, but someone people just like to.  In most cases, not providing a reason is preferred.\nExample wihout a reason: !loa 6/19/17\n\n' + 
'**!LoALate:** Creates a basic LoA, but defines a property to let the officers know you only plan on being late and not missing entirely.\nFormat: !LoALate: <Date>, <Reason (optional)>\nExample: !LoALate 6/19/17, I will be 15 minutes late.  The reason is still optional.\n\n' +
'**!LoADelete:** Deletes an LoA that has yet to pass.\nFormat: !LoADelete <Date>\nYou may only delete your LoA before or on the date originally entered.  LoAs after that date may not be deleted.\nExample: !LoADelete 6/19/17\n\n' +
'**!LoAUpdate:** Updates an existing LoA entry.\nFormat: !LoAUpdate <PreviousDate>, <NewDate>, <NewReason (optional)>\nAs with deletes, updates may only be edited before or on the date entered.\nExample: !LoAUpdate 6/19/17, 6/20/17, Work schedule changed.  The LoA for 6/19 was moved to 6/20 and the reason was also changed.\n\n' + 
'**!LoAList:** Lists all LoAs entered for the user who entered the command.\nExample: !LoAList\n\n' +
'**!LoAListForDate:** Lists all LoAs for a specific date.\nFormat: !LoAListForDate <date>\nExample: !LoAListForDate 6/19/17\n';

client.connect({
    //token: 'MzE2MjE2MDQ2MTA3MzYxMjgx.DAjXfQ.9UJJewQgiPFgYne--eF2SaL33OE' //test channel
    token: 'MzI2NDc4ODE4Mjg4MDc0NzUy.DCnYog.nEMacNJyvhX60N7JVmyOu2v6xmg' //real channel
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log('Connected as: ' + client.User.username);
    //console.log(client);
    sendDiscordMessage(loachannel, "Disappointed LoA bot ready!  Type !LoAHelp to get a message about everything I can do.");
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
                case '!about':
                    sendDiscordMessage(loachannel, "Hello!  I'm a bot to help manage LoAs.  I was created by the genius Smaktat and I'm here to (hopefully) make yours and everyone else's lives easier.\n  Type !help to get a direct message about all of the things I can do!");
                    break;
                case '!noloa':
                    console.log('noloa executing');
                    break;
                case '!loalate':
                    console.log('lateloa executing');
                    parseLoA(e.message, 'late');
                    break;
                case '!loa':
                    parseLoA(e.message, 'normal');
                    break;
                case '!loadelete':
                    parseLoA(e.message, 'delete');
                    break;
                case '!loaupdate':
                    break;
                case '!loahelp':
                    sendDirectMessage(e.message.author.id, helpText);
                    break;
                case '!loalist':
                    listLoAs(e.message);
                    break;
                case '!loalistfordate':
                    listLoAsForDate(e.message);
                    break;
                default:
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
    var messageContent = message.content.replace('!loa ', '');
    var messageArr = messageContent.toLowerCase().split(',');
    if (Date.parse(messageArr[0])) {
        if (moment().isSameOrBefore(new Date(messageArr[0]).toISOString(), 'day')) {
            //loa.date = moment(messageArr[0]).format('dddd, MMMM Do YYYY');
            loa.date = moment(new Date(messageArr[0]).toISOString()).format('YYYY-MM-DD');
            if (messageArr[1]) {
                loa.reason = messageArr[1];
            }
            if (type == 'update') {
                parseLoaUpdate(loa, messageArr);
            } else {
                loaTypeSwitch(loa);
            }
        } else {
            sendDiscordMessage(loachannel, 'Please enter a future or current date for your LoA.  You cannot edit or delete past LoAs.');
        }
    } else if (messageArr[0].includes('-')) {
        // date range

    } else {
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested.  LoA not added.  Please make your LoA request is in the following format: !loa <MM/DD/YYYY>, <Reason>.  Full LoA example: !loa 6/18/17, I will be on vacation.  Reasons are not mandatory, but the comma is important!  For help on creating an LoA, type !LoAHelp.");
    }
}

function loaTypeSwitch(loaObj) {
    switch (loaObj.type) {
        case 'normal':
            addloa(loaObj);
            break;
        case 'edit':
            break;
        case 'delete':
            deleteloa(loaObj);
            break;
    }
}

function parseLoaUpdate(loaObj, messageArr) {
    if (messageArr[2]) {
        if (Date.parse(messageArr[2])) {
            if (moment().isSameOrBefore(new Date(messageArr[2]).toISOString(), 'day')) {
                loaObj.updateDate = moment(new Date(messageArr[2]).toISOString()).format('YYYY-MM-DD');
                if (messageArr[3]) {
                    loaObj.updateReason = messageArr[3];
                }
                updateLoa(loaObj);
            } else {
                sendDiscordMessage(loachannel, 'Please enter a future or current date for your LoA.');
            }
        } else {
            sendDiscordMessage(loachannel, 'Please enter a valid second date to update to.');
        }
    } else {
        sendDiscordMessage(loachannel, 'Please enter a second date to update to.');
    }

}

function addloa(loaObj) {
    var sql = "SELECT * FROM loas WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error);
        } else {
            if (results.length > 0) {
                sendDiscordMessage(loachannel, "You've already got an LoA for this date.  You can delete an LoA with !LoADelete or change an LoA with !LoAEdit.  For more information about commands, type !LoAHelp");
            } else {
                var sql = "INSERT INTO loas (discordid, discordusername, reason, date, type) VALUES ('" + loaObj.discordId + "', '" + loaObj.discordUsername + "', '" + loaObj.reason + "', '" + loaObj.date + "', '" + loaObj.type + "')";
                connection.query(sql, function(error, results, fields) {
                    if (error) {
                        sendDiscordMessage(loachannel, error);
                    } else {
                        sendDiscordMessage(loachannel, 'Thanks ' + loaObj.discordUsername + ', your LoA for: ' + moment(loaObj.date).format("dddd, MMMM Do YYYY") + ' has been added.');
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
            sendDiscordMessage(loachannel, 'Thanks ' + loaObj.discordUsername + ', your LoA for ' + moment(loaObj.date).format("dddd, MMMM Do YYYY") + ' was successfully removed.');
        }
    });
}

function updateloa(loaObj) {
    var sql = "UPDATE loas SET date = DATE('" + moment(loaObj.updateDate).format('YYYY-MM-DD') + "'), reason = '" + loaObj.updateReason + "' WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error);
        } else {
            sendDiscordMessage(loachannel, 'Thanks ' + loaObj.discordUsername + ', your LoA for ' + moment(loaObj.date).format("dddd, MMMM Do YYYY") + ' was successfully changed to ' + moment(loaObj.updateDate).format("dddd, MMMM Do YYYY") + '.');
        }
    });
}

function listLoAs(message){
    var sql = "SELECT * FROM loas WHERE discordid = '" + message.author.id + "' AND date >= DATE('" + moment().format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if(error){
            sendDiscordMessage(loachannel, error);
        } else {
            if(results.length > 0){
                var strMessage = 'Active LoAs found for ' + message.author.username + '\n';
                for(var i = 0; i < results.length; i++){
                    strMessage += 'Date: ' + moment(results[i].date).format('dddd, MMMM Do YYYY') + ', Reason: ' + results[i].reason + '\n';
                }
                sendDiscordMessage(loachannel, strMessage);
            } else {
                sendDiscordMessage(loachannel, 'Sorry ' + message.author.username + ', I did not find any active LoAs for you.');
            }
        }
    });
}

function listLoAsForDate(message){
    var messageContent = message.content.replace('!loalistfordate ', '');
    if (Date.parse(messageContent)) {
        var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(new Date(messageContent).toISOString()).format('YYYY-MM-DD') + "')";
        connection.query(sql, function(error, results, fields) {
            if(error){
                sendDiscordMessage(loachannel, error);
            } else {
                if(results.length > 0){
                    var strMessage = 'Active LoAs found for ' + moment(new Date(messageContent).toISOString()).format('dddd, MMMM Do YYYY') + '\n';
                    for(var i = 0; i < results.length; i++){
                        strMessage += 'User: ' + results[i].discordusername + ', Reason: ' + results[i].reason + '\n';
                    }
                    sendDiscordMessage(loachannel, strMessage);
                } else {
                    sendDiscordMessage(loachannel, 'Sorry ' + message.author.username + ', I could not find any active LoAs for ' + moment(results[i].date).format('dddd, MMMM Do YYYY') + '.');
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

function sendDirectMessage(userId, message){
    client.DirectMessageChannels.open(userId).then((dm) => {
        dm.sendMessage(helpText);
    });
}