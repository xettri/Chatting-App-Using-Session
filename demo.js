var express=require("express");
var app=express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path=require('path');
var bodyParser = require('body-parser');
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


app.get('/', function(req, res){
  /*
  //var ip=requestIp.getClientIp(req);
var ip = req.headers["x-forwarded-for"];
  if (ip){
    var list = ip.split(",");
    ip = list[list.length-1];
  } else {
    ip = req.connection.remoteAddress;
  }

    var userinfo=[colors[Math.floor(Math.random() * 14)]];
    dmsg[ip.substring(7)]=userinfo;
    dmsg["debug"]=ip; //for debugging only
  */
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/test.html');
});

app.post("/",function(req,res)
{
  //var ip=requestIp.getClientIp(req);
  //var username=req.body.user.name;
  //dmsg[ip.substring(7)][1]=username;
  res.sendFile(__dirname + '/chatroom.html');
});
/*
app.get('/chatroom', function(req, res){
  res.status(300).sendFile(path.join(__dirname,"chatroom.html"));
});*/

app.get('/about', function(req, res){
  res.status(300).sendFile(path.join(__dirname,"about.html"));
});


io.on('connection', function(socket){
  socket.on('dchat msg', function(msg){
    	var userip=socket.request.connection.remoteAddress;
      console.log(userip);
    	dmsg.message=msg;//dmsg.debug+userip
    	dmsg.user=userip;
    	dmsg.ucolor=dmsg[userip][0];//[colors[Math.floor(Math.random() * 14)]];//
      dmsg.uname=dmsg[userip][1];//"Anonymous";
      io.emit('dchat msg', dmsg);
    });

  socket.on('EnterInChat', function(msg){
    var ip=socket.request.connection.remoteAddress;
    var userinfo=[colors[Math.floor(Math.random() * 14)]];
    dmsg[ip]=userinfo;
    dmsg.status=true;
    console.log(ip);

    var username=msg;
    dmsg[ip][1]=username;

   // var destination = '/chatroom';
  //  io.emit('redirect', destination);
    });
});

http.listen(port);