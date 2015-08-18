(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Tree = require('../tree');


window.Tree = function(game, opts) {
    map = opts.size
    if(opts.position === undefined) opts.position = {};
    if(!opts.position.x) opts.position.x = Math.floor(Math.random() * map) + 1;
    if(!opts.position.z) opts.position.z = Math.floor(Math.random() * map) + 1;
    if(!opts.densityScale) opts.densityScale = 5
    if(opts.treeType === undefined) opts.treeType = "subspace"
    if(opts.bark === undefined) throw "Must choose bark tile"
    if(opts.leaves === undefined) throw "Must choose leaves tile"
    var treeArr = [];
    var randCoords = function() {
        opts.position.x = Math.floor(Math.random() * map) + 1;
        opts.position.z = Math.floor(Math.random() * map) + 1;
        randH = Math.floor(Math.random() * map/2) + 3;
        if (treeArr.length) {
            for (var i = 0; i < treeArr.length; i++) {
                if (treeArr[i][0] === opts.position.x || treeArr[i][1] === opts.position.z) {
                    randCoords();
                }
                return [opts.position.x, opts.position.z, randH];
            }
        }
        return [opts.position.x, opts.position.z, randH];
    };
    var density = Math.floor(map / opts.densityScale);

    for(var i = 0; i < density; i++) {
        var treePos = randCoords();
        treeArr.push(treePos);
        if (opts.treeType === "random") {
            var treeTypeArr = ['subspace','guybrush', 'fractal']
            Tree(game, {
                position:{x: treePos[0], y:0, z:treePos[1]},
                height: treePos[2],
                bark: opts.bark,
                leaves: opts.leaves,
                treeType: treeTypeArr[Math.floor(Math.random() * treeTypeArr.length)]
        });
        }else{
            Tree(game, {
                position:{x: treePos[0], y:0, z:treePos[1]},
                height: treePos[2],
                bark: opts.bark,
                leaves: opts.leaves,
                treeType: opts.treeType
            });
        }
        map.getCell(treePos[0],treePos[1]).obstructed = true
    }
};

},{"../tree":2}],2:[function(require,module,exports){
module.exports = function (game, opts) {
    if (!opts) opts = {};
    if (opts.bark === undefined) opts.bark = 1;
    if (opts.leaves === undefined) opts.leaves = 2;
    if (!opts.height) opts.height = Math.floor(Math.random() * 16 + 4);
    if (opts.base === undefined) opts.base = opts.height / 3;
    if (opts.treeType === undefined) opts.treeType = 'subspace';
    if (opts.random == undefined) opts.random = function() { return Math.random(); };
    if(!opts.radius) opts.radius = Math.floor(Math.random() * 3 + 1);

    var voxels = game.voxels;
    var bounds = boundingChunks(voxels.chunks);
    var step = voxels.chunkSize * voxels.cubeSize;
    if (!opts.position) {
        var chunk = voxels.chunks[randomChunk(bounds)];
        opts.position = {
            x: (chunk.position[0] + Math.random()) * step,
            y: (chunk.position[1] + Math.random()) * step,
            z: (chunk.position[2] + Math.random()) * step
        };
    }

    var pos_ = { x: opts.position.x, y: opts.position.y, z: opts.position.z };
    function position () {
        return { x: pos_.x, y: pos_.y, z: pos_.z };
    }

    var ymax = bounds.y.max * step;
    var ymin = bounds.y.min * step;
    if (occupied(pos_.y)) {
        for (var y = pos_.y; occupied(y); y += voxels.cubeSize);
        if (y >= ymax) return false;
        pos_.y = y;
    }
    else {
        for (var y = pos_.y; !occupied(y); y -= voxels.cubeSize);
        if (y <= ymin) return false;
        pos_.y = y + voxels.cubeSize;
    }
    function occupied (y) {
        var pos = position();
        pos.y = y;
        return y <= ymax && y >= ymin && voxels.voxelAtPosition([pos.x,pos.y,pos.z]);
    }

    var updated = {};

    var pos = position();
    pos.y += y * voxels.cubeSize;
    set(pos, opts.leaves);

    Object.keys(updated).forEach(function (key) {
        game.showChunk(updated[key]);
    });

    function set (pos, value) {
        var ex = voxels.voxelAtPosition([pos.x,pos.y,pos.z]);
        if (ex) true;
        voxels.voxelAtPosition([pos.x,pos.y,pos.z], value);
        var c = voxels.chunkAtPosition([pos.x,pos.y,pos.z]);
        var key = c.join('|');
        if (!updated[key] && voxels.chunks[key]) {
            updated[key] = voxels.chunks[key];
        }
    }
    var generators = {
        subspace: function() {
            console.log("subspace");
            var around = [
            [ 0, 1 ], [ 0, -1 ],
            [ 1, 1 ], [ 1, 0 ], [ 1, -1 ],
            [ -1, 1 ], [ -1, 0 ], [ -1, -1 ]
            ];
            for (var y = 0; y < opts.height - 1; y++) {
                var pos = {x:opts.position.x, y:opts.position.y, z:opts.position.z};
                pos.y += y
                if (set(pos, opts.bark)) break;
                if (y < opts.base) continue;
                around.forEach(function (offset) {
                    if (opts.random() > 0.5) return;
                    var x = offset[0]
                    var z = offset[1]
                    pos.x += x;
                    pos.z += z;
                    set(pos, opts.leaves);
                    pos.x -= x;
                    pos.z -= z;
                });
            }
        },

        guybrush: function() {
            console.log("guybrush");
            var sphere = function(x,y,z, r) {
                return x*x + y*y + z*z <= r*r;
            }
            for (var y = 0; y < opts.height - 1; y++) {
                var pos = {x:opts.position.x, y:opts.position.y, z:opts.position.z};
                pos.y += y;
                set(pos, opts.bark);
            }
            var radius = opts.radius;
            console.log("radius", radius);
            for (var xstep = -radius; xstep <= radius; xstep++) {
                for (var ystep = -radius; ystep <= radius; ystep++) {
                    for (var zstep = -radius; zstep <= radius; zstep++) {
                        if (sphere(xstep,ystep,zstep, radius)) {
                            var leafpos = {
                                x: pos.x + xstep,
                                y: pos.y + ystep,
                                z: pos.z + zstep
                            }
                            set(leafpos, opts.leaves);
                        }
                    }
                }
            }
        },

        fractal: function() {
        function drawAxiom(axiom, angle, unitsize, units) {
            var posstack = [];

            var penangle = 0;
            var pos = {x:opts.position.x, y:opts.position.y, z:opts.position.z};
            pos.y += unitsize * 30;
            function moveForward() {
                var ryaw = penangle * Math.PI/180;
                for (var i = 0; i < units; i++) {
                    pos.y += unitsize * Math.cos(ryaw);
                    pos.z += unitsize * Math.sin(ryaw);
                    set(pos,opts.leaves);
                }
            }

            function setPoint() {
                set(pos, opts.bark);
            }
            function setMaterial(value) {
                mindex = value;
            }
            function yaw(angle) {
                penangle += angle;
            }
            function pitch(angle) {
                //turtle.pitch += angle;
            }
            function roll(angle) {
                //turtle.roll += angle;
            }
            function PushState() {
                //penstack.push(turtle);
                posstack.push(pos);
            }
            function PopState() {
              //  turtle = penstack.pop();
                pos = posstack.pop();
            }

            //F  - move forward one unit with the pen down
            //G  - move forward one unit with the pen up
            //#  - Changes draw medium.

            // +  - yaw the turtle right by angle parameter
            // -  - yaw the turtle left by angle parameter
            // &  - pitch the turtle down by angle parameter
            // ^  - pitch the turtle up by angle parameter
            // /  - roll the turtle to the right by angle parameter
            // *  - roll the turtle to the left by angle parameter
            // [  - save in stack current state info
            // ]  - recover from stack state info
            for (var i = 0; i < axiom.length; i++) {
                var c = axiom.charAt(i);
                switch(c) {
                    case 'F':
                        moveForward();
                        setPoint();
                        break;
                    case '+':
                        yaw(+angle);
                        break;
                    case '-':
                        yaw(-angle);
                        break;
                    case '&':
                        pitch(+angle);
                        break;
                    case '^':
                        pitch(-angle);
                        break;
                    case '/':
                        roll(+angle);
                        break;
                    case '*':
                        roll(-angle);
                        break;
                    case 'G':
                        moveForward();
                        break;
                    case '[':
                        PushState();
                        break;
                    case ']':
                        PopState();
                        break;
                    case '0':
                        setMaterial(0);
                        break;
                    case '1':
                        setMaterial(1);
                        break;
                    case '2':
                        setMaterial(2);
                        break;
                    case '3':
                        setMaterial(3);
                        break;

                }
            }
        }

        var axiom = "FX";
        var rules = [ ["X", "X+YF+"], ["Y", "-FX-Y"]];
        axiom = applyRules(axiom,rules);
        axiom = applyRules(axiom,rules);
        axiom = applyRules(axiom,rules);
        axiom = applyRules(axiom,rules);
        axiom = applyRules(axiom,rules);
        axiom = applyRules(axiom,rules);
        drawAxiom(axiom, 90, 1, 5);
    }
    }
    if (opts.treeType)
    generators[opts.treeType]();
};

function randomChunk (bounds) {
    var x = Math.random() * (bounds.x.max - bounds.x.min) + bounds.x.min;
    var y = Math.random() * (bounds.y.max - bounds.y.min) + bounds.y.min;
    var z = Math.random() * (bounds.z.max - bounds.z.min) + bounds.z.min;
    return [ x, y, z ].map(Math.floor).join('|');
}

function boundingChunks (chunks) {
    return Object.keys(chunks).reduce(function (acc, key) {
        var s = key.split('|');
        if (acc.x.min === undefined) acc.x.min = s[0]
        if (acc.x.max === undefined) acc.x.max = s[0]
        if (acc.y.min === undefined) acc.y.min = s[1]
        if (acc.y.max === undefined) acc.y.max = s[1]
        if (acc.z.min === undefined) acc.z.min = s[2]
        if (acc.z.max === undefined) acc.z.max = s[2]

        acc.x.min = Math.min(acc.x.min, s[0]);
        acc.x.max = Math.max(acc.x.max, s[0]);
        acc.y.min = Math.min(acc.y.min, s[1]);
        acc.y.max = Math.max(acc.y.max, s[1]);
        acc.z.min = Math.min(acc.z.min, s[2]);
        acc.z.max = Math.max(acc.z.max, s[2]);

        return acc;
    }, { x: {}, y: {}, z: {} });
}

function regexRules(rules) {
    var regexrule = '';
    rules.forEach(function (rule) {
        if (regexrule != '') {
            regexrule = regexrule+ '|' ;
        }
        regexrule = regexrule+rule[0];
    });
    return new RegExp(regexrule, "g");
}

function applyRules(axiom, rules) {
    function matchRule(match)
    {
        for (var i=0;i<rules.length;i++)
        {
            if (rules[i][0] == match) return rules[i][1];
        }
        return '';
    }
    return axiom.replace(regexRules(rules), matchRule);
}
},{}]},{},[1]);
