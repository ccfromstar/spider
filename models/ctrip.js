var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mysql = require('../models/db');

exports.get = function(cb) {
	console.log('正在抓取携程的数据...');
	var url = 'http://cruise.ctrip.com/search/';
	var txtSource = '携程';
	var url_list = [];
	var list = [];
	for (var i = 0; i < 43; i++) {
		url_list.push(url + 'p' + i + '.html');
	}
	async.eachSeries(url_list, function(arr_url, callback) {
		console.log('正在抓取' + arr_url + '的数据...');
		request(arr_url, function(err, data) {
			if (err) return console.error(err);
			var $ = cheerio.load(data.body.toString());
			$('#productlist .route_list').each(function() {
				
				var $me = $(this);
				var dom_title = $me.find('.route_title').text();
				var arr1 = dom_title.split('【');
				var arr2 = arr1[1].split('】');
				var arr3 = arr2[1].trim();
				var arr4 = analyDay(arr3);
				var dom_start_date = $me.find('.route_info_col .txt_link_strong').text();
				var dom_line = $me.find('.route_setout .route_info_txt').text();
				var dom_price = $me.find('.route_price .price  span').text();
				var item = {
					txtCompany: arr1[0],
					txtCruise: arr2[0],
					txtLine: dom_line,
					txtStartDate: dom_start_date.replace(' ','-'),
					numDay: arr4[0],
					numNight: arr4[1],
					numPrice: dom_price=='实时计价'?-1:Number(dom_price),
					txtUrl: $me.find('.route_list_link').attr('href'),
					title:'【' + arr1[0] + '-' + arr1[1] + '】'+dom_line+' '+dom_start_date.replace(' ','-')+' '+arr4[1]+'晚'+arr4[0]+'天'
				};
				list.push(item);
			});
			callback(err, list);
		});
	}, function(err) {
		if (err) return console.error(err.stack);
		/*写入数据库*/
		var count = 0;
		async.eachSeries(list, function(record, callback) {
			count += 1;
			console.log('正在写入第' + count + '条数据，共有'+list.length+'条...');
			var sql = 'insert into product(txtCompany,txtCruise,txtLine,txtStartDate,numDay,numNight,numPrice,txtUrl,txtSource,title) values("' + record.txtCompany + '","' + record.txtCruise + '","' + record.txtLine + '","' + record.txtStartDate + '",' + record.numDay + ',' + record.numNight + ',' + record.numPrice + ',"' + record.txtUrl + '","' + txtSource + '","'+record.title+'");';
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