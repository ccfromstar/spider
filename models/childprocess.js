var child_process = require('child_process');

/*
if(process.platform === 'win32'){
	var dir = child_process.spawn(process.execPath,[__dirname+'/test.js']);
}else{
	var dir = child_process.spawn('dir',[__dirname+'/test.js']);
}

dir.stdout.pipe(process.stdout);
dir.stderr.pipe(process.stderr);

dir.on('close',function(code){
	console.log('进程'+code+'结束');
});*/

var options = {
	maxBuffer: 200*1024
};

var str = __dirname+'\\test.js';
console.log(str);
var dir = child_process.exec('dir test.js',options,function(err,stdout,stderr){
	if(err) throw err;
	
	console.log(stdout);
	console.error(stderr);
});
