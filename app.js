//process.env.TZ = 'America/New_York';

//discord bot link: https://discordapp.com/developers/applications/me/316216046107361281
var Discordie = require('discordie');
var mysql = require('mysql');
var request = require('request');
var csv = require('csv');
var async = require('async');
var moment = require('moment-timezone');
moment.tz.setDefault('America/New_York');

const Events = Discordie.Events;
const client = new Discordie();

var connectFile = require('./connect.js');
var connString = connectFile.connString;

var token = connectFile.token;
var connection = mysql.createConnection({
    host: connString.host,
    user: connString.user,
    password: connString.password,
    database: connString.database
});

var loachannel = connectFile.loachannel;
var loaDays = [6, 0];

var versionNum = '4.0.1';
var versionAnnounce = 0;

var sampleDate = moment().format('MM/DD/YY');
var helpText = '__**Disappointed Leave of Absensce (LoA) Bot Help**__\n\n' +
    '**!LoA**: Create a basic LoA.\nFormat: !LoA <Date> : <Date (optional) >, <Reason (optional)>\n' +
    'Example One: !LoA ' + sampleDate + ', I will be on vacation.\nExample Two, batch command: !LoA 10/1 : 10/10, vacation.\nYou do not need to provide a reason, but someone people just like to.  In most cases, not providing a reason is preferred.\nExample wihout a reason: !loa ' + sampleDate + '\n\n' +
    '**!LoALate:** Creates a basic LoA, but defines a property to let the officers know you only plan on being late and not missing entirely.\nFormat: !LoALate: <Date>, <Reason (optional) >\nExample: !LoALate ' + sampleDate + ', I will be 15 minutes late.  The reason is still optional.\n\n' +
    '**!LoADelete:** Deletes an LoA that has yet to pass.\nFormat: !LoADelete <Date> : <Date (optional) >\nYou may only delete your LoA before or on the date originally entered.  LoAs after that date may not be deleted.\nExample: !LoADelete ' + sampleDate + '\nExample Two, batch command: !LoADelete 10/1 : 10/10\n\n' +
    '**!LoAUpdate:** Updates an existing LoA entry.\nFormat: !LoAUpdate <PreviousDate>, <NewDate>, <NewReason (optional)>\nAs with deletes, updates may only be edited before or on the date entered.\nExample: !LoAUpdate 6/19/17, 6/20/17, Work schedule changed.  The LoA for 6/19 was moved to 6/20 and the reason was also changed.\nIf you would like to update a reason for an existing entry, use the format !LoAUpdate <date>, <reason>.\nExample: !LoAUpdate today, I will be an hour late.\n\n' +
    '**!LoAList:** Lists all LoAs entered for the user who entered the command.\nExample: !LoAList\n\n' +
    '**!LoAListForDate:** Lists all LoAs for a specific date.\nFormat: !LoAListForDate <date>\nExample: !LoAListForDate ' + sampleDate + '\n\n';

var helpTextTwo = '\n\n__**Admin Only Commands**__\n\n' +
    '**!LoA**: Creates a basic LoA for a user.  Useful for when a user provides an LoA but needs help with submission.  As with the other commands, reason is an optional parameter.\nFormat: !LoA <date> : <date (optional) >, <@user>, <reason (optional) >.\nExample !LoA ' + sampleDate + ', @smaktat, Working\n\n' +
    '**!LoADelete:** Deletes an LoA for another user.  Useful when a user is not able to delete their LoA or an Admin has added an LoA for a user and needs to remove it.\nFormat: !LoADelete <date> : <date (optional) >, <@user>\nExample: !LoADelete ' + sampleDate + ', @smaktat\n\n' +
    '**!Loot**: Type this command and attach a text file with RC Loot Council CSV (Comma Seperated Values) data.  Only works with an attachment.\n\n' +
    '**!NoLoA:** Creates an LoA for a user.\nFormat: !NoLoA <date>, <@User>\nExample: !NoLoA ' + sampleDate + ', @smaktat.';

