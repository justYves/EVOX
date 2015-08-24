app.factory('mySocket', function (socketFactory) {
  var mySocket =socketFactory()
  mySocket.forward('correct');
  return mySocket;
});
