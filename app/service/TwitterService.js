var Twit = require('twit')
	, T
	, TwitterDB;

TwitterService = function(TwitterDAO){
			T = new Twit({
		    consumer_key:         '8MFLPfdX8HiLUrPM0Qyi5Bmjw'
		  , consumer_secret:      'd6u3cYvmVNnxicVeVL1hpfpOHSfVZyxRBCnWKbQeyTeQHEEqLN'
		  , access_token:         '3282733969-5b6ZzQmUpVN07x9jMumQqVlowRo7hy9h0pe3Ssv'
		  , access_token_secret:  'yCkFjssozROJpWoQ9C0kvmj7uVt6gpkj5w0IuN2tQmto2'
		});
		this.TwitterDB = TwitterDAO;
};

TwitterService.prototype.broadcastDo = function(doObj){
	if(doObj != null){
		var output = '';
		for(var i  = 0;  i < doObj.wholist.length; i++){
			output+=doObj.wholist[i]+" ";
		}

		output+=doObj.content;
		if(!doObj.active && doObj.isDo){
			output+='\n [SETTLED: YES] ';
		} else if(!doObj.active && !doObj.isDo){
			output+='\n [SETTLED: NO] ';
		}

		output+='\n ACCEPT: ['
		for(var i  = 0;  i < doObj.accept.length; i++){
			output+=doObj.accept[i]+" ";
		}
		output+=']';

		output+='\n DECLINE: ['
		for(var i  = 0;  i < doObj.decline.length; i++){
			output+=doObj.decline[i]+" ";
		}
		output+=']';

		T.post('statuses/update', { status: output }, function(err, data, response) {
			if(err == null){
	 			//save to mongo
	 		} else{
				console.log('Error Tweeting Get Do');
	 		}
		});
	}
};

TwitterService.prototype.getDo = function(tweet, obj){
	var statusID = tweet.in_reply_to_status_id;
	if(statusID != null){
		//getdo
		obj.TwitterDB.getDo(statusID, obj.broadcastDo);
	}
};

TwitterService.prototype.updateAcceptDo = function(tweet, obj){
	var statusID = tweet.in_reply_to_status_id;
	if(statusID != null){
		//getdo
		obj.TwitterDB.updateAcceptDo(statusID, tweet.user.screen_name);
	}
};

TwitterService.prototype.updateDeclineDo = function(tweet, obj){
	var statusID = tweet.in_reply_to_status_id;
	if(statusID != null){
		//getdo
		obj.TwitterDB.updateDeclineDo(statusID, tweet.user.screen_name);
	}
};

TwitterService.prototype.newDo = function(tweet, obj){
	var owner = tweet.user.screen_name;
	var content = tweet.text;
	if(content != null && content.indexOf('@rsvpstats') > -1){
		content = content.replace('@rsvpstats', '');
		var contentArray = content.split(' ');
		var contentOut = '';
		for(var i = 0; i < contentArray.length; i++){
			if(contentArray[i].indexOf('@') == -1 && contentArray[i].indexOf('#') == -1){
				contentOut+=contentArray[i]+" ";
			}
		}
		content = contentOut;
	}

	var wholist = [];
	if(tweet.entities != null && tweet.entities.user_mentions != null){
		for(var i = 0; i < tweet.entities.user_mentions.length; i++){
			var userMention = tweet.entities.user_mentions[i];
			if(userMention.screen_name != 'rsvpstats'){
				wholist.push('@'+userMention.screen_name);
			}
		}
	}
	wholist.push('@'+owner);
	console.log(wholist);


	var output = '';
	console.log('+++ '+wholist);
	for(var i = 0; i < wholist.length; i++){
		output+=wholist[i]+' ';
	}
	output+=content+' ';
	output+='\n[Reply #acceptdo/#declinedo]';
	T.post('statuses/update', { status: output }, function(err, data, response) {
			var twitterID = data.id;
			var newdo = new NewDo(twitterID, owner, content, wholist);

	 		console.log(data);
	 		if(err == null){
	 			//save to mongo
	 			console.log("pppppp");
	 			obj.TwitterDB.addNewDo(newdo);
	 		}
	});
	
	console.log(output);
}

TwitterService.prototype.delegator = function(tweet, obj){
	console.log(tweet.entities.hashtags);
	if(tweet.text.indexOf('@rsvpstats') > -1){
		if(tweet.text.indexOf('#newdo') > -1){
			obj.newDo(tweet, obj);
		} else if(tweet.text.indexOf('#acceptdo') > -1){
			obj.updateAcceptDo(tweet, obj);
		} else if(tweet.text.indexOf('#declinedo') > -1){
			obj.updateDeclineDo(tweet, obj);
		}

		if(tweet.text.indexOf('#getdo') > -1){
			//in_reply_to_status_id
			obj.getDo(tweet, obj);
		}
	}	

};


TwitterService.prototype.startStream = function(obj){
	console.log("------------- Starting Twitter Stream ------------" + obj);
	var stream = T.stream('user')
	stream.on('tweet', function(tweet){
		obj.delegator(tweet, obj);

	});
};

App.require('app/models/NewDo');

exports.TwitterService = TwitterService;