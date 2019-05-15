var g_lxdLogin = null; // Login.xml
function login(){
	var szLanguage = $.cookie('language');
	if (szLanguage === null) // 如果直接到登录界面，也获取一下语言
	{
		if (navigator.appName === "Netscape" || navigator.appName === "Opera")
		{
			var sysLanguage = navigator.language.toLowerCase();  //转换为小写
		}
		else
		{
			var sysLanguage = navigator.browserLanguage.toLowerCase();
		}
		szLanguage = sysLanguage.substring(0,2);
		if(szLanguage == "zh")  //中文需要区分简体和繁体
		{  
		   var arSysLan = sysLanguage.split("-");
		   if (arSysLan.length === 2) 
		   {
			   
			    if(arSysLan[1].toLowerCase() === "cn")
			    {
					szLanguage = "zh";
				}
				else if(arSysLan[1].toLowerCase() === "tw")
				{
					szLanguage = "zh";
				}
				else if(arSysLan[1].toLowerCase() === "hk")
				{
					szLanguage = "zh";
				}
		   }
		}
		else   //其它语言
		{
			$.cookie('language', szLanguage);
		}
		
	}
	translator.initLanguageSelect(szLanguage);
	g_lxdLogin = translator.getLanguageXmlDoc("login");
	translator.translatePage(g_lxdLogin, document);
	if (!(document.cookie || navigator.cookieEnabled))
    {
		alert(translator.translateNode(g_lxdLogin, "CookieTips"));
		return;
	}
	
	var userAgent = navigator.userAgent,  
	  rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
	  var browser; 
		var version; 
		var ua = userAgent.toLowerCase(); 
		function uaMatch(ua){ 
	  var match = rMsie.exec(ua); 
	  if(match != null){ 
		return { browser : "IE", version : match[2] || "0" }; 
	  } 
	  if (match != null) { 
		return { browser : "", version : "0" }; 
	  } 
	} 
	var browserMatch = uaMatch(userAgent.toLowerCase()); 
	if (browserMatch)
	{
		if (browserMatch.browser){ 
		  browser = browserMatch.browser; 
		  version = browserMatch.version; 
		 
		// alert(browser+"   "+version+"   "+typeof version)
		 if (version > 10   ){
		       //alert("不支持")
			   $("#isie").show().html(translator.translateNode(g_lxdLogin, "LoninIsie11"));	 
			}else if(version <= 6){
			  $("#isie").show().html(translator.translateNode(g_lxdLogin, "LoninIsie6"));
			}else{
			  $("#isie").hide()	
			}
	     }
	}
	
	loginEventBind();
	 $("#userdiv").addClass("inputfocus");
	$("#username").focus().val('');
	$("#password").addClass("inputblur")
	$.cookie('versionocx',null);
	
	$("#username").focus(function ()
	{
	  	$("#userdiv").addClass("inputfocus");
		$("#passdiv").removeClass("inputfocus");
	});
	
	$("#password").focus(function ()
	{
	  	$("#userdiv").removeClass("inputfocus");
		$("#passdiv").addClass("inputfocus");
	});
	
	initGetCap("anonym=true");//获取是否支持匿名登陆
	$.cookie('anonymous',null);
	$.cookie('UserNameLogin',null);
	$.cookie('UserPassLogin',null);
	$.cookie('authenticationinfo',null);
	//$.cookie('m_iPtzMode',null);
    //$.cookie('m_iPtzModetitle',null);
	$("#anonymous").val(false).prop("checked", false);
	$("#username").show();
	$("#password").show();
};
//获取鉴权ID
function DoLogin(obj){
	if ($("#anonymous").val()!="true"){
			if($("#username").val()==''){
				$("#err").html(m_szErrorState+getNodeValue("LoginTips1"))
				setTimeout(function(){$("#err").html("");},2500);
				$("#username").focus();
				return;
			}
			if($("#password").val() ==''){
				$("#err").html(m_szErrorState+getNodeValue("LoginTips5"))
				setTimeout(function(){$("#err").html("");},2500);
				$("#password").focus();
				return;
			}
			if(!CheckUserName($("#username").val()))
			{
				setTimeout(function(){$("#err").html("");},2500);
				$("#username").focus();
				return;
			}
			if(!CheckUserPassword($("#password").val()))
			{
				//$("#err").show().html("密码错误")
				setTimeout(function(){$("#err").html("");},2500); 
				$("#password").focus();
				return;
				
			}
	}
	
  var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/link/authenticationid";
	$.ajax({
		type: "get",
		url:szURL,
		async: false,  //同步
		//cache:false,  //不缓存
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromLogin(Docxml);
		    if($(xmlDoc).find("authenticationid").length > 0){
				$(xmlDoc).find("authenticationid").each(function(i){ 
					 authenticationid = $(this).text();
					 authenticationLogin();
					// $.cookie('authenticationid',authenticationid);
				});
			}
		},
		error: function(xhr, textStatus, errorThrown)
			{
			ErrStateLoginTips(xhr);
		}
	});
};
//是否支持匿名登陆
function initGetCap(obj){
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/getcap?"+obj
	$.ajax({
		type: "get",
		url:szURL,
		async: true,  //异步
		//cache:false,  //不缓存
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		     var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromLogin(Docxml);
		     if($(xmlDoc).find("anonym").length > 0){
				$(xmlDoc).find("anonym").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#subanonymous").hide();
					}else{
						$("#subanonymous").show();
					}
				});
			  }
		},
		error: function(xhr, textStatus, errorThrown)
			{
				$("#subanonymous").hide();
			}
	});
};

