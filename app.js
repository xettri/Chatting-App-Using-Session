var express                                 = require("express");
var app                                     = express();
var http                                    = require('http').createServer(app);
var io                                      = require('socket.io')(http);
var port                                    = process.env.PORT || 3000;
var path                                    = require('path');
var bodyParser                              = require('body-parser');
var session                                 = require("express-session");
var SessionStore                            = new session.MemoryStore();
var helper                                  = require('./helper');
var schedule                                = require('node-schedule');


app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

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

//-----------------
dmsg={};
//-----------------

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res)
{
  res.render('Index');
});

app.post("/",function(req,res)
{
  	var data=req.body;
  	user=data.username;
  	var key =helper.Common.genKey(user);
  	req.session.user=key;
  	dmsg[req.session.user]=[helper.AppConstant.colors[Math.floor(Math.random() * 14)]];
    dmsg[req.session.user][1]=user;
    dmsg[req.session.user][2]='#DCE3DA'; //for ai;
    res.render('ChatRoom/PublicRoom/chat');
});

app.get('/logout', function(req, res){
		dmsg[req.session.user]="";
		req.session.user==undefined;
		dmsg[req.session.user][1]="";
		if(dmsg.message!=null || dmsg.message!=undefined){dmsg.message="";}
		res.redirect("/");
});

app.get('/about', function(req, res){
  res.render('AppPages/about');
});

//------------------------------------------------------------------------
io.on('connection', function(socket){
  socket.on('dchat msg', function(msg){
      dmsg.message=msg;
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
      io.emit('dchat msg', dmsg);
    });
    //-----------------------------------------------------
    socket.on('dchat_ai_msg', function(msg){
        dmsg.message=msg;
        try
        {
          dmsg.ucolor=dmsg[socket.request.session.user][2];
          dmsg.uname=dmsg[socket.request.session.user][1];
        }
        catch(err)
        {
          dmsg.uname="Anonymous";
        }
        io.emit('dchat_ai_msg', dmsg);
      });

});
//------------------------------------------------------------------------

var j = schedule.scheduleJob('0 * * *', function(){
  dmsg={};
});

app.get('*', function(req, res){
  	var requrl=req.originalUrl.substring(1);
 	res.redirect('/');
});



http.listen(port);
