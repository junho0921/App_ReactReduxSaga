const path = require('path');

const config = {
	entry: {
		testModule: [
			'./src/index.js'
		]
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js'
	},

	externals : {
		'react': "React",
		'react-dom': "ReactDOM",
		'react-redux': "ReactRedux",
		"react-router": "ReactRouter",
		"react-router-redux": "ReactRouterRedux",
		// "redux-thunk" : "var window.ReduxThunk.default",
		'redux': "Redux"
	},

	plugins: [],
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel'
		}, {
			test: /\.js?$/,
			exclude: /node_modules/,
			loader: 'babel'
		}, {
			test: /\.css$/,
			exclude: /node_modules/,
			loader: 'style!css'
		},  {
			test: /\.scss$/,
			loader: 'style!css!sass'
		}]
	}
};

module.exports = config;