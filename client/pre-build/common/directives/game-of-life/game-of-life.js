app.directive('gameOfLife', function() {
    return {
        restrict: 'E',
        scope: {},
        controller: "GOLCTRL",
        templateUrl: 'pre-build/common/directives/game-of-life/game-of-life.html',
        link: function($scope) {
            $scope.gameOfLife.createAndShowBoard();
        }
    };
});

app.controller('GOLCTRL', function($scope) {
    $scope.getNeighbors = function(cell, cellX, cellY) {
        var neighbors = [];
        for (var x = cellX - 1; x <= cellX + 1; x++) {
            for (var y = cellY - 1; y <= cellY + 1; y++) {
                if (cellX !== x || cellY !== y) {
                    var n = document.getElementById(x + '-' + y);
                    if (n) neighbors.push(n);
                }
            }
        }
        return neighbors;
    };

    $scope.countLiveNeighbors = function(cell, cellX, cellY) {
        var neighbors = $scope.getNeighbors(cell, cellX, cellY);
        return neighbors.reduce(function(currentSum, c) {
            var increment = c.getAttribute('data-status') === 'alive' ? 1 : 0;
            return currentSum + increment;
        }, 0);
    };

    $scope.toggle = function(cell) {
        if (cell.getAttribute('data-status') === 'dead') {
            cell.className = "alive";
            cell.setAttribute('data-status', 'alive');
        } else {
            cell.className = "dead";
            cell.setAttribute('data-status', 'dead');
        }
    };

    $scope.gameOfLife = {
        cellsOn: [],
        width: 40,
        height: 25,
        stepInterval: 500,
        isPlaying: true,

        forEachCell: function(iteratorFunc) {
            var cells = this.board.getElementsByTagName('td');
            for (var i = 0; i < cells.length; i++) {
                var xy = cells[i].id.split('-');
                var x = parseInt(xy[0]);
                var y = parseInt(xy[1]);
                iteratorFunc(cells[i], x, y);
            }
        },

        play: function() {
            this.isPlaying = true;
            this.step();
            this.intervalId = setInterval(this.step.bind(this), this.stepInterval);
        },

        pause: function() {
            this.isPlaying = false;
            clearInterval(this.intervalId);
        },

        enableAutoPlay: function() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },

        step: function() {
            var toToggle = [];
            this.forEachCell(function(cell, cellX, cellY) {
                var liveNeighbors = $scope.countLiveNeighbors(cell, cellX, cellY);

                // determine whether the cell should be toggled LATER
                if (cell.getAttribute('data-status') === 'alive') {
                    if (liveNeighbors < 2 || liveNeighbors > 3) toToggle.push(cell);
                } else {
                    if (liveNeighbors === 3) toToggle.push(cell);
                }

            });
            toToggle.forEach($scope.toggle);
        },

        initialize: function() {
            this.pause();
            this.forEachCell(function(cell) {
                var status = Math.random() > 0.20 ? 'dead' : 'alive';
                cell.setAttribute('data-status', status);
                cell.className = status;
            });
        },

        createAndShowBoard: function() {
            // create <table> element
            var goltable = document.createElement("tbody");

            // build Table HTML
            var tablehtml = '';
            for (var h = 0; h < this.height; h++) {
                tablehtml += "<tr id='row'" + h + "'>";
                for (var w = 0; w < this.width; w++) {
                    tablehtml += "<div><td data-status='dead' id='" + w + "-" + h + "'></td><div>";
                }
                tablehtml += "</tr>";
            }
            goltable.innerHTML = tablehtml;

            // add table to the #board element
            var board = document.getElementById('board');
            board.appendChild(goltable);
            this.board = board;
            this.initialize();
            this.enableAutoPlay();
        }
    };
});