function ZoomControler(){

	this.wireEventsEmitter = function(){
		emitter.on('controler:setZoomObject', function(obj){
			emitter.emit('model:setZoomObject', obj);
		});
	};

	this.init = function(){
		this.wireEventsEmitter();
		emitter.emit('init');
	};
}