/**********************************
功能: 匿名登录
***********************************/
function anonymous(obj){
	if($(obj).prop("checked")){
		    $("#anonymous").val(true).prop("checked", true);
			$("#username").val('').hide();;
			$("#password").val('').hide();
			$(".LoginInputDiv").addClass('LoginAnonymous').removeClass("inputfocus");
		}else{
			$("#anonymous").val(false).prop("checked", false);
			$("#username").show();
			$("#password").show();
			$(".LoginInputDiv").removeClass("LoginAnonymous");
		}
}
/**********************************
功能: 按回车键登录
***********************************/
document.onkeydown=function (event) 
{
	event = event?event:(window.event?window.event:null);	 
	 if(event.keyCode==13)
	{
		DoLogin(); 
	}
}
/****
登录
***/
function authenticationLogin(){
		
	//initGetCapPTZ("ptz=true");
	//m_szPwdValue = Base64.encode($('#password').val());
	var authentipassword = $("#username").val()+","+$("#password").val()+","+authenticationid;
		authentipassword = Base64.encode(hex_md5(authentipassword));
		var authenticationinfo = '<authenticationinfo type="7.0">';
			authenticationinfo += "<username>"+$("#username").val()+"</username>";
			authenticationinfo += "<password>"+authentipassword+"</password>";
			authenticationinfo += "<authenticationid>"+authenticationid+"</authenticationid>";
			authenticationinfo += "</authenticationinfo>";
    var szXml = "<loginparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	//szXml += authenticationinfo;
 	szXml += "</loginparam>";
	 $.cookie('authenticationinfo', authenticationinfo);
	var xmlDoc = parseXmlFromLogin(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/login"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		cache:false,  //不缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromLogin(Docxml);
			//alert("aa"+xhr.status) 200
			　if (xhr.readyState == 4) {
		　　			if (xhr.status == 200) {
			
			          
		                $.cookie('page',null);
						$.cookie('menu_onemenu',null);
						$.cookie('menu_twomenu',null);
						$.cookie('UserNameLogin', $("#username").val());
						$.cookie('UserPassLogin', $("#password").val());
		                $.cookie('authenticationinfo', authenticationinfo);
						if ($("#anonymous").val()=="true"){
							$.cookie('authenticationinfo', '');
							$.cookie('anonymous',"anonymous");
							/*if ($.cookie('m_iPtzModetitle')=="false")
							{
								$.cookie('m_iPtzMode',1);
							}*/
						}
						//console.log(authenticationinfo)
					//	window.location.href = "view/main.htm";
					window.location.replace("view/main.htm");
		　　			} else {
						$("#err").html(m_szErrorState+getNodeValue("LoginTips4"))
						setTimeout(function(){$("#err").html("");},2500);
						$.cookie('UserNameLogin', null);
						$.cookie('authenticationinfo', null);
		　　			}
		　　		}
			
		},
		error: function(xhr, textStatus, errorThrown)
		{
			ErrStateLoginTips(xhr);
		}
	});
};

function parseXmlFromLogin(szXml){
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
};

function GetparseXmlFromLogin(szXml){
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
};
/*************************************************
Function:		ErrStateLoginTips
Description:	错误码状态提示
Input:			xhr  XMLHttpRequest 对象		
Output:			无
return:			无				
*************************************************/
function ErrStateLoginTips(xhr){
	
	if(arguments.length > 0)
	{
		szXmlhttp = xhr;
	}
	szXmlhttp = xhr;
	{
		if(szXmlhttp.status == 403 || szXmlhttp.status == 400 || szXmlhttp.status == 503 || szXmlhttp.status == 500)
		{
		    var xmlDoc =szXmlhttp.responseText;
			var xmlDocstate = GetparseXmlFromLogin(xmlDoc);
			$(xmlDocstate).find("statuscode").each(function(i){ 
		  	   var state= $(this).text();
			   if("202"==state || "204"==state  || "205"==state  )  //202用户名不存在 204 密码错误 205鉴权ID错误
			    {
					szRetInfo = m_szErrorState+getNodeValue('LoginTips8');
			    }
				else if("207"==state) //207 IP限制
				{
					szRetInfo = m_szErrorState+getNodeValue('LoginTips7');
				}
				else if("231"==state) //231 用户禁用登录
				{
					szRetInfo = m_szErrorState+getNodeValue('LoginTips9');
				}
			});
		}
		else
		{
			szRetInfo = m_szErrorState + getNodeValue('ConnectTimeoutTips');
		}
		
		$("#err").html(szRetInfo);
		setTimeout(function(){$("#err").html("");},5000);  //5秒后自动清除
	}
}
