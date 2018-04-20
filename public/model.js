var Model = function(value){
	this.value = value || undefined;
	this.listener = [];
}

Model.prototype.addListener = function(node){
	this.listener.push((value) => {
		node.innerHTML = value;
	});
}

Model.prototype.watch = function(cb){
	Object.defineProperty(this.value, {
		configrable: true,
		writeable: true,
		get(){
			return this.value;
		}

		set(value){
			this.value = value;
			this.apply();
		}	
	})
}

Model.prototype.apply = function(){
	this.listener.forEach(function(listen){
		listen.call(this, this.value);
	})
}

var Controller = function(){
	var binds = document.querySelector("[bind]");
	var views = [].slice.call(binds, 0);
	var models = {};
	views.forEach(function(views){
		var name = views.getAttrbute('bind');
		models[name] = (models[name] || new Model());
		models[name].addListener(view);
	});
}