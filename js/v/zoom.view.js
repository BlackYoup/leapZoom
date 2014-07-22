function ZoomView(_model){
	var self = this;

	this.model = _model;

	this.wireEventEmitter = function(){
		emitter.on('views:haveUpdate', function(){

		});
	};

	this.wireEmitterEvents = function(){
			
	};

	this.wireDomEvents = function(){
	
	};

	this.init = function(){
		this.wireDomEvents();
	};

	emitter.once('init', function(){
		self.init();
	});	
}
