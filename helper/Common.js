var genKey= function(user){
  key=user;
  key=user+ Math.random().toString(36).substring(2, 10);
  key=user+ Math.random().toString(36).substring(2, 10);
  console.log(key);
  return key;
}




module.exports = {
  'genKey'                  : genKey,
}
