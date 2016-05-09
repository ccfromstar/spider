var tapotiexie = require('../models/tapotiexie');
var ctrip = require('../models/ctrip');
var ly = require('../models/ly');
var lvmama = require('../models/lvmama');
var tuniu = require('../models/tuniu');
var uzai = require('../models/uzai');
var spring = require('../models/spring');
/*var test = require('../models/test');*/
var settings = require('../settings');
var mysql = require('../models/db');
var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('myapp:index');
var async = require('async');
var cronJob = require('cron').CronJob;

/*
*每天凌晨1点定时抓取数据
**/
var job1 = new cronJob('00 00 01 * * *',function(){
    	async.waterfall([function(callback) {
			//1.踏破铁鞋
			tapotiexie.get(callback);
		}, function(callback) {
			//2.携程
			ctrip.get(callback);
		}, function(callback) {
			//3.同程
			ly.get(callback);
		}, function(callback) {
			//4.驴妈妈
			lvmama.get(callback);
		}, function(callback) {
			//5.途牛
			tuniu.get(callback);
		}, function(callback) {
			//6.众信
			uzai.get(callback);
		}, function(callback) {
			//7.春秋
			spring.get(callback);
		}], function(err) {
		    if(err){
		    	console.log(err);
		    }else{
		    	console.log('任务处理完毕！');
			}
		});
});

job1.start();

/*手动执行网络爬虫*/
exports.spider = function(req, res) {
		async.waterfall([function(callback) {
			//1.踏破铁鞋
			//tapotiexie.get(callback);
			callback(null);
		}, function(callback) {
			//2.携程
			ctrip.get(callback);
			//callback(null);
		}, function(callback) {
			//3.同程
			//ly.get(callback);
			callback(null);
		}, function(callback) {
			//4.驴妈妈
			//lvmama.get(callback);
			callback(null);
		}, function(callback) {
			//5.途牛
			//tuniu.get(callback);
			callback(null);
		}, function(callback) {
			//6.众信
			//uzai.get(callback);
			callback(null);
		}, function(callback) {
			//7.春秋
			//spring.get(callback);
			callback(null);
		}], function(err) {
		    if(err){
		    	console.log(err);
		    }else{
		    	console.log('任务处理完毕！');
			}
		});
	res.render('spider', {
		layout: false
	});
}

exports.loading = function(req, res) {
	res.redirect("/loading.html");
}

