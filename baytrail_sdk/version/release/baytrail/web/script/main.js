//var connectid="";  //保活ID
var g_lxdMain = null;
var UserNameLogin = $.cookie('UserNameLogin');
var m_anonymous=$.cookie('anonymous');
var softversion="";
//$.cookie('UserNameLogin');
//$.cookie('versionocx')=null 没装插件
 
function Load_main(){
	 if (m_anonymous!="anonymous")//不是匿名
	 {  
		if (UserNameLogin==null || UserNameLogin=="" )
		{
			top.location.href = "/";
			return;
		}else{
			$("#username").html(UserNameLogin)
		}
	}else{
		$("#username").html("anonym");
		$.cookie('page',null);
		window.parent.ChangeMenu(1);
	}
	 
	 $(window).bind("resize", function()
	{
		if($("#contentframe").attr("src").indexOf("viewer") != "-1")
		{
			var curWnd = document.getElementById('contentframe').contentWindow;
			//console.log(curWnd+"    "+curWnd.m_iWndType)
			if(curWnd.m_iWndType == 0)
			{
				curWnd.autoSize();
			}
		}
		if($("#contentframe").attr("src").indexOf("playback") != "-1")
		{
			var curWnd = document.getElementById('contentframe').contentWindow;
				curWnd.playautoSize();
		}
		
	});
	LatestPage();
	initMainGetCap("rec=true&picmanager=true");//是否支持录像回放和图片管理 
	mainEventBind();
    pluginmain();
	initDeviceInfo();
 };

function initDeviceInfo(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/deviceinfo"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			$("#maindevicetype").html($(xmlDoc).find('devicetype').eq(0).text() );//设备型号
			softversion=$(xmlDoc).find('softversion').eq(0).text();//软件版本号
			$("#softversion").html(softversion);
		},error: function(xhr, textStatus, errorThrown)
			{
				//ErrStateTips(xhr);
			}
	});
};

function initMainGetCap(obj){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/getcap?"+obj
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			
			if (m_anonymous=="anonymous"){
				 $("#iMenu2").hide();
				 $("#iMenu3").hide();
				 $("#iMenu4").hide();
			 }
			 else{
				 //录像回放
				if($(xmlDoc).find("rec").length > 0){
					$(xmlDoc).find("rec").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#iMenu2").hide();
						}
						else{
							$("#iMenu2").show();
						}
					});
				}
				//图片管理
				if($(xmlDoc).find("picmanager").length > 0){
					$(xmlDoc).find("picmanager").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#iMenu3").hide();
						}
						else{
							$("#iMenu3").show();
						}
					
					});
				} 
			 }
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
	});
};
//关闭升级弹出窗口，
function UpgradeCloseclose(obj){
	
   if (obj=="upgrade"){
	    $.modal.impl.close();
		$.cookie('page',null);
		$.cookie('versionocx',null);
		$.cookie('VersionSession',null);
		$.cookie('UserNameLogin',null);
		$.cookie('UserPassLogin',null);
		$.cookie('authenticationinfo',null);
		$.cookie('menu_onemenu',null);
		$.cookie('menu_twomenu',null);
		//top.location.href = "/";
	    parent.location.reload(true);//关闭后刷新下页面
		window.location.href = "/";
		window.location.reload(true);
	  }
	   else if(obj=="systemreboot"){//导入
		mainsystemreboot();
	  }
	  else if(obj=="ptz"){
		$.modal.impl.close(); 
	 }
	 };

/*************************************************
Function:		systemreboot
Description:	重启系统
Input:			无			
Output:			无
return:			无				
*************************************************/
function mainsystemreboot(){
		var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/system/reboot"
		$.ajax({
			type: "post",
			url:szURL,
			processData: false,//不转换
		    data: xmlDoc,
			timeout: 15000,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
			},
			success: function(xmlDoc, textStatus, xhr)
			{
				    $.modal.impl.close();
					$.cookie('page',null);
					$.cookie('versionocx',null);
					$.cookie('VersionSession',null);
					$.cookie('UserNameLogin',null);
					$.cookie('UserPassLogin',null);
					$.cookie('authenticationinfo',null);
					$.cookie('menu_onemenu',null);
					$.cookie('menu_twomenu',null);
					top.location.href = "/";
			   
			}
		});
};


