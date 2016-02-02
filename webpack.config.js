module.exports = {
	entry: './public/app.js',
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)$/, 
			exclude: /(node_modules)/, 
			loader: 'babel',
			query: { 
				presets: ['es2015']
			}
		}, {
            test: /modernizr\.js$/,
            exclude: /(node_modules)/, 
            loader: 'imports?this=>window!exports?window.Modernizr'
        }]
	},
	resolve: {
    	extensions: ['', '.js', '.jsx']
 	}
};