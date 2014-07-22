function ZoomModel(){
	var self = this;

	this.Leap = null;
	this.waitForFrame = null;
	this.currentFrame = null;
	this.previousFrame = null;
	this.currentIndexesFingersPos = null;
	this.previousIndexesFingersPos = null;
	
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
		this.previousFrame = this.currentFrame;
		this.currentFrame = frame;
		if(this.checkHands(2)){
			this.defineIndexesPositions();
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
				fingerPos: myFingerData[0].tipPosition
			};
		});
		return myFingers;
	};

	this.defineIndexesPositions = function(){
		this.previousIndexesPos = this.currentIndexesFingersPos;
		
		var currentIndexFingers = this.getIndexFingers();
		this.currentIndexFingersPos = this.getIndexFingersPos(currentIndexFingers);
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
