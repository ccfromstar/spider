var load = '<ul id="ajax_list" class="am-list"><li>数据查询中... <i class="am-icon-spinner am-icon-pulse"></i></li></ul>';
var loadcompany = '<option value="*">邮轮公司</option><option value="*">数据加载中...</option>';
var loadship = '<option value="*">船名</option><option value="*">数据加载中...</option>';
var defaultship = '<option value="*">船名</option><option value="*">请先选择邮轮公司</option>';
var loadport = '<option value="*">出发港</option><option value="*">数据加载中...</option>';
var url = window.location.href;
var loadinfo = "加载中...";

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
					if (p == 0) {
						p = '售罄';
					} else if (p == -1) {
						p = '实时计价';
					} else {
						p = "¥" + p + "起";
					}
					if (data[i].txtSource == '踏破铁鞋') {
						res += '<li onclick="showDetail(\'' + data[i].txtUrl + '\')">';
					} else {
						res += '<li onclick="window.open(\'' + data[i].txtUrl + '\')">';
					}

					if (data[i].txtSource == '驴妈妈' || data[i].txtSource == '途牛' || data[i].txtSource == '春秋') {
						res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> ' + data[i].title + '</h1>';
					} else if (data[i].txtSource == '同程' || data[i].txtSource == '众信') {
						res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> ' + data[i].title + ' ' + data[i].txtStartDate + '</h1>';
					} else {
						res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> 【' + data[i].txtCompany + '-' + data[i].txtCruise + '】';
						res += data[i].txtLine + ' ';
						res += data[i].txtStartDate + ' ' + data[i].numNight + '晚' + data[i].numDay + '天</h1>';
						/*
						res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> ' + data[i].txtCompany + '-' + data[i].txtCruise + '</h1>';
						res += '<h2>邮轮线路：' + data[i].txtLine + '</h2>';
						res += '<h2>出发日期：' + data[i].txtStartDate + ' ' + data[i].numNight + '晚' + data[i].numDay + '天</h2>';
						*/
					}
					res += '<span class="price am-badge am-badge-warning am-radius ">' + p + '</span>';
					res += '</li>';
				}
				res += '</ul>';
				$("#result").html(res);
			}
		});
}

/*显示产品详情*/
function showDetail(url) {
	window.location = 'detail.html?p=' + url;
	/*
	var $modal = $('#modal_detail');
	$modal.css("height", $(window).height());
	$modal.find("iframe").css("height", $(window).height() - 20).css("width", $(window).width()).attr("src", "load.html");
	$modal.find("iframe").attr("src", url);
	$modal.modal('open');*/
}

/*组合查询条件重置*/
function resetFrom() {
	$('#startdate1').val('');
	$('#startdate2').val('');
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
	var data_4_1 = $('#startdate1').val();
	var data_4_2 = $('#startdate2').val();
	var data_5 = $('#day').val();
	/*set sessionStorage*/
	window.sessionStorage.setItem("data_1",data_1);
	window.sessionStorage.setItem("data_2",data_2);
	window.sessionStorage.setItem("data_3",data_3);
	window.sessionStorage.setItem("data_4_1",data_4_1);
	window.sessionStorage.setItem("data_4_2",data_4_2);
	window.sessionStorage.setItem("data_5",data_5);
	if (data_1 == '*' && data_2 == '*' && data_3 == '*' && data_4_1 == '' && data_4_2 == '' && data_5 == '*') {
		$('.errorinfo').html('<p>最少要选择一个查询条件</p>').removeClass("none");
		setTimeout(function() {
			$('.errorinfo').addClass("none");
		}, 2000);
		return false;
	}
	if (data_4_1 != '' && data_4_2 != '' && data_4_1 > data_4_2) {
		$('.errorinfo').html('<p>结束日期不能大于开始日期</p>').removeClass("none");
		setTimeout(function() {
			$('.errorinfo').addClass("none");
		}, 2000);
		return false;
	}

	//显示数据加载层
	$("#result_combox").html(load);
	$.ajax({
		type: "POST",
		url: "/service/SearchByComboxKey",
		data: {
			data_1: data_1 == '*' ? "*" : arr[1],
			data_2: data_2,
			data_3: data_3,
			data_4_1: data_4_1,
			data_4_2: data_4_2,
			data_5: data_5,
			option_2: window.localStorage.getItem('option_2')
		},
		success: function(data) {
			var res = '<ul class="am-list">';
			for (var i in data) {
				var p = data[i].numPrice;
				if (p == 0) {
					p = '售罄';
				} else if (p == -1) {
					p = '实时计价';
				} else {
					p = "¥" + p + "起";
				}
				if (data[i].txtSource == '踏破铁鞋') {
					res += '<li onclick="showDetail(\'' + data[i].txtUrl + '\')">';
				} else {
					res += '<li onclick="window.open(\'' + data[i].txtUrl + '\')">';
				}
				if (data[i].txtSource == '驴妈妈' || data[i].txtSource == '途牛' || data[i].txtSource == '春秋') {
					res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> ' + data[i].title + '</h1>';
				} else if (data[i].txtSource == '同程' || data[i].txtSource == '众信') {
					res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> ' + data[i].title + ' ' + data[i].txtStartDate + '</h1>';
				} else {
					res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> 【' + data[i].txtCompany + '-' + data[i].txtCruise + '】';
					res += data[i].txtLine + ' ';
					res += data[i].txtStartDate + ' ' + data[i].numNight + '晚' + data[i].numDay + '天</h1>';
					/*
					res += '<h1><span class="am-badge am-badge-success am-radius ">' + data[i].txtSource + '</span> ' + data[i].txtCompany + '-' + data[i].txtCruise + '</h1>';
					res += '<h2>邮轮线路：' + data[i].txtLine + '</h2>';
					res += '<h2>出发日期：' + data[i].txtStartDate + ' ' + data[i].numNight + '晚' + data[i].numDay + '天</h2>';
					*/
				}
				res += '<span class="price am-badge am-badge-warning am-radius ">' + p + '</span>';
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
				res += '<option value="' + data[i].txtCompanyNo + '|' + data[i].txtCompanyName + '">' + data[i].txtCompanyName + '</option>';
			}
			$("#txtCompanyName").html(res);
			$('#txtCompanyName').val(window.sessionStorage.getItem("data_1"));
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
			$('#txtCruise').val(window.sessionStorage.getItem("data_2"));
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
			$('#port').val(window.sessionStorage.getItem("data_3"));
		}
	});
}

