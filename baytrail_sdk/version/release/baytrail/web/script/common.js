var camera_hostname	= self.location.hostname;  /*127.0.0.1*/
var camera_port = self.location.port;   /*8081*/
var szRetInfo="";
var g_AskTips =false;
if (camera_port==""){
	camera_port=80;
}

var camera_host = self.location.host;  /*127.0.0.1:8081*/
var m_lHttp="http://";
window.parent.document.title="IPC Web"  //title标题
//var pppp=top.document.getElementById("IpcCtrl")
var SearchID="";  //切换页面发送停止图片查询请求
var m_szSuccessState = "&nbsp;<img src='../images/config/smile.png' class='imgmiddle'>&nbsp;"; //设置成功
var m_szErrorState = "&nbsp;<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;"; //设置失败
/*************************************************
Function:		DelCookies
Description:	删除Cookies
Input:			无			
Output:			无
return:			无				
*************************************************/
function DelCookies(){
	$.cookie('page',null);
	$.cookie('UserNameLogin',null);
	$.cookie('UserPassLogin',null);
	$.cookie('authenticationinfo',null);
};
/*************************************************
  Function:    	isUserName
   Description:	检测只能输入用户名,提示只能输入数字英文和"-、_、@、."@"
*************************************************/
function CheckUserName(strName)
{
	 if (strName==""){
		$("#err").html(translator.translateNode(g_lxdLogin, "LoginTips1"));    
		return false;
	}
	
	/*var strName1 = strName.substr(0, 1);
	 var strP=/^[0-9-_@.]$/; 			
	 if(strP.test(strName1))
	 {
			$("#err").show().html("用户不存在"); 
			return false;
	 }*/
	// var strP1=/^[a-zA-Z0-9-_@.]$/; 
	 var strP1=/^[a-zA-Z0-9-_@.]{1,}$/; 	
	 if(!strP1.test(strName))
	 {      
			$("#err").html(translator.translateNode(g_lxdLogin, "LoginTips8"));   //用户名不存在
			return false;
	 }
	 setTimeout(function(){$("#err").html("");},2500);  
	 return true;
}
/*************************************************
  Function:    	isPassword
  Description:	检测只能输入用户名,提示只能输入数字英文和"-_@.,#$*~!"
*************************************************/
function CheckUserPassword(strName)
{
	
	 if (strName=="")
	 {
		$("#err").html(translator.translateNode(g_lxdLogin, "LoginTips5")); 
		return false;   
	}
	 if(!strName) return false;
	 //  英文和数字和"-"、"_""@"
	 var strP=/^[A-Za-z0-9-_@.,#$*~!]+$/;  
	 if(!strP.test(strName))
	 {
		$("#err").html(translator.translateNode(g_lxdLogin, "LoginTips8")); 
		return false;
	 }
    setTimeout(function(){$("#err").html("");},2500);   
	 return true;
}
/*************************************************
  Function:    	CheckTypeB 
  Description:	B类校验密码类,提示只能输入数字英文和"-_@.,#$*~!"
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				szName:名称
				iMin最小值
				iMax最大值
				iNull:是否可以为空 0不能为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckTypeB(strName, tipid,szName,iMin,iMax,iNull){
	 var szAreaNameInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
	 setTimeout(function(){$("#" + tipid).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strName))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("NullTips");
			$("#" + tipid).html(szAreaNameInfo);    
			return false;
		}
	}
	 var strP=/^[A-Za-z0-9-_@.,#$*~!]+$/;  	
	 if(!strP.test(strName))
	 {
		 if(tipid)
         {
			szAreaNameInfo +=  getNodeValue("UserTips")+",#$*~!";;
			$("#" + tipid).html(szAreaNameInfo); 
			return false;
         }
	 }
	 $("#" + tipid).html("");    
	 return true;
};


/*************************************************
Function:		chooseLanguage
Description:	选择语言
Input:			lan：语言
Output:			无
return:			无				
*************************************************/
function chooseLanguage(lan) {
    if(translator.szCurLanguage != lan) {
	    ChangeFrameLanguage(lan);
	}
	$('#laCurrentLanguage').html($('#' + lan).html());
	$('#divLanguageChoose').hide();
	
	if (typeof (window.frames.contentframe)!="undefined")
	{
		var pluginOSD=window.frames["contentframe"].document.getElementById("pluginOSD");  //osd页 
		if (pluginOSD)  
		{
			pluginOSD.eventWebToPlugin("changelanguage",lan);
		}
		
		var plugin0=window.frames["contentframe"].document.getElementById("plugin0")   //浏览、放像、图像效果
		if (plugin0)  
		{
			if (typeof (plugin0.eventWebToPlugin)!="undefined")
			{
				plugin0.eventWebToPlugin("changelanguage",lan);
		   }
		}
		
		var plugincropping=window.frames["contentframe"].document.getElementById("plugincropping")  //编码裁剪
		if (plugincropping)  
		{
			if (typeof (plugincropping.eventWebToPlugin)!="undefined")
			{
				plugincropping.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		var pluginRoi=window.frames["contentframe"].document.getElementById("pluginRoi")  //ROI
		if (pluginRoi)  
		{
			if (typeof (pluginRoi.eventWebToPlugin)!="undefined")
			{
				pluginRoi.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		
	    var privacymasks=window.frames["contentframe"].document.getElementById("pluginPrivacymasks")  //视频遮蔽
		if (privacymasks)  
		{
			if (typeof (privacymasks.eventWebToPlugin)!="undefined")
			{
				privacymasks.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		
		var pluginMotion=window.frames["contentframe"].document.getElementById("pluginMotion") //移动侦测
		if (pluginMotion)  
		{
			if (typeof (pluginMotion.eventWebToPlugin)!="undefined")
			{
				pluginMotion.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		
		var pluginAlarm=window.frames["contentframe"].document.getElementById("pluginAlarm")  //遮挡报警
		if (pluginAlarm)  
		{
			if (typeof (pluginAlarm.eventWebToPlugin)!="undefined")
			{
				pluginAlarm.eventWebToPlugin("changelanguage",lan);
			}
		}
		//云台
		var plugin_PresetPoint=window.frames["contentframe"].document.getElementById("plugin_PresetPoint")  //预置位
		if (plugin_PresetPoint)  
		{
			if (typeof (plugin_PresetPoint.eventWebToPlugin)!="undefined")
			{
				plugin_PresetPoint.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		var pluginLimit=window.frames["contentframe"].document.getElementById("pluginLimit")  //限位
		if (pluginLimit)  
		{
			if (typeof (pluginLimit.eventWebToPlugin)!="undefined")
			{
				pluginLimit.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		var pluginV5Limit=window.frames["contentframe"].document.getElementById("pluginV5Limit")  //V5限位
		if (pluginV5Limit)  
		{
			if (typeof (pluginV5Limit.eventWebToPlugin)!="undefined")
			{
				pluginV5Limit.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		var pluginCruise=window.frames["contentframe"].document.getElementById("pluginCruise")  //巡航扫描
		if (pluginCruise)  
		{
			if (typeof (pluginCruise.eventWebToPlugin)!="undefined")
			{
				pluginCruise.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		var pluginScanPattern=window.frames["contentframe"].document.getElementById("pluginScanPattern")  //花样扫描
		if (pluginScanPattern)  
		{
			if (typeof (pluginScanPattern.eventWebToPlugin)!="undefined")
			{
				pluginScanPattern.eventWebToPlugin("changelanguage",lan);
			}
		}
		
		var pluginLocation=window.frames["contentframe"].document.getElementById("pluginLocation")  //定位
		if (pluginLocation)  
		{
			if (typeof (pluginLocation.eventWebToPlugin)!="undefined")
			{
				pluginLocation.eventWebToPlugin("changelanguage",lan);
			}
		}
	}
}

/*************************************************
Function:		ChangeFrameLanguage
Description:	改变页面语言
Input:			lan：语言
Output:			无
return:			无
*************************************************/
function ChangeFrameLanguage(lan)
{
	$.cookie('language', lan);
	g_lxdLogin = translator.getLanguageXmlDoc("login", lan);
	translator.translatePage(g_lxdLogin, document);
	//window.parent.document.title = translator.translateNode(g_lxdLogin, "lalogin");
}

//停止查询图片
function stoppicquery(){
	var szXml = "<stoppicqueryparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<id>"+SearchID+"</id>";
 	szXml += "</stoppicqueryparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/piccapture/1/stoppicquery"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			
		}
	
	});
};
/*************************************************
Function:		UnloadPage
Description:	子页面销毁时，修改cookie为当前页
Input:			src:页面路径
				index:ID序号
Output:			无
return:			无				
*************************************************/
function UnloadPage(src,index) {
	
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	/*
	//关闭录像下载窗口
	if(2 == index) {
		if(m_DownWindow && m_DownWindow.open && !m_DownWindow.closed) {
			m_DownWindow.close();关闭录像下载窗口
		}
	}*/
	if (typeof m_TimerKeepaliveID !="undefined"){
	  clearInterval(m_TimerKeepaliveID);	
	}
	
	$("#plugin0").hide();
	if (SearchID!=''){
		stoppicquery();
	}
	
	$.cookie('page',src+"%"+index);
	
};
/*************************************************
Function:		loginEventBind
Description:	事件绑定
Input:			无
Output:			无
return:			无				
*************************************************/
function loginEventBind() {
    //点击语言选择框
	$(".languageshow").bind({
	    click: function (e) {
			e.stopPropagation();
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			} else {
				$('#divLanguageChoose').show();
			}
		}
	});
	//点击语言选择框以外的地方
    $("body").bind({
	    click: function (e) {
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			}
		}
	});	
};
/**********************************
Function:		DayAdd
Description:	日期加天数
Input:			szDay: 要加的日期
				iAdd： 加的天数
Output:			无
return:			true 有录像； false 没有录像；		
***********************************/
function DayAdd(szDay,iAdd)
{
	var date =  new Date(Date.parse(szDay.replace(/\-/g,'/')));
	var newdate = new Date(date.getTime()+(iAdd*24 * 60 * 60 * 1000));
	
	return newdate.Format("yyyy-MM-dd hh:mm:ss");   
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt)
{
	var o=
	{
		"M+":this.getMonth()+1,//月份
		"d+":this.getDate(),//日
		"h+":this.getHours(),//小时
		"m+":this.getMinutes(),//分
		"s+":this.getSeconds(),//秒
		"q+":Math.floor((this.getMonth()+3)/3),//季度
		"S":this.getMilliseconds()//毫秒
	};
	if(/(y+)/.test(fmt))
	fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
	for(var k in o)
	if(new RegExp("("+k+")").test(fmt))
	fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));
	return fmt;
}

function getNodeValue(tagName)
{
	if (parent != this) { // 父frame包含Translator.js，当前frame包含common.js
		var _translator = parent.translator;
	} else { // 当前节点包含Translator.js和common.js
		var _translator = translator;
	}
	if (_translator.s_lastLanguageXmlDoc !== null) {
		return _translator.translateNodeByLastLxd(tagName);
	}
}

/*************************************************
Function:		getXMLHttpRequest
Description:	创建xmlhttprequest对象
Input:			无			
Output:			无
return:			无				
*************************************************/
function getXMLHttpRequest()    
{
        var xmlHttpRequest = null; 
        if (window.XMLHttpRequest) 
        {
            xmlHttpRequest = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
        	xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
     	return xmlHttpRequest;
} 
/*************************************************
Function:		createxmlDoc
Description:	创建xml DOM对象
Input:			无			
Output:			无
return:			无				
*************************************************/
function createxmlDoc()
{
	var xmlDoc;
	var aVersions = [ "MSXML2.DOMDocument","MSXML2.DOMDocument.5.0",
	"MSXML2.DOMDocument.4.0","MSXML2.DOMDocument.3.0",
	"Microsoft.XmlDom"];
	
	for (var i = 0; i < aVersions.length; i++) 
	{
		try 
		{
			xmlDoc = new ActiveXObject(aVersions[i]);
			break;
		}
		catch (oError)
		{
			xmlDoc = document.implementation.createDocument("", "", null);
			break;
		}
	}
	xmlDoc.async="false";
	return xmlDoc;
}
/*************************************************
Function:		parseXml
Description:	从xml文件中解析xml
Input:			无
Output:			无
return:			xmlDoc				
*************************************************/
function parseXml(fileRoute)
{
	return $.ajax({
		url: fileRoute,
		dataType: "xml",
		type: "get",
		async: false
	}).responseXML;
}

/*************************************************
Function:		parseXmlFromStr
Description:	从xml字符串中解析xml
Input:			szXml xml字符串
Output:			无
return:			xml文档				
*************************************************/
function parseXmlFromStr(szXml)
{
	if ($.cookie('anonymous')!="anonymous")
	{
		if ($.cookie('authenticationinfo')==null ||  $.cookie('authenticationinfo')=='')
		{
			if ($.cookie('anonymous')!="anonymous")
			{
				if (!g_AskTips)
				{
					g_AskTips=true;
					alert(getNodeValue('LoginConnectTimeoutTips'));//登录超时,请重新登录
					top.location.href = "/";
					return;
				}
			}
		}
		else
		{
			if ($.cookie('authenticationinfo') != null){
				szXml = "<contentroot>"  + $.cookie('authenticationinfo') + szXml + "</contentroot>";
			}
			if(null == szXml || '' == szXml)
			{
				return null;
			}
			var xmlDoc=new createxmlDoc();
			if(!$.browser.msie)
			{
				var oParser = new DOMParser();
				xmlDoc = oParser.parseFromString(szXml,"text/xml");
			}
			else
			{
				xmlDoc.loadXML(szXml);
			}
			return xmlDoc;
		}
	}
	else
	{
		   if ($.cookie('authenticationinfo') != null){
				szXml = "<contentroot>"  + $.cookie('authenticationinfo') + szXml + "</contentroot>";
			}
			else
			{
				szXml = "<contentroot>"  + szXml + "</contentroot>";
			}
			if(null == szXml || '' == szXml)
			{
				return null;
			}
			var xmlDoc=new createxmlDoc();
			if(!$.browser.msie)
			{
				var oParser = new DOMParser();
				xmlDoc = oParser.parseFromString(szXml,"text/xml");
			}
			else
			{
				xmlDoc.loadXML(szXml);
			}
			return xmlDoc;
	}
	
	
	
	
	
}
/*************************************************
Function:		GetparseXmlFromStr
Description:	从xml字符串中解析xml
Input:			szXml xml字符串
Output:			无
return:			xml文档				
*************************************************/
function GetparseXmlFromStr(szXml)
{
	if ($.cookie('anonymous')!="anonymous")
	{
		if ($.cookie('authenticationinfo')==null ||  $.cookie('authenticationinfo')=='')
		{
			if (!g_AskTips)
			{
				g_AskTips=true;
				alert(getNodeValue('LoginConnectTimeoutTips'));//登录超时,请重新登录
				top.location.href = "/";
				return;
			}
		}
		else
		{
			if(null == szXml || '' == szXml)
			{
				return null;
			}
			var xmlDoc=new createxmlDoc();
			if(!$.browser.msie)
			{
				var oParser = new DOMParser();
				xmlDoc = oParser.parseFromString(szXml,"text/xml");
			}
			else
			{
				xmlDoc.loadXML(szXml);
			}
			return xmlDoc;
		}
	}
	else
	{
		if(null == szXml || '' == szXml)
		{
			return null;
		}
		var xmlDoc=new createxmlDoc();
		if(!$.browser.msie)
		{
			var oParser = new DOMParser();
			xmlDoc = oParser.parseFromString(szXml,"text/xml");
		}
		else
		{
			xmlDoc.loadXML(szXml);
		}
		return xmlDoc;
	}
	
}

/*************************************************
Function:		AGparseXmlFromStr(高级配置)
Description:	从xml字符串中解析xml
Input:			szXml xml字符串
Output:			无
return:			xml文档				
*************************************************/
function AGparseXmlFromStr(szXml)
{
	if ($.cookie('AGauthenticationinfo') != null){
		szXml = "<contentroot>"  + $.cookie('AGauthenticationinfo') + szXml + "</contentroot>";
	}
	if(null == szXml || '' == szXml)
	{
		return null;
	}
	var xmlDoc=new createxmlDoc();
	if(!$.browser.msie)
	{
		var oParser = new DOMParser();
		xmlDoc = oParser.parseFromString(szXml,"text/xml");
	}
	else
	{
		xmlDoc.loadXML(szXml);
	}
	return xmlDoc;
}
/*************************************************
Function:		xmlToStr
Description:	xml转换字符串
Input:			Xml xml文档
Output:			无
return:			字符串				
*************************************************/
function xmlToStr(Xml)
{
	if(Xml == null)
	{
	    return;	
	}
	var XmlDocInfo = '';
	if(navigator.appName == "Netscape" || navigator.appName == "Opera")
	{
		var oSerializer = new XMLSerializer();
		XmlDocInfo = oSerializer.serializeToString(Xml);
	}
	else
	{
		XmlDocInfo = Xml.xml;
	}
	if(XmlDocInfo.indexOf('<?xml') == -1)
	{
		XmlDocInfo = "<?xml version='1.0' encoding='utf-8'?>" + XmlDocInfo;
	}
	return XmlDocInfo;
}
/*************************************************
Function:		CreateCalendar
Description:	创建日历
Input:			iType: 0 日志界面日历 1 时间配置界面日历
Output:			无
return:			无
*************************************************/
function CreateCalendar(iType)
{
	var szLanguage = '';
	if(parent.translator.szCurLanguage == 'zh')
	{
		szLanguage = 'zh-cn';
	} else if(parent.translator.szCurLanguage == 'zh_TW') {
		szLanguage = 'zh-tw';	
	}  else {
		$.each(parent.translator.languages, function(i) {
			    if (this.value === parent.translator.szCurLanguage) {
				    szLanguage = this.value;
			    }
		});
		if(szLanguage === '') {
			szLanguage = 'en';
		}
	}
	if(iType == 0)
	{
	    WdatePicker({startDate:'%y-%M-%d %h:%m:%s',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:false,minDate:'1970-01-01 00:00:00',maxDate:'2037-12-31 23:59:59',readOnly:true,lang:szLanguage,isShowClear:false});
	}
	else if(2 == iType)
	{
		WdatePicker({dateFmt:'HH:mm:ss',alwaysUseStartDate:false,readOnly:true,lang:szLanguage,isShowClear:false});
	}
	else
	{
		WdatePicker({startDate:'%y-%M-%d %h:%m:%s',dateFmt:'yyyy-MM-ddTHH:mm:ss',alwaysUseStartDate:false,qsEnabled:false,minDate:'1970-01-01 00:00:00',maxDate:'2037-12-31 23:59:59',readOnly:true,lang:szLanguage,isShowClear:false});
	}
};
/*************************************************
Function:		SaveState
Description:	保存后返回的状态
Input:			xhr  XMLHttpRequest 对象		
Output:			无
return:			无				
*************************************************/
function SaveState(xhr)
{
	if(arguments.length > 0)
	{
		szXmlhttp = xhr;
	}
	
	if(szXmlhttp.readyState == 4)
	{
		if(szXmlhttp.status == 200 || szXmlhttp.status == 403 || szXmlhttp.status == 400 || szXmlhttp.status == 503 || szXmlhttp.status == 500)
		{
		    var xmlDoc =szXmlhttp.responseText;
			//xhr.responseText;
		  //  alert(xmlDoc)
			//statuscode
			var xmlDocstate = GetparseXmlFromStr(xmlDoc);
			$(xmlDocstate).find("statuscode").each(function(i){ 
		  	  state= $(this).text();
			});
			//var state = $(xmlDoc).find('statuscode').eq(0).text();
			//alert(state)
			if("0" == state  || "5" == state   )	//OK  5修改IP成功
			{
				szRetInfo = m_szSuccessState+m_szSuccess1;
			}else{
			    szRetInfo=m_szErrorState+m_szError1;
			}

		}
		else
		{
			szRetInfo = m_szErrorState + m_ConnectTimeoutTips;  //链接超时
		}
		$("#SetResultTips").html(szRetInfo);
		setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
	}
}
function SaveStateTips(xhr,obj,errtype){
	if(arguments.length > 0)
	{
		szXmlhttp = xhr;
	}
	szXmlhttp = xhr;
	//console.log("返回"+"  "+szXmlhttp.status)
	if(szXmlhttp.readyState == 4)
	{
		if(szXmlhttp.status == 200 || szXmlhttp.status == 403 || szXmlhttp.status == 400 || szXmlhttp.status == 503 || szXmlhttp.status == 500)
		{
		    var xmlDoc =szXmlhttp.responseText;
			var xmlDocstate = GetparseXmlFromStr(xmlDoc);
			$(xmlDocstate).find("statuscode").each(function(i){ 
		  	   var state= $(this).text();
			    if("0" == state  || "5" == state   )	//OK  5修改IP成功
			    {
					szRetInfo = m_szSuccessState+m_szSuccess1;
			    }
				else if ("201" == state) //未知错误
				{
					szRetInfo = m_szSuccessState+m_MUnknownerror;
				}
				else if ("202" == state || "203" == state || "204" == state) //无效的用户名或密码，请重新登录
				{
					if (errtype=="DelUser" || errtype=="EditUser")  //202  用户不存在,可能已被删除
					{
						alert(getNodeValue('jsUsernon'));//用户不存在,可能已被删除
						szRetInfo ="";
						$.modal.impl.close();
						GetUserLists();
					}
					else if(errtype=="EditPass")
					{
						szRetInfo = m_szErrorState + m_OldPassError;
					}
					else if(errtype=="GetAuthentication")
					{
						szRetInfo = m_szErrorState + getNodeValue('LoginTips6');//密码错误
						$("#spCheckResultTips").html(szRetInfo);
						setTimeout(function(){$("#spCheckResultTips").html("");},5000);  //5秒后自动清除
					}
					else
					{
						if (!g_AskTips)
						{
							g_AskTips=true;
								alert(getNodeValue('MUserPassErr'));
								$.cookie('page',null);
								$.cookie('UserNameLogin',null);
								$.cookie('authenticationinfo',null);
								$.cookie('menu_onemenu',null);
								$.cookie('menu_twomenu',null);
								top.location.href = "/"; 
								return;
						}
						
					}
				}
				else if("205" == state  ) //鉴权ID错误
			    {
					if (!g_AskTips)
					{
						g_AskTips=true;
						alert(getNodeValue('LoginConnectTimeoutTips'));//登录超时,请重新登录
						$.cookie('page',null);
						$.cookie('UserNameLogin',null);
						$.cookie('authenticationinfo',null);
						$.cookie('menu_onemenu',null);
						$.cookie('menu_twomenu',null);
						top.location.href = "/"; 
						szRetInfo ="";
						return;
					}
				}
				else if("206" == state) //没有权限
			    {
					alert(getNodeValue('Mauthorization'));
					szRetInfo ="";
					return;
				}
				else if("207" == state) //IP限制
			    {
					if (!g_AskTips)
					{
						g_AskTips=true;
						alert(getNodeValue('MIPlimit'));
						$.cookie('page',null);
						$.cookie('UserNameLogin',null);
						$.cookie('authenticationinfo',null);
						$.cookie('menu_onemenu',null);
						$.cookie('menu_twomenu',null);
						top.location.href = "/"; 
						return;
					}
				}
				else if("208" == state) //旧密码错误
			    {
					szRetInfo = m_szErrorState + m_OldPassError;
				}
				else if("209" == state) //用户已存在
			    {
					szRetInfo = m_szErrorState + getNodeValue('jsUserexists');//用户已存在
					$("#UserAddOKTips").html(szRetInfo);
					setTimeout(function(){$("#UserAddOKTips").html("");},5000);  //5秒后自动清除
				}
				
				else if("210" == state) //此CGI请求不支持或请求的URL格式有问题
			    {
					szRetInfo = m_szErrorState + getNodeValue('MCGIerr');
				}
				else if("211" == state) //请求没有携带XML
			    {
					szRetInfo = m_szErrorState + getNodeValue('MNoXML');
				}
				else if("212" == state) //Error4 无效的XML格式
			    {
					szRetInfo = m_szErrorState + m_szError3;
				}
				else if("213" == state || "214" == state || "215" == state) //213 （请求的URL与XML内的根节点不匹配）214 CGI请求携带的XML中缺少必要的参数 215 XML中携带的参数过长
			    {
					szRetInfo = m_szErrorState + m_szError4;
				}
				else if("219" == state) //参数错误
			    {
					if (errtype=="SaveIP")
					{
						szRetInfo = m_szErrorState + m_szError1;
						$("#SetResultTipsIPTCP").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SavePort")
					{
						szRetInfo = m_szErrorState + getNodeValue('jsPortConflict'); //端口冲突,保存失败
						$("#SetResultTipsPost").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsPost").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveDevice")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsDeviceInfo").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsDeviceInfo").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveVsip")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsVSIP").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsVSIP").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveOnvif")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsOnvif").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除
					}
					else if (errtype=="SaveGB28181")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsGb28181").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsGb28181").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveTime")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsTimeSystem").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsTimeSystem").html("");},5000);  //5秒后自动清除
					}
					else
					{
						szRetInfo = m_szErrorState + m_szError1;  //操作失败
					}
				}
				else if("220" == state) //IP地址错误
			    {
					szRetInfo = m_szErrorState + m_szError88;
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("221" == state) //IP扰码错误
			    {
					szRetInfo = m_szErrorState + m_szError100;
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("222" == state) //IP网关错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MDefaultGatewayErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("223" == state) //DNS地址错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MDNSErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("224" == state) //组播地址错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MMulticastErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("225" == state) //MTU参数错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MMTUErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("229" == state) //设备忙
			    {
					szRetInfo = m_szErrorState + m_szError7;
				}
				else if("231" == state) //用户被禁止登录
			    {
					if (!g_AskTips)
					{
						g_AskTips=true;
						alert(getNodeValue('MUserDisabled'));//用户被禁用
						$.cookie('page',null);
						$.cookie('UserNameLogin',null);
						$.cookie('authenticationinfo',null);
						$.cookie('menu_onemenu',null);
						$.cookie('menu_twomenu',null);
						top.location.href = "/"; 
						szRetInfo ="";
						return;
					}
					
				}
				else if("2508"==state){ //无存储卡
					$("#SearchVideotips").html(getNodeValue('Mnomemorycard'));
					setTimeout(function(){$("#SearchVideotips").html("");},5000);  //5秒后自动清除
					szRetInfo ="";
					return;
				}else if("2509"==state){
					alert(m_MFormattingTips)
					szRetInfo ="";
					return;
				}
			});
		}
		else
		{
			szRetInfo = m_szErrorState + m_ConnectTimeoutTips;
		}
		var szRetIco=$(obj).next("span").attr("id")
		$("#"+szRetIco).html(szRetInfo);
		setTimeout(function(){$("#"+szRetIco).html("");},5000);  //5秒后自动清除
	}
};

//返回错误
function ErrStateTips(xhr,obj,errtype){
	if(arguments.length > 0)
	{
		szXmlhttp = xhr;
	}
	szXmlhttp = xhr;
	//if(szXmlhttp.readyState == 4)
	{
		if(szXmlhttp.status == 403 || szXmlhttp.status == 400 || szXmlhttp.status == 503 || szXmlhttp.status == 500)
		{
		    var xmlDoc =szXmlhttp.responseText;
			var xmlDocstate = GetparseXmlFromStr(xmlDoc);
			$(xmlDocstate).find("statuscode").each(function(i){ 
		  	   var state= $(this).text();
			    if("0" == state  || "5" == state   )	//OK  5修改IP成功
			    {
					szRetInfo = m_szSuccessState+m_szSuccess1;
			    }
				else if ("201" == state) //未知错误
				{
					szRetInfo = m_szSuccessState+m_MUnknownerror;
				}
				else if ("202" == state || "203" == state || "204" == state) //无效的用户名或密码，请重新登录
				{
					if (errtype=="DelUser" || errtype=="EditUser")  //202  用户不存在,可能已被删除
					{
						alert(getNodeValue('jsUsernon'));//用户不存在,可能已被删除
						szRetInfo ="";
						$.modal.impl.close();
						GetUserLists();
					}
					else if(errtype=="EditPass")
					{
						szRetInfo = m_szErrorState + m_OldPassError;
					}
					else if(errtype=="GetAuthentication")
					{
						szRetInfo = m_szErrorState + getNodeValue('LoginTips6');//密码错误
						$("#spCheckResultTips").html(szRetInfo);
						setTimeout(function(){$("#spCheckResultTips").html("");},5000);  //5秒后自动清除
					}
					else
					{
						if (!g_AskTips)
						{
							g_AskTips=true;
								alert(getNodeValue('MUserPassErr'));
								$.cookie('page',null);
								$.cookie('UserNameLogin',null);
								$.cookie('authenticationinfo',null);
								$.cookie('menu_onemenu',null);
								$.cookie('menu_twomenu',null);
								top.location.href = "/"; 
								return;
						}
						
					}
				}
				else if("205" == state  ) //鉴权ID错误
			    {
					if (!g_AskTips)
					{
						g_AskTips=true;
						alert(getNodeValue('LoginConnectTimeoutTips'));//登录超时,请重新登录
						$.cookie('page',null);
						$.cookie('UserNameLogin',null);
						$.cookie('authenticationinfo',null);
						$.cookie('menu_onemenu',null);
						$.cookie('menu_twomenu',null);
						top.location.href = "/"; 
						return;
					}
				}
				else if("206" == state) //没有权限
			    {
					alert(getNodeValue('Mauthorization'));
					szRetInfo ="";
					return;
				}
				else if("207" == state) //IP限制
			    {
					if (!g_AskTips)
					{
						g_AskTips=true;
						alert(getNodeValue('MIPlimit'));
						$.cookie('page',null);
						$.cookie('UserNameLogin',null);
						$.cookie('authenticationinfo',null);
						$.cookie('menu_onemenu',null);
						$.cookie('menu_twomenu',null);
						top.location.href = "/"; 
						return;
					}
				}
				else if("208" == state) //旧密码错误
			    {
					szRetInfo = m_szErrorState + m_OldPassError;
				}
				else if("209" == state) //用户已存在
			    {
					szRetInfo = m_szErrorState + getNodeValue('jsUserexists');//用户已存在
					$("#UserAddOKTips").html(szRetInfo);
					setTimeout(function(){$("#UserAddOKTips").html("");},5000);  //5秒后自动清除
				}
				
				else if("210" == state) //此CGI请求不支持或请求的URL格式有问题
			    {
					szRetInfo = m_szErrorState + getNodeValue('MCGIerr');
				}
				else if("211" == state) //请求没有携带XML
			    {
					szRetInfo = m_szErrorState + getNodeValue('MNoXML');
				}
				else if("212" == state) //Error4 无效的XML格式
			    {
					szRetInfo = m_szErrorState + m_szError3;
				}
				else if("213" == state || "214" == state || "215" == state) //213 （请求的URL与XML内的根节点不匹配）214 CGI请求携带的XML中缺少必要的参数 215 XML中携带的参数过长
			    {
					//console.log("000")
				   szRetInfo = m_szErrorState + m_szError4;
				   if (errtype=="SaveIP")
				   {
					   szRetInfo = m_szErrorState + m_szError4;
					   $("#SetResultTipsIPTCP").html(szRetInfo);
					   setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				   }
				}
				else if("219" == state) //参数错误
			    {
					if (errtype=="SaveIP")
					{
						szRetInfo = m_szErrorState + m_szError1;
						$("#SetResultTipsIPTCP").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SavePort")
					{
						szRetInfo = m_szErrorState + getNodeValue('jsPortConflict'); //端口冲突,保存失败
						$("#SetResultTipsPost").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsPost").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveDevice")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsDeviceInfo").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsDeviceInfo").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveVsip")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsVSIP").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsVSIP").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveOnvif")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsOnvif").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除
					}
					else if (errtype=="SaveGB28181")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsGb28181").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsGb28181").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveTime")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultTipsTimeSystem").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsTimeSystem").html("");},5000);  //5秒后自动清除
					}
					else if(errtype=="SaveImages")
					{
						szRetInfo = m_szErrorState + m_szError1; 
						$("#SetResultImagsSettingsTips").html(szRetInfo);
						setTimeout(function(){$("#SetResultImagsSettingsTips").html("");},5000);  //5秒后自动清除
					}
					else
					{
						szRetInfo = m_szErrorState + m_szError1;  //操作失败
					}
				}
				else if("220" == state) //IP地址错误
			    {
					szRetInfo = m_szErrorState + m_szError88;
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("221" == state) //IP扰码错误
			    {
					szRetInfo = m_szErrorState + m_szError100;
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("222" == state) //IP网关错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MDefaultGatewayErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("223" == state) //DNS地址错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MDNSErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("224" == state) //组播地址错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MMulticastErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("225" == state) //MTU参数错误
			    {
					szRetInfo = m_szErrorState + getNodeValue('MMTUErr');
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
				else if("229" == state) //设备忙
			    {
					szRetInfo = m_szErrorState + m_szError7;
				}
				else if("231" == state)
				{
					if (!g_AskTips)
					{
						g_AskTips=true;
						alert(getNodeValue('MUserDisabled'));//用户被禁用
						$.cookie('page',null);
						$.cookie('UserNameLogin',null);
						$.cookie('authenticationinfo',null);
						$.cookie('menu_onemenu',null);
						$.cookie('menu_twomenu',null);
						top.location.href = "/"; 
						szRetInfo ="";
						return;
					}
				}
				else if("2508"==state){ //无存储卡
					$("#SearchVideotips").html(getNodeValue('Mnomemorycard'));
					setTimeout(function(){$("#SearchVideotips").html("");},5000);  //5秒后自动清除
					szRetInfo ="";
					return;
				}else if("2509"==state){
					alert(m_MFormattingTips)
					szRetInfo ="";
					return;
				}
			});
		}
		else
		{
			szRetInfo = m_szErrorState + m_ConnectTimeoutTips;
		}
		var szRetIco=$(obj).next("span").attr("id")
		$("#"+szRetIco).html(szRetInfo);
		setTimeout(function(){$("#"+szRetIco).html("");},5000);  //5秒后自动清除
	}
};


function addEvent(obj, name, func)
{
	if (m_PreviewOCX!=null){
		if (window.addEventListener) {
			obj.addEventListener(name, func, false); 
		} else {
			obj.attachEvent("on" + name, func);
		}
	}
	
}
        
function loadBackPlay(obj)
{
	addEvent(obj, 'fired', cbf)
}
function  cbf(a,b)
 {
	if (  (3 == a && "play_connectionlost" == b) // 浏览页面断链
   		 || (3 == a && "play_failed" == b) // 浏览页面播放失败
  		) 
	  {
		 if (typeof StopAll!="undefined")
		 {
			StopAll(1);
		 }
	  }
	  else if(3 == a && "play_start" == b)//开始播放回调
	  {
		 if (typeof StopAll!="undefined")
		 { 
		 	 StartRealPlay();
		 }
	  }
	  else if ("faild_localrec_diskfull" == b)
	  {
		  $("#divPreviewTips").html(parent.translator.translateNode(g_lxdPreview, 'Mdiskfull'));//磁盘满,录像结束
		  setTimeout(function(){$("#divPreviewTips").html("");},5000);  //5秒后自动清除
	  }
	  else if(a==0){
		 if (b=="stoprec"){ //停止放像
			 
			 StopPlay(1);
		 }
		 else if (b=="lostconnection"){
			 StopPlay(1);
			
		} 
	}
   

	
  
}	



//PTZ花样扫描停止扫描
function stopPTZscanpath(){
	var scanpath=$("#scanpath").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+'syncscan_stoprec'+"</ptzevent>";
	szXml += "<scanpath>"+scanpath+"</scanpath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		async:false,  //同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			$("#ClearScanPattern").attr('disabled',false)
			$("#PlayScanPattern").attr('disabled',false)
			$.cookie('syncscan_rec',null);   //停止记录
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//PTZ花样扫描停止预览
function stopPTZsyncscan(){
	var scanpath=$("#scanpath").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+'syncscan_stoppreview'+"</ptzevent>";
	szXml += "<scanpath>"+scanpath+"</scanpath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		async:false,  //同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 $("#StartScanPattern").attr('disabled',false)
			 $("#ClearScanPattern").attr('disabled',false)
			 $.cookie('syncscan_preview',null);   //停止预览
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
function logout(){
	 if (confirm(parent.translator.translateNode(g_lxdMain, 'jsexit'))){
		$.cookie('authenticationinfo',null);
		$.cookie('page',null);
		$.cookie('UserNameLogin',null)
		$.cookie('UserPassLogin',null);
		$.cookie('curpage',null);
		$.cookie('anonymous',null);
		$.cookie('VersionSession',null);
		top.location.href = "/";
	  }
};
