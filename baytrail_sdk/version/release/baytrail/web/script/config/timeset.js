//var g_szVideoInfoXml = "";
var TcpIp = {
	tabs: null   // 保存音视频配置页面的tabs对象引用
};
/*************************************************
*************************************************/
function TimeSet() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(TimeSet);
pr(TimeSet).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["TimeSet", "TimeSetMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initTimeSet();
	//this.initCSS();	
	
}




/*************************************************
Function:		initTimeSet
Description:	初始化日志页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initTimeSet()
{
	
	autoResizeIframe();
}




function PTZPan() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(PTZPan);
pr(PTZPan).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["PTZPan", "TimeSetMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initPTZPan();
	//this.initCSS();	
	
}