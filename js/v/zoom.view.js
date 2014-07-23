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
	    $('#zoomImage').animate({
	        width: dimensions.width,
	        height: dimensions.height
	    }, 100);
	};

	this.wireDomEvents = function(){

	};

	this.giveZoomObject = function(){
		setTimeout(function(){
			emitter.emit('controler:setZoomObject', $('#zoomImage'));
		}, 100); // wait for the image to be rendered. Otherwise, it'll have a with & height of 0px
	};

	this.init = function(){
		this.wireDomEvents();
		this.wireEventEmitter();
		this.giveZoomObject();
	};

	emitter.once('init', function(){
		self.init();
	});	
}
