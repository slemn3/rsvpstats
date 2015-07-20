
NewDo = function(id, owner, content, wholist){
	this.id = id;
	this.owner = owner;
	this.content = content;
	this.wholist = wholist;
	this.accept = [];
	this.decline = [];
	this.active = true;
	this.isDo = true;
}

NewDo.prototype.addAccept = function(username){
	if(this.decline.indexOf(username) > -1){
		this.decline.remove(username);
	}
	this.accept.push(username);
};

NewDo.prototype.addDecline = function(username){
	if(this.accept.indexOf(username) > -1){
		this.accept.remove(username);
	}
	this.decline.push(username);
};

NewDo.prototype.toString = function(){
	return "id: " + this.id
			+ ", owner: " + this.owner
			+ ", content: " + this.content
			+ ", accept: " + this.accept
			+ ", decline: " + this.decline
};

exports.NewDo = NewDo;