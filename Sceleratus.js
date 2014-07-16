var prefix = "%";
var leaveLimit = 1800;
var autoAdd = 600;

function botVersion() {
  return "0.3.0-beta";
}

API.on(API.DJ_ADVANCE, djadvancecallback);
API.on(API.CHAT, chatcallback);
API.on(API.USER_LEAVE,userLeave(data));

function djadvancecallback(obj) {
  var currentDJ = obj.dj;
  setTimeout(function () {
    var reason = "";
    var skipcondition = false;
    if (API.getTimeRemaining() > 420) {
      skipcondition = true;
      reason = "Too long";
    }
    if (skipcondition && currentDJ.id != "53517697c3b97a1d6548a7ea" && currentDJ.id != "5394868d96fba54fbc290223" && !currentDJ.permission) {
      $('#meh').click();
      API.moderateRemoveDJ(currentDJ.id);
      if (document.location == 'http://plug.dj/epic-room-20/') {
        API.sendChat(reason+"!! Trying to skip..");
      }
    } else {
      $('#woot').click();
    }
  }, 2000);
}

function chatcallback(data) {
  if (data.type === "message") {
    if (data.fromID === "53517697c3b97a1d6548a7ea") {
      if (data.message.lastIndexOf(prefix, 0) == 0) {
        var cmdParts = data.message.split(" ");
        var cmdBase = cmdParts[0].replace(prefix, "");
        cmdParts.splice(0,1)
        laelaCommand(cmdBase, cmdParts);
        API.moderateDeleteChat(data.chatID);
      }
    } else {
      if (data.message.lastIndexOf(prefix, 0) == 0) {
        var cmdParts = data.message.split(" ")
        var cmdBase = cmdParts[0].replace(prefix, "");
        cmdParts.splice(0,1)
        publicCommand(cmdBase, cmdParts);
        API.moderateDeleteChat(data.chatID);
      }
    }
  }
}

function userLeave(data){
    captureUserLeave(data);
}

function laelaCommand(id,arg) {
  if(!arg)
  {
    arg = [];
  }
  switch (id) {
    case 'meh':
      $('#meh').click()
      break;
    case 'woot':
      $('#woot').click()
      break;
    case 'reload':
      location.reload(true);
      break;
    case 'debug':
      document.location = 'http://plug.dj/804060f5/';
      break;
    case 'eesti':
      document.location = 'http://plug.dj/epic-room-20/';
      break;
    case 'goto':
      var newloc = "http://plug.dj/"+arg[0];
      document.location = newloc;
      break;
    case 'join':
      API.djJoin();
      break;
    case 'echo':
      API.sendChat(arg.join(" "));
      break;
    case 'leave':
      API.djLeave();
      break;
    case 'skip':
      API.moderateForceSkip();
      break;
    case 'ban':
      API.sendChat("Command disabled");
      break;
    case 'kick':
      API.sendChat("Command disabled");
      break;
    case 'add':
      if (!arg.length) {arg[0] = "5394868d96fba54fbc290223";}
      API.moderateAddDJ(arg[0]);
      break;
    case 'remove':
      if (!arg.length) {arg[0] = "5394868d96fba54fbc290223";}
      API.moderateRemoveDJ(arg[0]);
      break;
    case 'version':
      API.sendChat("Current bot version: "+botVersion());
      break;
    case 'stats':
      if (!arg.length) {arg[0] = "Sceleratus";}
      var user = API.getUser(getId(arg[0]));
      API.sendChat(user.username+": grabs received: "+user.curatorPoints+", woots received: "+user.djPoints+", woots/mehs given: "+user.listenerPoints);
      break;
    case 'statsid':
      if (!arg.length) {arg[0] = "5394868d96fba54fbc290223";}
      var user = API.getUser(arg[0]);
      API.sendChat(user.username+": grabs received: "+user.curatorPoints+", woots received: "+user.djPoints+", woots/mehs given: "+user.listenerPoints);
      break;
    case 'getid':
      if (!arg.length) {arg[0] = "Sceleratus";}
      API.sendChat("User id of: "+arg[0]+" = "+getId(arg[0]));
      break;
    case 'genre':
      var media = API.getMedia();
      var url = 'http://en.wikipedia.org/wiki/' + media.author.replace(/ /g, '_');
      handleWiki(url, media.author);
      break;
    case 'dc':
        lookupUserLeave(arg[1]);
      break;
    default:
      API.sendChat("Command not found: " + id+" Arg: "+arg.join());
  }
}