client.connect({
    token: token
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log('Connected as: ' + client.User.username);
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
        updateReason: '',
        status: false,
        dateCheck: '',
        batch: false
    };
    var user = client.Users.get(e.message.author.id);
    var channel = client.Channels.find(c => c.id == loachannel);
    var permissions = user.permissionsFor(channel);

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
                    sendDiscordMessage(loachannel, "Hello!  I'm a bot to help manage LoAs.  I was created by the genius Smaktat and I'm here to (hopefully) make yours and everyone else's lives easier through effective and consistent management of LoAs.\nType !LoAHelp to get a direct message about all of the things I can do!");
                    break;
                case '!loachanges':
                case '!loaupdates':
                case '!loalatest':
                    sendDiscordMessage(loachannel, "Batch LoAs have arrived!  You may add multiple LoAs at once with one command.\nExample: !LoA 10/1 : 10/25, vaca baby!\n\nAdded the wrong date range?  You can batch delete as well.\nExample: !LoADelete 10/1 : 10/25");
                    break;
                case '!noloa':
                    console.log('noloa executing');
                    if (permissions.General.ADMINISTRATOR == true) {
                        var err = "I could not parse a User object from the supplied parameters.  Please pass in a valid User object by using the @ command.  For help or reference formats for creating an LoA, type !LoAHelp."
                        if (e.message.mentions.length > 0) {
                            for (var i = 0; i < e.message.mentions.length; i++) {
                                var loaObj = { date: '', reason: '', type: '', discordId: '', discordUsername: '', updateDate: '', updateReason: '', status: false, dateCheck: '' };
                                parseNoLoA(e.message, e.message.mentions[i], 'NoLoA', loaObj, permissions);
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
                    preParseLoA(e.message, 'late', loaObj, permissions);
                    break;
                case '!loadelete':
                    console.log('loadelete executing');

                    if (e.message.mentions.length > 0) {
                        if (permissions.General.ADMINISTRATOR == true) {
                            for (var i = 0; i < e.message.mentions.length; i++) {
                                e.message.author = e.message.mentions[i];
                                preParseLoA(e.message, 'delete', loaObj, permissions, e.message.mentions[i]);
                            }
                        } else {
                            sendDiscordMessage(loachannel, "Sorry " + e.message.author.username + ", you don't have the proper permission to do that.");
                        }
                    } else {
                        preParseLoA(e.message, 'delete', loaObj, permissions);
                    }
                    break;
                case '!loaupdate':
                    console.log('loaupdate executing');
                    parseUpdateLoA(e.message, 'update', loaObj, permissions);
                    break;
                case '!loahelp':
                    console.log('loahelp executing');
                    sendDirectMessage(e.message.author.id, helpText);
                    sendDirectMessage(e.message.author.id, helpTextTwo);
                    break;
                case '!loalist':
                    console.log('loalist executing');
                    listLoAs(e.message, loaObj);
                    break;
                case '!loalistfordate':
                    console.log('loalistfordate executing');
                    listLoAsForDate(e.message, loaObj, permissions);
                    break;
                case '!loot':
                    console.log('!loot executing');
                    if (permissions.General.ADMINISTRATOR == true) {
                        if (e.message.attachments) {
                            if (e.message.attachments[0].url) {
                                var url = e.message.attachments[0].url;
                                parseLoot(url, permissions);
                            } else {
                                sendDiscordMessage(loachannel, 'I could not find a URL to download from the Discord servers.  The file may not have uploaded to Discord correctly.  Please try again.');
                            }
                        } else {
                            sendDiscordMessage(loachannel, 'The !loot command requires an attached loot file text file.  Please add an attachment with this command.');
                        }
                    } else {
                        sendDiscordMessage(loachannel, 'This command is restricted to those with Administrator access only.');
                    }
                    break;
                case '!clearmessages':
                    console.log('clear messages executing');
                    if (permissions.General.ADMINISTRATOR == true) {
                        if (whitespace == '') {
                            e.message.channel.sendMessage('Please send a value between 1 and 100 for the amount of messages to clear.');
                        } else {
                            if (parseInt(whitespace)) {
                                if (whitespace > 0 && whitespace < 101) {
                                    console.log('Clearing last ' + whitespace + ' messages...');
                                    clearMessages(whitespace);
                                } else {
                                    e.message.channel.sendMessage('Please send a numerical value for the amount of messages to delete, between the values of 1 and 100.');
                                }
                            } else {
                                e.message.channel.sendMessage('Please send a numerical value for the amount of messages to delete, between the values of 1 and 100.');
                            }
                        }
                    } else {
                        sendDiscordMessage(loachannel, 'This command is restricted to those with Administrator access only.');
                        break;
                    }
                    break;
                case '!loa':
                    console.log('loa executing');
                    if (e.message.mentions.length > 0) {
                        if (permissions.General.ADMINISTRATOR == true) {
                            for (var i = 0; i < e.message.mentions.length; i++) {
                                e.message.author = e.message.mentions[i];
                                preParseLoA(e.message, 'normal', loaObj, permissions, e.message.mentions[i]);
                            }
                        } else {
                            sendDiscordMessage(loachannel, "Sorry " + e.message.author.username + ", you don't have the proper permission to do that.");
                        }
                    } else {
                        preParseLoA(e.message, 'normal', loaObj, permissions);
                    }
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
    //assume user data is EST since Discord gives us no way to detect a user's timezone
    if (date.toLowerCase().replace(/\s/g, "") == 'today') {
        //convert moment UTC date to EST
        date = moment().format();
    } else {
        //parse date entered to EST from moment UTC
        date = moment(date, 'MM/DD').format();
    }
    if (moment().isSameOrAfter(date, 'year')) {
        date = moment(date).year(moment().year()).format();
    }
    return date;
}

function checkDate(loa, permissions) {
    console.log(loa.dateCheck);
    if (Date.parse(loa.dateCheck) || loa.dateCheck.replace(/\s/g, "").toLowerCase() == 'today') {
        loa.dateCheck = parseDateTodayAndYear(loa.dateCheck);
        if (moment().isSameOrBefore(loa.dateCheck, 'day') || permissions.General.ADMINISTRATOR == true) {
            for (var i = 0; i < loaDays.length; i++) {
                if (moment(loa.dateCheck).day() == loaDays[i]) {
                    loa.status = true;
                    console.log('day: ' + moment(loa.dateCheck).day() + ', loaday: ' + loaDays[i]);
                }
            }
            if (loa.status == false) {
                if (loa.batch == false) {
                    var loaStr = '';
                    sendDiscordMessage(loachannel, 'The date entered was not on a set raid day.');
                }
            } else {
                loa.status = true;
            }
        } else {
            sendDiscordMessage(loachannel, 'Please enter a future or current date for your LoA.  You cannot edit or delete past LoAs.  Commas are important.  Please refer to the formats presented in !LoAHelp for clarification.');
            loa.status = false;
        }
    } else {
        console.log(loa);
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested.  LoA not added.  Please make your LoA request is in the correct format for the job you are requesting.  Reasons are not mandatory, but the comma is important!  For help or reference formats for creating an LoA, type !LoAHelp.");
        loa.status = false;
    }
    return loa;
}

function mysql_real_escape_string(val) {
    val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function(s) {
        switch (s) {
            case "\0":
                return "\\0";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\b":
                return "\\b";
            case "\t":
                return "\\t";
            case "\x1a":
                return "\\Z";
            case "'":
                return "''";
            case '"':
                return '""';
            default:
                return "\\" + s;
        }
    });

    return val;
};

function preParseLoA(message, type, loa, permissions, loaUser) {
    loa.discordId = message.author.id;
    loa.discordUsername = message.author.username;
    loa.type = type;
    var messageContent = message.content.toLowerCase();
    messageContent = messageContent.replace(type.toLowerCase(), '');
    messageContent = messageContent.replace('!loa', '');
    var messageArr = messageContent.toLowerCase().split(',');

    if (loaUser) {
        loa.discordId = loaUser.id;
        loa.discordUsername = loaUser.username;
    } else {
        loa.discordId = message.author.id;
        loa.discordUsername = message.author.username;
    }
    loa.type = type;
    var datesArr = messageArr[0].split(':');
    if (datesArr.length > 1) {
        loa.batch = true;
    }
    var currDate = parseDateTodayAndYear(datesArr[0]);
    datesArr[1] = parseDateTodayAndYear(datesArr[1]);

    while (moment(currDate).isSameOrBefore(datesArr[1])) {
        loa.status = false;
        console.log('inside perparseloa');
        console.log(currDate);
        loa.dateCheck = currDate;
        loa = checkDate(loa, permissions);

        switch (type.toLowerCase()) {
            case 'late':
            case 'normal':
                parseNormalLoA(messageArr, type, JSON.parse(JSON.stringify(loa)), permissions);
                break;
            case 'update':
                parseUpdateLoA(messageArr, type, JSON.parse(JSON.stringify(loa)), permissions);
                break;
            case 'delete':
                parseDeleteLoA(messageArr, type, JSON.parse(JSON.stringify(loa)), permissions);
                break;
            case 'noloa':
                break;
        }

        if (loa.batch == true) {
            console.log('in the if');
            console.log(currDate);
            currDate = moment(currDate).add(1, 'days').format('MM/DD/YYYY');
            console.log(currDate);
        } else {
            break;
        }
    }
}

function parseNormalLoA(messageArr, type, loa, permissions) {
    //standard loa function
    //type can be changed
    if (loa.status) {
        loa.date = loa.dateCheck;
        if (messageArr[1]) {
            if (messageArr[1].includes('<@')) {
                if (messageArr[2]) {
                    console.log('2 ' + messageArr[2]);
                    loa.reason = mysql_real_escape_string(messageArr[2]);
                }
            } else {
                if (messageArr[1]) {
                    loa.reason = mysql_real_escape_string(messageArr[1]);
                }
            }
        }
        addloa(loa);
    }
}

function parseUpdateLoA(message, type, loa, permissions) {
    loa.discordId = message.author.id;
    loa.discordUsername = message.author.username;
    loa.type = type;
    var messageContent = message.content.toLowerCase().replace('!loa' + type, '');
    var messageArr = messageContent.toLowerCase().split(',');

    loa.dateCheck = messageArr[0];
    loa = checkDate(loa, permissions);
    if (loa.status) {
        loa.status = false;
        loa.date = loa.dateCheck;
        loa.dateCheck = messageArr[1];
        loa = checkDate(loa, permissions);
        if (loa.status) {
            loa.updateDate = loa.dateCheck;
            if (messageArr[2]) {
                loa.updateReason = messageArr[2];
            }
            updateloa(loa);
        }
    }
}

function parseDeleteLoA(messageArr, type, loa, permissions) {
    if (loa.status) {
        loa.date = loa.dateCheck;
        if (messageArr[1]) {
            loa.reason = mysql_real_escape_string(messageArr[1]);
        }
        deleteloa(loa);
    }
}

function parseNoLoA(message, loaUser, type, loa, permissions) {
    loa.discordId = loaUser.id;
    loa.discordUsername = loaUser.username;
    loa.type = type;
    var messageContent = message.content.toLowerCase().replace('!noloa', '');
    var messageArr = messageContent.toLowerCase().split(',');

    loa.dateCheck = messageArr[0];
    loa = checkDate(loa, permissions);
    if (loa.status) {
        loa.date = loa.dateCheck;
        addloa(loa);
    }
}

function addloa(loaObj) {
    console.log('beginning of addloa');
    console.log(loaObj);

    async.waterfall([
        async.constant(loaObj),
        function(loaObj, callback) {
            console.log('inside sql 1: ');
            console.log(loaObj);
            var sql = "SELECT * FROM loas WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
            connection.query(sql, function(error, results, fields) {
                callback(error, results, loaObj);
            });
        },
        function(results, loaObj, callback) {
            console.log('inside sql 2: ');
            console.log(loaObj);
            if (results.length > 0) {
                sendDiscordMessage(loachannel, "An LoA already exists for <@" + loaObj.discordId + "> on " + moment(loaObj.date).format('dddd, MM/DD/YY') + ".  For more information about commands, type !LoAHelp");
            } else {
                var sql = "INSERT INTO loas (discordid, discordusername, reason, date, type) VALUES ('" + loaObj.discordId + "', '" + loaObj.discordUsername + "', '" + loaObj.reason + "', '" + moment(loaObj.date).format('YYYY-MM-DD') + "', '" + loaObj.type + "')";
                connection.query(sql, function(error, results, fields) {
                    callback(error, loaObj);
                });
            }
        }
    ], function(err, loaObj) {
        console.log(err);
        if (err) {
            sendDiscordMessage(loachannel, err + ', <@105094681141977088>');
        } else {
            sendDiscordMessage(loachannel, 'The LoA on ' + moment(loaObj.date).format("dddd, MM/DD/YY") + ' for <@' + loaObj.discordId + '> has been added.');
        }
    });
}

function deleteloa(loaObj) {
    var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "') ";
    sql += "AND discordid='" + loaObj.discordId + "'";

    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
        } else if (results.length > 0) {
            sql = "DELETE FROM loas WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
            connection.query(sql, function(error, results, fields) {
                if (error) {
                    sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
                } else {
                    sendDiscordMessage(loachannel, 'The LoA on ' + moment(loaObj.date).format("dddd, MM/DD/YY") + ' for <@' + loaObj.discordId + '> was deleted.');
                }
            });
        } else {
            if (loaObj.batch == false) {
                sendDiscordMessage(loachannel, 'There are no LoAs to delete for <@' + loaObj.discordId + '> on ' + moment(loaObj.date).format("dddd, MM/DD/YY") + '.');
            }
        }
    });
}

