var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mysql = require('../models/db');
var iconv = require('iconv-lite');

exports.get = function(cb) {
	console.log('正在抓取同程的数据...');
	var url = 'http://www.ly.com/youlun/AjaxcallTravel.aspx?Type=GetYoulunPage3&producttypeid=0&hxid=3&hxcid=0&companyid=0&cruiseid=0&harbourid=0&dateid=0&sortManyiType=0&sortPriceType=0&sortCmCountType=0&sortSailDateType=0&dayNum=0&themeId=0&pctabid=&tagNum=0&isTCSpecialLine=0&pageNum=';
	var txtSource = '同程';
	var url_list = [];
	var list = [];
	var max = 34;
	//var max = 2;
	for (var i = 1; i < max; i++) {
		url_list.push(url + i + '&iid=0.3765048531157762');
	}
	var count = 0;
	async.eachSeries(url_list, function(arr_url, callback) {
		count += 1;
		console.log('正在抓取第' + count + '条数据，共'+(max-1)+'条...');
		request({
			encoding: null,
			url: arr_url
		}, function(err, data, body) {
			if (err) return console.error(err);
			var charset = "gb2312";
			//var body = data.body;
			body = iconv.decode(body, charset);
			body = JSON.parse(body);
			var obj = body.LineMessageMod;
			for (var i in obj) {
				/*
				var title = obj[i].MainTitle;
				var arr1 = title.split('【');
				var arr2 = arr1[1].split('】');
				var arr3 = arr2[0].split('-');
				arr2[1] = arr2[1].replace(' ', '|');
				if(arr2[1].indexOf('|') == -1){
					console.log(arr2[1]+'格式不匹配');
					continue;
				}
				var arr4 = arr2[1].split('|');
				var arr5 = analyDay(arr4[1].trim());*/
				var item = {
					txtCompany: '',
					txtCruise: '',
					txtLine: '',
					txtStartDate: obj[i].SailDateListModel.SailDateList[0],
					numDay: -1,
					numNight: -1,
					numPrice: Number(obj[i].Prize),
					txtUrl: 'http://www.ly.com/youlun/tours-' + obj[i].LineId + '.html?Key=067099221111152123212004056080057078050101040222&SearchCondition=JTdCJTIySHhJZCUyMiUzQSUyMjAlMjIlMkMlMjJIeENpZCUyMiUzQSUyMjAlMjIlMkMlMjJDb21wYW55SWQlMjIlM0ElMjIwJTIyJTJDJTIyQ3J1aXNlSWQlMjIlM0ElMjIwJTIyJTJDJTIySGFyYm91cklkJTIyJTNBJTIyMCUyMiUyQyUyMkRhdGVJZCUyMiUzQSUyMjAlMjIlMkMlMjJEYXlOdW0lMjIlM0ElMjIwJTIyJTdE',
					title: obj[i].MainTitle
				};
				list.push(item);

			}
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