var fun = [
	{"href":"search.html","icon":"am-icon-search","text":"模糊查询"},
	{"href":"combox.html","icon":"am-icon-search-plus","text":"组合查询"},
	{"href":"option.html","icon":"am-icon-wrench","text":"设置"}
];
var default_info = <div id="result"><p className="p_top">搜索关键字提示</p><p>邮轮公司（如：歌诗达）</p><p>船名（如：维多利亚）</p><p>途径港口（如：福冈）</p></div>;
var load = <ul id="ajax_list" className="am-list"><li>数据查询中... <i className="am-icon-spinner am-icon-pulse"></i></li></ul>;


/*
 * 底部菜单栏组件
 * */
var R_footer = React.createClass({
	render:function(){
		var list = this.props.data.map(function(c){
		return(
				<li className="am-active">
					<a href={c.href}>
						<span className={c.icon}></span>
						<span className="am-navbar-label">{c.text}</span>
					</a>
				</li>
			);
		});
		return(
			<div data-am-widget="navbar" className="am-navbar am-cf am-navbar-default " id="">
				<ul className="am-navbar-nav am-cf am-avg-sm-4">
					{list}
				</ul>
			</div>
		);
	}
});
/*
 * 顶部标题栏组件
 * */
var R_header = React.createClass({
	render:function(){
		return(
			<header data-am-widget="header" className="am-header am-header-default am-no-layout am-header-fixed">
				<h1 className="am-header-title">
    				<a href="#title-link">{this.props.title}</a>
  				</h1>
			</header>
		);
	}
});
/*
 * 返回顶部组件
 * */
var R_totop = React.createClass({
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
			<div data-am-widget="gotop" ref="toTop" className="am-gotop am-gotop-fixed">
				<a href="#top" title="回到顶部">
					<span className="am-gotop-title">回到顶部</span>
					<i className="am-gotop-icon am-icon-chevron-up"></i>
				</a>
			</div>
		);
	}
});
/*
 * 查询输入框组件
 * */
var R_Input = React.createClass({
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
		this.setState({close:<i className="am-icon-close close" onClick={this.closeHandle}></i>});
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
			<div className="fixed">
				<div className="am-form-icon">
					<i className="am-icon-search"></i>
					<input type="text" className="am-form-field" ref="key" onInput={this.searchKey} placeholder="邮轮公司/船名/途径港口"></input>
					{this.state.close}
				</div>
			</div>
		);
	}
});
/*
 * 查询结果组件
 * */
var R_Result = React.createClass({
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
					<li onClick={o.showDetail.bind(this,c.txtUrl)}>
						<h1><span className="am-badge am-badge-success am-radius ">{c.txtSource}</span>{c.title}</h1>
						<span className="price am-badge am-badge-warning am-radius ">{p}</span>
					</li>
				);
			});	
		}
		return(
			<div id="result">
				<ul className="am-list">
					{list}
				</ul>
			</div>
		);
	}
});
/*
 * 查询组件
 * */
var R_Search = React.createClass({
	getInitialState: function() { 
		return {res: default_info};
	},
	handlesearch:function(c){
		this.setState({res: c}); 
	},
	render:function(){
		return(
			
			<form action="" className="am-form am-form-inline">
				<R_Input onsearchKey={this.handlesearch} />
				<R_Result date={this.state.res} />
			</form>
		);
	}
});