function updateloa(loaObj) {
    var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "') AND type <> 'noloa' AND discordid='" + loaObj.discordId + "'";
    console.log(sql);
    console.log(loaObj);
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
        } else {
            if (results.length > 0) {
                sql = "UPDATE loas SET date = DATE('" + moment(loaObj.updateDate).format('YYYY-MM-DD') + "'), reason = '" + loaObj.updateReason + "' WHERE discordid = '" + loaObj.discordId + "' AND date = DATE('" + moment(loaObj.date).format('YYYY-MM-DD') + "')";
                connection.query(sql, function(error, results, fields) {
                    if (error) {
                        sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
                    } else {
                        sendDiscordMessage(loachannel, 'Thanks <@' + loaObj.discordId + '>, your LoA for ' + moment(loaObj.date).format("dddd, MM/DD/YY") + ' was successfully changed to ' + moment(loaObj.updateDate).format("dddd, MM/DD/YY") + '.');
                    }
                });
            } else {
                sendDiscordMessage(loachannel, "There were no existing LoAs found for the date " + moment(loaObj.date).format("dddd, MM/DD/YY") + " for <@" + loaObj.discordId + ">.  No entries updated.  Type !LoAList to get all LoA entries for any current or future date for your user account.");
            }
        }

    });
}

function listLoAs(message) {
    var sql = "SELECT * FROM loas WHERE discordid = '" + message.author.id + "' AND date >= DATE('" + moment().format('YYYY-MM-DD') + "')";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
        } else {
            if (results.length > 0) {
                var strMessage = 'Active LoAs found for <@' + message.author.id + '>\n';
                for (var i = 0; i < results.length; i++) {
                    strMessage += 'Date: ' + moment(results[i].date).format('dddd, MM/DD/YY') + ', Reason: ' + results[i].reason + '\n';
                }
                sendDiscordMessage(loachannel, strMessage);
            } else {
                sendDiscordMessage(loachannel, 'Sorry ' + message.author.username + ', I did not find any active LoAs for you.');
            }
        }
    });
}

