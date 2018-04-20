console.log("main");

setTimeout(function(){
	console.log("time1");
}, 0);

new Promise(function(resolve, reject){
	console.log("promise1");
	Promise.resolve().then(()=> {
		console.log("promise2");
	})
}).then(function(){
	console.log('resolve')
});
