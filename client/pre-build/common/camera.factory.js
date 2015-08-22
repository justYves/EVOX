app.factory('CameraFactory', function() {
  return {
    startCamera: function(game) {
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
        onMouseDownTheta = -10

      camera.position.x = (radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))
      camera.position.y = radius * Math.sin(phi * Math.PI / 360)
      camera.position.z = (radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))

      document.addEventListener('DOMMouseScroll', mousewheel, false);
      document.addEventListener('mousewheel', mousewheel, false);
      game.view.renderer.domElement.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', onDocumentMouseMove, false)
      document.addEventListener('mousedown', onDocumentMouseDown, false)
      game.view.renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false)


      function mousewheel(event) {
        event.preventDefault()
          // prevent zoom if a modal is open
        zoom(event.wheelDeltaY / 15 || event.detail)
      }

      function interact() {
        if (typeof raycaster === 'undefined') return
          // if (objectHovered) {
          //   objectHovered.material.opacity = 1
          //   objectHovered = null
          // }

        var intersect = getIntersecting()
          // console.log(intersect);
          // if (intersect) {
          //   var normal = intersect.face.normal.clone()
          //   normal.applyMatrix4(intersect.object.matrixRotationWorld)
          //   var position = new THREE.Vector3().addVectors(intersect.point, normal)
          //   var newCube = [Math.floor(position.x / 50), Math.floor(position.y / 50), Math.floor(position.z / 50)]

        //   function updateBrush() {
        //     brush.position.x = Math.floor(position.x / 50) * 50 + 25
        //     brush.position.y = Math.floor(position.y / 50) * 50 + 25
        //     brush.position.z = Math.floor(position.z / 50) * 50 + 25
        //   }

        //   if (isAltDown) {
        //     if (!brush.currentCube) brush.currentCube = newCube
        //     if (brush.currentCube.join('') !== newCube.join('')) {
        //       if (isShiftDown) {
        //         if (intersect.object !== plane) {
        //           scene.remove(intersect.object.wireMesh)
        //           scene.remove(intersect.object)
        //         }
        //       } else {
        //         if (brush.position.y != 2000) addVoxel(brush.position.x, brush.position.y, brush.position.z, color)
        //       }
        //     }
        //     updateBrush()
        //     updateHash()
        //     return brush.currentCube = newCube
        //   } else if (isShiftDown) {
        //     if (intersect.object !== plane) {
        //       objectHovered = intersect.object
        //       objectHovered.material.opacity = 0.5
        //       brush.position.y = 2000
        //       return
        //     }
        //   } else {
        //     updateBrush()
        //     return
        //   }
        // }
        // brush.position.y = 2000
      }

      function getIntersecting() {

        var hit = game.raycastVoxels(raycaster.ray.direction, raycaster.ray.position, 10000);
        // console.log("hit",hit);

        var intersectable = [];
        var intersections = raycaster.intersectObjects(game.scene.children);
        if (intersections.length > 0) {
          // console.log(intersections);
          var intersect = intersections[0].object.isBrush ? intersections[1] : intersections[0];
          return intersect;
        }
      }



      function zoom(delta) {
        var origin = {
          x: 10,
          y: 0,
          z: 10
        }
        var distance = camera.position.distanceTo(origin)
        var tooFar = distance > 100
        var tooClose = distance < 5
        if (delta > 0 && tooFar) return
        if (delta < 0 && tooClose) return
        radius = distance // for mouse drag calculations to be correct
        camera.translateZ(delta)
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
          interact();
          render();
        }
      }

      function onDocumentMouseDown(event) {
        event.preventDefault()
        isMouseDown = true
        onMouseDownTheta = theta
        onMouseDownPhi = phi
        onMouseDownPosition.x = event.clientX
        onMouseDownPosition.y = event.clientY
      }

      function onDocumentMouseUp(event) {
        event.preventDefault()
        isMouseDown = false
        onMouseDownPosition.x = event.clientX - onMouseDownPosition.x
        onMouseDownPosition.y = event.clientY - onMouseDownPosition.y
      }


      function render() {
        camera.lookAt(target)
        raycaster = projector.pickingRay(mouse2D.clone(), camera)
          // console.log(raycaster);
        game.view.renderer.render(game.scene, camera)
      }
      camera.lookAt(target)
      game.view.camera = camera;
    }
  }
})