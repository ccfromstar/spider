var mysql = require('mysql');
var settings = require('../settings');
var debug = require('debug')('myapp:main');
var async = require('async');
var cronJob = require('cron').CronJob;

var job1 = new cronJob('* * * * * *',function(){
	debug('每秒执行一次');  
});

job1.start();


/*

var conn = mysql.createConnection({
	host: settings.host,
	user: settings.user,
	password: settings.password,
	database: settings.database,
	port: settings.port
});

conn.connect();
*/

/*
function handleDisconnect() {
	conn = mysql.createConnection({
		host: settings.host,
		user: settings.user,
		password: settings.password,
		database: settings.database,
		port: settings.port
	});
	conn.connect(function(err) {
		if (err) {
			console.log('连接数据库出错：' + err);
			setTimeout(handleDisconnect, 2000);
		}
	});

	conn.on('error', function(err) {
		console.log('出错：' + err);
		if (err.code == 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

handleDisconnect();*/
/*
var pool = mysql.createPool({
	host: settings.host,
	user: settings.user,
	password: settings.password,
	database: settings.database,
	port: settings.port,
	connectionLimit: 10
});


var colunms = ['id', 'name'];
var sql = 'select ?? from test';
conn.query(sql, [colunms], function(err, rows) {
	if (err) throw err;
	debug(JSON.stringify(rows));
});

var name = '李四';
var table = 'test';
sql = 'insert into ??(name) value ("?")';
conn.query(sql, [table, name], function(err, info) {
	if (err) throw err;
	debug(info.affectedRows);
	debug(info.insertId);
});

async.waterfall([function(callback) {
	var sql = 'select * from test where name="陈叔叔"';

	pool.query(sql, function(err, rows) {
		if (err) {
			debug('err1:' + err);
			return;
		}
		debug('rows[0].id：' + rows[0].id);
		var id = rows[0].id;
		callback(null, id);
	});
}, function(id, callback) {
	sql = 'select name from test where id = ' + id;
	debug(sql);
	pool.query(sql, function(err, rows) {
		if (err) {
			debug('err2:' + err);
			return;
		}
		debug(rows[0].name);
		callback(err, rows);
	});
}], function(err,rows) {
	err ? debug('err3:' + err) : debug('完成：'+rows[0].name);
});

//conn.end();

/*
var pool = mysql.createPool({
	host: settings.host,
	user: settings.user,
	password: settings.password,
	database: settings.database,
	port: settings.port,
	connectionLimit: 10
});

pool.getConnection(function(err,connection){
	if(err) throw err;
	// connection 为当前一个可用的数据库连接
});*/