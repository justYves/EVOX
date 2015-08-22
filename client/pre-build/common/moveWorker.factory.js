app.factory('MoveWorker', function() {
    var blobURL = URL.createObjectURL(new Blob(['(',
        function() {
            //Long-running work here
            self.onmessage = function(message) {

                var x = Number(message.data.x);
                var y = Number(message.data.y);
                var z = Number(message.data.z);
                var posX = Number(message.data.currentX);
                var posY = Number(message.data.currentY);
                var posZ = Number(message.data.currentZ);
                var mapSize = Number(message.data.size);

                var rotationY;

                if (z < 0) {
                    if (x === 0) rotationY = Math.PI;
                    else rotationY = Math.PI * (3 / 4) * (x / Math.abs(x));
                }
                else if (z > 0) {
                    if (x === 0) rotationY = 0;
                    else rotationY = Math.PI * (1 / 4) * (x / Math.abs(x));
                }
                else if (z === 0 && x !== 0) {
                    rotationY = Math.PI * (1 / 2) * (x / Math.abs(x));
                }

                if ((posX + x <= mapSize) && (posX + x >= 0))
                    posX += x;
                if ((posY + y <= mapSize) && (posY + y >= 0))
                    posY += y;
                if ((posZ + z <= mapSize) && (posZ + z >= 0))
                    posZ += z;

                var workerResult = {
                    x: posX,
                    y: posY,
                    z: posZ,
                    rotY: rotationY
                };
                postMessage(workerResult);
                close();
            };

        }.toString(),

        ')()'
    ], {
        type: 'application/javascript'
    }));
    return blobURL;

});