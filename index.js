var qsocks = require('qsocks')
var serializeapp = require('serializeapp')
var fs = require('fs-extra');
var yargs = require('yargs');



// Parse command line parameters
var argv = yargs.usage('Qlik Sense app metadata extractor', {
  'about': {
    description: 'This app serializes metadata for Qlik Sense apps to standard output.',
    required: false,
    alias: 'a',
  },
  'id': {
    description: 'ID of app to extract metadata for.',
    required: true,
    alias: 'i',
  }
}).argv;


// 	QRS config
var config = {
    isSecure: true,
    host: '<sense server>',
    port: 4747,
    headers: {
        'X-Qlik-User': 'UserDirectory=Internal;UserId=sa_repository'
    },
    cert: fs.readFileSync('./client.pem'),
    key: fs.readFileSync('./client_key.pem'),
    rejectUnauthorized: false
};




// Extract metadata
qsocks.Connect(config).then(function(global) {
	global.openDoc(argv.id.toString())
		.then(function(app) {
			return serializeapp(app);
		})
		.then(function(data) {
			console.log(data); // --> A JSON Object describing the app.

      // Close connection to Sense server
	    try {
	      global.connection.ws.close();
	    } catch(ex) {

	    }

		})
})
