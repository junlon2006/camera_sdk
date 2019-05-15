var g_oCurrentTab = null;
var g_oMenu = null; // 菜单对象
var m_roi="false";      //是否支持ROI
var m_encclip="false";  //是否支持编码编码裁剪
var m_TimerCoordinate = null; //PTZ定位坐标定时获取
var m_FormattingTimerID=null;  //格式化中 
var k_Gb28181=null;
var m_vsip=false,m_onvif=false,m_gb28181=false,g_Protocol = false;
// 此对象用来优化基本设置与高级设置菜单之间切换的速度
// 还需进一步测试，
var g_menuRecorder = {
	szCurMenu: "LocalConfig",
	szCurMainMenu: null,
	szLastMenu: null,
	szLastMainMenu: null
}
$.ajaxSetup({timeout: 15000});  //默认超时时间为15秒
var g_lxdParamConfig = null; // paramconfig.xml
var SearchID="";  //切换页面发送停止图片查询请求

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
		
		window.parent.document.getElementById('content').style.height = $("#EditAreaContent").height() + 86 + "px";
		window.parent.document.getElementById('contentframe').style.height =  $("#EditAreaContent").height() + 50 + "px";
		
		//window.parent.document.getElementById('maindevicetype').style.width=
		
		parent.$("#header").width("100%");
		parent.$("#head_top").width(960);
		parent.$("#maindevicetype").width(960)
		parent.$("#content").width(960);
		var th1=$("#contentleft").height();
		var th2=$("#EditAreaContent").height()
		$("#contentleft").height(th2)
		$("#contentright").height(th2)
	}
	else
	{   
		parent.$("#header").width("100%");
		parent.$("#head_top").width(960);
		parent.$("#maindevicetype").width(960);	
		parent.$("#content").width(960);	
		window.parent.document.getElementById('content').style.height = 655 + "px";
		window.parent.document.getElementById('contentframe').style.height =  628 + "px";
		parent.$("#maindevicetype").width(960)				
		$("#contentleft").height(616)
		$("#contentright").height(616)
	}
}
/*************************************************
Function:		InitInterConfigface
Description:	初始化配置页面
Input:			无
				无
Output:			无
return:			无				
*************************************************/
function InitInterConfigface()
{
	//Plugin();
	
	if (m_PreviewOCX!=null){
		top.parent.$("#PluginWeb").html(top.document.getElementById("IpcCtrl").getPluginVersion())
	}
	//记录菜单cookie置为空
	$.cookie('page',null);

	//选中菜单
	window.parent.ChangeMenu(4);
	/*
	ptz=true  //是否支持PTZ功能
	event=true  //是否支持视频分析功能
	exception=true  //是否支持异常联动功能
	storage=true //是否支持存储
	image          是否支持图像功能
	
	alarmin  >0 报警输入
	alarmout >0 报警输出
	IP地址 ipaddr
	videosourcenum  视频
	mtcf   //高级性能
	*/
	//rs232
	//rs485
	initConfigGetCap("ptz=true&event=true&storage=true&image=true&alarmin=true&alarmout=true&ipaddr=true&osd=true&videosourcenum=true&audio=true&exception=true&rs232=true&rs485=true&vsip=true&onvif=true&gb28181=true");
	 //ChangeLanguage(parent.translator.szCurLanguage);
	//合并语言资源
	ChangeLanguage(parent.translator.szCurLanguage, false);
	
	//初始化菜单树
	g_oMenu = $("#menu").Menu({defaultCur : "0_0"});   //默认选中的菜单

	//$("#menu").width(962)
	//window.parent.document.getElementById("menu").style.width=962+"px";
	//console.log(parent.$("#header").width())
	parent.$("#menu").width(960);
	parent.$("#head_top").width(960);
	//window.parent.document.getElementById("head_top").style.width=962+"px";
	
	/*if(!window.parent.g_bIsIPDome)
	{
		g_oMenu.hide("2_3");
	}*/
	
}

function JumpProtocol(obj)
{
    if (obj=="tcpip")
	{
		if (g_Protocol==true)
		{
			if(m_vsip==true)
			{
				$("#aAccessProtocol").click();
				$.cookie('tabAccessProtocol_curTab','0');
				showmenuconfig("AccessProtocol","0","FastSetConfig","vsipup");
			}
			else if(m_onvif==true)
			{
				$("#aAccessProtocol").click();
				$.cookie('tabAccessProtocol_curTab','1');
				showmenuconfig("AccessProtocol","0","FastSetConfig","onvifup");
			}
			else if (m_gb28181==true)
			{
				$("#aAccessProtocol").click();
				$.cookie('tabAccessProtocol_curTab','2');
				showmenuconfig("AccessProtocol","0","FastSetConfig","gbup");
			}
		}
		else
		{
			$("#aDeviceInformation").click();
			showmenuconfig("deviceinfo","0","FastSetConfig");
		}
		
	}
	else if (obj=="vsip")
	{
		if (m_onvif==true)
		{
			$("#mOnvif").click();
			ia(Onvif).update();
		}
		else if (m_gb28181==true)
		{
			$("#mGB28181").click();
			ia(GB28181).update();
		}
		else
		{
			$("#aDeviceInformation").click();
			showmenuconfig("deviceinfo","0","FastSetConfig");
		}
		
	}
	else if(obj=="onvif")
	{
		
		if (k_Gb28181>0)
		{
			$("#mGB28181").click();
			ia(GB28181).update();
		}
		else
		{
			$("#aDeviceInformation").click();
			showmenuconfig("deviceinfo","0","FastSetConfig")
		}
	}
	else if(obj=="gb28181")
	{
		$("#aDeviceInformation").click();
		showmenuconfig("deviceinfo","0","FastSetConfig")
	}
	else if (obj=="deviceinfo")
	{
		$("#aDateTime").click();
		showmenuconfig("TimeSet","0","FastSetConfig")
	}
}


