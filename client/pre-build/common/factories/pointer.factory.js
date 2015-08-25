app.factory('PointerFactory', function($rootScope) {


  var currentPos ;

  function setPos(pos){
    currentPos = pos;
    return currentPos;
  }

  function getPos(pos){
    return currentPos;
  }


  return {
    setPos: setPos,
    getPos: getPos
  };

});