app.factory('WorldsFactory', function($http, MapFactory) {

    //integrate map and saving worlds and shit
    var currentGame, currentWorld;

    var grass, dirt, bark, leaves;
    var materials;
    var size;

    function concatMap(map) {
        var cells = map.data.reduce(function(a, b) {
            return a.concat(b);
        }, [])
        return cells.map(function(cell) {
            delete cell.neighbors;
            return cell;
        })
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
            return {
                generate: function(x, y, z) {
                    return (y === 0 && x >= 0 && x < size && z >= 0 && z < size) ? MapFactory.getCurrentMap().getMaterial(x, z) : 0;
                },
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