var fun = [
	{"href":"search.html","icon":"am-icon-search","text":"模糊查询"},
	{"href":"combox.html","icon":"am-icon-search-plus","text":"组合查询"},
	{"href":"option.html","icon":"am-icon-wrench","text":"设置"}
];
var default_info = React.createElement("div", {id: "result"}, React.createElement("p", {className: "p_top"}, "搜索关键字提示"), React.createElement("p", null, "邮轮公司（如：歌诗达）"), React.createElement("p", null, "船名（如：维多利亚）"), React.createElement("p", null, "途径港口（如：福冈）"));
var load = React.createElement("ul", {id: "ajax_list", className: "am-list"}, React.createElement("li", null, "数据查询中... ", React.createElement("i", {className: "am-icon-spinner am-icon-pulse"})));


/*
 * 底部菜单栏组件
 * */
var R_footer = React.createClass({displayName: "R_footer",
	render:function(){
		var list = this.props.data.map(function(c){
		return(
				React.createElement("li", {className: "am-active"}, 
					React.createElement("a", {href: c.href}, 
						React.createElement("span", {className: c.icon}), 
						React.createElement("span", {className: "am-navbar-label"}, c.text)
					)
				)
			);
		});
		return(
			React.createElement("div", {"data-am-widget": "navbar", className: "am-navbar am-cf am-navbar-default ", id: ""}, 
				React.createElement("ul", {className: "am-navbar-nav am-cf am-avg-sm-4"}, 
					list
				)
			)
		);
	}
});
/*
 * 顶部标题栏组件
 * */
var R_header = React.createClass({displayName: "R_header",
	render:function(){
		return(
			React.createElement("header", {"data-am-widget": "header", className: "am-header am-header-default am-no-layout am-header-fixed"}, 
				React.createElement("h1", {className: "am-header-title"}, 
    				React.createElement("a", {href: "#title-link"}, this.props.title)
  				)
			)
		);
	}
});
/*
 * 返回顶部组件
 * */
var R_totop = React.createClass({displayName: "R_totop",
	componentDidMount:function(){
		/*DOM加载之后触发的事件*/
		var o = this;
		document.addEventListener("scroll",function(){
			var scrollTop = document.body.scrollTop;
			var t = o.refs.toTop.getDOMNode();
			if(scrollTop>50){
				$(t).addClass("am-active");
			}else{
				$(t).removeClass("am-active");
			}
		},false);
		var $goTop = $('[data-am-widget="gotop"]');
		$goTop.find('a').on('click', function(e) {
		    e.preventDefault();
		    $(window).smoothScroll();
		});
	},
	render:function(){
		return(
			React.createElement("div", {"data-am-widget": "gotop", ref: "toTop", className: "am-gotop am-gotop-fixed"}, 
				React.createElement("a", {href: "#top", title: "回到顶部"}, 
					React.createElement("span", {className: "am-gotop-title"}, "回到顶部"), 
					React.createElement("i", {className: "am-gotop-icon am-icon-chevron-up"})
				)
			)
		);
	}
});
/*
 * 查询输入框组件
 * */
var R_Input = React.createClass({displayName: "R_Input",
	getInitialState: function() { 
		return {close:""};
	},
	closeHandle:function(){
		this.refs.key.getDOMNode().value = "";
		this.searchKey();
	},
	searchKey:function(){
		var key = this.refs.key.getDOMNode().value.trim();
		if(!key || key.indexOf("'")!=-1){
			this.props.onsearchKey(default_info);
			this.setState({close:""});
			return;
		}
		this.setState({close:React.createElement("i", {className: "am-icon-close close", onClick: this.closeHandle})});
		this.props.onsearchKey(load);
		$.ajax({
			type: "POST",
			url: "/service/SearchByKey",
			data: {
				key: key,
				option_2: window.localStorage.getItem('option_2')
			},
			success: function(data) {
				this.props.onsearchKey(data);
			}.bind(this)
		});
	},
	render:function(){
		return(
			React.createElement("div", {className: "fixed"}, 
				React.createElement("div", {className: "am-form-icon"}, 
					React.createElement("i", {className: "am-icon-search"}), 
					React.createElement("input", {type: "text", className: "am-form-field", ref: "key", onInput: this.searchKey, placeholder: "邮轮公司/船名/途径港口"}), 
					this.state.close
				)
			)
		);
	}
});
/*
 * 查询结果组件
 * */
var R_Result = React.createClass({displayName: "R_Result",
	showDetail:function(url){
		window.open(url);
	},
	render:function(){
		var o = this;
		var list = "";
		if(this.props.date == default_info | this.props.date == load){
			list = this.props.date;
		}else{
			list = this.props.date.map(function(c){
			var p = c.numPrice;
			if (p == 0) {
				p = '售罄';
			} else if (p == -1) {
				p = '实时计价';
			} else {
				p = "¥" + p + "起";
			}
			return(
					React.createElement("li", {onClick: o.showDetail.bind(this,c.txtUrl)}, 
						React.createElement("h1", null, React.createElement("span", {className: "am-badge am-badge-success am-radius "}, c.txtSource), c.title), 
						React.createElement("span", {className: "price am-badge am-badge-warning am-radius "}, p)
					)
				);
			});	
		}
		return(
			React.createElement("div", {id: "result"}, 
				React.createElement("ul", {className: "am-list"}, 
					list
				)
			)
		);
	}
});
/*
 * 查询组件
 * */
var R_Search = React.createClass({displayName: "R_Search",
	getInitialState: function() { 
		return {res: default_info};
	},
	handlesearch:function(c){
		this.setState({res: c}); 
	},
	render:function(){
		return(
			
			React.createElement("form", {action: "", className: "am-form am-form-inline"}, 
				React.createElement(R_Input, {onsearchKey: this.handlesearch}), 
				React.createElement(R_Result, {date: this.state.res})
			)
		);
	}
});
