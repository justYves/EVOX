app.factory('ObjectivesFactory', function() {
	return {
		1: {
			1: function(creature, user) {
				if (creature.state === "eating") user.levels[0].objective[0].completed = true;
			},
			2: function(creature, user) {
				if (creature.state === "procreating") user.levels[0].objective[1].completed = true; 
			},
			3: function(creature, user) {
				var count = 0;
				return function(c, u) {
					if (c.state === "eating") count++;
					if (count === 3) u.levels[0].objective[2].completed = true;
					else return;
				}
			},
			4: function(creature, user) {
				var count = 0;
				return function(c, u) {
					if (c.state === "procreating") count++;
					if (count === 3) u.levels[0].objective[2].completed = true;
					else return;
				}
			}
		},
		2: {
			1: function(creature, user) {},
			2: function(creature, user) {},
			3: function(creature, user) {},
			4: function(creature, user) {}
		},
		3: {
			1: function(creature, user) {},
			2: function(creature, user) {},
			3: function(creature, user) {},
			4: function(creature, user) {}
		},
		4: {
			1: function(creature, user) {},
			2: function(creature, user) {},
			3: function(creature, user) {},
			4: function(creature, user) {}
		}
	}
});