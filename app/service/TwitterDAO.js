var dbsession;

TwitterDAO = function(dbsession){
	 this.dbsession = dbsession;
	 
};

TwitterDAO.prototype.getSize = function(){
	this.dbsession.collection('newdo', function(error, data){
	 	data.find().toArray(function(error, results){
	 		console.log('a'+results.length);
	 	});
	 });

};

TwitterDAO.prototype.addNewDo = function(newdo){
		this.dbsession.collection('newdo', function(error, data){
	 	data.insert(newdo, function(error, results){
	 		if(error != null){
	 			console.log('Error adding New Do: '+error);
	 		} else {
	 			console.log('Successfully retrieved Do '+results);	
	 			return results;
	 		}
	 		
	 	});
	 });

};

TwitterDAO.prototype.updateAcceptDo = function(idVal, username){
		this.dbsession.collection('newdo', function(error, data){
			if(error){
				console.log("Error ", error);
			}
		 	data.update(
		 		{id: idVal}, 
		 		{  	$push:
		 			{
		 				accept: '@'+username
		 			}
		 			, $pullAll:
		 			{
		 				decline: ['@'+username]
		 			}
		 		}
	 		)
	 });
};

TwitterDAO.prototype.updateDeclineDo = function(idVal, username){
		this.dbsession.collection('newdo', function(error, data){
			if(error){
				console.log("Error ", error);
			}
		 	data.update(
		 		{id: idVal}, 
		 		{ 	$push:
		 			{
		 				decline: '@'+username
		 			}
		 			, $pullAll:
		 			{
		 				accept: ['@'+username]
		 			}
		 		}
	 		)
	 });

};


TwitterDAO.prototype.getDo = function(idVal, callback){
		this.dbsession.collection('newdo', function(error, data){
		console.log("---- "+idVal);
	 	data.findOne({id: idVal}, function(error, results){
	 		if(error != null){
	 			console.log('Error adding New Do: '+error);
	 		} else {
	 			var theDo = results;
	 			callback(theDo);
	 		}
	 		
	 	});
	 });

};



App.require("config/database.js")


exports.TwitterDAO = TwitterDAO;