function listLoAsForDate(message, loa, permissions) {
    var messageContent = message.content.toLowerCase().replace('!loalistfordate ', '');
    loa.dateCheck = messageContent;
    loa = checkDate(loa, permissions);
    if (loa.status) {
        loa.date = loa.dateCheck;
        var sql = "SELECT * FROM loas WHERE date = DATE('" + moment(loa.date).format('YYYY-MM-DD') + "') order by type asc";
        connection.query(sql, function(error, results, fields) {
            if (error) {
                sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
            } else {
                if (results.length > 0) {
                    var strMessage = 'Active LoAs found for ' + moment(loa.date).format('dddd, MM/DD/YY') + '\n';
                    for (var i = 0; i < results.length; i++) {
                        strMessage += results[i].discordusername;
                        if (results[i].type !== 'normal') {
                            strMessage += ', ' + results[i].type;
                        }
                        if (results[i].reason) {
                            strMessage += ', ' + mysql_real_escape_string(results[i].reason) + '\n';
                        } else {
                            strMessage += '\n';
                        }
                    }
                    sendDiscordMessage(loachannel, strMessage);
                } else {
                    sendDiscordMessage(loachannel, 'There are no active LoAs for ' + moment(loa.date).format('dddd, MM/DD/YY') + '.');
                }
            }
        });
    } else {
        sendDiscordMessage(loachannel, "Unable to parse a date for the LoA requested. Please sure you're entering a valid date value.");
    }
}

