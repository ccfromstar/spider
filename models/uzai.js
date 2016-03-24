var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mysql = require('../models/db');
var iconv = require('iconv-lite');

exports.get = function(cb) {
	console.log('正在抓取众信的数据...');
	var url = 'http://www.uzai.com/youlun';
	var txtSource = '众信';
	var url_list = [];
	var list = [];
	var max = 2;
	for (var i = 1; i < max; i++) {
		url_list.push(url);
	}
	var count = 0;
	async.eachSeries(url_list, function(arr_url, callback) {
		console.log('正在抓取' + arr_url + '的数据...');
		request(arr_url, function(err, data) {
			if (err) return console.error(err);
			var $ = cheerio.load(data.body.toString());
			$('#j_RouteList .line-list li').each(function() {
				var $me = $(this);
				var start_date = $me.find('.fl .pr10').eq(1).find('a').text();
				var arr2 = start_date.split('/');
				if (arr2[0].length == 1) {
					arr2[0] = '0' + arr2[0];
				}
				if (arr2[1].length == 1) {
					arr2[1] = '0' + arr2[1];
				}
				var item = {
					txtCompany: '',
					txtCruise: '',
					txtLine: $me.find('.fl .pr10').eq(2).find('span').text(),
					txtStartDate: '2016-' + arr2[0] + '-' + arr2[1],
					numDay: -1,
					numNight: -1,
					numPrice: Number($me.find('.f20 strong').text()),
					txtUrl: $me.find('.f16 a').attr('href'),
					title: $me.find('.f16 a').attr('title')
				};
				list.push(item);
			});
			//console.log(list);
			callback(err, list);
		});
	}, function(err) {
		if (err) return console.error(err.stack);
		/*写入数据库*/
		var count = 0;
		async.eachSeries(list, function(record, callback) {
			count += 1;
			console.log('正在写入第' + count + '条数据，共有' + list.length + '条...');
			var sql = 'insert into product(txtCompany,txtCruise,txtLine,txtStartDate,numDay,numNight,numPrice,txtUrl,txtSource,title) values("' + record.txtCompany + '","' + record.txtCruise + '","' + record.txtLine + '","' + record.txtStartDate + '",' + record.numDay + ',' + record.numNight + ',' + record.numPrice + ',"' + record.txtUrl + '","' + txtSource + '","' + record.title + '");';
			mysql.query(sql, function(err, info) {
				if (err) return console.error(err.stack);
				if (info.affectedRows == 1) {
					callback(err);
				}
			});
		}, function(err) {
			if (err) return console.error(err.stack);
			console.log('处理成功！');
			cb(null);
		});
	});
}

/*解析晚和天*/
function analyDay(str) {
	var arr1 = str.split('天');
	var arr2 = arr1[1].split('晚');
	var _newStr = arr1[0] + '|' + arr2[0];
	return _newStr.split('|');
}