var QuickReply= function(user,msg){
  msg=msg.toLowerCase();
  if(msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('hy') || msg.includes('hyy'))
  {
    return 'Hello '+user+' how are you?';
  }
  else if(msg.includes('how are u') || msg.includes('how are you') || msg.includes('h r u'))
  {
    return 'I am fine how about you';
  } else if(msg.includes('fuck') || msg.includes('nude') || msg.includes('sex') || msg.includes('porn'))
  {
    return 'ohh hello m shareef girl mind ur language';
  } else if(msg.includes('where from you') || msg.includes('kaha se ho'))
  {
    return 'Kiu tumhe kya karna hai janke 😃😃😃😃😃😃';
  } else if(msg.includes('single'))
  {
    return 'kiu?';
  } else if (msg.includes('kya kar') || msg.includes('doing')) {
    return 'Just sitting';
  }
   else {
    last=['hmmmm','smjh nai aaya?','what?','kya bolre ho','mera net slow hai msg aake pop down hore hai..','yaar mera net..😤😤'];
    return last[Math.floor(Math.random() * 5)];
  }
}


module.exports = {
  'QuickReply'              : QuickReply,
}