/*加载天数*/
function loadDay() {
	var res = '<option value="*">天数</option>';
	for (var i = 3; i < 10; i++) {
		res += '<option value="' + i + '">' + i + '天</option>';
	}
	res += '<option value="10">10天以上</option>';
	$("#day").html(res);
	$('#day').val(window.sessionStorage.getItem("data_5"));
}

/*加载产品详情*/
function loadDetail() {
	var $modal = $('#my-modal-loading');
	$('.am-modal-hd').html(loadinfo);
	$modal.modal();
	var arr1 = url.split('?p=');
	/*兼容微信*/
	var arr2 = arr1[1].split('&from=');
	//console.log(arr1);
	$.ajax({
		type: "POST",
		data: {
			url: arr2[0]
		},
		url: "/service/getDetail",
		success: function(data) {
			
			var html = '';
			var imglist = data[0].imglist;
			for(i in imglist){
				html += '<li>';
				html += '<img src="'+imglist[i]+'">';
				html += '</li>';
			}
			$('#headerimg').attr('src',imglist[0]);
			$('#fysm').html(data[0].fysm);
			$('#qxzc').html(data[0].qxzc);
			//$('#hxxx').html(data[0].hxxx);
			var jbxx = data[0].infolist;
			$('#jbxx').html(jbxx[0].p1+'<br/>'+jbxx[0].p2+'<br/>'+jbxx[0].p3+'<br/>'+jbxx[0].p4);
			//console.log(data[0].pricelist);
			var plist = data[0].pricelist;
			html = '<table class="am-table am-table-bordered am-table-radius am-table-striped">';
			for(var j in plist){
				html+='<tr>';
				html+='<td>'+plist[j].p1+'</td>';
				html+='<td>'+plist[j].p2+'</td>';
				html+='<td>'+plist[j].p3+'</td>';
				html+='<td>'+plist[j].p4+'</td>';
				html+='<td>'+plist[j].p5+'</td>';
				html+='<td>'+plist[j].p6+'</td>';
				html+='</tr>';
			}
			html+='</table>';
			$('#jgxx').html(html);
			/*加载行程*/
			var hlist = data[0].xingchenglist;
			html = '<ul class="am-list">';
			for(var j in hlist){
				html+='<li class="am-g">';
				html+='<p class="p1">'+hlist[j].p1+'</p>';
				html+='<p><b>'+hlist[j].p2+'</b></p>';
				html+='<p class="p3">'+hlist[j].p3+'</p>';
				html+='<p>'+hlist[j].p4+'</p>';
				html+='</li>';
			}
			html+='</ul>';
			$('#hxxx').html(html);
			/*生成header*/
			var arr1 = (jbxx[0].p1).split('：');
			var arr2 = (jbxx[0].p2).split('：');
			var arr3 = (jbxx[0].p3).split('：');
			var arr4 = (jbxx[0].p4).split('：');
			$('title').html(arr1[1]+' '+arr2[1]+' '+arr3[1]+' '+arr4[1]);
			$modal.modal('close');
		}
	});
}

$(function() {
	/*结果排序*/
	var option_2 = window.localStorage.getItem('option_2');
	if (!option_2) {
		window.localStorage.setItem('option_2', 'txtStartDate');
	}
	/*初始化系统设置*/
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
		if(window.sessionStorage.getItem("data_4_1")){
			$('#startdate1').datepicker('setValue', window.sessionStorage.getItem("data_4_1"));
		}
		if(window.sessionStorage.getItem("data_4_2")){
			$('#startdate2').datepicker('setValue', window.sessionStorage.getItem("data_4_2"));
		}
		
	}
});