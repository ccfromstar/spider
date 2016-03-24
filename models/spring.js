var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mysql = require('../models/db');
var iconv = require('iconv-lite');
var debug = require('debug')('myapp:spring');

exports.get = function(cb) {
	debug('正在抓取春秋的数据...');
	var url = 'http://www.springtour.com/shanghai-rihan/y9/';
	var txtSource = '春秋';
	var url_list = [];
	var list = [];
	var max = 3;
	/*日韩*/
	for (var i = 1; i < max; i++) {
		url_list.push(url+i);
	}
	
	var count = 0;
	async.eachSeries(url_list, function(arr_url, callback) {
		debug('正在抓取' + arr_url + '的数据...');
		request(arr_url, function(err, data) {
			if (err) return console.error(err);
			var $ = cheerio.load(data.body.toString());
			$('#search-result .search_items').each(function() {
				var $me = $(this);
				var start_date = $me.find('.s_info').text();
				var arr2 = start_date.split('班期：');
				
				var item = {
					txtCompany: '',
					txtCruise: '',
					txtLine: '',
					txtStartDate: arr2[1].trim(),
					numDay: -1,
					numNight: -1,
					numPrice: Number($me.find('.shprice p b').text()),
					txtUrl: $me.find('.stitle a').attr('href'),
					title: $me.find('.stitle a').attr('title')
				};
				list.push(item);
			});
			//debug(JSON.stringify(list));
			callback(err, list);
		});
	}, function(err) {
		if (err) return console.error(err.stack);
		/*写入数据库*/
		var count = 0;
		async.eachSeries(list, function(record, callback) {
			count += 1;
			debug('正在写入第' + count + '条数据，共有' + list.length + '条...');
			var sql = 'insert into product(txtCompany,txtCruise,txtLine,txtStartDate,numDay,numNight,numPrice,txtUrl,txtSource,title) values("' + record.txtCompany + '","' + record.txtCruise + '","' + record.txtLine + '","' + record.txtStartDate + '",' + record.numDay + ',' + record.numNight + ',' + record.numPrice + ',"' + record.txtUrl + '","' + txtSource + '","' + record.title + '");';
			mysql.query(sql, function(err, info) {
				if (err) return console.error(err.stack);
				if (info.affectedRows == 1) {
					callback(err);
				}
			});
		}, function(err) {
			if (err) return console.error(err.stack);
			debug('处理成功！');
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