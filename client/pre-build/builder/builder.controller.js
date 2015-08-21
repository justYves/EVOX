app.controller('BuilderController', function($scope, $state) {
  var THREE = window.THREE;

  var raf = window.raf;

  console.log(THREE);
  var container;
  var camera, renderer, brush;
  var projector, plane, scene, grid, shareDialog;
  var mouse2D, mouse3D, raycaster, objectHovered;
  var isShiftDown = false,
    isCtrlDown = false,
    isMouseDown = false,
    isAltDown = false;
  var onMouseDownPosition = new THREE.Vector2(),
    onMouseDownPhi = 60,
    onMouseDownTheta = 45;
  var radius = 1600,
    theta = 90,
    phi = 60;
  var target = new THREE.Vector3(0, 200, 0);
  var color = 0;
  var CubeMaterial = THREE.MeshBasicMaterial;
  var cube = new THREE.CubeGeometry(50, 50, 50);
  var wireframeCube = new THREE.CubeGeometry(50.5, 50.5, 50.5);
  var wireframe = true,
    fill = true,
    animation = false,
    animating = false,
    animationInterval;
  var manualAnimating = false;
  var sliderEl, playPauseEl;
  var wireframeOptions = {
    color: 0x000000,
    wireframe: true,
    wireframeLinewidth: 1,
    opacity: 0.8
  };
  var wireframeMaterial = new THREE.MeshBasicMaterial(wireframeOptions);
  var animationFrames = [];
  var currentFrame = 0;
  var colors = ['2ECC71', '3498DB', '34495E', 'E67E22', 'ECF0F1'].map(function(c) {
    return hex2rgb(c);
  });
  for (var c = 0; c < 5; c++) {
    addColorToPalette(c);
  }

  init();
  raf(window).on('data', render)
  render();
  addEventListener()
  interact();

  // raf(window).on('data', render)

  function init() {
    bindEventsAndPlugins()
    setupImageDropImport(document.body)

    container = document.createElement( 'div' )
    // container = document.getElementById("container")
    document.getElementById("container").appendChild(container)

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
    camera.position.y = radius * Math.sin(phi * Math.PI / 360)
    camera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)

    scene = new THREE.Scene()
    window.scene = scene

    // // Grid

    var size = 500,
      step = 50

    var geometry = new THREE.Geometry()

    for (var i = -size; i <= size; i += step) {

      geometry.vertices.push(new THREE.Vector3(-size, 0, i))
      geometry.vertices.push(new THREE.Vector3(size, 0, i))

      geometry.vertices.push(new THREE.Vector3(i, 0, -size))
      geometry.vertices.push(new THREE.Vector3(i, 0, size))

    }

    var material = new THREE.LineBasicMaterial({
      color: 0x000000,
      opacity: 0.2
    })

    var line = new THREE.Line(geometry, material)
    line.type = THREE.LinePieces
    grid = line
    scene.add(line)

    // // Plane

    projector = new THREE.Projector()

    plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial())
    plane.rotation.x = -Math.PI / 2
    plane.visible = false
    plane.isPlane = true
    scene.add(plane)

    mouse2D = new THREE.Vector3(0, 10000, 0.5)

    // // Brush

    var brushMaterials = [
      new CubeMaterial({
        vertexColors: THREE.VertexColors,
        opacity: 0.5,
        transparent: true
      }),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true
      })
    ]
    brushMaterials[0].color.setRGB(colors[0][0], colors[0][1], colors[0][2])
    brush = THREE.SceneUtils.createMultiMaterialObject(cube, brushMaterials)

    brush.isBrush = true
    brush.position.y = 2000
    brush.overdraw = false
    scene.add(brush)

    // // Lights

    var ambientLight = new THREE.AmbientLight(0x606060)
    scene.add(ambientLight)

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    var hasWebGL = (function() {
      try {
        return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
      } catch (e) {
        return false;
      }
    })()

    if (hasWebGL) renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    else renderer = new THREE.CanvasRenderer()

    renderer.setSize(window.innerWidth, window.innerHeight)

    container.appendChild(renderer.domElement)
  }

  function render() {
    camera.lookAt(target)
    raycaster = projector.pickingRay(mouse2D.clone(), camera)
    renderer.render(scene, camera)
  }

  //<----- bind Events ---->
  function bindEventsAndPlugins() {

    $('.colorPickButton').click(pickColor);
    $('.colorPickButton').on("contextmenu", changeColor);
    $('.colorAddButton').click(addColor);

    $('.toggle input').click(function(e) {
      // setTimeout ensures this fires after the input value changes
      setTimeout(function() {
        var el = $(e.target).parent()
        var state = !el.hasClass('toggle-off')
        exports[el.attr('data-action')](state)
      }, 0)
    })

    // var actionsMenu = $(".actionsMenu")
    // actionsMenu.dropkick({
    //   change: function(value, label) {
    //     if (value === 'noop') return
    //     if (value in exports) exports[value]()
    //     setTimeout(function() {
    //       actionsMenu.dropkick('reset')
    //     }, 0)
    //   }
    // })

    // Todo list
    $(".todo li").click(function() {
      $(this).toggleClass("todo-done");
    });

    // Init tooltips
    $("[data-toggle=tooltip]").tooltip("show");

    // Init tags input
    $("#tagsinput").tagsInput();

    // JS input/textarea placeholder
    $("input, textarea").placeholder();

    $(".btn-group").on("click", "a", function() {
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
    });

    // Disable link click not scroll top
    $("a[href='#']").click(function(e) {
      e.preventDefault()
    });
  } //<----- bind Events ---->

  //<---- SET UP IMAGE DROP ---->
  function setupImageDropImport(element) {
    element.ondragover = function(event) {
      return event.preventDefault(event) && false
    }
    element.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()

      if (!event.dataTransfer) return false

      var file = event.dataTransfer.files[0]
      if (!file) return false
      if (!file.type.match(/image/)) return false

      var reader = new FileReader
      reader.onload = function(event) {
        var image = new Image
        image.src = event.target.result
        image.onload = function() {
          if (importImage(image)) return
          window.alert('Looks like that image doesn\'t have any voxels inside it...')
        }
      }
      reader.readAsDataURL(file)
      return false
    }
  } //<---- SET UP IMAGE DROP ---->

  function addEventListener() {
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false)
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false)
    document.addEventListener('keydown', onDocumentKeyDown, false)
    document.addEventListener('keyup', onDocumentKeyUp, false)
    window.addEventListener('DOMMouseScroll', mousewheel, false);
    window.addEventListener('mousewheel', mousewheel, false);
    window.addEventListener('resize', onWindowResize, false)

    function mousewheel(event) {
      // prevent zoom if a modal is open
      if ($('.modal').hasClass('in'))
        return
      zoom(event.wheelDeltaY || event.detail)
    }

    function onDocumentMouseMove(event) {
      event.preventDefault()
      if (isMouseDown) {

        theta = -((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta
        phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi

        phi = Math.min(180, Math.max(0, phi))

        camera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
        camera.position.y = radius * Math.sin(phi * Math.PI / 360)
        camera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
        camera.updateMatrix()

      }

      mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1

      interact()
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

      if (onMouseDownPosition.length() > 5) return

      var intersect = getIntersecting()

      if (intersect) {
        if (isShiftDown) {
          if (intersect.object != plane) {
            scene.remove(intersect.object.wireMesh)
            scene.remove(intersect.object)
          }
        } else {
          if (brush.position.y != 2000) addVoxel(brush.position.x, brush.position.y, brush.position.z, color)
        }
      }

      updateHash()
      render()
      interact()
    }

    function onDocumentKeyDown(event) {
      switch (event.keyCode) {
        case 189:
          zoom(100);
          break
        case 187:
          zoom(-100);
          break
        case 49:
          setColor(0);
          break
        case 50:
          setColor(1);
          break
        case 51:
          setColor(2);
          break
        case 52:
          setColor(3);
          break
        case 53:
          setColor(4);
          break
        case 54:
          setColor(5);
          break
        case 55:
          setColor(6);
          break
        case 56:
          setColor(7);
          break
        case 57:
          setColor(8);
          break
        case 48:
          setColor(9);
          break
        case 16:
          isShiftDown = true;
          break
        case 17:
          isCtrlDown = true;
          break
        case 18:
          isAltDown = true;
          break
        case 65:
          setIsometricAngle();
          break
      }
    }

    function onDocumentKeyUp(event) {

      switch (event.keyCode) {
        case 16:
          isShiftDown = false;
          break
        case 17:
          isCtrlDown = false;
          break
        case 18:
          isAltDown = false;
          break
      }
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
      interact()
    }

    if ($scope.currentHash) buildFromHash()

    updateHash()
  }

  function buildFromHash(hashMask) {

    var hash = $scope.currentHash.slice(1)
    var  hashChunks = hash.split(':');
      var chunks = {}

    animationFrames = []
    for (var j = 0, n = hashChunks.length; j < n; j++) {
      var chunk = hashChunks[j].split('/')
      chunks[chunk[0]] = chunk[1]
      if (chunk[0].charAt(0) == 'A') {
        animationFrames.push(chunk[1])
      }
    }

    if ((!hashMask || hashMask == 'C') && chunks['C']) {
      // decode colors
      var hexColors = chunks['C']
      for (var c = 0, nC = hexColors.length / 6; c < nC; c++) {
        var hex = hexColors.substr(c * 6, 6)
        colors[c] = hex2rgb(hex)
        addColorToPalette(c)
      }
    }
    var frameMask = 'A'

    if (currentFrame != 0) frameMask = 'A' + currentFrame

    if ((!hashMask || hashMask == frameMask) && chunks[frameMask]) {
      // decode geo
      var current = {
        x: 0,
        y: 0,
        z: 0,
        c: 0
      }
      var data = decode(chunks[frameMask])
      var i = 0,
        l = data.length

      while (i < l) {

        var code = data[i++].toString(2)
        if (code.charAt(1) == "1") current.x += data[i++] - 32
        if (code.charAt(2) == "1") current.y += data[i++] - 32
        if (code.charAt(3) == "1") current.z += data[i++] - 32
        if (code.charAt(4) == "1") current.c += data[i++] - 32
        if (code.charAt(0) == "1") {
          addVoxel(current.x * 50 + 25, current.y * 50 + 25, current.z * 50 + 25, current.c)
        }
      }
    }

    updateHash()

  }



  //<---UpdateHas --- >
  function updateHash() {
    var data = [],
      voxels = [],
      code
    var current = {
      x: 0,
      y: 0,
      z: 0,
      c: 0
    }
    var last = {
      x: 0,
      y: 0,
      z: 0,
      c: 0
    }
    for (var i in scene.children) {

      var object = scene.children[i]

      if (object.isVoxel && object !== plane && object !== brush) {

        current.x = (object.position.x - 25) / 50
        current.y = (object.position.y - 25) / 50
        current.z = (object.position.z - 25) / 50

        var colorString = ['r', 'g', 'b'].map(function(col) {
            return object.material.color[col]
          }).join('')
          // this string matching of floating point values to find an index seems a little sketchy
        for (var i = 0; i < colors.length; i++)
          if (colors[i].join('') === colorString) current.c = i
        voxels.push({
          x: current.x,
          y: current.y + 1,
          z: current.z,
          c: current.c + 1
        })

        code = 0

        if (current.x != last.x) code += 1000
        if (current.y != last.y) code += 100
        if (current.z != last.z) code += 10
        if (current.c != last.c) code += 1

        code += 10000

        data.push(parseInt(code, 2))

        if (current.x != last.x) {

          data.push(current.x - last.x + 32)
          last.x = current.x

        }

        if (current.y != last.y) {

          data.push(current.y - last.y + 32)
          last.y = current.y

        }

        if (current.z != last.z) {

          data.push(current.z - last.z + 32)
          last.z = current.z

        }

        if (current.c != last.c) {

          data.push(current.c - last.c + 32)
          last.c = current.c

        }
      }
    }

    data = encode(data)
    animationFrames[currentFrame] = data

    var cData = '';
    for (var i = 0; i < colors.length; i++) {
      cData += rgb2hex(colors[i]);
    }

    var outHash = "#" + (cData ? ("C/" + cData) : '')
    for (var i = 0; i < animationFrames.length; i++) {
      if (i === 0) {
        outHash = outHash + ":A/" + animationFrames[i]
      } else {
        outHash = outHash + ":A" + i + '/' + animationFrames[i]
      }
    }

    // hack to ignore programmatic hash changes
    $scope.updatingHash = true
    $scope.currentHash = outHash;
    // window.location.replace("outHash")

    setTimeout(function() {
      $scope.updatingHash = false
    }, 1)

    return voxels
  }

  function getIntersecting() {
    var intersectable = []
    scene.children.map(function(c) {
      if (c.isVoxel || c.isPlane) intersectable.push(c);
    })
    var intersections = raycaster.intersectObjects(intersectable)
    if (intersections.length > 0) {
      var intersect = intersections[0].object.isBrush ? intersections[1] : intersections[0]
      return intersect
    }
  }


  function decode(string) {
    var output = []
    string.split('').forEach(function(v) {
      output.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(v))
    })
    return output
  }

  function encode(array) {
    var output = ""
    array.forEach(function(v) {
      output += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(v)
    })
    return output
  }

  // function save() {
  //   window.open( renderer.domElement.toDataURL('image/png'), 'mywindow' )
  // }
  //
  function addVoxel(x, y, z, c) {
    var cubeMaterial = new CubeMaterial({
      vertexColors: THREE.VertexColors,
      transparent: true
    })
    var col = colors[c] || colors[0]
    cubeMaterial.color.setRGB(col[0], col[1], col[2])
    var wireframeMaterial = new THREE.MeshBasicMaterial(wireframeOptions)
    wireframeMaterial.color.setRGB(col[0] - 0.05, col[1] - 0.05, col[2] - 0.05)
    var voxel = new THREE.Mesh(cube, cubeMaterial)
    voxel.wireMesh = new THREE.Mesh(wireframeCube, wireframeMaterial)
    voxel.isVoxel = true
    voxel.position.x = x
    voxel.position.y = y
    voxel.position.z = z
    voxel.wireMesh.position.copy(voxel.position)
    voxel.wireMesh.visible = wireframe
    voxel.matrixAutoUpdate = false
    voxel.updateMatrix()
    voxel.name = x + "," + y + "," + z
    voxel.overdraw = true
    scene.add(voxel)
    scene.add(voxel.wireMesh)
  }

  // function getVoxels() {
  //   var hash = window.location.hash.substr(1)
  //   var convert = new Convert()
  //   var data = convert.toVoxels(hash)
  //   var l = data.bounds[0]
  //   var h = data.bounds[1]
  //   var d = [h[0] - l[0] + 1, h[1] - l[1] + 1, h[2] - l[2] + 1]
  //   var len = d[0] * d[1] * d[2]
  //   var voxels = ndarray(new Int32Array(len), [d[0], d[1], d[2]])

  //   var colors = [undefined]
  //   data.colors.map(function(c) {
  //     colors.push('#' + rgb2hex(c))
  //   })

  //   function generateVoxels(x, y, z) {
  //     var offset = [x + l[0], y + l[1], z + l[2]]
  //     var val = data.voxels[offset.join('|')]
  //     return data.colors[val] ? val + 1 : 0
  //   }

  //   ndarrayFill(voxels, generateVoxels)
  //   return {
  //     voxels: voxels,
  //     colors: colors
  //   }
  // }


  function interact() {
    if (typeof raycaster === 'undefined') return

    if (objectHovered) {
      objectHovered.material.opacity = 1
      objectHovered = null
    }

    var intersect = getIntersecting()

    if (intersect) {
      var normal = intersect.face.normal.clone()
      normal.applyMatrix4(intersect.object.matrixRotationWorld)
      var position = new THREE.Vector3().addVectors(intersect.point, normal)
      var newCube = [Math.floor(position.x / 50), Math.floor(position.y / 50), Math.floor(position.z / 50)]

      function updateBrush() {
        brush.position.x = Math.floor(position.x / 50) * 50 + 25
        brush.position.y = Math.floor(position.y / 50) * 50 + 25
        brush.position.z = Math.floor(position.z / 50) * 50 + 25
      }

      if (isAltDown) {
        if (!brush.currentCube) brush.currentCube = newCube
        if (brush.currentCube.join('') !== newCube.join('')) {
          if (isShiftDown) {
            if (intersect.object !== plane) {
              scene.remove(intersect.object.wireMesh)
              scene.remove(intersect.object)
            }
          } else {
            if (brush.position.y != 2000) addVoxel(brush.position.x, brush.position.y, brush.position.z, color)
          }
        }
        updateBrush()
        updateHash()
        return brush.currentCube = newCube
      } else if (isShiftDown) {
        if (intersect.object !== plane) {
          objectHovered = intersect.object
          objectHovered.material.opacity = 0.5
          brush.position.y = 2000
          return
        }
      } else {
        updateBrush()
        return
      }
    }
    brush.position.y = 2000
  }



  // Color convertor Helper functions
  function v2h(value) {
    value = parseInt(value).toString(16)
    return value.length < 2 ? '0' + value : value
  }

  function rgb2hex(rgb) {
    return v2h(rgb[0] * 255) + v2h(rgb[1] * 255) + v2h(rgb[2] * 255);
  }

  function hex2rgb(hex) {
    if (hex[0] == '#') hex = hex.substr(1)
    return [parseInt(hex.substr(0, 2), 16) / 255, parseInt(hex.substr(2, 2), 16) / 255, parseInt(hex.substr(4, 2), 16) / 255]
  }

  //camera helpers
  function scale(x, fromLow, fromHigh, toLow, toHigh) {
    return (x - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow
  }

  function zoom(delta) {
    var origin = {
      x: 0,
      y: 0,
      z: 0
    }
    var distance = camera.position.distanceTo(origin)
    var tooFar = distance > 3000
    var tooClose = distance < 300
    if (delta > 0 && tooFar) return
    if (delta < 0 && tooClose) return
    radius = distance // for mouse drag calculations to be correct
    camera.translateZ(delta)
  }

  function setIsometricAngle() {

    theta += 90

    camera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
    camera.position.y = radius * Math.sin(phi * Math.PI / 360)
    camera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
    camera.updateMatrix()
  }

  //color helper
  function addColorToPalette(idx) {
    // add a button to the group
    var colorBox = $('i[data-color="' + idx + '"]');
    if (!colorBox.length) {
      var base = $('.colorAddButton');
      var clone = base.clone();
      clone.removeClass('colorAddButton');
      clone.addClass('colorPickButton');
      colorBox = clone.find('.colorAdd');
      colorBox.removeClass('colorAdd');
      colorBox.addClass('color');
      colorBox.attr('data-color', idx);
      colorBox.text('');
      base.before(clone);
      clone.click(function(e) {
        pickColor(e);
        e.preventDefault();
      });
      clone.on("contextmenu", changeColor);
    }

    colorBox.parent().attr('data-color', '#' + rgb2hex(colors[idx]));
    colorBox.css('background', "#" + rgb2hex(colors[idx]));

    if (color == idx && brush)
      brush.children[0].material.color.setRGB(colors[idx][0], colors[idx][1], colors[idx][2]);
  }

  function setColor(idx) {
    $('i[data-color="' + idx + '"]').click()
  }

  function addColor(e) {
    //add new color
    colors.push([0.0, 0.0, 0.0])
    var idx = colors.length - 1

    color = idx;

    addColorToPalette(idx)

    updateHash()

    updateColor(idx)
  }

  function updateColor(idx) {
    color = idx
    // console.log("called");
    var picker = $('i[data-color="' + idx + '"]').parent().colorpicker('show')

    picker.on('changeColor', function(e) {
      colors[idx] = hex2rgb(e.color.toHex())
      addColorToPalette(idx)

      // todo:  better way to update color of existing blocks
      scene.children
        .filter(function(el) {
          return el.isVoxel
        })
        .map(function(mesh) {
          scene.remove(mesh.wireMesh);
          scene.remove(mesh)
        })
      var frameMask = 'A'
      if (currentFrame != 0) frameMask = 'A' + currentFrame
      buildFromHash(frameMask)
    })
    picker.on('hide', function(e) {
      // todo:  add a better remove for the colorpicker.
      picker.unbind('click.colorpicker')
    })
  }

  function changeColor(e) {
    var target = $(e.currentTarget)
    var idx = +target.find('.color').attr('data-color')
    updateColor(idx)
    return false // eat the event
  }

  function pickColor(e) {
    var target = $(e.currentTarget)
    var idx = +target.find('.color').attr('data-color')

    color = idx
    brush.children[0].material.color.setRGB(colors[idx][0], colors[idx][1], colors[idx][2])
  }


});