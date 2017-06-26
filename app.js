process.env.TZ = 'America/New_York';

//discord bot link: https://discordapp.com/developers/applications/me/316216046107361281
var Discordie = require('discordie');
var mysql = require('mysql');
var moment = require('moment');

const Events = Discordie.Events;
const client = new Discordie();

//var loachannel = '237085726208950272'; //real channel
var loachannel = '266749722692288512'; //test channel

var token = 'MzE2MjE2MDQ2MTA3MzYxMjgx.DAjXfQ.9UJJewQgiPFgYne--eF2SaL33OE'; //test channel
//var token = 'MzI2NDc4ODE4Mjg4MDc0NzUy.DCnYog.nEMacNJyvhX60N7JVmyOu2v6xmg'; //real channel

var connection = mysql.createConnection({
    host: 'mysql4.gear.host',
    user: 'disappointedloa',
    password: 'Nr2s?!FlWSPG',
    database: 'disappointedloa'
});

var versionNum = '2.1';

var sampleDate = moment().utcOffset(240).format('MM/DD/YY hh:mm');

var helpText = '__**Disappointed Leave of Absensce (LoA) Bot Help**__\n\n' +
    '**!LoA**: Create a basic LoA.\nFormat: !loa <Date>, <Reason (optional)>\n' +
    'Example: !LoA ' + sampleDate + ', I will be on vacation.  You do not need to provide a reason, but someone people just like to.  In most cases, not providing a reason is preferred.\nExample wihout a reason: !loa ' + sampleDate + '\n\n' +
    '**!LoALate:** Creates a basic LoA, but defines a property to let the officers know you only plan on being late and not missing entirely.\nFormat: !LoALate: <Date>, <Reason (optional)>\nExample: !LoALate ' + sampleDate + ', I will be 15 minutes late.  The reason is still optional.\n\n' +
    '**!LoADelete:** Deletes an LoA that has yet to pass.\nFormat: !LoADelete <Date>\nYou may only delete your LoA before or on the date originally entered.  LoAs after that date may not be deleted.\nExample: !LoADelete ' + sampleDate + '\n\nAdmins: You may delete dates for others with this command using the format: !LoADelete <date>, <@User>.\n\nExample: !LoADelete today, @smaktat\n\n' +
    '**!LoAUpdate:** Updates an existing LoA entry.\nFormat: !LoAUpdate <PreviousDate>, <NewDate>, <NewReason (optional)>\nAs with deletes, updates may only be edited before or on the date entered.\nExample: !LoAUpdate ' + sampleDate + ', 6/20/17, Work schedule changed.  The LoA for 6/19 was moved to 6/20 and the reason was also changed.\nIf you would like to update a reason for an existing entry, use the format !LoAUpdate <date>, <reason>.\nExample: !LoAUpdate today, I will be an hour late.\n\n' +
    '**!LoAList:** Lists all LoAs entered for the user who entered the command.\nExample: !LoAList\n\n' +
    '**!LoAListForDate:** Lists all LoAs for a specific date.\nFormat: !LoAListForDate <date>\nExample: !LoAListForDate ' + sampleDate + '\n\n' +
    '**!NoLoA:** Creates an LoA for a user.  This command is only useable by members with Administrator access to the LoA channel.\nFormat: !NoLoA <date>, <@User>\nExample: !NoLoA ' + sampleDate + ', @smaktat.\n\n' + 
    '**<today>**: The keyword "today" can be used as a quick way to state the current date instead of typing it out.\nFormat: <!command> <today>\nExample: !loa today\n\n' + 
    '**Date Variations**: This bot can understand many different date variations.  You can say June 24, 2017, 6/24/17, 6/24 (the bot will assume the current year), etc.  If the date you entered is invalaid, you will be notified.';

