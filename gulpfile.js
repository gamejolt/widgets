const gulp = require('gulp');

const config = {
	staticCdn: 'https://s.gjcdn.net/widgets',
	sections: {
		app: {
			title: 'Game Jolt',
		},
	}
};

require('game-jolt-frontend-lib/gulp/tasks/common')(config, __dirname);