function parseLoot(url, permissions) {
    request.get(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            csv.parse(body, function(error, body) {
                if (!error) {
                    console.log(body.length);

                    //check to see if first entry is parsing data
                    if (body[0][0].toLowerCase() == 'player' && body[0][1].toLowerCase() == ' date') {
                        body.splice(0, 1);
                    }

                    sendDiscordMessage(loachannel, 'Preparing to parse ' + body.length + ' items');

                    checkIfLootItemExists(body);
                } else {
                    sendDiscordMessage('An error occurred while parsing the CSV data.  Message returned from parser: ' + error + ' <@105094681141977088>');
                }
            });
        } else {
            sendDiscordMessage('An error occurred while retrieving the file from the Discord servers.  Message returned from request: ' + error + ' <@105094681141977088>');
        }
    });
}

function checkIfLootItemExists(lootArray) {
    var duplicatesArray = [];
    var submittedArray = [];
    sendDiscordMessage(loachannel, 'Beginning submission, please be patient while I process all items');
    async.each(lootArray, function(lootItem, callback) {
        // Perform operation on file here.
        //console.log('Processing file ' + lootItem);
        var sql = "SELECT * FROM loot_history WHERE date='" + moment(lootItem[1], 'DD/MM/YY').format('YYYY-MM-DD') + " " + lootItem[2] + "' AND itemId = " + lootItem[4];
        //console.log('sql: ' + sql);
        connection.query(sql, function(error, results, fields) {
            if (error) {
                sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
                console.log(sql);
                return false;
            } else {
                if (results.length > 0) {
                    duplicatesArray.push('Duplicate item found, skipping: ' + lootItem[0] + ', ' + lootItem[3] +
                        ', ' + lootItem[1] + ' ' + lootItem[2]);

                    console.log('Duplicate item found, skipping: ' + lootItem[0] + ', ' + lootItem[3] + ', ' + lootItem[1] + ' ' + lootItem[2]);
                    callback();
                } else {
                    submittedArray.push('Adding item: ' + lootItem[0] + ', ' + lootItem[3] + ', ' + lootItem[1] + ' ' + lootItem[2]);
                    addLootItem(lootItem, callback);
                }
            }
        });
    }, function(err, results) {
        // if any of the file processing produced an error, err would equal that error
        var msg = '';
        if (duplicatesArray.length > 0) {
            msg += 'Skipping ' + duplicatesArray.length + ' duplicate items.\n';
        }
        msg += 'Submitting ' + submittedArray.length + ' new items.';
        sendDiscordMessage(loachannel, msg);

        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('err: ' + err);
            sendDiscordMessage(loachannel, 'An item failed to process: ' + err);
        } else {
            sendDiscordMessage(loachannel, 'All items have been processed successfully.');
        }
    });
}

