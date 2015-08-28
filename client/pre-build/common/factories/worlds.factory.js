app.factory('WorldsFactory', function($http, MapFactory) {

    //integrate map and saving worlds and shit
    var currentGame, currentWorld;

    var grass, dirt, bark, leaves;
    var materials;
    var size, flat;

    function concat3DMap(map) {
        var cells = map.data.reduce(function(a, b) {
            return a.concat(b);
        }, []).reduce(function(a, b) {
            return a.concat(b);
        }, []);
        return JSON.stringify(cells.map(function(cell) {
            delete cell.neighbors;
            return cell;
        }))
    }

    function concatFlatMap(map) {
        var cells = map.data.reduce(function(a, b) {
            return a.concat(b);
        }, [])
        return JSON.stringify(cells.map(function(cell) {
            delete cell.neighbors;
            return cell;
        }))
    }

    var map;

    function randomMap(x, y, z) {
        if (flat) {
            return (y === 0 && x >= 0 && x < size && z >= 0 && z < size) ? map.getMaterial(x, z) : 0;
        } else {
            return (y >= 0 && y < 3 && x >= 0 && x < size && z >= 0 && z < size && map.data[x][y][z] && map.data[x][y][z].legit) ? map.getMaterial(x, y, z) : 0;
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
            var func, creatures;
            if (world.flat) func = concatFlatMap;
            else func = concat3DMap;
            if (world.environment === 'land') creatures = ['fox', 'turtle'];
            if (world.environment === 'desert') creatures = ['elephant', 'crocodile', 'lion', 'giraffe'];
            if (world.environment === 'ice') creatures = ['penguin', 'wolf', 'deer', 'beaver'];
            world.map = func(MapFactory.create(world.size, null, world.flat, world.grassPercent))

            return $http.post('/api/creatures/all', creatures)
                .then(function(res) {
                    world.creatures = res.data
                    return $http.post('/api/worlds', world)
                })
                .then(function(res) {
                    return res.data;
                })
        },
        updateWorld: function(world) {
            var func;
            if (world.flat) func = concatFlatMap;
            else func = concat3DMap;
            world.map = func(world.map);
            return $http.put('/api/worlds/' + world._id, world)
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
        setCurrentGame: function(game, world) {
            currentGame = game;
            currentGame.flat = world.flat;
        },
        getCurrentGame: function() {
            return currentGame;
        },
        newWorldOptions: function() {
            map = MapFactory.getCurrentMap();
            // console.log(map)
            return {
                generate: randomMap,
                materials: materials,
                texturePath: '../textures/',
                controls: {
                    discreteFire: true
                },
                // lightsDisabled: true
            }
        },
        setCurrentWorld: function(world) {
            currentWorld = world;
            flat = world.flat;
            size = world.size;
            if (world.environment === 'land') {
                grass = ['grass-nice', 'light-dirt', 'grass-dirt-light'];
                dirt = ['light-dirt', 'light-dirt', 'light-dirt'];
                bark = ['leaves1', 'bark'];
                leaves = ['leaves1'];
                materials = [grass, dirt, bark, leaves];
            }
            if (world.environment === 'ice') {
                grass = ['snowgrass', 'dirt-med', 'dirt-med-snow'];
                dirt = ['whitewool', 'dirt-med', 'dirt-med-snow'];
                bark = ['whitewool', 'bark'];
                leaves = ['whitewool', 'leaves1', 'leaves1'];
                materials = [grass, dirt, bark, leaves];
            }
            if (world.environment === 'desert') {
                grass = ['brown-grass', 'rock', 'rock-sand'];
                dirt = ['sand', 'rock', 'rock-sand'];
                bark = ['leaves2', 'bark'];
                leaves = ['leaves2'];
                materials = [grass, dirt, bark, leaves];
            }
        },
        getCurrentWorld: function() {
            return currentWorld;
        }
    }
})