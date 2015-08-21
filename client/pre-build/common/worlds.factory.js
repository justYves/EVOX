app.factory('WorldsFactory', function($http, MapFactory) {

    //integrate map and saving worlds and shit
    var currentGame, currentWorld;

    var grass, dirt, bark, leaves;
    var materials;
    var size;

    function concatMap(map) {
        var cells = map.data.reduce(function(a, b) {
            return a.concat(b);
        }, []).reduce(function(a, b) {
            return a.concat(b);
        }, []);
        return cells.map(function(cell) {
            delete cell.neighbors;
            return cell;
        })
    }

    // function threeArray(size, y) {
    //     var three = new Array(size);
    //     for (var i = 0; i < size; i++) {
    //         three[i] = new Array(y);
    //         for (var j = 0; j < y; j++) {
    //             three[i][j] = new Array(size);
    //             for (var k = 0; k < size; k++) {
    //                 if (j === 0) three[i][j][k] = 1;
    //                 else if (i && k && i < size - 1 && k < size - 2) {
    //                     if (j === 1 && Math.round(Math.random() * 1.4) === 1) {
    //                         three[i][j][k] = 1;
    //                         three[i - 1][j][k] = 1;
    //                         three[i][j][k - 1] = 1;
    //                         three[i][j][k + 1] = 1;
    //                     } else {
    //                         if (!three[i][j - 1][k - 1] || !three[i][j - 1][k + 1] || !three[i - 1][j - 1][k] || !three[i][j - 1][k]) three[i][j][k] = 0;
    //                         else three[i][j][k] = Math.round(Math.random() * 0.6);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return three;
    // }

    var map;

    function randomMap(x, y, z) {
        if (y >= 0 && y < 3 && x >= 0 && x < size && z >= 0 && z < size) {
            return map.data[x][y][z] && map.data[x][y][z].legit ? map.getMaterial(x, y, z) : 0;
        }
    }

    return {
        getWorlds: function() {
            return $http.get('/api/worlds')
                .then(function(res) {
                    return res.data;
                })
        },
        getWorld: function(id) {
            return $http.get('/api/worlds/' + id)
                .then(function(res) {
                    return res.data;
                })
        },
        postWorld: function(world) {
            world.map = concatMap(MapFactory.create(world.size))
            return $http.post('/api/worlds', world)
                .then(function(res) {
                    return res.data;
                })
        },
        updateWorld: function(id, obj) {
            obj.map = concatMap(obj.map);
            return $http.put('/api/worlds/' + id, obj)
                .then(function(res) {
                    return res.data;
                })
        },
        removeWorld: function(id) {
            return $http.delete('/api/worlds/' + id)
                .then(function(res) {
                    return res.data;
                })
        },
        setCurrentGame: function(game) {
            currentGame = game;
        },
        getCurrentGame: function() {
            return currentGame;
        },
        newWorldOptions: function() {
            map = MapFactory.getCurrentMap();
            console.log(map)
            return {
                generate: randomMap,
                materials: materials,
                texturePath: '../textures/',
                controls: {
                    discreteFire: true
                }
                // lightsDisabled: true
            }
        },
        setCurrentWorld: function(world) {
            currentWorld = world;
            size = world.size;
            if (world.environment === 'land') {
                grass = ['grass-nice', 'light-dirt', 'grass-dirt-light'];
                dirt = ['light-dirt', 'light-dirt', 'light-dirt'];
                bark = ['leaves2', 'bark'];
                leaves = ['leaves2'];
                materials = [grass, dirt, bark, leaves];
            }
            if (world.environment === 'ice') {
                grass = ['whitewool', 'dirt-med', 'dirt-med'];
                dirt = ['dirt', 'dirt', 'dirt'];
                bark = ['whitewool', 'bark'];
                leaves = ['whitewool', 'leaves1', 'leaves1'];
                materials = [grass, dirt, bark, leaves];
            }
            if (world.environment === 'water') {
                grass = ['crate', 'dirt', 'grass_dirt'];
                dirt = ['dirt', 'dirt', 'dirt'];
                bark = ['tree_side'];
                leaves = ['leaves_opaque'];
                materials = [grass, dirt, bark, leaves];
            }
        },
        getCurrentWorld: function() {
            return currentWorld;
        }
    }
})