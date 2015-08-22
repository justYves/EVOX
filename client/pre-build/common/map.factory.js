app.factory('MapFactory', function($http) {

    var currentMap;

    function Map(n, cells) {
        this.game;
        this.size = n;
        this.data = [];
        this.nextRound = [];
        this.fertilized = [];
        if (cells) {
            this.loadMap(3, cells);
            this.setNeighbors();
        } else this.createMap(3);
    }

    Map.prototype.createMap = function(height) {
        var three = new Array(this.size);
        for (var x = 0; x < this.size; x++) {
            three[x] = new Array(height);
            for (var y = 0; y < height; y++) {
                three[x][y] = new Array(this.size);
                for (var z = 0; z < this.size; z++) {
                    three[x][y][z] = {
                        legit: false,
                        x: x,
                        y: y,
                        z: z
                    };
                }
            }
        }

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < height; y++) {
                for (var z = 0; z < this.size; z++) {
                    if (y === 0) three[x][y][z] = new Cell(x, y, z);
                    if (!three[x][y][z].legit && x > 1 && z > 1 && x < this.size - 2 && z < this.size - 2) {
                        if (y === 1 && Math.random() > 0.85) {
                            three[x][y][z] = new Cell(x, y, z);
                            three[x - 1][y][z] = new Cell(x - 1, y, z);
                            three[x][y][z - 1] = new Cell(x, y, z - 1);
                            three[x + 1][y][z] = new Cell(x + 1, y, z);
                            three[x][y][z + 1] = new Cell(x, y, z + 1);
                            three[x - 1][y][z - 1] = new Cell(x - 1, y, z - 1);
                            three[x - 1][y][z + 1] = new Cell(x - 1, y, z + 1);
                            three[x + 1][y][z - 1] = new Cell(x + 1, y, z - 1);
                            three[x + 1][y][z + 1] = new Cell(x + 1, y, z + 1);
                        }
                        if (y > 1 && Math.random() > 0.5 && three[x - 1][y - 1][z].legit && three[x + 1][y - 1][z].legit && three[x][y - 1][z - 1].legit && three[x][y - 1][z + 1].legit) three[x][y][z] = new Cell(x, y, z);
                    }
                }
            }
        }
        this.data = three;
    }

    Map.prototype.loadMap = function(height, cells) {
        for (var x = 0; x < this.size; x++) {
            this.data[x] = new Array(height);
            for (var y = 0; y < height; y++) {
                this.data[x][y] = new Array(this.size);
            }
        }
        console.log(this.data);
        var self = this;
        cells.forEach(function(cell) {
            if (cell.legit) self.data[cell.x][cell.y][cell.z] = new Cell(cell.x, cell.y, cell.z, cell.material);
            else self.data[cell.x][cell.y][cell.z] = cell;
        })
    }
>>>>>>> master

    Map.prototype.setNeighbors = function() {
        var self = this;
        this.data.forEach(function(column) {
            column.forEach(function(row, y) {
                row.forEach(function(cell) {
                    cell.neighbors = [];
                    for (var x = cell.x - 1; x <= cell.x + 1; x++) {
                        for (var z = cell.z - 1; z <= cell.z + 1; z++) {
                            if ((cell.x == x || cell.z == z) && (!(cell.x == x && cell.z == z))) {
                                var neighbor = self.getCell(x, y, z);
                                if (neighbor) cell.neighbors.push(neighbor);
                            }
                        }
                    }
                });
            })
        });
    };


    Map.prototype.getCell = function(x, y, z) {
        if (x >= 0 && x < this.size && z >= 0 && z < this.size) {
            return this.data[x][y][z];
        } else {
            return false;
        }
    };
    Map.prototype.getMaterial = function(x, y, z) {
        return this.data[x][y][z].material === "dirt" ? 2 : 1; //Need to modify so that it's not hard coded
    };


    Map.prototype.fertilize = function(x, y, z) {
        // z is optional, if want to pass in multiple cells,
        // pass in 2d array as x, otherwise pass in coordinates
        // individually
        // check if fertilizing a whole patch or just one cell
        if (Array.isArray(x)) {
            // x is 2d array of coordinates [[x1,z1],[x2,z2]]
            x.forEach(function(cell) {
                this.fertilized.push(this.data[cell[0]][cell[1]][cell[2]]);
            });
        } else {
            // x and z are individual coords
            this.fertilized.push(this.data[x][y][z]);
        }
    };

    Map.prototype.growGrass = function(game) {
        this.game = game;
        var self = this;
        this.fertilized.forEach(function(cell) {
            cell.setMaterial("grass");
            game.setBlock(cell.coordinate, 1); // 1 = grass
            cell.neighbors.forEach(function(neighbor) {
                if (neighbor.material !== "grass") {
                    if (Math.random() > 0.9)
                        self.nextRound.push(neighbor);
                    else self.nextRound.push(cell);
                }
            });
        });

        //replace fertilized with the next round
        this.fertilized = this.nextRound;
    };

    Map.prototype.empty = function(x, y, z) {
        var currentCell = this.getCell(x, y, z);
        if (currentCell.getMaterial === "dirt") return; //if animal eat empty patch
        console.log('EMPTY MAP FUNC', currentCell)
        currentCell.setMaterial("dirt");
        game.setBlock(currentCell.coordinate, 2); // 2 = Dirt

        //Check if neighbors is alive to regrow
        currentCell.neighbors.forEach(function(neighbor) {
            if (neighbor.getMaterial === "grass") this.nextRound.push(currentCell);
        });
    };



    function Cell(x, y, z, material) {
        this.legit = true;
        this.material = material || "grass"; //need to change
        this.coordinate = [x, y, z];
        this.neighbors = [];
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Cell.prototype.setMaterial = function(material) {
        this.material = material;
    };

    Cell.prototype.getCoordinate = function() {
        return [this.x, this.y, this.z];
    };

    return {
        create: function(size, cells) { //used for both creating new world and loading world
            if (cells) {
                currentMap = new Map(size, cells);
                return currentMap
            } else return new Map(size);
        },
        getCurrentMap: function() {
            return currentMap;
        }
    }

})