/*************************************************
  Function:    	showmenuconfig
  Description:	树中节点选择并跳转不同页面
  Input:        szMenu:子菜单名
  				iMode:0获取 1设置
  				szMainMenu:主菜单名
  Output:      	无
  Return:		无
*************************************************/
function showmenuconfig(szMenu, iMode, szMainMenu ,fastTab)
{
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	
	if (SearchID!=''){
		stoppicquery();
	}
	
	if (m_TimerCoordinate!=null){
		clearInterval(m_TimerCoordinate);
	}
	if (m_FormattingTimerID!=null){
		clearInterval(m_FormattingTimerID);
	}
	
	if (iMode == 0)
	{
		//console.log("如果等于0到这里")
		
		//g_menuRecorder.szCurMenu = szMenu;
		//g_menuRecorder.szCurMainMenu = szMainMenu;
	}
	switch ((iMode == 0) ? (szMenu + ":get") : (g_menuRecorder.szCurMenu + ":set"))
	{
		
		case "LocalConfig:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			$.ajax({
				url: "params/localconfig.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					g_oCurrentTab = $(".tabs").tabs(".pane", {markCurrent: false});
					pr(LocalConfig).initCSS();
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
					autoResizeIframe();
				}
			});
			break;
		}
		
		/*********快速设置开始**************/
		 /************TCPIP开始****************/
	   case "IPAddress:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "FastSetConfig")
				{
					//TCPIP.hideTabs([1]);
					//TCPIP.tabs.hideTabs([0]);
				} else {
					//TCPIP.tabs.hideTabs([0]);
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/tcpip.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					$("#EditAreaContent").html(msg);
					
					$("#IPTCPJump").show();
					$("#IPTCPdown").show();
					$("#SaveIPTCP").hide();
					if (szMainMenu === "FastSetConfig") 
					{
						TCPIP.tabs = $("#tabTCPIP").tabs(".pane", {beforeLeave:TCPIP.beforeLeave, hideIndexes:[1]});
					} 
					else 
					{
						TCPIP.tabs = $("#tabTCPIP").tabs(".pane", {beforeLeave:TCPIP.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}	
		
		
		/************TCPIP结束***************/
		
			 /************接入协议开始****************/
		case "AccessProtocol:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "FastSetConfig")
				{
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			
			//StopRealPlay()();
			$.ajax({
				url: "params/accessprotocol.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					$("#EditAreaContent").html(msg);
					//initConfigGetCap("gb28181=true&vsip=true&onvif=true");//获取国标能力集
					
					var szXml = "<contentroot>";
							szXml +=$.cookie('authenticationinfo');
							szXml += "</contentroot>";
							var xmlDoc = GetparseXmlFromStr(szXml);
							var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/getcap?gb28181=true&vsip=true&onvif=true"
						$.ajax({
							type: "post",
							url:szURL,
							processData: false,//不转换
							data: xmlDoc,
							timeout: 15000,
							beforeSend: function(xhr) {
								xhr.setRequestHeader("If-Modified-Since", "0");
							},success: function(xmlDoc, textStatus, xhr){
								
								//VSIP
								var Docxml =xhr.responseText;
		    					 var xmlDoc = GetparseXmlFromStr(Docxml);
									if($(xmlDoc).find("vsip").length > 0){
										$(xmlDoc).find("vsip").each(function(i){ 
										   if($(this).text()=="true")
											{
												m_vsip=true;
												g_Protocol=true;
											}
										});
									}
									//onvif
									if($(xmlDoc).find("onvif").length > 0){
										$(xmlDoc).find("onvif").each(function(i){ 
										   if($(this).text()=="true")
											{
												//AccessProtocol.tabs.hideTab(1);
												m_onvif=true;
												g_Protocol=true;
											}
											
										});
									}
									//GB28181
									if($(xmlDoc).find("gb28181").length > 0){
										$(xmlDoc).find("gb28181").each(function(i){ 
										   k_Gb28181=$(this).text();
										   if (k_Gb28181 > 0)
										   {
											   m_gb28181=true;
											   g_Protocol=true;
										   }
										});
									}
									
									if (g_Protocol!=true)
									{
										$("#aAccessProtocol").hide();
										$("#SubNetWork").find($("[id='aAccessProtocol']")).hide();
									}
							   $("#SaveVSIP").hide();
							$("#SaveOnvif").hide();
							$("#SaveGb28181").hide();
							if (szMainMenu === "FastSetConfig") 
							{
								
								if (m_vsip==false)
								{
									$("#mVSIP").hide();
								}
								if (m_onvif==false)
								{
									$("#mOnvif").hide();
								}
								if (m_gb28181==false)
								{
									$("#mGB28181").hide();
								}
								
								
								if(fastTab==="gbup")
								{
									g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 2});
								}
								else if(fastTab==="onvifup")
								{
									g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 1});
								}
								else if(fastTab==="vsipup")
								{
									g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 0});
								}
								else if(typeof fastTab=="undefined")
								{
									//g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 2});
									if (m_vsip==true)
									{
										$.cookie('tabAccessProtocol_curTab','0');
										g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane",{defaultCur: 0});
									}
									else if(m_onvif==true)
									{
										$.cookie('tabAccessProtocol_curTab','1');
										g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 1});
									}
									else if(m_gb28181==true)
									{
										$.cookie('tabAccessProtocol_curTab','2');
										g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 2});
									}
								}
								
								
							} 
							else 
							{
								g_oCurrentTab.tabs = $("#tabAccessProtocol").tabs(".pane", {beforeLeave:AccessProtocol.beforeLeave});
							}	
							g_menuRecorder.szLastMenu = szMenu;
							g_menuRecorder.szLastMainMenu = szMainMenu;
							},error: function(xhr, textStatus, errorThrown)
							{
								ErrStateTips(xhr);
							}
						});
					

					
					
				}
			});
			break;
		}
		
		
		/************接入协议结束***************/
		
		
		case "deviceinfo:get":
		{
			
			if (g_menuRecorder.szLastMenu === szMenu)
			{
				//console.log(szMainMenu)
				
				if (szMainMenu === "FastSetConfig")
				{
					//System.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
				
			}
			//StopRealPlay()();
			//HWP.destory();
			//top.document.getElementById("IpcCtrl").stopVideo();
			$.ajax({
				url: "params/system.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					
					$("#SaveDeviceInfo").hide();
					$("#Jumpsave").show();
					$("#deviceinfoup").show();
					$("#TimeSystemsucc").show();
					if (szMainMenu === "FastSetConfig") 
					{
						//System.tabs = $("#tabSystem").tabs(".pane", {beforeLeave:System.beforeLeave, hideIndexes:[1]});
						g_oCurrentTab = $("#tabSystem").tabs(".pane",{defaultCur: 0});
					} 
					else 
					{
						System.tabs = $("#tabSystem").tabs(".pane", {beforeLeave:System.beforeLeave});
						
					}			
					
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
					//initNetwork();
				}
			});
			break;
		}
		
		/************OSD设置结束***************/
		
		
		 /************时间设置开始****************/
		
		
		case "TimeSet:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "FastSetConfig")
				{
					//TimeSystem.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/timesystem.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					$("#SaveTimeSystem").hide();
					$("#TimeSystemup").show();
					$("#TimeSystemsucc").show();
					if (szMainMenu === "SystemConfig") 
					{
						TimeSystem.tabs = $("#tabTimeSystem").tabs(".pane", {beforeLeave:TimeSystem.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						TimeSystem.tabs = $("#tabTimeSystem").tabs(".pane", {beforeLeave:TimeSystem.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		/************时间设置结束***************/
		
		
		/*********快速设置结束**************/
		/*********网络开始**************/
		case "TCPIPpost:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "NetWorkConfig")
				
				{
					//TCPIP.hideTabs([]);
					//TCPIP.tabs.showTabs([1]);
				} else {
					//TCPIP.tabs.showTabs([1]);
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/tcpip.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					//Storage.tabs = $("#tabStorage").tabs(".pane", {defaultCur: 0});
					$("#IPTCPJump").hide();
					$("#IPTCPdown").hide();
					$("#SaveIPTCP").show();
					//wireless 是否支持无线
					initConfigGetCap("wireless=true");
					if (szMainMenu === "NetWorkConfig") 
					{
						TCPIP.tabs = $("#tabTCPIP").tabs(".pane", {beforeLeave:TCPIP.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						TCPIP.tabs = $("#tabTCPIP").tabs(".pane", {beforeLeave:TCPIP.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "AccessProtocolNet:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "NetWorkConfig")
				{
					//AccessProtocol.hideTabs([5, 6]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/accessprotocol.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					
					var szXml = "<contentroot>";
							szXml +=$.cookie('authenticationinfo');
							szXml += "</contentroot>";
							var xmlDoc = GetparseXmlFromStr(szXml);
							var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/getcap?gb28181=true&vsip=true&onvif=true"
						$.ajax({
							type: "post",
							url:szURL,
							processData: false,//不转换
							data: xmlDoc,
							timeout: 15000,
							beforeSend: function(xhr) {
								xhr.setRequestHeader("If-Modified-Since", "0");
							},success: function(xmlDoc, textStatus, xhr){
								
								//VSIP
								var Docxml =xhr.responseText;
		    					 var xmlDoc = GetparseXmlFromStr(Docxml);
									if($(xmlDoc).find("vsip").length > 0){
										$(xmlDoc).find("vsip").each(function(i){ 
										   if($(this).text()=="true")
											{
												m_vsip=true;
												g_Protocol=true;
											}
										});
									}
									//onvif
									if($(xmlDoc).find("onvif").length > 0){
										$(xmlDoc).find("onvif").each(function(i){ 
										   if($(this).text()=="true")
											{
												//AccessProtocol.tabs.hideTab(1);
												m_onvif=true;
												g_Protocol=true;
											}
											
										});
									}
									//GB28181
									if($(xmlDoc).find("gb28181").length > 0){
										$(xmlDoc).find("gb28181").each(function(i){ 
										   k_Gb28181=$(this).text();
										   if (k_Gb28181 > 0)
										   {
											   m_gb28181=true;
											   g_Protocol=true;
										   }
										});
									}
									
									if (g_Protocol!=true)
									{
										$("#aAccessProtocol").hide();
										$("#SubNetWork").find($("[id='aAccessProtocol']")).hide();
									}
							   $("#SaveVSIP").hide();
							   $("#SaveOnvif").hide();
							  $("#SaveGb28181").hide();
							if (m_vsip==false)
							{
								$("#mVSIP").hide();
							}
							if (m_onvif==false)
							{
								$("#mOnvif").hide();
							}
							if (m_gb28181==false)
							{
								$("#mGB28181").hide();
							}
								
							
							$("#SaveVSIP").show();
							$("#vsipJump").hide();
							$("#vsipup").hide();
							$("#vsipdown").hide();
							
							$("#SaveOnvif").show();
							$("#jumponvif").hide();
							$("#Onvifup").hide();
							$("#Onvifdown").hide();
							
							$("#SaveGb28181").show();
							$("#Junmgb").hide();
							$("#gbup").hide();
							$("#gbdown").hide();
							
							
							
							//initConfigGetCap("gb28181=true&vsip=true&onvif=true");//获取国标能力集
							if (szMainMenu === "NetWorkConfig") 
							{
								//AccessProtocol.tabs = $("#tabAccessProtocol").tabs(".pane", {beforeLeave:AccessProtocol.beforeLeave});
								if (m_vsip==true)
								{
									$.cookie('tabAccessProtocol_curTab','0');
									g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane",{defaultCur: 0});
								}
								else if(m_onvif==true)
								{
									$.cookie('tabAccessProtocol_curTab','1');
									g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 1});
								}
								else if(m_gb28181==true)
								{
									$.cookie('tabAccessProtocol_curTab','2');
									g_oCurrentTab = $("#tabAccessProtocol").tabs(".pane", {defaultCur: 2});
								}
							} 
							else 
							{
								AccessProtocol.tabs = $("#tabAccessProtocol").tabs(".pane", {beforeLeave:AccessProtocol.beforeLeave});
							}	
							
							
							
							
							g_menuRecorder.szLastMenu = szMenu;
							g_menuRecorder.szLastMainMenu = szMainMenu;
							},error: function(xhr, textStatus, errorThrown)
							{
								ErrStateTips(xhr);
							}
						});
					
					
					
					
					
				}
			});
			break;
		}
		<!---其它协议--->
		case "OtherProtocol:get":
		{
			
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "NetWorkConfig")
				{
				//	Network.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			
			$.ajax({
				url: "params/network.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					//DDNS，ddns;PPPoE,pppoe;KSNMP,ksnmp;8021X,8021x;Qos,qos, UPnP,upnp; dpss 
					initConfigGetCap("ddns=true&pppoe=true&ksnmp=true&_8021x=true&qos=true&upnp=true&dpss=true");//获取视频能力集
					
					if (szMainMenu === "NetWorkConfig") 
					{
						Network.tabs = $("#tabNetwork").tabs(".pane", {beforeLeave:Network.beforeLeave, hideIndexes:[ ]});
					} 
					else 
					{
						Network.tabs = $("#tabNetwork").tabs(".pane", {beforeLeave:Network.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		

		
		/*********网络结束**************/
		
		/*********摄像机开始**************/
		 case "ImagsSettings:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "VideoConfig")
				{
					//ImagsSettings.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/imagssettings.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					//Storage.tabs = $("#tabStorage").tabs(".pane", {defaultCur: 0});
					
					
					if (szMainMenu === "VideoConfig") 
					{
						ImagsSettings.tabs = $("#tabImagsSettings").tabs(".pane", {beforeLeave:ImagsSettings.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						ImagsSettings.tabs = $("#tabImagsSettings").tabs(".pane", {beforeLeave:ImagsSettings.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		 case "OSD:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "VideoConfig")
				{
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/osd.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					//initConfigGetCap("hdsdi=true");//显示OSD文字
					//dynamicosd  动态内容插件
					 var szXml = "<contentroot>";
						szXml +=$.cookie('authenticationinfo');
						szXml += "</contentroot>";
						var xmlDoc = GetparseXmlFromStr(szXml);
					var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/getcap?hdsdi=true&dynamicosd=true"
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
							//osd名称改变
							
							if($(xmlDoc).find("hdsdi").length > 0){
								$(xmlDoc).find("hdsdi").each(function(i){ 
								    var g_hdsdi=$(this).text();
									if(g_hdsdi!="true")
									{
										$("#mOsdSet").attr("name","mOsdSet");
									}
									else
									{
										 $("#mOsdSet").attr("name","mOsdlocalecho");
									}
									
									if (szMainMenu === "VideoConfig") 
									{
										OsdSet.tabs = $("#tabOsdSet").tabs(".pane", {beforeLeave:OsdSet.beforeLeave, hideIndexes:[]});
									} 
									else 
									{
										OsdSet.tabs = $("#tabOsdSet").tabs(".pane", {beforeLeave:OsdSet.beforeLeave});
									}	
									g_menuRecorder.szLastMenu = szMenu;
									g_menuRecorder.szLastMainMenu = szMainMenu;
									
								});
							};
							
							
							if($(xmlDoc).find("dynamicosd").length > 0){
								$(xmlDoc).find("dynamicosd").each(function(i){ 
									 if($(this).text()!="true")
									{
										$("#mcurplugin").hide();
									}else{
										$("#mcurplugin").show();
									}
								});
							}
						},error: function(xhr, textStatus, errorThrown)
						{
							ErrStateTips(xhr);
						}
					});
					
					
					
					
				}
			});
			break;
		}
		
		 case "Video:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "VideoConfig")
				{
					//ImagsSettings.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/video.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					
					initConfigGetCap("videosourcenum=true&streamnum=true&encclip=true&roi=true&videoshild=true");//获取视频能力集
					
					//k_enccli=$(xmlDoc).find('streamnum').eq(0).text()   //编码裁剪
			// k_roi=$(xmlDoc).find('roi').eq(0).text()   //敏感区域
			        //console.log("aaaa"+k_enccli)
					
					if (szMainMenu === "VideoConfig") 
					{
						Video.tabs = $("#tabVideo").tabs(".pane", {beforeLeave:Video.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						Video.tabs = $("#tabVideo").tabs(".pane", {beforeLeave:Video.beforeLeave});
						
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		case "Audio:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "VideoConfig")
				{
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/audio.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					//audiodec 音频编码
					 //audioenc音频解码
					initConfigGetCap("audiodec=true&audioenc=true");
					
					if (szMainMenu === "VideoConfig") 
					{
						Audio.tabs = $("#tabAudio").tabs(".pane", {beforeLeave:Audio.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						Audio.tabs = $("#tabAudio").tabs(".pane", {beforeLeave:Audio.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		
		case "PTZ:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				//console.log(szMainMenu)
				if (szMainMenu === "VideoConfig")
				{
					//PTZPan.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/ptz.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					//patterns=true  花样扫描
					//ptzvermax=true 垂直坐标的范围
					//ptzver=true    云台版本
					initConfigGetCap("ptzver=true&patterns=true");// 能力集获取
					if (szMainMenu === "VideoConfig") 
					{
						PTZPan.tabs = $("#tabPTZ").tabs(".pane", {beforeLeave:PTZPan.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						PTZPan.tabs = $("#tabPTZ").tabs(".pane", {beforeLeave:PTZPan.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		/***高级性能**/
		case "Adcap:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				//console.log(szMainMenu)
				if (szMainMenu === "VideoConfig")
				{
					//PTZPan.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/adcap.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					if (szMainMenu === "VideoConfig") 
					{
						divAdcap.tabs = $("#tabAdcap").tabs(".pane", {beforeLeave:divAdcap.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						divAdcap.tabs = $("#tabAdcap").tabs(".pane", {beforeLeave:divAdcap.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		/*********摄像机结束**************/
		
		/*********异常开始**************/
		
		case "Abnormal:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					//Abnormal.hideTabs([1,2,3,4,5]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/abnormal.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						Abnormal.tabs = $("#tabAbnormal").tabs(".pane", {beforeLeave:Abnormal.beforeLeave, hideIndexes:[1,2,3,4,5]});
					} 
					else 
					{
						Abnormal.tabs = $("#tabAbnormal").tabs(".pane", {beforeLeave:Abnormal.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		case "VideoAnalysis:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					//Alarm.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/occlusionalarm.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*
					shieldalarm  遮挡报警
					virtualfocus  虚焦侦测
					sightchange   场景变更侦测
					warningline   警戒线
					*/
					initConfigGetCap("shieldalarm=true&virtualfocus=true&sightchange=true&warningline=true");//是否支持遮挡报警
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						Alarm.tabs = $("#tabAlarm").tabs(".pane", {beforeLeave:Alarm.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						Alarm.tabs = $("#tabAlarm").tabs(".pane", {beforeLeave:Alarm.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		
		case "Input:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					//Input.hideTabs([1,2,3,4,5]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/input.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						Input.tabs = $("#tabInput").tabs(".pane", {beforeLeave:Input.beforeLeave, hideIndexes:[1,2,3,4,5]});
					} 
					else 
					{
						Input.tabs = $("#tabInput").tabs(".pane", {beforeLeave:Input.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "Output:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					//Output.hideTabs([1,2,3,4,5]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/output.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						Output.tabs = $("#tabOutput").tabs(".pane", {beforeLeave:Output.beforeLeave, hideIndexes:[1,2,3,4,5]});
					} 
					else 
					{
						Output.tabs = $("#tabOutput").tabs(".pane", {beforeLeave:Output.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		
		/*********异常结束**************/
		
		
		/******存储开始*******************/
		
		case "StorageManagement:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					StorageManagement.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/storagemanagement.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						StorageManagement.tabs = $("#tabStorageManagement").tabs(".pane", {beforeLeave:StorageManagement.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						StorageManagement.tabs = $("#tabStorageManagement").tabs(".pane", {beforeLeave:StorageManagement.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		
		
		/*case "StorageManagement:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					StorageManagement.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/storagemanagement.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						StorageManagement.tabs = $("#tabStorageManagement").tabs(".pane", {beforeLeave:StorageManagement.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						StorageManagement.tabs = $("#tabStorageManagement").tabs(".pane", {beforeLeave:StorageManagement.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}*/
		
		
		case "VideoProgram:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					VideoProgram.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/videoprogram.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						VideoProgram.tabs = $("#tabVideoProgram").tabs(".pane", {beforeLeave:VideoProgram.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						VideoProgram.tabs = $("#tabVideoProgram").tabs(".pane", {beforeLeave:VideoProgram.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		case "Screenshot:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "EventConfig")
				{
					Screenshot.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/screenshot.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "EventConfig") 
					{
						Screenshot.tabs = $("#tabScreenshot").tabs(".pane", {beforeLeave:Screenshot.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						Screenshot.tabs = $("#tabScreenshot").tabs(".pane", {beforeLeave:Screenshot.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		/******存储结束*******************/
		
		case "System:get":
		{
			
			if (g_menuRecorder.szLastMenu === szMenu)
			{
				//console.log(szMainMenu)
				
				if (szMainMenu === "SystemConfig")
				{
					//System.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
				
			}
			//StopRealPlay()();
			//HWP.destory();
			//top.document.getElementById("IpcCtrl").stopVideo();
			$.ajax({
				url: "params/system.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					
					$("#EditAreaContent").html(msg);
					
					$("#SaveDeviceInfo").show();
					$("#Jumpsave").hide();
					$("#deviceinfoup").hide();
					$("#deviceinfodown").hide();
					
					if (szMainMenu === "SystemConfig") 
					{
						System.tabs = $("#tabSystem").tabs(".pane", {beforeLeave:System.beforeLeave, hideIndexes:[1]});
					} 
					else 
					{
						System.tabs = $("#tabSystem").tabs(".pane", {beforeLeave:System.beforeLeave});
						
					}			
					
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
					//initNetwork();
				}
			});
			break;
		}
	/*	case "System:set":
		{
			switch (g_oCurrentTab.curTab)
			{
				case 0:
					ia(DeviceInfo).submit();
					break;
				case 1: // 不可能到这里
					ia(TimeSettings).submit();
					break;
				case 2: // 不可能到这里
					ia(Maintain).submit();
					break;
				case 3:
				 	ia(RS232Config).submit();
					break;
				case 4:
					ia(RS485Config).submit();
					break;
				case 6:
					ia(TimeSettings).submitDST();
					break;
				default:
					break;
			}
			
			break;
		}*/
		

		
		case "User:get":
		{
			
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "SystemConfig") 
				{
					//User.tabs.hideTabs([2]);
				} 
				else 
				{
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/user.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					if (szMainMenu === "SystemConfig") 
					{
						User.tabs = $("#tabUser").tabs(".pane", {beforeLeave:User.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						User.tabs = $("#tabUser").tabs(".pane", {beforeLeave:User.beforeLeave});
						
					}			
				
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		/*case "User:set":
		{
			switch (g_oCurrentTab.curTab)
			{
				case 1:
					ia(RTSPAuth).setRTSPAuthInfo();
					break;
				default:
					break;
			}
			break;
		}*/
		
		case "TimeSystem:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "SystemConfig")
				{
					//TimeSystem.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/timesystem.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					initConfigGetCap("summertime=true");//是否支持夏令时
					$("#SaveTimeSystem").show();
					$("#TimeSystemup").hide();
					$("#TimeSystemsucc").hide();
					if (szMainMenu === "SystemConfig") 
					{
						TimeSystem.tabs = $("#tabTimeSystem").tabs(".pane", {beforeLeave:TimeSystem.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						TimeSystem.tabs = $("#tabTimeSystem").tabs(".pane", {beforeLeave:TimeSystem.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		case "SerialPost:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "SystemConfig")
				{
					//SerialPost.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/serialpost.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "SystemConfig") 
					{
						SerialPost.tabs = $("#tabSerialPost").tabs(".pane", {beforeLeave:SerialPost.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						SerialPost.tabs = $("#tabSerialPost").tabs(".pane", {beforeLeave:SerialPost.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		case "Log:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "SystemConfig")
				{
					//LogMain.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/log.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if (szMainMenu === "SystemConfig") 
					{
						LogMain.tabs = $("#tabLog").tabs(".pane", {beforeLeave:LogMain.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						LogMain.tabs = $("#tabLog").tabs(".pane", {beforeLeave:LogMain.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		case "SystemMaintenance:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "SystemConfig")
				{
					//Maintain.hideTabs([]);
				} else {
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//StopRealPlay()();
			$.ajax({
				url: "params/systemmaintenance.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					/*if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}*/
					$("#EditAreaContent").html(msg);
					
					if ($.cookie('UserNameLogin')!="admin"){
						$("#SubAdvanceConfig").hide();
					}else{
						$("#SubAdvanceConfig").show();
					}
					/*
					automaintain 自动维护
					find  发现
					*/
					initConfigGetCap("automaintain=true&find=true");
					if (szMainMenu === "SystemConfig") 
					{
						Maintain.tabs = $("#tabSystemMaintenance").tabs(".pane", {beforeLeave:Maintain.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						Maintain.tabs = $("#tabSystemMaintenance").tabs(".pane", {beforeLeave:Maintain.beforeLeave});
					}	
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		
		
		/************音视频_开始**********************/
		case "AudioAndVideo:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "BaseConfig") 
				{
					AudioAndVideo.tabs.hideTabs([]);
				} 
				else 
				{
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//HWP.destory();
			//StopRealPlay()();
			$.ajax({
				url: "params/AudioAndVideo.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					$("#EditAreaContent").html(msg);
					//console.log("网络")
					
					if (szMainMenu === "BaseConfig") 
					{
						AudioAndVideo.tabs = $("#tabAudioAndVideo").tabs(".pane", {beforeLeave:AudioAndVideo.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						AudioAndVideo.tabs = $("#tabAudioAndVideo").tabs(".pane", {beforeLeave:AudioAndVideo.beforeLeave});
						
					}			
					
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
					//initNetwork();
				}
			});
			break;
		}
		/************音视频_结束**********************/
		
		/************事件开始****************/
		case "Event:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			//HWP.destory();
			//StopRealPlay()();
			$.ajax({
				url: "params/event.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}
					$("#EditAreaContent").html(msg);
					Event.tabs = $("#tabEvent").tabs(".pane", {defaultCur: 0});
					/*if(!g_bSupportCapturePlan)
					{
						Event.tabs.hideTab(7);
					}
					if(!g_bSupportWLS && !g_bSupportPIR && !g_bSupportCH)
					{
						Event.tabs.hideTab(8);
					}
					if(0 === pr(DeviceInfo).queryAlarmInNum()) {
						Event.tabs.hideTab(3);
					}
					if(0 === pr(DeviceInfo).queryAlarmOutNum()) {
						Event.tabs.hideTab(4);
					}*/
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "Event:set":
		{
			switch (Event.tabs.curTab)
			{
				case 0:
				    SetMoveDetectInfo();
					break;
				case 1:
				    SetBlockAlarmInfo();
					break;
				case 2: 
				    SetVideoLostInfo();
					break;
				case 3: 
				    SaveAlarmInInfo();
					break;
				case 4: 
				    SetAlarmOutInfo();
					break;
				case 5: 
				    SaveExceptionInfo();
					break;	
				case 6: 
				    SetEmailInfo();
					break;
				case 7:
				    setCapturePlanInfo();
					break;
				case 8:
					/*setOtherAlarmLinkDoc();*/
					break;
				default:
					break;
			}
			break;
		}
		/************事件结束***************/
		/************存储开始****************/
		case "Storage:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "BaseConfig") 
				{
					Storage.tabs.hideTabs([ 8, 9,10]);
				} 
				else 
				{
					
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			
			/*if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}*/
			//HWP.destory();
			//StopRealPlay()();
			$.ajax({
				url: "params/storage.htm",
				type: "GET",
				dataType: "html",
				cache:false,
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						
					}
					$("#EditAreaContent").html(msg);
					//Storage.tabs = $("#tabStorage").tabs(".pane", {defaultCur: 0});
					
					
					if (szMainMenu === "BaseConfig") 
					{
						Storage.tabs = $("#tabStorage").tabs(".pane", {beforeLeave:Storage.beforeLeave, hideIndexes:[  9,10]});
					} 
					else 
					{
						Storage.tabs = $("#tabStorage").tabs(".pane", {beforeLeave:Storage.beforeLeave});
						
					}	
					
					/*
					if (szMainMenu === "BaseConfig") 
					{
						AudioAndVideo.tabs = $("#tabAudioAndVideo").tabs(".pane", {beforeLeave:AudioAndVideo.beforeLeave, hideIndexes:[]});
					} 
					else 
					{
						AudioAndVideo.tabs = $("#tabAudioAndVideo").tabs(".pane", {beforeLeave:AudioAndVideo.beforeLeave});
						
					}			
					
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
					*/
					
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "Storage:set":
		{
			switch (Storage.tabs.curTab)
			{
				case 0:
				    SetMoveDetectInfo();
					break;
				case 1:
				    SetBlockAlarmInfo();
					break;
				case 2: 
				    SetVideoLostInfo();
					break;
				case 3: 
				    SaveAlarmInInfo();
					break;
				case 4: 
				    SetAlarmOutInfo();
					break;
				case 5: 
				    SaveExceptionInfo();
					break;	
				case 6: 
				    SetEmailInfo();
					break;
				case 7:
				    setCapturePlanInfo();
					break;
				case 8:
					/*setOtherAlarmLinkDoc();*/
					break;
				default:
					break;
			}
			break;
		}
		/************存储结束***************/
		/************日志开始****************/
		
		/************日志结束***************/
		

		
		

		default:
		{
			break;
		}
	}//switch end
}

/*************************************************
Function:		ChangeLanguage
Description:	改变页面语言
Input:			lan: 语言
				bCallback: 是否执行翻译回调  默认执行
Output:			无
return:			无				
*************************************************/
var g_transStack = new parent.TransStack();
function ChangeLanguage(lan, bCallback)
{
	if (arguments.length < 2)
	{
		bCallback = true;
	}
	var lxd = parent.translator.getLanguageXmlDoc("paramconfig", lan);
	ChangeVariableLanguage(parent.translator.appendLanguageXmlDoc($(lxd.cloneNode(true)).children("ParamConfig")[0], parent.g_lxdMain)); // 改变配置页面全局变量语言
	g_lxdParamConfig = parent.translator.appendLanguageXmlDoc($(lxd).children("Common")[0], parent.g_lxdMain);
	//parent.document.title = parent.translator.translateNode(g_lxdParamConfig, 'laparamCfg');
	$("#SaveConfigBtn").val(parent.translator.translateNode(g_lxdParamConfig, 'laSaveBtn'));
	if (bCallback)
	{
		g_transStack.translate();
	}
}

/*************************************************
Function:		ChangeVariableLanguage
Description:	改变配置页面全局变量语言
Input:          lxd：LanguageXmlDoc
Output:			无
return:			无				
*************************************************/
function ChangeVariableLanguage(lxd)
{
    m_szSuccess1 = parent.translator.translateNode(lxd, 'Success1');   	 //成功
    m_szSuccess2 = parent.translator.translateNode(lxd, 'Success2');       //成功需重启
    m_szSuccess3 = parent.translator.translateNode(lxd, 'DeleteSuccTips');  	 //删除成功
    m_szSuccess4 = parent.translator.translateNode(lxd, 'Success4');       //成功需重启
    m_szSuccess5 = parent.translator.translateNode(lxd, 'Success5');       //设备重启成功 
	m_szSuccess6 = parent.translator.translateNode(lxd, 'Success6');   		 //成功
	
	m_Mauthorization = parent.translator.translateNode(lxd, 'Mauthorization');  //没有权限
    m_szError1 = parent.translator.translateNode(lxd, 'Error1'); 			 //操作失败
    m_szError2 = parent.translator.translateNode(lxd, 'Error2');   		 //获取失败
    m_szError3 = parent.translator.translateNode(lxd, 'Error3');       	 //无效的XML内容
    m_szError4 = parent.translator.translateNode(lxd, 'Error4');   		 //无效的XML格式
    m_szError5 = parent.translator.translateNode(lxd, 'Error5');   		 //无效的操作
    m_szError6 = parent.translator.translateNode(lxd, 'Success6');   		 //成功
	m_szError7 = parent.translator.translateNode(lxd, 'Error7');   		 //设备忙
    m_szError9 = parent.translator.translateNode(lxd, 'Error9');   		 //失败
    m_szError10 = parent.translator.translateNode(lxd, 'Error10');
    m_szError11 = parent.translator.translateNode(lxd, 'Error11');   		 //用户名密码错误
    m_szError12 = parent.translator.translateNode(lxd, 'Error12');  		 //方法不允许
    m_szError13 = parent.translator.translateNode(lxd, 'Error13');  		 //参数错误
    m_szError14 = parent.translator.translateNode(lxd, 'Error14');            //无效的UEL
    m_szError400 = parent.translator.translateNode(lxd, 'Error400');  	 //网络中断或异常
    m_szError44 = parent.translator.translateNode(lxd, 'Error44');   		 //参数失败
    m_szError55 = parent.translator.translateNode(lxd, 'Error55');
	m_szError66 = parent.translator.translateNode(lxd, 'Error66');
	m_szError77 = parent.translator.translateNode(lxd, 'Error77');
	m_szError88 = parent.translator.translateNode(lxd, 'Error88');    //IP地址错误
	m_szError99 = parent.translator.translateNode(lxd, 'Error99');
	m_szError100 = parent.translator.translateNode(lxd, 'Error100');  //IP掩码错误
	
	m_LoadSuccTips =parent.translator.translateNode(lxd, 'LoadSuccTips');//调用成功
	m_StopsuccTips =parent.translator.translateNode(lxd, 'StopsuccTips');//停止成功
	
    m_plugintips =parent.translator.translateNode(lxd, 'MpluginTips');  //请安装插件
    m_szAsk = parent.translator.translateNode(lxd, 'MAsk'); 				 //询问信息  操作需要重启，是否继续
	m_szAsk1 = parent.translator.translateNode(lxd, 'MAsk1');        //是否恢复默认 图像效果页
    m_szAskTip1 = parent.translator.translateNode(lxd, 'AskTip1');				 //删除用户询问信息
	m_szRestartAsk = parent.translator.translateNode(lxd, 'RestartTips');  //是否重启设备
	m_MDeviceRestar = parent.translator.translateNode(lxd, 'MDeviceRestar');  //重启设备
	m_MDeviceRestaring = parent.translator.translateNode(lxd, 'MDeviceRestaring');  //设备正在重启
	
    m_szRestartSuccess = parent.translator.translateNode(lxd, 'RestartSuccessTips');
    m_szRestartFailed = parent.translator.translateNode(lxd, 'RestartFailedTips');
	m_szExit = parent.translator.translateNode(lxd, 'exit');
	m_szRestartParameters = parent.translator.translateNode(lxd, 'RestartParametersTips');  //确定重启应用参数
	m_ConnectTimeoutTips = parent.translator.translateNode(lxd, 'ConnectTimeoutTips');  //连接超时
	m_LoginConnectTimeoutTips = parent.translator.translateNode(lxd, 'LoginConnectTimeoutTips');  //登录超时,请重新登录
	m_tipsRebootErr = parent.translator.translateNode(lxd, 'tipsRebootErr');  //设备已断开或IP已修改
	m_MFormattingTips = parent.translator.translateNode(lxd, 'MFormattingTips');  //正在录放像或下载无法格式化
	m_MDefaultRestar  = parent.translator.translateNode(lxd, 'MDefaultRestar');  //恢复默认值后,系统将自动重启,是否恢复
	m_OldPassError  = parent.translator.translateNode(lxd, 'OldPassError');  //旧密码错误
	m_MUnknownerror  = parent.translator.translateNode(lxd, 'MUnknownerror');  //未知错误
	
	//PTZ
	m_SetupSuccTips  = parent.translator.translateNode(lxd, 'SetupSuccTips');  //设置成功
	m_SetupfailedTips  = parent.translator.translateNode(lxd, 'SetupfailedTips');  //设置失败
	m_DeletefailedTips  = parent.translator.translateNode(lxd, 'DeletefailedTips');  //删除失败
	m_LoadfailedTips  = parent.translator.translateNode(lxd, 'LoadfailedTips');  //调用失败
	
	
	
	
	
}



/*************************************************
Function:		延时赋值
Description:	setValueDelay
Input:			无			
Output:			无
return:			无				
*************************************************/
function setValueDelayIE6(szId, oXml, szXmlNode, szValue)
{
	if($.browser.msie && parseInt($.browser.version, 10) == 6)
	{
		setTimeout(function()
	    {
		    if(szValue == undefined || szValue == null || szValue == "")
		    {
			    $("#" + szId).val( $(oXml).find(szXmlNode).eq(0).text() );
		    }
		    else
		    {
			    $("#" + szId).val(szValue);
		    }
	   },  20);
	}
	else
	{
		if(szValue == undefined || szValue == null || szValue == "")
		{
			$("#" + szId).val( $(oXml).find(szXmlNode).eq(0).text() );
		}
		else
		{
			$("#" + szId).val(szValue);
		}
	}
}
// 往select里插option，不刷新页面翻译的方式，要求每个option都有自己的Id
// szCapabilitySet: 从设备获取的能力集
// szOptionalSet: 可选能力集
// szIds: 用来翻译的option的Id
// szSelectId: select的Id
function insertOptions2Select(szCapabilitySet, szOptionalSet, szOptionIds, szSelectId) {
	$.each(szCapabilitySet, function(i, szCapability) {
		var index = $.inArray(szCapability, szOptionalSet);
		if (index !== -1) {
			//$("<option id='" + szOptionIds[index] + "' name='" + szOptionIds[index] + "' value='" + szCapability +"'></option>").appendTo("#" + szSelectId);
			$("<option id='" + szOptionIds[index] + "' name='" + szOptionIds[index] + "' value='" + szCapability +"'>"+getNodeValue(szOptionIds[index])+"</option>").appendTo("#" + szSelectId);
		}
		else {
			if (szOptionalSet[szOptionalSet.length - 1] === "*") {
				$("<option id='" + szOptionIds[szOptionalSet.length - 1] + "' name='" + szOptionIds[szOptionalSet.length - 1] + "' value='" + szCapability +"'></option>").appendTo("#" + szSelectId);
			}
		}
	});
}
/*************************************************
Function:		systemreboot
Description:	重启系统
Input:			无			
Output:			无
return:			无				
*************************************************/
function systemrebootconfig(){
	if (confirm(m_szRestartAsk)){//是否重启设备
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
				/*$.cookie('username',null);
				$.cookie('page',null);
				$.cookie('menu_onemenu',null);
				$.cookie('menu_twomenu',null);
				$.cookie('tabSystemMaintenance_curTab',null);
				//$.cookie('curpage',null);
				top.location.href = "/";
				*/
				window.parent.parent.$('#divUpgradeTable').modal({
			      "close":false   //禁用叉叉和ESC
			    });
				window.parent.parent.$('#divTitle').html(m_MDeviceRestar)
			    window.parent.parent.$('#divUpgradeExplaintips').hide();
			    window.parent.parent.$('#UpgradeClose').show().prop("disabled",true);
			    window.parent.parent.$('#divUpgradeExplain').show().html(m_MDeviceRestaring+"...");//设备正在重启
			    m_TextSignal= setInterval("TextSysSignal()",2000);
				m_TimerRebootOutID= setInterval("RebootSignal()",180000 ); // 3分钟没有返回值表示设备断开或IP
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		});
	}
};

//获取视频能力集
function initConfigGetCap(obj){
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
		 
			if($(xmlDoc).find("videosourcenum").length > 0){
				$(xmlDoc).find("videosourcenum").each(function(i){ 
				   k_streamnum= $(this).text();  //视频源个数
				});
			}
			
			if($(xmlDoc).find("streamnum").length > 0){
				$(xmlDoc).find("streamnum").each(function(i){ 
				 k_streamnum= $(this).text();  //码流路数
				});
			}
			
			//VSIP
			if($(xmlDoc).find("vsip").length > 0){
				$(xmlDoc).find("vsip").each(function(i){ 
				   if($(this).text()=="true")
					{
						m_vsip=true;
						g_Protocol=true;
					}
				});
			}
			//onvif
			if($(xmlDoc).find("onvif").length > 0){
				$(xmlDoc).find("onvif").each(function(i){ 
				   if($(this).text()=="true")
					{
						//AccessProtocol.tabs.hideTab(1);
						m_onvif=true;
						g_Protocol=true;
					}
					
				});
			}
			//GB28181
			if($(xmlDoc).find("gb28181").length > 0){
				$(xmlDoc).find("gb28181").each(function(i){ 
				   k_Gb28181=$(this).text();
				   if (k_Gb28181 > 0)
				   {
					   m_gb28181=true;
					   g_Protocol=true;
				   }
				});
			}
			
			if (g_Protocol!=true)
			{
				$("#aAccessProtocol").hide();
				$("#SubNetWork").find($("[id='aAccessProtocol']")).hide();
			}
			//网络
			/*if($(xmlDoc).find("ipaddr").length > 0){
				$(xmlDoc).find("ipaddr").each(function(i){ 
				  if($(this).text()!="true")
					{
						Video.tabs.hideTab(3);
					}
				});
			}*/
			
			if($(xmlDoc).find("wireless").length > 0){
				$(xmlDoc).find("wireless").each(function(i){ 
				  if($(this).text()!="true")
					{
						TCPIP.tabs.hideTab(1);
					}
				});
			}
			
			
			//网络
			//DDNS，ddns;PPPoE,pppoe;KSNMP,ksnmp;8021X,8021x;Qos,qos, UPnP,upnp;
			//是否支持DDNS
			if($(xmlDoc).find("ddns").length > 0){
			  $(xmlDoc).find("ddns").each(function(i){ 
			   
				if($(this).text()!="true")
				{
					Network.tabs.hideTab(0);
				}
			   });
			}
			
			//是否支持PPPoE
			if($(xmlDoc).find("pppoe").length > 0){
			  $(xmlDoc).find("pppoe").each(function(i){ 
			   
				if($(this).text()!="true")
				{
					Network.tabs.hideTab(1);
				}
			   });
			}
			
			//是否支持KSNMP
			if($(xmlDoc).find("ksnmp").length > 0){
			  $(xmlDoc).find("ksnmp").each(function(i){ 
			   
				if($(this).text()!="true")
				{
					Network.tabs.hideTab(2);
				}
			   });
			}
			
			//是否支持8021X
			if($(xmlDoc).find("_8021x").length > 0){
			  $(xmlDoc).find("_8021x").each(function(i){ 
			   
				if($(this).text()!="true")
				{
					Network.tabs.hideTab(3);
				}
			   });
			}
			//是否支持QOS
			if($(xmlDoc).find("qos").length > 0){
			  $(xmlDoc).find("qos").each(function(i){ 
			   
				if($(this).text()!="true")
				{
					Network.tabs.hideTab(4);
				}
			   });
			}
			//是否支持UPNP
			if($(xmlDoc).find("upnp").length > 0){
			  $(xmlDoc).find("upnp").each(function(i){ 
			   
				if($(this).text()!="true")
				{
					Network.tabs.hideTab(5);
				}
			   });
			}
			//是否支持dpss
			if($(xmlDoc).find("dpss").length > 0){
			  $(xmlDoc).find("dpss").each(function(i){ 
			   
				if($(this).text()!="true")
				{
					Network.tabs.hideTab(6);
				}
			   });
			}
			
			
			//编码裁剪
			if($(xmlDoc).find("encclip").length > 0){
				$(xmlDoc).find("encclip").each(function(i){ 
				  if($(this).text()!="true")
					{
						Video.tabs.hideTab(1);
					}
				});
			}
			
			//敏感区域
			if($(xmlDoc).find("roi").length > 0){
				$(xmlDoc).find("roi").each(function(i){ 
				  if($(this).text()!="true")
					{
						Video.tabs.hideTab(2);
					}
				
				});
			}
			//图像遮蔽
			if($(xmlDoc).find("videoshild").length > 0){
				$(xmlDoc).find("videoshild").each(function(i){ 
				  if($(this).text()!="true")
					{
						Video.tabs.hideTab(3);
					}
				});
			}
			
			//云台
			//是否支持PTZ功能
			if($(xmlDoc).find("ptz").length > 0){
				$(xmlDoc).find("ptz").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#aPTZ").hide();
					}else{
						$("#aPTZ").show();
					}
				});
			}
			//是否支持V5限位
			if($(xmlDoc).find("ptzver").length > 0){
				$(xmlDoc).find("ptzver").each(function(i){ 
					 if($(this).text()=="v5")
					{
						PTZPan.tabs.hideTab(3);
						PTZPan.tabs.showTab(4);
					}else if($(this).text()=="v7"){
						PTZPan.tabs.hideTab(4);
						PTZPan.tabs.showTab(3);
					}
				});
			}
			
			//是否支持花样扫描
			if($(xmlDoc).find("patterns").length > 0){
				$(xmlDoc).find("patterns").each(function(i){ 
					 if($(this).text()!="true")
					{
						PTZPan.tabs.hideTab(6);
					}
				});
			}
			
			
			
			//摄像机--图像
			if($(xmlDoc).find("image").length > 0){
				$(xmlDoc).find("image").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#aImagsSettings").hide();
					}else{
						$("#aImagsSettings").show();
					}
				});
			}
			
			//摄像机--OSD
			if($(xmlDoc).find("osd").length > 0){
				$(xmlDoc).find("osd").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#aOSD").hide();
					}else{
						$("#aOSD").show();
					}
				});
			}
			
			//摄像机--视频
			if($(xmlDoc).find("videosourcenum").length > 0){
				$(xmlDoc).find("videosourcenum").each(function(i){ 
					 if($(this).text()==0)
					{
						$("#aVideo").hide();
					}else{
						$("#aVideo").show();
					}
				});
			}
			
			//摄像机--高级性能
			if($(xmlDoc).find("mtcf").length > 0){
				$(xmlDoc).find("mtcf").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#aadcap").hide();
					}else{
						$("#aadcap").show();
					}
				});
			}
			
			//音频
			var g_audiodeccat = false;
			var g_audioenccat = false;
			if($(xmlDoc).find("audio").length > 0){
				$(xmlDoc).find("audio").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#aAudio").hide();
					}
					else{
						$("#aAudio").show();
					}
				});
			}
			
			//音频编码enc
			if($(xmlDoc).find("audioenc").length > 0){
				$(xmlDoc).find("audioenc").each(function(i){ 
					var g_audioenc=$(this).text();
					//var g_audioenc="false"
					if(g_audioenc!="true")
					{
						$("#MAudiocode").hide();
					}
					else{
						$("#MAudiocode").show();
						g_audiodeccat=true;
					}
				});
			};
			//音频解码dec
			if($(xmlDoc).find("audiodec").length > 0){
				$(xmlDoc).find("audiodec").each(function(i){ 
					var g_audiodec=$(this).text();
					if($(this).text()!="true")
					{
						$("#MAudiodecoder").hide();
					}
					else
					{
						$("#MAudiodecoder").show();
						g_audioenccat=true;
						//javascript:ia(Audiodecoder).update();
					}
				});
			}
			
			//console.log(g_audiodeccat+"    "+g_audioenccat)
			if (g_audiodeccat!=true && g_audioenccat==true)
			{
				$.cookie('tabAudio_curTab','1');
				$("#MAudiocode").removeClass("current")
				$("#MAudiodecoder").addClass("current")
				$("#DivAudiocode").hide();
				$("#DivAudiodecoder").show();
				javascript:ia(Audiodecoder).update();
			}
			
			//事件类--视频分析
			if($(xmlDoc).find("event").length > 0){
				$(xmlDoc).find("event").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#SubEvent").hide();
					}else{
						$("#SubEvent").show();
					}
				});
			}
			
			//事件类--视频分析--遮档报警
			if($(xmlDoc).find("shieldalarm").length > 0){
				$(xmlDoc).find("shieldalarm").each(function(i){ 
					 if($(this).text()==0)
					{
						Alarm.tabs.hideTab(1);
					}else
					{
						Alarm.tabs.showTab(1);
					}
				});
			}
			
			if($(xmlDoc).find("warningline").length > 0){
				$(xmlDoc).find("warningline").each(function(i){ 
					 if($(this).text()!="true")
					{
						Alarm.tabs.hideTab(2);
					}else
					{
						Alarm.tabs.showTab(2);
					}
				});
			}
			
			
			//事件类--视频分析--虚焦侦测
			if($(xmlDoc).find("virtualfocus").length > 0){
				$(xmlDoc).find("virtualfocus").each(function(i){ 
					 if($(this).text()!="true")
					{
						Alarm.tabs.hideTab(3);
					}else
					{
						Alarm.tabs.showTab(3);
					}
				});
			}	
			
			//事件类--视频分析--场景变更
			if($(xmlDoc).find("sightchange").length > 0){
				$(xmlDoc).find("sightchange").each(function(i){ 
					 if($(this).text()!="true")
					{
						Alarm.tabs.hideTab(4);
					}else
					{
						Alarm.tabs.showTab(4);
					}
				});
			}		
			
			//事件类--报警输入
			if($(xmlDoc).find("alarmin").length > 0){
				$(xmlDoc).find("alarmin").each(function(i){ 
					 if($(this).text()==0)
					{
						$("#aAlarmInput").hide();
					}else{
						$("#aAlarmInput").show();
					}
				});
			};
			
			//事件类--报警输出
			if($(xmlDoc).find("alarmout").length > 0){
				$(xmlDoc).find("alarmout").each(function(i){ 
					 if($(this).text()==0)
					{
						$("#aAlarmoutput").hide();
					}else{
						$("#aAlarmoutput").show();
					}
				});
			};
			
			
			
			//事件类--异常联动
			if($(xmlDoc).find("exception").length > 0){
				$(xmlDoc).find("exception").each(function(i){ 
					 if($(this).text()!="true")
					{
						$("#aAbnormal").hide();
					}else{
						$("#aAbnormal").show();
					}
				});
			}
			
			//存储类
			if($(xmlDoc).find("storage").length > 0){
				$(xmlDoc).find("storage").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#SubStorage").hide();
					}else{
						$("#SubStorage").show();
					}
				});
			}	
			
			//系统类
			var g_Serial = false;
			//串口
			if($(xmlDoc).find("rs232").length > 0){
				$(xmlDoc).find("rs232").each(function(i){ 
					var g_rs232=$(this).text();
					if(g_rs232!="true")
					{
						//$("#SubStorage").hide();
					}
					else
					{
						//$("#SubStorage").show();
						g_Serial =true;
					}
				});
			}	
			//串口
			if($(xmlDoc).find("rs485").length > 0){
				$(xmlDoc).find("rs485").each(function(i){ 
				    var g_rs485=$(this).text();
					if(g_rs485!="true")
					{
						//$("#SubStorage").hide();
					}
					else
					{
						//$("#SubStorage").show();
						g_Serial =true;
					}
				});
			}	
			//rs232/rs485都不支持时，串口才隐藏
			if (($(xmlDoc).find("rs485").length > 0  && $(xmlDoc).find("rs485").length > 0))
			{
				if (g_Serial!=true)
				{
					$("#aSerialPost").hide();
				}	
				else
				{
					$("#aSerialPost").show();
				}
			}
			
			//系统--时间设置--是否支持夏令时
			if($(xmlDoc).find("summertime").length > 0){
				$(xmlDoc).find("summertime").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#dvDST").hide();
					}else{
						$("#dvDST").show();
					}
				});
			}
			//是否支自动维护
			if($(xmlDoc).find("automaintain").length > 0){
				$(xmlDoc).find("automaintain").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#subautomaintain").hide();
						
					}else{
						$("#subautomaintain").show();
						
					}
				});
			}
			//是否支持发现功能
			 if($(xmlDoc).find("find").length > 0){
				$(xmlDoc).find("find").each(function(i){ 
					 if($(this).text()!="true")
					{
						
						$("#subfind").hide();
					}else{
						
						$("#subfind").show();
					}
				});
			}
			
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
	});
};

/*
清空全部
*/
function clearallarea(clearmode,cleartype){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;
		$("#SetResultTipscropping").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipscropping").html("");},5000);  //5秒后自动清除
		return;
	}
	
	
	        if (cleartype=="enccut")//清除编码裁剪
			{ 
			 document.getElementById("plugincropping").eventWebToPlugin("encode","clear");  
			}
			else if(cleartype=="roi")//清除ROI
			{  
			 document.getElementById("pluginRoi").eventWebToPlugin("roi","clear");  
			}
			else if(cleartype=="shield")//清除视频遮蔽
			{ 
			 document.getElementById("pluginPrivacymasks").eventWebToPlugin("shiled","clear");  
			}
			else if(cleartype=="detect")//清除移动侦测
			{ 
			 document.getElementById("pluginMotion").eventWebToPlugin("detect","clear");
			}
			else if(cleartype=="shieldalarm") //清除遮挡报警
			{
			 document.getElementById("pluginAlarm").eventWebToPlugin("tampering","clear");
			};
};

// 检测重启
function RebootSignal(){
	clearInterval(m_TextSignal);
	clearInterval(m_TimerRebootOutID);
	window.parent.parent.$("#divUpgradeico").hide();
	window.parent.parent.$("#divUpgradeExplain").html(m_tipsRebootErr);  //设备已断开或IP已修改
	window.parent.parent.$("#UpgradeClose").hide()
	window.parent.parent.$("#UpgradePTZClose").show().prop("disabled",false);
	
};
/*
重启时获取到信息表明重启成功
*/
function TextSysSignal(){
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/link/authenticationid";
	$.ajax({
		type: "get",
		url:szURL,
		processData: false,//不转换
		cache:false,  //不缓存
		//data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
		    
			　if (xhr.readyState == 4) 
			 {
		　　		if (xhr.status == 200) 
				{
					
					if($(xmlDoc).find("authenticationid").length > 0){
					    clearInterval(m_TextSignal);
						clearInterval(m_TimerRebootOutID);
						setTimeout(function (){
							window.parent.parent.$("#divUpgradeico").hide();
							window.parent.parent.$("#divUpgradeExplain").html(m_szSuccess5);  //设备重启成功
							window.parent.parent.$("#UpgradeClose").show().prop("disabled",false);
						},10000)//等待10秒后可关闭
			         }
				}
			}
		},
		error: function(xhr, textStatus, errorThrown)
			{
				    /*clearInterval(m_TextSignal);
					window.parent.parent.$("#UpgradeClose").hide().prop("disabled",true);
					window.parent.parent.$("#divUpgradeico").hide();
					window.parent.parent.$("#divUpgradeExplain").html("设备重启失败");
					window.parent.parent.$("#UpgradePTZClose").show().prop("disabled",false);
					*/
			}
	});
};