function addLootItem(lootItem, done) {
    //lootItem is an 1 indivudal loot item, as an array of values
    //adds an entry to the loot table
    //returns the player name
    var sql = "INSERT INTO loot_history VALUES(DEFAULT,'" + mysql_real_escape_string(lootItem[0]) + "', '" + moment(lootItem[1], "DD/MM/YY").format('YYYY-MM-DD') + " " + mysql_real_escape_string(lootItem[2]) + "', '" + mysql_real_escape_string(lootItem[3]) + "'," + mysql_real_escape_string(lootItem[4]) + ",'" + mysql_real_escape_string(lootItem[5]) + "','" + mysql_real_escape_string(lootItem[6]) + "'," + mysql_real_escape_string(lootItem[7]) + ",'" + mysql_real_escape_string(lootItem[8]) + "','" + mysql_real_escape_string(lootItem[9]) + "','" + mysql_real_escape_string(lootItem[10]) + "','" + mysql_real_escape_string(lootItem[11]) + "','" + mysql_real_escape_string(lootItem[12]) + "','" + mysql_real_escape_string(lootItem[13]) + "','" + mysql_real_escape_string(lootItem[14]) + "', NOW(), NOW())";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            sendDiscordMessage(loachannel, error + ', <@105094681141977088>');
            console.log(sql);
        } else {
            done();
        }
    });
}

function clearMessages(amount) {
    client.Channels.get(loachannel).fetchMessages(amount).then(() => {
        var messages = client.Channels.get(loachannel).messages;
        client.Messages.deleteMessages(messages, loachannel);
        console.log('Messages cleared.');
    }).catch((err) => {
        sendDiscordMessage(loachannel, err);
    });
}

function sendDiscordMessage(channelId, message) {
    client.Channels.get(channelId).sendMessage(message);
}

function sendDirectMessage(userId, message) {
    client.DirectMessageChannels.open(userId).then((dm) => {
        dm.sendMessage(message);
    }).catch(function(error) {
        console.log(error);
    });
}
