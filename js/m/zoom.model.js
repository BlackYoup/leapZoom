function ZoomModel(){
	var self = this;

	this.Leap = null;
	this.waitForFrame = null;
	this.currentFrame = null;
	this.previousFrame = null;
	this.currentIndexesFingersPos = null;
	this.previousIndexesFingersPos = null;
	this.zoomUpdates = [];
	this.zoomObject = null;
	
	this.haveUpdate = function(){
		emitter.emit('views:haveUpdate');
	};

	this.wireEmitterEvents = function(){
	
	};

	this.initWaitForFrame = function(){
		this.waitForFrame = null;
		this.waitForFrame = _.after(10, this.onFrame);
	};

	this.onFrame = function(frame){
		this.initWaitForFrame();
		this.previousFrame = this.currentFrame;
		this.currentFrame = frame;
		if(this.checkHands(2)){
			this.defineIndexesPositions();
			this.makeZoom();
		}
	};

	this.checkHands = function(nbr){
		return this.currentFrame.hands.length === nbr;
	};

	this.getIndexFingers = function(){
		var tempHands = _.map(this.currentFrame.hands, function(hand){
			return {
				type: hand.type, 
				indexFinger: hand.indexFinger
			};
		});
	
		var fingers = {};
		_.each(tempHands, function(hand){
			if(!_.has(fingers, hand.type)){
				fingers[hand.type] = hand.indexFinger;
			}
		});

		return fingers;
	};

	this.getIndexFingersPos = function(fingers){
		var myFingers = _.map(fingers, function(finger, key){
			var myFingerData = _.filter(self.currentFrame.pointables, function(curFinger){
				return curFinger.id === fingers[key].id;
			});
			return {
				type: key,
				x: myFingerData[0].tipPosition[0]
			};
		});
		return myFingers;
	};

	this.defineIndexesPositions = function(){
		this.previousIndexesFingersPos = this.currentIndexesFingersPos;
		
		var currentIndexFingers = this.getIndexFingers();
		this.currentIndexesFingersPos = this.getIndexFingersPos(currentIndexFingers);
	};

	this.makeZoom = function(){
		var cifp = _.map(this.currentIndexesFingersPos, function(val){
			return {
				type: val.type,
				x: val.x < 0 ? val.x *= -1 : val.x
			} ;
		});
		var pfip = _.map(this.previousIndexesFingersPos, function(val){
			return {
				type: val.type,
				x: val.x < 0 ? val.x *= -1 : val.x
			};
		});
		var distances = {
			old: _.reduce(pfip, function(calcul, distance){ return calcul + distance.x; }, 0),
			current: _.reduce(cifp, function(calcul, distance){ return calcul + distance.x; }, 0)
		};

		var diff = distances.current - distances.old;
		this.zoom(diff);
	};

	this.zoom = function(diff){
		var newWidth = this.zoomObject.obj.width() + (diff * this.zoomObject.ratio);
		var newHeight = this.zoomObject.obj.height() + (diff * this.zoomObject.ratio);

		this.zoomUpdates.push({
			type: 'updateDimensions',
			width: newWidth,
			height: newHeight
		});
		emitter.emit('views:haveUpdate'); 
	};

	this.getUpdate = function(){
		var send = this.zoomUpdates;
		this.zoomUpdates = [];
		return send;
	};

	this.initLeap = function(){
		this.Leap = Leap;
		this.Leap.loop(function(frame){
			self.waitForFrame(frame);
		});
	};

	this.computeRatio = function(){
		this.zoomObject['ratio'] = this.zoomObject.obj.width() / this.zoomObject.obj.height();
	};

	this.wireEventsEmitter = function(){
		emitter.on('model:setZoomObject', function(obj){
			self.zoomObject = {
				obj: obj
			};
			self.computeRatio();
			self.ready();
		});
	};

	this.ready = function(){
		this.initLeap();
	};

	this.init = function(){
		this.wireEventsEmitter();
		this.initWaitForFrame();
	};	

	emitter.once('init', function(){
		self.init();
	});

}
