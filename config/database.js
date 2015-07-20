// Database initialization.  Should set 
var mongodb = require('mongodb')

// Initialize your database
App.DB = {
	startup: function(host, port, dbname, callback){
		var server = new mongodb.Server(host, port, {auto_reconnect: true}, {});
		this.db = new mongodb.Db(dbname, server);
		this.db.open(callback);
	}
  , shutdown: function() {
    // if the DB requires any special shutdown code
  	}
}
