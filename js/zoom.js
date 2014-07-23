$(document).ready(function(){
	window.emitter = new EventEmitter2();

	emitter.on('error', function(err){
		console.log(err);
	});

	var zoomModel = new ZoomModel(),
		zoomView = new ZoomView(zoomModel),
		zoomControler = new ZoomControler();

	zoomControler.init();
});
