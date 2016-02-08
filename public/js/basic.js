var load = '<ul id="ajax_list" class="am-list"><li>数据查询中... <i class="am-icon-spinner am-icon-pulse"></i></li></ul>';
var loadcompany = '<option value="*">邮轮公司</option><option value="*">数据加载中...</option>';
var loadship = '<option value="*">船名</option><option value="*">数据加载中...</option>';
var defaultship = '<option value="*">船名</option><option value="*">请先选择邮轮公司</option>';
var loadport = '<option value="*">出发港</option><option value="*">数据加载中...</option>';

/*模糊查询*/
function searchKey() {
	var key = $("#key").val();
	if (key == "") {
		$("#result").html("<p>搜索关键字提示</p><p>邮轮公司（如：歌诗达）</p><p>船名（如：维多利亚）</p><p>港口（如：福冈）</p>");
		$(".close").addClass("none");
		return false;
	}
	//显示数据加载层
	$("#result").html(load);
	$(".close").removeClass("none");
	if (key)
		$.ajax({
			type: "POST",
			url: "/service/SearchByKey",
			data: {
				key: key,
				option_2: window.localStorage.getItem('option_2')
			},
			success: function(data) {
				var res = '<ul class="am-list">';
				for (var i in data) {
					var p = data[i].numPrice;
					p = p == 0 ? "售罄" : "¥" + p + "起";
					res += '<li onclick="window.open(\'' + data[i].txtUrl + '\')">';
					res += '<h1><span class="am-badge am-badge-success am-radius am-text-sm">' + data[i].txtSource + '</span> ' + data[i].txtCompany + '-' + data[i].txtCruise + '</h1>';
					res += '<h2>邮轮线路：' + data[i].txtLine + '</h2>';
					res += '<h2>出发日期：' + data[i].txtStartDate + ' ' + data[i].numNight + '晚' + data[i].numDay + '天</h2>';
					res += '<span class="price am-badge am-badge-warning am-radius am-text-sm">' + p + '</span>';
					res += '</li>';
				}
				res += '</ul>';
				$("#result").html(res);
			}
		});
}

/*组合查询条件重置*/
function resetFrom(){
	$('#startdate').val('');
	loadCompany();
	loadPort();
	loadShip();
	loadDay();
}

/*组合查询*/
function comboxSearch() {
	var data_1 = $('#txtCompanyName').val();
	var arr = data_1.split('|');
	var data_2 = $('#txtCruise').val();
	var data_3 = $('#port').val();
	var data_4 = $('#startdate').val();
	var data_5 = $('#day').val();
	if (data_1 == '*' && data_2 == '*' && data_3 == '*' && data_4 == '' && data_5 == '*') {
		$('.error1').removeClass("none");
		setTimeout(function() {
			$('.error1').addClass("none");
		}, 2000);
		return false;
	}
	//显示数据加载层
	$("#result_combox").html(load);
	$.ajax({
		type: "POST",
		url: "/service/SearchByComboxKey",
		data: {
			data_1: data_1 == '*'?"*":arr[1],
			data_2: data_2,
			data_3: data_3,
			data_4: data_4,
			data_5: data_5,
			option_2: window.localStorage.getItem('option_2')
		},
		success: function(data) {
			var res = '<ul class="am-list">';
			for (var i in data) {
				var p = data[i].numPrice;
				p = p == 0 ? "售罄" : "¥" + p + "起";
				res += '<li onclick="window.open(\'' + data[i].txtUrl + '\')">';
				res += '<h1><span class="am-badge am-badge-success am-radius am-text-sm">' + data[i].txtSource + '</span> ' + data[i].txtCompany + '-' + data[i].txtCruise + '</h1>';
				res += '<h2>邮轮线路：' + data[i].txtLine + '</h2>';
				res += '<h2>出发日期：' + data[i].txtStartDate + ' ' + data[i].numNight + '晚' + data[i].numDay + '天</h2>';
				res += '<span class="price am-badge am-badge-warning am-radius am-text-sm">' + p + '</span>';
				res += '</li>';
			}
			res += '</ul>';
			$("#result_combox").html(res);
		}
	});
}

/*清空搜索关键字*/
function clearsearch() {
	$("#key").val('');
	searchKey();
	$(".close").addClass("none");
}

/*保存设置*/
function save() {
	/*查询范围最少选择一个*/
	var sSecondType = "";
	$(':checked[name="option_1"]').each(function() {
		if (sSecondType == "") {
			sSecondType = $(this).val();
		} else {
			sSecondType = sSecondType + "*" + $(this).val();
		}
	})
	if (sSecondType == '') {
		$('.error1').removeClass("none");
		setTimeout(function() {
			$('.error1').addClass("none");
		}, 2000);
		return false;
	}
	/*查询结果排序*/
	var val_2 = $(':checked[name="option_2"]').val();
	window.localStorage.setItem('option_2', val_2);
	/*显示保存成功*/
	$('.success').removeClass("none");
	/*2秒后关闭*/
	setTimeout(function() {
		$('.success').addClass("none");
	}, 2000);
}

/*加载邮轮公司选项*/
function loadCompany() {
	//显示数据加载层
	$("#txtCompanyName").html(loadcompany);
	$.ajax({
		type: "POST",
		url: "/service/getAllCompany",
		success: function(data) {
			var res = '<option value="*">邮轮公司</option>';
			for (var i in data) {
				res += '<option value="' + data[i].txtCompanyNo + '|'+ data[i].txtCompanyName + '">' + data[i].txtCompanyName + '</option>';
			}
			$("#txtCompanyName").html(res);
		}
	});
}

/*加载船名选项*/
function loadShip() {
	//显示数据加载层
	$('#txtCruise').html(loadship);
	var cno = $('#txtCompanyName').val();
	var arr = cno.split('|');
	if (cno == '*') {
		$('#txtCruise').html(defaultship);
		return false;
	}
	$.ajax({
		type: "POST",
		url: "/service/getShipByCompanyNo",
		data: {
			txtCompanyNo: arr[0]
		},
		success: function(data) {
			var res = '<option value="*">船名</option>';
			for (var i in data) {
				res += '<option value="' + data[i].txtShipName + '">' + data[i].txtShipName + '</option>';
			}
			$("#txtCruise").html(res);
		}
	});
}

/*加载出发港选项*/
function loadPort() {
	//显示数据加载层
	$('#port').html(loadport);
	$.ajax({
		type: "POST",
		url: "/service/getPort",
		success: function(data) {
			var res = '<option value="*">出发港</option>';
			for (var i in data) {
				res += '<option value="' + data[i].name + '">' + data[i].name + '</option>';
			}
			$("#port").html(res);
		}
	});
}

/*加载天数*/
function loadDay(){
	var res = '<option value="*">天数</option>';
	for(var i=3;i<10;i++){
		res += '<option value="'+i+'">'+i+'天</option>';
	}
	res += '<option value="10">10天以上</option>';
	$("#day").html(res);
}

$(function() {
	/*结果排序*/
	var option_2 = window.localStorage.getItem('option_2');
	if (!option_2) {
		window.localStorage.setItem('option_2', 'txtStartDate');
	}
	/*初始化系统设置*/
	var url = window.location.href;
	if (url.indexOf('option') > 0) {
		var _op2 = window.localStorage.getItem('option_2');
		if (_op2 == 'txtStartDate') {
			$('#radio2').attr('checked', 'checked');
		} else {
			$('#radio1').attr('checked', 'checked');
		}
	}
	/*初始化组合查询*/
	if (url.indexOf('combox') > 0) {
		loadCompany();
		loadPort();
		loadDay();
	}
});