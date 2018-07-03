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
var AIChat                                  = require('./AIChat');
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
pmsg={};
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

app.get('/globalChat', function(req, res)
{
  res.render('ChatRoom/PublicRoom/Index',{title:'DChat-GlobalChat'});
});

app.get('/privateChat', function(req, res)
{
  res.render('ChatRoom/AI/Index',{title:'DChat-PrivateChat'});
});

//--------------------------------------------------------------------------------------
app.post("/GlobalChat",function(req,res)
{
  	var data=req.body;
  	user=data.username;
  	var key =helper.Common.genKey(user);
  	req.session.user=key;
  	dmsg[req.session.user]=[helper.AppConstant.colors[Math.floor(Math.random() * 14)]];
    dmsg[req.session.user][1]=user;
    console.log(req.session.user);
    res.render('ChatRoom/PublicRoom/chat',{user:req.session.user});
});

app.post("/privateChat",function(req,res)
{
    var data=req.body;
    user=data.username;
    var key =helper.Common.genKey(user);
    req.session.user=key;
    pmsg[req.session.user]=[helper.AppConstant.colors[Math.floor(Math.random() * 14)]];
    pmsg[req.session.user][1]=user;
    ai={};
    ai.uname=helper.AppConstant.AiNames[Math.floor(Math.random() * 10)];
    ai.ucolor='#FFCDD2';
    ai.count=0;
    pmsg[req.session.user+'_ai']=ai;
    console.log(ai);
    res.render('ChatRoom/AI/chat',{user:req.session.user});
});

//------------------------------------------------------
app.get('/private/logout', function(req, res){
    delete pmsg[req.session.user];
    delete pmsg[req.session.user+'_ai']
    res.redirect("/");
});
app.get('/logout', function(req, res){
		delete dmsg[req.session.user];
		res.redirect("/");
});
//-----------------------------------------------------
app.get('/about', function(req, res){
  res.render('AppPages/about');
});

//------------------------------------------------------------------------
io.on('connection', function(socket){
  socket.on('dchat_msg_'+socket.request.session.user, function(msg){
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
      io.emit('dchat_msg_global', dmsg);
    });
    //-----------------------------------------------------
    socket.on('dchat_ai_msg_'+socket.request.session.user, function(msg){
        pmsg.message=msg;
        try
        {
          pmsg.ucolor=pmsg[socket.request.session.user][0];
          pmsg.uname=pmsg[socket.request.session.user][1];
        }
        catch(err)
        {
          dmsg.uname="Anonymous";
        }
          io.emit('dchat_ai_msg_'+socket.request.session.user, pmsg);
          AI_Reply = pmsg[socket.request.session.user+'_ai'];
          pmsg[socket.request.session.user+'_ai'].count++;
          if(pmsg[socket.request.session.user+'_ai'].count==15)
          {
            last=['Ok bey','i have work by','baad me baat karti hu cu','bey bey','tata cu','ok g cu','bey'+pmsg.uname]
            AI_Reply.message = last[Math.floor(Math.random() * 7)]
            io.emit('dchat_ai_msg_'+socket.request.session.user, AI_Reply);
          } else if(pmsg[socket.request.session.user+'_ai'].count<15){
            AI_Reply.message=AIChat.Common.QuickReply(pmsg.uname,pmsg.message);
            io.emit('dchat_ai_msg_'+socket.request.session.user, AI_Reply);
          }

      });

});
//------------------------------------------------------------------------

var j = schedule.scheduleJob('0 * * *', function(){
  dmsg={};
  pmsg={};
});

app.get('*', function(req, res){
  	var requrl=req.originalUrl.substring(1);
 	res.redirect('/');
});



http.listen(port);