function publicCommand(id,arg) {
  if(!arg)
  {
    arg = [];
  }
  switch (id) {
    case 'help':
      API.sendChat("Current public commands: stats, statsid, getid, genre, dc, version. Prefix: " + prefix);
      break;
    case 'version':
      API.sendChat("Current version: "+botVersion());
      break;
    case 'stats':
      if (!arg.length) {arg[0] = "Sceleratus";}
      var user = API.getUser(getId(arg[0]));
      API.sendChat(user.username+": grabs received: "+user.curatorPoints+", woots received: "+user.djPoints+", woots/mehs given: "+user.listenerPoints);
      break;
    case 'statsid':
      if (!arg.length) {arg[0] = "5394868d96fba54fbc290223";}
      var user = API.getUser(arg[0]);
      API.sendChat(user.username+": grabs received: "+user.curatorPoints+", woots received: "+user.djPoints+", woots/mehs given: "+user.listenerPoints);
      break;
    case 'getid':
      if (!arg.length) {arg[0] = "Sceleratus";}
      API.sendChat("User id of: "+arg[0]+" = "+getId(arg[0]));
      break;
    case 'genre':
      var media = API.getMedia();
      var url = 'http://en.wikipedia.org/wiki/' + media.author.replace(/ /g, '_');
      handleWiki(url, media.author);
      break;
    case 'dc':
        lookupUserLeave(arg[1]);
      break;
    default:
      //API.sendChat("Command not found or not allowed: " + id+" Arg: "+arg.join());
  }
}

function getId(name) {
  users=API.getUsers();
  var len=users.length;
  for (var i=0;i<len;++i){
    if (users[i].username.toLowerCase()==name.toLowerCase()) {
      return users[i].id
    }
  }
}

function botConnect() {
  if (document.location == 'http://plug.dj/epic-room-20/') {
    API.sendChat("Sceleratus "+botVersion()+" is connected");
  }
}

window.onload = botConnect();

jQuery.getScript('http://okfnlabs.org/wikipediajs/wikipedia.js', function(){

  WIKIPEDIA.getData = function (wikipediaUrlOrPageName, callback, error) {
    var url = WIKIPEDIA._getDbpediaUrl(wikipediaUrlOrPageName);
    function onSuccess(data) {
      var out = {
        raw: data,
        dbpediaUrl: url,
        summary: null
      };
      if (data[url]) {
        out.summary = WIKIPEDIA.extractSummary(url, data);
      } else {
        out.error = 'Failed to retrieve data. Is the URL or page name correct?';
      }
      callback(out);
    }
    WIKIPEDIA.getRawJson(url, onSuccess, error);
  };

});

function handleWiki(url, author){
  WIKIPEDIA.getData(url, function(info){
    Gdata = info;
    console.log('Success');
    var dpedia = info.raw[info.dbpediaUrl];
    if(!dpedia){
      if(url.indexOf('_(band)') === -1){
        handleWiki(url + '_(band)', author);
        return;
      }
      else{
        genreBotFailed('Error while getting page of '+author);
        return;
      }
    }

    var genres = dpedia['http://dbpedia.org/property/genre'];
    var chatMessage = "";
    if(!genres){
      if(url.indexOf('_(band)') === -1){
        handleWiki(url + '_(band)', author);
        return;
      }
      else{
        genreBotFailed('Can\'t find a valid page for "' + author +'"');
        return;
      }
    }

    for(var i = 0; i < genres.length; i++){
      chatMessage += genres[i].value.substr(genres[i].value.lastIndexOf('/') + 1).replace(/_/g, ' ') + ', ';
    }
    API.sendChat(chatMessage.substr(0,chatMessage.lastIndexOf(', ')))

  },function(){
    if(url.indexOf('_(band)') === -1){
      handleWiki(url + '_(band)', author);
    }
    else{
      genreBotFailed('Request failed');
      return;
    }
  });
}

function genreBotFailed(reason){
  API.sendChat(reason);
}

var leftUserList = JSON.parse(localStorage.getItem('leftUsers')) ? JSON.parse(localStorage.getItem('leftUsers')) : {length: 0, reset: Date.now()};
function captureUserLeave(data){
  if(data.wlIndex && data.wlIndex > 0){
    if(!leftUserList[data.username]){
      leftUserList.length++;
    }
    leftUserList[data.username] = {'pos': data.wlIndex, 'time': Date.now()};
    localStorage.setItem('leftUsers', JSON.stringify(leftUserList));
  }
  if(((Date.now() - leftUserList.reset) / 1000) > leaveLimit){
    for(var key in leftUserList){
      if(((Date.now() - leftUserList[key].time) / 1000) > leaveLimit){
        delete leftUserList[key];
      }
    }
  }
}

function lookupUserLeave(name){
    var name = parts[1].replace('@', '');
    var user = leftUserList[name];
    if(user){
      API.sendChat('/me → @' + name + ' left position ' + (user.pos + 1) + ' about ' + toPrettyTime((Date.now() - user.time) / 1000) + ' ago' );
      if(((Date.now() - user.time) / 1000) <= autoAdd){
        API.moderateAddDJ(name);
        API.moderateMoveDJ(name, user.pos);
        API.sendChat('/me → Automatically added @' + name + ' back in line');
      }
    }
    else{
      API.sendChat('/me → @' + name + ' not found in list of disconnected users');
    }
  }
}

function toPrettyTime(secs) {
  var sec_num = parseInt(secs, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = ""+hours;}
  if (minutes < 10) {minutes = ""+minutes;}
  if (seconds < 10) {seconds = ""+seconds;}

  var time    = (hours !== '0' ? (hours+' hours, ') : '') + (minutes !== '0' ? minutes+' minutes and ' : '') + seconds + ' seconds';
  return time;
}
