var express=require("express");
var app=express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path=require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var session = require("express-session");
var SessionStore = new session.MemoryStore()


var sessionMiddleware = session({
  name: 'bharatrawat',
  store: SessionStore,
  secret: 'qawsedrftgyhujikolpzcbmxbn',
  saveUninitialized: true,
  resave: true,
});

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));

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
	var data=req.body;
	user=data.username;
	var key =user+Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
	req.session.user=key;
	dmsg[req.session.user]=[colors[Math.floor(Math.random() * 14)]];
    dmsg[req.session.user][1]=user;
	
  res.sendFile(__dirname + '/chatroom.html');
});
app.get('/logout', function(req, res){
		dmsg[req.session.user]="";
		req.session.user==undefined;
		dmsg[req.session.user][1]="";
		if(dmsg.message!=null || dmsg.message!=undefined){dmsg.message="";}
		res.redirect("/");
});

app.get('/about', function(req, res){
  res.status(300).sendFile(path.join(__dirname,"about.html"));
});

io.on('connection', function(socket){
  socket.on('dchat msg', function(msg){
      dmsg.message=msg;
      //console.log(dmsg); //debuging
      try
      {
        dmsg.ucolor=dmsg[socket.request.session.user][0];
        dmsg.uname=dmsg[socket.request.session.user][1];
      }
      catch(err)
      {
        dmsg.uname="Anonymous";
      }
      io.emit('dchat msg', dmsg);
    });
});

http.listen(port);