client.connect({
    token: token
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log('Connected as: ' + client.User.username);
    //console.log(client);
    sendDiscordMessage(loachannel, "Disappointed LoA Bot v" + versionNum + " ready!  Type !LoAHelp to get a message about everything I can do.");
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    var loaObj = {
        date: '',
        reason: '',
        type: '',
        discordId: '',
        discordUsername: '',
        updateDate: '',
        updateReason: ''
    };
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

			        var user = client.Users.get(e.message.author.id);
			        var channel = client.Channels.find(c => c.id == loachannel);
			        var permissions = user.permissionsFor(channel);

                    if (permissions.General.ADMINISTRATOR == true) {
                        var err = "I could not parse a User object from the supplied parameters.  Please pass in a valid User object by using the @ command.  For help or reference formats for creating an LoA, type !LoAHelp."
                        if (e.message.mentions.length > 0) {
                            for (var i = 0; i < e.message.mentions.length; i++) {
                                parseNoLoA(e.message, e.message.mentions[i], 'NoLoA', loaObj);
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
                    parseNormalLoA(e.message, 'late', loaObj);
                    break;
                case '!loa':
                    console.log('loa executing');
                    parseNormalLoA(e.message, 'normal', loaObj);
                    break;
                case '!loadelete':
                    console.log('loadelete executing');
			        var user = client.Users.get(e.message.author.id);
			        var channel = client.Channels.find(c => c.id == loachannel);
			        var permissions = user.permissionsFor(channel);

                    if (e.message.mentions.length > 0) {
                        if (permissions.General.ADMINISTRATOR == true) {
                            for (var i = 0; i < e.message.mentions.length; i++) {
                                e.message.author = e.message.mentions[i];
                                parseDeleteLoA(e.message, 'delete', loaObj, e.message.mentions[i]);
                            }
                        } else {
                            sendDiscordMessage(loachannel, "Sorry " + e.message.author.username + ", you don't have the proper permission to do that.");
                        }
                    } else {
                        parseDeleteLoA(e.message, 'delete', loaObj);
                    }
                    break;
                case '!loaupdate':
                    console.log('loaupdate executing');
                    parseUpdateLoA(e.message, 'update', loaObj);
                    break;
                case '!loahelp':
                    console.log('loahelp executing');
                    sendDirectMessage(e.message.author.id, helpText);
                    break;
                case '!loalist':
                    console.log('loalist executing');
                    listLoAs(e.message, loaObj);
                    break;
                case '!loalistfordate':
                    console.log('loalistfordate executing');
                    listLoAsForDate(e.message, loaObj);
                    break;
                default:
                    console.log('default executing');
                    sendDiscordMessage(loachannel, "I couldn't understand that command.  Type !LoAHelp to get a message about everything I can do.");
                    break;
            }
        }

    }
});

function parseDateTodayAndYear(date) {
    console.log(date);
    if (date.toLowerCase().replace(/\s/g, "") == 'today') {
        date = moment().utcOffset(240).format('MM-DD-YYYY');
    }
    console.log(date);
    if (moment().utcOffset(240).isSameOrAfter(new Date(date).toISOString(), 'year')) {
        date = moment(new Date(date).toISOString()).utcOffset(240).set('year', moment().get('year'));
    }
    return date;
}

function parseNormalLoA(message, type, loa) {
    //standard loa function
    //type can be changed
    loa.discordId = message.author.id;
    loa.discordUsername = message.author.username;
    loa.type = type;
    var messageContent = message.content.toLowerCase().replace('!loa' + type, '');
    var messageArr = messageContent.toLowerCase().split(',');

    if (Date.parse(messageArr[0]) || messageArr[0].replace(/\s/g, "").toLowerCase() == 'today') {
        loa.date = parseDateTodayAndYear(messageArr[0]);
        if (moment().utcOffset(240).isSameOrBefore(new Date(loa.date).toISOString(), 'day')) {

            if (messageArr[1]) {
                loa.reason = messageArr[1];
            }
            addloa(loa);
        } else {
            sendDiscordMessage(loachannel, 'Please enter a future or current date for your LoA.  You cannot edit or delete past LoAs.  Commas are important.  Please refer to the formats presented in !LoAHelp for clarification.');
        }
    } else {
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested.  LoA not added.  Please make your LoA request is in the correct format for the job you are requesting.  Reasons are not mandatory, but the comma is important!  For help or reference formats for creating an LoA, type !LoAHelp.");
    }
}

