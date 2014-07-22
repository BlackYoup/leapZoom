function ZoomModel(){
	var self = this;

	this.Leap = null;
	this.waitForFrame = null;

	this.haveUpdate = function(){
		emitter.emit('views:haveUpdate');
	};

	this.wireEmitterEvents = function(){
	
	};

	this.initWaitForFrame = function(){
		this.waitForFrame = null;
		this.waitForFrame = _.after(50, this.onFrame);
	};

	this.onFrame = function(frame){
		this.initWaitForFrame();
	};

	this.initLeap = function(){
		this.Leap = Leap;
		this.Leap.loop(function(frame){
			self.waitForFrame(frame);
		});
	};

	this.init = function(){
		this.initWaitForFrame();
		this.initLeap();
	};	

	emitter.once('init', function(){
		self.init();
	});

}
