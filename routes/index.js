var tapotiexie = require('../models/tapotiexie');
var settings = require('../settings');
var mysql = require('../models/db');

/*网络爬虫*/
exports.spider = function(req, res) {
	//1.爬踏破铁鞋的航次
	tapotiexie.get();
}

exports.servicedo = function(req, res) {
	var _sql = req.params.sql;
	if (_sql == "SearchByKey") {
		/*模糊查询*/
		var _key = req.param("key");
		var _option2 = req.param("option_2");
		var sql = "select * from product where txtCompany like '%" + _key + "%' or txtCruise like '%" + _key + "%' or txtLine like '%" + _key + "%' order by "+_option2+" asc";
		//console.log(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			//console.log(result);
			res.json(result);
		});
	}else if(_sql =="getAllCompany"){
		/*获取所有邮轮公司*/
		var sql = "select * from company";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	}else if(_sql == "getShipByCompanyNo"){
		/*根据邮轮公司编号获取所有船名*/
		var txtCompanyNo = req.param("txtCompanyNo");
		var sql = "select * from ship where txtCompanyNo = '"+txtCompanyNo+"'";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	}else if(_sql == "getPort"){
		/*获取出发港*/
		var sql = "select * from port";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	}else if(_sql == "SearchByComboxKey"){
		/*组合查询*/
		var hasand = false;
		var data_1 = req.param("data_1");
		var data_2 = req.param("data_2");
		var data_3 = req.param("data_3");
		var data_4 = req.param("data_4");
		var data_5 = req.param("data_5");
		var _option2 = req.param("option_2");
		var sql = "select * from product where ";
		if(data_1 != "*"){
			sql += "txtCompany like '%"+data_1+"%' ";
			hasand = true;
		}
		if(data_2 != "*"){
			if(hasand){
				sql += "and "; 
			}
			sql += "txtCruise like '%"+data_2+"%' ";
			hasand = true;
		}
		if(data_3 != "*"){
			if(hasand){
				sql += "and "; 
			}
			sql += "txtLine like '"+data_3+"%' ";
			hasand = true;
		}
		if(data_4 != ""){
			if(hasand){
				sql += "and "; 
			}
			sql += "txtStartDate = '"+data_4+"' ";
			hasand = true;
		}
		if(data_5 != "*"){
			if(hasand){
				sql += "and "; 
			}
			if(data_5 == "10"){
				sql += "numDay > "+Number(data_5-1)+" ";
			}else{
				sql += "numDay = "+data_5+" ";
			}
			hasand = true;
		}
		sql += "order by "+_option2+" asc";
		console.log(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	}
}