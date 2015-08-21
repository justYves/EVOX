(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [

        function(require, module, exports) {
            function Snow(opts) {
                var self = this;
                if (!(this instanceof Snow)) return new Snow(opts || {});
                if (opts.THREE) opts = {
                    game: opts
                };
                this.game = opts.game;
                this.speed = opts.speed || 0.1;
                this.drift = opts.drift || 1;
                this.particles = [];
                if (opts.count != null || opts.size != null || opts.material != null) {
                    this.game.scene.add(this.add(
                        opts.count || null, opts.size || null, opts.material || null
                    ));
                }
            }

            window.Snow = Snow;

            Snow.prototype.add = function(count, size, material) {
                var game = this.game;
                count = count || 1000;
                size = size || 20;
                material = material || new game.THREE.ParticleBasicMaterial({
                    color: 0xffffff,
                    size: 1
                });

                var half = size / 2;

                var geom = new game.THREE.Geometry();
                geom.boundingBox = new game.THREE.Box3(
                    new game.THREE.Vector3(-half, -half, -half),
                    new game.THREE.Vector3(half, half, half)
                );

                for (var i = 0; i < count; i++) {
                    geom.vertices.push(new game.THREE.Vector3(
                        rand(-half, half), rand(-half, half), rand(-half, half)
                    ));
                }

                var particles = new game.THREE.ParticleSystem(geom, material);
                this.particles.push(particles);

                return particles;
            };

            Snow.prototype.tick = function() {
                var self = this;
                var target = self.game.controls.target();
                self.particles.forEach(function(particle) {
                    if (target == null) return;

                    particle.position.copy(target.position);

                    var bounds = particle.geometry.boundingBox;
                    var count = particle.geometry.vertices.length;
                    var a = target.yaw.rotation.y;
                    var x = Math.floor(target.velocity.x * 1000) / 50;
                    var y = Math.floor(target.velocity.y * 1000) / 50;
                    var z = Math.floor(target.velocity.z * 1000) / 50;
                    // todo: fix this, should handle 2 directions at the same time
                    var r = x !== 0 ? x * 0.5 : z !== 0 ? z : 0;
                    if (x !== 0) a += Math.PI / 2;
                    while (count--) {
                        var p = particle.geometry.vertices[count];
                        if (p.y < bounds.min.y) p.y = bounds.max.y;
                        p.y -= Math.random() * (self.speed + y / 2);
                        ['x', 'z'].forEach(function(x) {
                            if (p[x] > bounds.max[x] || p[x] < bounds.min[x]) {
                                p[x] = rand(bounds.min[x], bounds.max[x]);
                            }
                        });
                        p.x += Math.sin(a) * -r * self.drift;
                        p.z += Math.cos(a) * -r * self.drift;
                    }
                    particle.geometry.verticesNeedUpdate = true;
                });
            };

            function rand(min, max) {
                return Math.random() * (max - min) + min;
            }

        }, {}
    ],
    2: [

        function(require, module, exports) {
            require('voxel-snow');
        }, {
            "voxel-snow": 1
        }
    ]
}, {}, [2]);