exports.servicedo = function(req, res) {
	var _sql = req.params.sql;
	if (_sql == "SearchByKey") {
		/*模糊查询*/
		var _key = req.param("key");
		var _option2 = req.param("option_2");
		var sql = "select * from product where title like '%" + _key + "%' or txtCompany like '%" + _key + "%' or txtCruise like '%" + _key + "%' or txtLine like '%" + _key + "%' and txtStartDate >= '" + getToday() + "'  order by " + _option2 + " asc";
		//console.log(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			//console.log(result);
			res.json(result);
		});
	} else if (_sql == "getDetail") {
		/*根据url抓取产品详情*/
		var purl = req.param("url");
		console.log(purl);
		request(purl, function(err, data) {
			if (err) return console.error(err);
			var list = [];
			var $ = cheerio.load(data.body.toString());
			/*读取图片列表*/
			var imglist = [];
			$('#show_img img').each(function() {
				imglist.push('http://www.tapotiexie.com' + $(this).attr('src'));
			});
			/*计算价格*/
			var pricelist = [];
			var j = 0;
			$('#price tr').each(function() {
				for (var i = 0; i < 6; i++) {
					if ($(this).find('td').eq(i).text().trim() == '') {
						return;
					}
				}
				var item = {
					p1: $(this).find('td').eq(0).text(),
					p2: $(this).find('td').eq(1).text(),
					p3: $(this).find('td').eq(2).text(),
					p4: $(this).find('td').eq(3).text(),
					p5: $(this).find('td').eq(4).text(),
					p6: $(this).find('td').eq(5).text()
				};
				pricelist.push(item);
			});
			/*基本信息*/
			var infolist = [];
			$('.tptx_ytxq_2da_2 ul').each(function() {
				var item = {
					p1: $(this).find('li').eq(0).text(),
					p2: $(this).find('li').eq(1).text(),
					p3: $(this).find('li').eq(2).text(),
					p4: $(this).find('li').eq(3).text()
				};
				infolist.push(item);
			});
			/*读取行程*/
			var xingchenglist = [];
			$('.xingcheng li').each(function() {
				var item = {
					p1: $(this).find('.xingcheng_tit .day_box p').text(),
					p2: $(this).find('.xingcheng_tit h4').text(),
					p3: $(this).find('.tpxt_list div').eq(1).text(),
					p4: $(this).find('.tpxt_list div p').text()
				};
				xingchenglist.push(item);
			});
			/*生成结果*/
			var item = {
				fysm: $('.tptx_ytxq_5 .tptx_ytxq_5b').eq(0).html(),
				qxzc: $('.tptx_ytxq_5 .tptx_ytxq_5b').eq(1).html(),
				imglist: imglist,
				infolist: infolist,
				pricelist: pricelist,
				xingchenglist:xingchenglist
			};
			list.push(item);
			res.json(list);
		});
	} else if (_sql == "getAllCompany") {
		/*获取所有邮轮公司*/
		var sql = "select * from company";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	} else if (_sql == "getShipByCompanyNo") {
		/*根据邮轮公司编号获取所有船名*/
		var txtCompanyNo = req.param("txtCompanyNo");
		var sql = "select * from ship where txtCompanyNo = '" + txtCompanyNo + "'";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	} else if (_sql == "getPort") {
		/*获取出发港*/
		var sql = "select * from port";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	} else if (_sql == "SearchByComboxKey") {
		/*组合查询*/
		var hasand = false;
		var data_1 = req.param("data_1");
		var data_2 = req.param("data_2");
		var data_3 = req.param("data_3");
		var data_4_1 = req.param("data_4_1");
		var data_4_2 = req.param("data_4_2");
		var data_5 = req.param("data_5");
		var _option2 = req.param("option_2");
		var sql = "select * from product where (";
		if (data_1 != "*") {
			sql += "txtCompany like '%" + data_1 + "%' ";
			hasand = true;
		}
		if (data_2 != "*") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtCruise like '%" + data_2 + "%' ";
			hasand = true;
		}
		if (data_3 != "*") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtLine like '" + data_3 + "%' ";
			hasand = true;
		}
		if (data_4_1 != "") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtStartDate >= '" + data_4_1 + "' ";
			hasand = true;
		}
		if (data_4_2 != "") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtStartDate <= '" + data_4_2 + "' ";
			hasand = true;
		}
		if (data_4_1 != "" && data_4_2 == "") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtStartDate <= '" + data_4_1 + "' ";
			hasand = true;
		}
		if (data_5 != "*") {
			if (hasand) {
				sql += "and ";
			}
			if (data_5 == "10") {
				sql += "numDay > " + Number(data_5 - 1) + " ";
			} else {
				sql += "numDay = " + data_5 + " ";
			}
			hasand = true;
		}
		sql += " and (txtSource = '踏破铁鞋' or txtSource = '携程')) or ( "
		hasand = false;
		if (data_1 != "*") {
			sql += "title like '%" + data_1 + "%' ";
			hasand = true;
		}
		if (data_2 != "*") {
			if (hasand) {
				sql += "and ";
			}
			sql += "title like '%" + data_2 + "%' ";
			hasand = true;
		}
		if (data_3 != "*") {
			if (hasand) {
				sql += "and ";
			}
			sql += "title like '%" + data_3 + "%' ";
			hasand = true;
		}
		if (data_4_1 != "") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtStartDate >= '" + data_4_1 + "' ";
			hasand = true;
		}
		if (data_4_2 != "") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtStartDate <= '" + data_4_2 + "' ";
			hasand = true;
		}
		if (data_4_1 != "" && data_4_2 == "") {
			if (hasand) {
				sql += "and ";
			}
			sql += "txtStartDate <= '" + data_4_1 + "' ";
			hasand = true;
		}
		if (data_5 != "*") {
			if (hasand) {
				sql += "and ";
			}
			sql += "title like '%" + data_5 + "天%' ";
			hasand = true;
		}
		sql += " and (txtSource = '同程' or txtSource = '驴妈妈' or txtSource = '途牛' or txtSource = '众信' or txtSource = '春秋')) "
		sql += "and txtStartDate >= '" + getToday() + "' order by " + _option2 + " asc";
		console.log(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	}
}

function getToday() {
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
	var d = (((myDate.getDate()) + "").length == 1) ? "0" + (myDate.getDate()) : (myDate.getDate());
	return y + "-" + m + "-" + d;
}