var express=require("express");
var app=express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path=require('path');
var bodyParser = require('body-parser');
var RedisStore = require("connect-redis")(session);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public")));
var requestIp = require('request-ip');
colors=["#FFCDD2","#F50057","#9C27B0","#E040FB","#651FFF","#3D5AFE","#1E88E5","#00B0FF","#76FF03","#AEEA00","#FFC400","#FF6E40","#B0BEC5","#FFC107"];
dmsg={};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res)
{
  res.sendFile(__dirname + '/index.html');
});

app.post("/",function(req,res)
{
  res.sendFile(__dirname + '/chatroom.html');
});


app.get('/about', function(req, res){
  res.status(300).sendFile(path.join(__dirname,"about.html"));
});
/*
app.get('/chatroom', function(req, res){
  res.status(300).sendFile(path.join(__dirname,"chatroom.html"));
});
*/
io.on('connection', function(socket){
  socket.on('dchat msg', function(msg){
      var userip=socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;//socket.request.connection.remoteAddress;
      dmsg.message=msg;
      console.log(dmsg);
      console.log("-------Ip When Message-------",userip);
      try
      {
        dmsg.ucolor=dmsg[userip][0];
        dmsg.uname=dmsg[userip][1];
      }
      catch(err)
      {
        dmsg.uname="Anonymous";
      }
      io.emit('dchat msg', dmsg);
    });

  socket.on('EnterInChat', function(user){
    var ip=socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;//socket.request.connection.remoteAddress;
    dmsg[ip]=[colors[Math.floor(Math.random() * 14)]];
    dmsg[ip][1]=user;
    console.log("-------Ip When Login-------"+ip);
    console.log(dmsg);
    });
});

http.listen(port);