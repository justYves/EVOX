app.factory('CameraFactory', function($rootScope) {
  return {
    startCamera: startCamera,
    setGrass: setGrass
  };
      var grass = false;


      function setGrass(bool){
        grass = bool;
        console.log(grass);
      }

     function startCamera(game) {
      var camera = new game.THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000)
      var size = game.map.size
      window.camera = camera;
      camera.position.set(18, 8, 50);
      var projector = new game.THREE.Projector()
      var mouse2D = new game.THREE.Vector3(0, 10000, 0.5)
      var target = new game.THREE.Vector3(size / 2, 0, size / 2)
      var mouse3D, raycaster, objectHovered;
      var radius = 50,
        theta = 90,
        phi = 90;
      var isMouseDown = false;
      var onMouseDownPosition = new game.THREE.Vector2(),
        onMouseDownPhi = -10,
        onMouseDownTheta = -10;


      camera.position.x = (radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))
      camera.position.y = radius * Math.sin(phi * Math.PI / 360)
      camera.position.z = (radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))

      game.view.renderer.domElement.addEventListener('DOMMouseScroll', mousewheel, false);
      game.view.renderer.domElement.addEventListener('mousewheel', mousewheel, false);
      game.view.renderer.domElement.addEventListener('resize', onWindowResize, false);
      game.view.renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false)
      game.view.renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
      game.view.renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false)

      function mousewheel(event) {
        event.preventDefault()
          // prevent zoom if a modal is open
        zoom(event.wheelDeltaY / 15 || event.detail)
      }

      var highlighted;
      var currentPos;
      var toggle;

      function interact() {
        if (typeof raycaster === 'undefined') return
          // if (objectHovered) {
          //   objectHovered.material.opacity = 1
          //   objectHovered = null
          // }

        var intersect = getIntersecting()
        if (!intersect) {
          game.scene.remove(highlighted);
          highlighted = undefined;
          currentPos = undefined;
          return;
        }
        // console.log("old",currentPos);
        // console.log("recorded",intersect.point);
        // console.log(raycaster.ray.direction);
        if((currentPos && Math.abs(currentPos.x - intersect.point.x ) < 0.25 &&
          Math.abs(currentPos.y - intersect.point.y) < 0.25 &&
          Math.abs(currentPos.z - intersect.point.z) < 0.25)) return;
        currentPos = {
          x:intersect.point.x,
          y:intersect.point.y,
          z:intersect.point.z
        };

        // console.log(intersect);
        // var normal = intersect.face.normal.clone()
        // normal.applyMatrix4(intersect.object.matrixRotationWorld)
        // var position = new game.THREE.Vector3().addVectors(intersect.point, normal)
        var x = Math.floor(intersect.point.x+ Math.sign(raycaster.ray.direction.x)*0.01) + 0.5;
        var y = Math.floor(intersect.point.y-0.01) + 0.5;
        var z = Math.floor(intersect.point.z+ Math.sign(raycaster.ray.direction.z)*0.01) + 0.5;
        // console.log([z,y,z]);
        // if (newPos === currentPos) return;
        // game.scene.remove(highlighted);

        if (!highlighted) {
          highlight(x, y, z);
        } else {
          // console.log("newPos:", x,y,z)
          highlighted.position.x = x;
          highlighted.position.y = y;
          highlighted.position.z = z;
        }
      }

      function highlight(x, y, z) {
        var geometry = new game.THREE.CubeGeometry(1, 1, 1);
        var material = new game.THREE.MeshBasicMaterial({
          color: grass ?  0x00FF000 : 0x000000,
          wireframe: true,
          wireframeLinewidth: 3,
          transparent: true,
          opacity: 0.5
        });
        highlighted = new game.THREE.Mesh(geometry, material);
        highlighted.isHighlight = true;
        // var voxel = new game.THREE.Mesh(cube, cubeMaterial)
        // voxel.wireMesh = new game.THREE.Mesh(wireframeCube, wireframeMaterial)
        highlighted.position.x = x;
        highlighted.position.y = y;
        highlighted.position.z = z;
        game.scene.add(highlighted);
      }



      function getIntersecting() {

        // console.log(game.scene.children);
        var intersectable = [];
        var intersections = raycaster.intersectObjects(game.scene.children);
        if (intersections.length) {
          // console.log(intersections);
          return intersections[0].object.isHighlight ? intersections[1] : intersections[0];
        }
      }

      function zoom(delta) {
        var origin = {
          x: game.map.size / 2,
          y: 0,
          z: game.map.size / 2
        };
        var distance = camera.position.distanceTo(origin);
        var tooFar = distance > 100;
        var tooClose = distance < 5;
        if (delta > 0 && tooFar) return;
        if (delta < 0 && tooClose) return;
        radius = distance; // for mouse drag calculations to be correct
        camera.translateZ(delta);
        render();
      }

      function setIsometricAngle() {

        theta += 90

        camera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
        camera.position.y = radius * Math.sin(phi * Math.PI / 360)
        camera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
          // camera.updateMatrix()
      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        game.view.renderer.setSize(window.innerWidth, window.innerHeight)
      }

      function onDocumentMouseMove(event) {
        event.preventDefault()
        if (true) {}
        if (isMouseDown) {
          //controls are set in the stream in the voxel engine/ voxel control / stream on event(attain)
          theta = -((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta
          phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi

          phi = Math.min(180, Math.max(0, phi))

          // theta is x; phi is y;
          camera.position.x = (radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)) + size / 2;
          camera.position.y = radius * Math.sin(phi * Math.PI / 360)
          camera.position.z = (radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)) + size / 2;
        }
        mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
        render();
      }

      function getCreature (position){
        var x = position.x - 0.5;
        var y = position.y - 0.5;
        var z = position.z - 0.5;
        var cell = game.map.getCell(x, y, z);
        game.creatures.forEach(function(creature){
          if (position.x === creature.position.x && position.z === creature.position.z) {
            $rootScope.$broadcast("currentCreature", creature);
          };
        });
      };

      function onDocumentMouseDown(event) {
        event.preventDefault();
        isMouseDown = true;
        onMouseDownTheta = theta;
        onMouseDownPhi = phi;
        onMouseDownPosition.x = event.clientX;
        onMouseDownPosition.y = event.clientY;
        getCreature(highlighted.position);
      };

      function onDocumentMouseUp(event) {
        event.preventDefault();
        isMouseDown = false;
        onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
        onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;
      };

      function render() {
        camera.lookAt(target);
        raycaster = projector.pickingRay(mouse2D.clone(), camera);
        interact();
        game.view.renderer.render(game.scene, camera);
      };

      camera.lookAt(target);
      game.view.camera = camera;
    }
})