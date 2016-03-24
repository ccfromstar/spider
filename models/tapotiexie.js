var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mysql = require('../models/db');

exports.get = function(cb) {
	console.log('正在抓取踏破铁鞋的数据...');
	var domino = 'http://www.tapotiexie.com';
	var url = 'http://www.tapotiexie.com/Line/index/name/yt/p/';
	var txtSource = '踏破铁鞋';
	var url_list = [];
	var list = [];
	for (var i = 1; i < 25; i++) {
		url_list.push(url + i + '.html');
	}
	async.eachSeries(url_list, function(arr_url, callback) {
		console.log('正在抓取' + arr_url + '的数据...');
		request(arr_url, function(err, data) {
			if (err) return console.error(err);
			var $ = cheerio.load(data.body.toString());
			$('.tptx_ytgt .tptx_ytgt_4').each(function() {
				var $me = $(this);
				//解析船公司和船字段
				var arr1 = analyStr($me.find('.tptx_ytgt_2b a').text());
				//解析晚和天
				var arr2 = analyDay($me.find('.tptx_jcyj_2ab_1 span').text());
				var item = {
					txtCompany: arr1[0],
					txtCruise: arr1[1],
					txtLine: analyLine($me.find('.tptx_jcyj_2ab_1 ul li:first-child').text()),
					txtStartDate: analyStart($me.find('.tptx_jcyj_2ab_1 li').eq(1).text(), $me.find('.tptx_jcyj_2ab_1 span').text()),
					numDay: Number(arr2[1]),
					numNight: Number(arr2[0]),
					numPrice: analyPrice($me.find('.tptx_jcyj_2ac .tptx_jcyj_2ac_1').text()),
					txtUrl: domino + $me.find('.tptx_ytgt_2b a').attr('href'),
					title:'【' + arr1[0] + '-' + arr1[1] + '】'+ analyLine($me.find('.tptx_jcyj_2ab_1 ul li:first-child').text())+' '+analyStart($me.find('.tptx_jcyj_2ab_1 li').eq(1).text(), $me.find('.tptx_jcyj_2ab_1 span').text()) + ' ' + Number(arr2[0]) + '晚' + Number(arr2[1]) + '天'
				};
				list.push(item);
			});
			callback(err, list);
		});
	}, function(err) {
		if (err) return console.error(err.stack);
		/*删除所有数据*/
		async.waterfall([function(callback) {
			var sql1 = "delete from product";
		    mysql.query(sql1, function(err, result) {
		        if (err) return console.error(err.stack);
		        callback(null);
		    });
		}, function(callback) {
		    /*写入数据库*/
			var count = 0;
			async.eachSeries(list, function(record, callback) {
				count += 1;
				console.log('正在写入第' + count + '条数据，共有' + list.length + '条...');
				var sql = 'insert into product(txtCompany,txtCruise,txtLine,txtStartDate,numDay,numNight,numPrice,txtUrl,txtSource,title) values("' + record.txtCompany + '","' + record.txtCruise + '","' + record.txtLine + '","' + record.txtStartDate + '",' + record.numDay + ',' + record.numNight + ',' + record.numPrice + ',"' + record.txtUrl + '","' + txtSource + '","'+record.title+'");';
				mysql.query(sql, function(err, info) {
					if (err) return console.error(err.stack);
					if (info.affectedRows == 1) {
						callback(err);
					}
				});
			}, function(err) {
				if (err) return console.error(err.stack);
				callback(err);
			});
		}], function(err) {
		    if(err){
		    	console.log(err);
		    }else{
		    	console.log('处理成功！');
		    	cb(null);
			}
		});

	});
}

/*按中间的空格解析字符串*/
function analyStr(str) {
	var _newStr = '';
	for (i in str) {
		if (str[i].trim() == '') {
			_newStr += '|';
		} else {
			_newStr += str[i];
		}
	}
	return _newStr.split('||');
}

/*解析航线*/
function analyLine(str) {
	var arr1 = str.split("邮轮线路：");
	return arr1[1];
}

/*解析价格*/
function analyPrice(str) {
	if (str == '售罄') {
		return 0;
	} else {
		var arr1 = str.split("￥");
		var arr2 = arr1[1].split("起");
		return Number(arr2[0]);
	}
}

/*解析晚和天*/
function analyDay(str) {
	var arr1 = str.split('晚');
	var arr2 = arr1[1].split('天');
	var _newStr = arr1[0] + '|' + arr2[0];
	return _newStr.split('|');
}

/*解析出发日期*/
function analyStart(str1, str2) {
	var arr1 = str1.split(str2);
	var arr2 = arr1[0].split('出发时间：');
	return arr2[1];
}