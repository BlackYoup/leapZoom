function ZoomView(_model){
	var self = this;

	this.model = _model;

	this.wireEventEmitter = function(){
		emitter.on('views:haveUpdate', function(){
            var got = self.model.getUpdate();
            self.route(got);
		});
	};

	this.route = function(data){
	    _.each(data, function(d){
	        self[d.type](d);
	    });
	};

	this.updateDimensions = function(dimensions){
	    $('#image').animate({
	        width: dimensions.width,
	        height: dimensions.height
	    }, 100);
	};

	this.wireDomEvents = function(){

	};

	this.init = function(){
		this.wireDomEvents();
		this.wireEventEmitter();
	};

	emitter.once('init', function(){
		self.init();
	});	
}