function parseUpdateLoA(message, type, loa) {
    loa.discordId = message.author.id;
    loa.discordUsername = message.author.username;
    loa.type = type;
    var messageContent = message.content.toLowerCase().replace('!loa' + type, '');
    var messageArr = messageContent.toLowerCase().split(',');

    if (Date.parse(messageArr[0]) || messageArr[0].replace(/\s/g, "").toLowerCase() == 'today') {
        loa.date = parseDateTodayAndYear(messageArr[0]);
        if (moment().utcOffset(240).isSameOrBefore(new Date(loa.date).toISOString(), 'day')) {
            if (Date.parse(messageArr[1])) {
                loa.updateDate = parseDateTodayAndYear(messageArr[1]);
                if (moment().utcOffset(240).isSameOrBefore(new Date(loa.updateDate).toISOString(), 'day')) {
                    if (messageArr[2]) {
                        loa.updateReason = messageArr[2];
                    }
                    updateloa(loa);
                } else {
                    sendDiscordMessage(loachannel, 'Please enter a future or current date for the second date in your LoA reqest.  You cannot edit or delete past LoAs.  Commas are important.  Please refer to the formats presented in !LoAHelp for clarification.');
                }
            } else {
                loa.updateReason = messageArr[1];
                loa.updateDate = loa.date;
                updateloa(loa);
            }
        } else {
            sendDiscordMessage(loachannel, 'Please enter a future or current date for the first date in your LoA reqest.  You cannot edit or delete past LoAs.  Commas are important.  Please refer to the formats presented in !LoAHelp for clarification.');
        }
    } else {
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested.  LoA not added.  Please make your LoA request is in the correct format for the job you are requesting.  Reasons are not mandatory, but the comma is important!  For help or reference formats for creating an LoA, type !LoAHelp.");
    }
}

function parseDeleteLoA(message, type, loa, loaUser) {
    //format: command <date>, mention
    var messageContent = message.content.toLowerCase().replace('!loa' + type, '');
    if (loaUser) {
        loa.discordId = loaUser.id;
        loa.discordUsername = loaUser.username;
        loa.type = 'noloadelete';
    } else {
        loa.discordId = message.author.id;
        loa.discordUsername = message.author.username;
        loa.type = type;
    }
    
    var messageArr = messageContent.toLowerCase().split(',');

    if (Date.parse(messageArr[0]) || messageArr[0].replace(/\s/g, "").toLowerCase() == 'today') {
        loa.date = parseDateTodayAndYear(messageArr[0]);
        if (moment().utcOffset(240).isSameOrBefore(new Date(loa.date).toISOString(), 'day')) {
            deleteloa(loa);
        } else {
            sendDiscordMessage(loachannel, 'Please enter a future or current date for the first date in your LoA reqest.  You cannot edit or delete past LoAs.  Commas are important.  Please refer to the formats presented in !LoAHelp for clarification.');
        }
    } else {
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested.  LoA not added.  Please make your LoA request is in the correct format for the job you are requesting.  Reasons are not mandatory, but the comma is important!  For help or reference formats for creating an LoA, type !LoAHelp.");
    }
}

function parseNoLoA(message, loaUser, type, loa) {
    var loa = new Object(loaTemplate);
    loa.discordId = loaUser.id;
    loa.discordUsername = loaUser.username;
    loa.type = type;
    var messageContent = message.content.toLowerCase().replace('!noloa', '');
    var messageArr = messageContent.toLowerCase().split(',');

    console.log(messageArr);
    console.log(messageContent);

    if (Date.parse(messageArr[0]) || messageArr[0].replace(/\s/g, "").toLowerCase() == 'today') {
        loa.date = parseDateTodayAndYear(messageArr[0]);
        if (moment().utcOffset(240).isSameOrBefore(new Date(loa.date).toISOString(), 'day')) {
            addloa(loa);
        } else {
            sendDiscordMessage(loachannel, 'Please enter a future or current date for the first date in your LoA reqest.  You cannot edit or delete past LoAs.  Commas are important.  Please refer to the formats presented in !LoAHelp for clarification.');
        }
    } else {
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested.  LoA not added.  Please make your LoA request is in the correct format for the job you are requesting.  Reasons are not mandatory, but the comma is important!  For help or reference formats for creating an LoA, type !LoAHelp.");
    }
}

function addloa(loaObj) {
    loaObj.date = moment(loaObj.date).utcOffset(240).format('YYYY-MM-DD');
    var sql = "SELECT * FROM loas WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).utcOffset(240).format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
        } else {
            if (results.length > 0) {
                sendDiscordMessage(loachannel, "You've already got an LoA for this date.  You can delete an LoA with !LoADelete or change an LoA with !LoAUpdate.  For more information about commands, type !LoAHelp");
            } else {
                var sql = "INSERT INTO loas (discordid, discordusername, reason, date, type) VALUES ('" + loaObj.discordId + "', '" + loaObj.discordUsername + "', '" + loaObj.reason + "', '" + loaObj.date + "', '" + loaObj.type + "')";
                connection.query(sql, function(error, results, fields) {
                    if (error) {
                        sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
                    } else {
                        sendDiscordMessage(loachannel, 'The LoA on ' + moment(loaObj.date).utcOffset(240).format("dddd, MMMM Do YYYY") + ' for <@' + loaObj.discordId + '> has been added.');
                    }
                });
            }
        }
    });
}