function pluginmain(){
     if(document.all)
	   {
			document.getElementById("ipcocx").innerHTML ='<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="IpcCtrl"  width="0" height="0" ></object>';
		   }
	   else
		   {
			document.getElementById("ipcocx").innerHTML = '<embed type="application/x-ipcwebui" id = "IpcCtrl" width="0" height="0"  ></embed>';
		}
		if (document.getElementById('IpcCtrl'))  
		{
			if (typeof (document.getElementById('IpcCtrl').eventWebToPlugin)!="undefined")
			{
				document.getElementById('IpcCtrl').eventWebToPlugin("changelanguage",$.cookie("language"));
			}
		}
	  
};


/*************************************************
Function:		LastPage
Description:	主页面加载时，获取cookie，跳转到刷新前的界面
Input:			无
Output:			无
return:			无				
*************************************************/
function LatestPage()
{
	var szLanguage = $.cookie('language');
	if (szLanguage === null ||  szLanguage==='' ) // 如果直接到登录界面，也获取一下语言
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
	var lxd = translator.getLanguageXmlDoc("main");
	translator.translatePage($(lxd).children("Main")[0], parent.document);
	g_lxdMain = $(lxd).children("Common")[0];
	translator.translateElements(g_lxdMain, $("#dvChangeSize")[0], "span", "title");
	
	var curpage = $.cookie('page');
	
	if(null == curpage)
	{
		ChangeFrame("../view/viewer.htm",1);
	}else
	{  
		ChangeFrame(curpage.split("%")[0],curpage.split("%")[1]);
	}
	//console.log(curpage)
	//autoResizeIframe1()
}
/*************************************************
Function:		ChangeMenu
Description:	改变主页菜单栏
Input:			index:ID序号
Output:			无
return:			无				
*************************************************/
function ChangeMenu(index)
{
	for(var i = 1;i < 6;i++)
	{
		if($("#iMenu"+i).hasClass("menuground"))
		{
			$("#iMenu"+i).removeClass("menuground");
		}
	}
	$("#iMenu"+index).addClass("menuground");
}

/*************************************************
Function:		ChangeFrame
Description:	主页面加载时，获取cookie，跳转到刷新前的界面
Input:			src:页面路径
				index:ID序号
Output:			无
return:			无				
*************************************************/
function ChangeFrame(src,index) {
	
		if ($.cookie('authenticationinfo')==null ||  $.cookie('authenticationinfo')=='')
		{
			if ($.cookie('anonymous')!="anonymous")
			{
				alert(getNodeValue('LoginConnectTimeoutTips'));//登录超时,请重新登录
				top.location.href = "/";
				return;
			}
		}
		$("#content").html('<iframe frameborder="0" scrolling="no" id="contentframe" name="contentframe" class="contentframe" src="'+src+"?"+ (new Date()).getTime() +'"></iframe>');
}


/*************************************************
Function:		autoResizeIframe
Description:	配置页面高度自适应
Input:			无
				无
Output:			无
return:			无				
*************************************************/
function autoResizeIframe()
{
	
	
	if($("#EditAreaContent").height() > 616)
	{  
		window.parent.document.getElementById('content').style.height = $("#contentright").height() + 86 + "px";
		window.parent.document.getElementById('contentframe').style.height =  $("#EditAreaContent").height() + 50 + "px";
		
		//var th1=$("#contentleft").height();
		var th2=$("#contentright").height()
		//th1=th2;
		$("#contentleft").height(th2)
		$("#contentright").height(th2)
	}
	else
	{   
	  
		window.parent.document.getElementById('content').style.height = 655 + "px";
		window.parent.document.getElementById('contentframe').style.height =  619 + "px";				
		
		$("#contentleft").height(616)
		$("#contentright").height(616)
	}
}