function deleteloa(loaObj) {
    var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(loaObj.date).utcOffset(240).format('YYYY-MM-DD') + "') ";
    if(loaObj.type == 'noloadelete'){
        sql += "AND type = 'noloa' ";
    } else {
        sql += "AND type <> 'noloa' ";
    }
    sql += "AND discordid='" + loaObj.discordId + "'";

    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
        } else if (results.length > 0) {
            sql = "DELETE FROM loas WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).utcOffset(240).format('YYYY-MM-DD') + "')";
            connection.query(sql, function(error, results, fields) {
                if (error) {
                    sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
                } else {
                    sendDiscordMessage(loachannel, 'The LoA on ' + moment(loaObj.date).utcOffset(240).format("dddd, MMMM Do YYYY") + ' for <@' + loaObj.discordId + '> was deleted.');
                }
            });
        } else {
            sendDiscordMessage(loachannel, 'There are no LoAs to delete for <@' + loaObj.discordId + '> on ' + moment(loaObj.date).utcOffset(240).format("dddd, MMMM Do YYYY") + '.');
        }
    });

}

function updateloa(loaObj) {
    var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(loaObj.date).utcOffset(240).format('YYYY-MM-DD') + "') AND type <> 'noloa' AND discordid='" + loaObj.discordId + "'";
    console.log(sql);
    console.log(loaObj);
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
        } else {
            if (results.length > 0) {
                sql = "UPDATE loas SET date = DATE('" + moment(loaObj.updateDate).utcOffset(240).format('YYYY-MM-DD') + "'), reason = '" + loaObj.updateReason + "' WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).utcOffset(240).format('YYYY-MM-DD') + "')";
                connection.query(sql, function(error, results, fields) {
                    if (error) {
                        sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
                    } else {
                        sendDiscordMessage(loachannel, 'Thanks <@' + loaObj.discordId + '>, your LoA for ' + moment(loaObj.date).utcOffset(240).format("dddd, MMMM Do YYYY") + ' was successfully changed to ' + moment(loaObj.updateDate).utcOffset(240).format("dddd, MMMM Do YYYY") + '.');
                    }
                });
            } else {
                sendDiscordMessage(loachannel, "There were no existing LoAs found for the date " + moment(loaObj.date).utcOffset(240).format("dddd, MMMM Do YYYY") + " for <@" + loaObj.discordId + ">.  No entries updated.  Type !LoAList to get all LoA entries for any current or future date for your user account.");
            }
        }

    });
}

function listLoAs(message) {
    var sql = "SELECT * FROM loas WHERE discordid = '" + message.author.id + "' AND date >= DATE('" + moment().utcOffset(240).format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
        } else {
            if (results.length > 0) {
                var strMessage = 'Active LoAs found for <@' + message.author.id + '>\n';
                for (var i = 0; i < results.length; i++) {
                    strMessage += 'Date: ' + moment(results[i].date).utcOffset(240).format('dddd, MMMM Do YYYY') + ', Reason: ' + results[i].reason + '\n';
                }
                sendDiscordMessage(loachannel, strMessage);
            } else {
                sendDiscordMessage(loachannel, 'Sorry ' + message.author.username + ', I did not find any active LoAs for you.');
            }
        }
    });
}

function listLoAsForDate(message) {
    var messageContent = message.content.toLowerCase().replace('!loalistfordate ', '');
    if (Date.parse(messageContent) || messageContent.replace(/\s/g, "").toLowerCase() == 'today') {
        messageContent = parseDateTodayAndYear(messageContent);
        var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(new Date(messageContent).utcOffset(240).toISOString()).format('YYYY-MM-DD') + "')";
        connection.query(sql, function(error, results, fields) {
            if (error) {
                sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
            } else {
                if (results.length > 0) {
                    var strMessage = 'Active LoAs found for ' + moment(new Date(messageContent).utcOffset(240).toISOString()).format('dddd, MMMM Do YYYY') + '\n';
                    for (var i = 0; i < results.length; i++) {
                        strMessage += 'User: ' + results[i].discordusername + ', Reason: ' + results[i].reason + '\n';
                    }
                    sendDiscordMessage(loachannel, strMessage);
                } else {
                    sendDiscordMessage(loachannel, 'There are no active LoAs for ' + moment(new Date(messageContent).utcOffset(240).toISOString()).format('dddd, MMMM Do YYYY') + '.');
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