/*************************************************
Function:		ChangeFrameLanguage
Description:	改变页面语言
Input:			lan:语言
Output:			无
return:			无				
*************************************************/
function ChangeFrameLanguage(lan)
{
	$.cookie('language', lan);
	var lxd = translator.getLanguageXmlDoc("main", lan);
	translator.translatePage($(lxd).children("Main")[0], parent.document);
	g_lxdMain = $(lxd).children("Common")[0];
	//translator.translateElements(g_lxdMain, $("#dvChangeSize")[0], "span", "title");
	var curWnd = document.getElementById('contentframe').contentWindow;
	//document.getElementById('IpcCtrl').eventWebToPlugin("changelanguage",lan);
	curWnd.ChangeLanguage(lan);
	if (document.getElementById('IpcCtrl'))  
	{
		if (typeof (document.getElementById('IpcCtrl').eventWebToPlugin)!="undefined")
		{
			document.getElementById('IpcCtrl').eventWebToPlugin("changelanguage",lan);
		}
	}
	
	
}
//兼容IE9以下格式化时间
function NewDate(str) { 
  str = str.split('-'); 
  var date = new Date(str); 
  date.setUTCFullYear(str[0], str[1] - 1, str[2]); 
  date.setUTCHours(0, 0, 0, 0); 
  return date; 
 }
/*************************************************
Function:		mainEventBind
Description:	事件绑定
Input:			无
Output:			无
return:			无				
*************************************************/
function mainEventBind() {
    //点击语言选择框
	//maindevicetype
	
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

	//点击语言选择框和帮助以为的地方
    $("body").bind({
	    click: function (e) {
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			}
			if($("#SoftwareEdition").css("display") !== "none") {
				$("#SoftwareEdition").hide();
			}
			if(window.frames["contentframe"]){
				var ulmode = window.frames["contentframe"].document.getElementById("ulmode")
				if (ulmode)  
				{
					if($("#contentframe")[0].contentWindow.$("#ulmode").css("display") !== "none") {
						$("#contentframe")[0].contentWindow.$("#ulmode").hide();
					}
				}
			}
		}
	});
	
	 //点关于
	$(".about").bind({
	    click: function (e){
			var str = $("#WebVersion1").html();
			var PluginVersion="",v1="",p1="";
			e.stopPropagation();
			if($("#SoftwareEdition").css("display") !== "none") 
			{
				$('#SoftwareEdition').hide();
			} 
			else 
			{
				if (typeof (top.document.getElementById("IpcCtrl").getPluginVersion)!="undefined")
				{
					PluginVersion=top.document.getElementById("IpcCtrl").getPluginVersion();
					 v1=PluginVersion.substring(PluginVersion.indexOf("(")+1,PluginVersion.indexOf(")"))
					 p1 = /\(.*?\)/g;
				}
				var softversion1=softversion.substring(softversion.indexOf(" "));
				var softversion2=softversion.split(" ");
				if ($.cookie('language')=="zh")
				{
					$("#WebVersion").html(new Date(NewDate(str)).Format("yyyy-MM-dd"));
					$("#PluginWeb").html(PluginVersion.replace(p1, "("+new Date(NewDate(v1)).Format("yyyy-MM-dd")+")"));
					$("#softversion").html(softversion2[0]+" "+new Date(softversion1).Format("yyyy-MM-dd"));
				}
				else
				{
					$("#WebVersion").html(new Date(NewDate(str)).Format("dd-MM-yyyy"));
					$("#PluginWeb").html(PluginVersion.replace(p1, "("+new Date(NewDate(v1)).Format("dd-MM-yyyy")+")"))
					$("#softversion").html(softversion2[0]+" "+new Date(softversion1).Format("dd-MM-yyyy"));
				}
				$('#SoftwareEdition').show();
			}
		}
	});	
}
function help(){
	var HelpPath="../help/"+$.cookie('language')+"/index.htm";
	window.open(HelpPath, "newhelp", "height=600, width=530, top=0,left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no")
}

//关闭弹出窗口
function Closevideodownload(){
	 $("#contentframe")[0].contentWindow.$("#downloadplugin").width("100%").height("100%");
	$.modal.impl.close(); 
};
