document.charset = "utf-8";
var m_modeWatchon = 1;//0为未选,1为选中
var g_tTimeTasks = [];//定时任务信息数组
var m_iTimePart = 10; //PTZ时间段最大数
var m_TimerCoordinate = null; //PTZ定位坐标定时获取 
var m_bStartPTZ = false;
var outagetimemin =60;
var outagetimemax = 360; 
//路径巡航的最小最大值
var pathcruisemin = 1;
var pathcruisemax = 8;
var CruiseXml="";
var m_PtzUpradePower = false; //没有云台升级权限
var m_ptzporwesys=false;
var m_ptzporwe=false;
// 花样扫描的最小最大值
var syncscanmin = 1;
var syncscanmax = 4;
var CruiseChange= 0;  //巡航是否修改
var Cruiseindex=null; //巡航选择前的值
var k_szcruisepathmax=null;
var mutiplex="",mutipley="";
var ptz = {
	tabs: null
};

/*************************************************
Function:		ptz_hover
Description:	PTZ云台鼠标效果
*************************************************/
function ptz_hover(){
    $(".ptz_direction_left").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
              
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    });
	$(".ptz_direction_second").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    });
	$(".ptz_view").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    });
	$(".ptz_direction_right").find("span").each(function() {
		var id=$(this).attr("id")
        $(this).hover(function () {
			   $(this).addClass(id+"_hover");
            },function () {
               $(this).removeClass(id+"_hover")
            }
        );
    }); 
	$("#menubar").hover(function (){
		 $(this).addClass("menubar_open_hover");
		},function () {
		$(this).removeClass("menubar_open_hover");
	});
};

/*************************************************
Function:		PTZPresetSelect
Description:	预置位下拉
*************************************************/
function PTZPresetSelect(){
	for (i=1;i<=256;i++){
		$("<option value='" + i + "' >" + i + "</option>").appendTo("#PTZPreset");
	}
}

/*************************************************
Function:		PTZPan
Description:	云台维护
*************************************************/
function PTZPan() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(PTZPan);
pr(PTZPan).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "PTZPan"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	 if(document.all)
   {
		 $("#mainpluginPTZ").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin0"  width="100%" height="100%" ></object>')
	   }
   else
	   {
		 $("#mainpluginPTZ").html('<embed id="plugin0" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
	  }
	Plugin()
	initPTZPan(); //初始化云台维护
	//this.initCSS();	
}

/*************************************************
Function:		initPTZPan
Description:	初始化云台维护
*************************************************/
function initPTZPan()
{
	$("#modepreset").empty();
	for (i=1;i<=256;i++){
		$("<option value='" + i + "' >" + i + "</option>").appendTo("#modepreset");
	}
	GetPTZbase();   //获取基本信息
	//Getmaintain();  //获取云台维护
	GetUserinfoPTZ();//获取升级权限
	autoResizeIframe();
}
function checkbox(obj){
	if($(obj).prop("checked")){ //选中
		  m_modeWatchon = 1;
		  $(obj).val(true);
		  $(obj).prop("checked", true);
		}else{
		  m_modeWatchon = 0;  //未选
		  $(obj).prop("checked", false);
		  $(obj).val(false);
		}
}

/*************************************************
Function:		GetPTZbase
Description:	初始化云台获取
*************************************************/
function GetPTZbase(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/base"
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
		    $("#ptzversion").html($(xmlDoc).find('ptzversion').eq(0).text() )//云台版本
			
			
			$(xmlDoc).find("scanrate").each(function(i){ 
				scanratemin=$(this).attr('min');
				scanratemax=$(this).attr('max');
				$("#scanrate").val($(this).text())//扫描速度等级
				$("#fixedscanrateTips").html(scanratemin+"~"+scanratemax)
			});
			
			//景深比例启用
			if("true" == $(xmlDoc).find('enabledepth').eq(0).text())
		    {
			    $("#enabledepth").val(true);
				$("#enabledepth").prop("checked", true);
		    }else{
				$("#enabledepth").val(false);
				$("#enabledepth").prop("checked", false);
			}
            Getmaintain();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
/*************************************************
Function:		Getmaintain
Description:	初始化云台维护
*************************************************/
function Getmaintain(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/maintain"
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
			//$(kd_szpresetgetXml).eq(0).find("info").each(function(i){ 
			//断电恢复启用
			if("true" == $(xmlDoc).find('enableoutage').eq(0).text())
		    {
			    $("#enableoutage").val(true);
				$("#enableoutage").prop("checked", true);
		    }else{
				$("#enableoutage").val(false);
				$("#enableoutage").prop("checked", false);
			}
			//恢复方式
			 $(xmlDoc).find("outagememery").each(function(i){ 
		  	 	var g_outagememery= $(this).text();
				$("#outagememery").empty(); 
				 var g_outagememerys = $(this).attr('opt').split(",");
				insertOptions2Select(g_outagememerys, ["outage","preset"], ["optoutage","optptzpreset"], "outagememery");
				setValueDelayIE6("outagememery" ,"","",g_outagememery);
				
				if (g_outagememery=="outage")
				{
					 $("#sbuoutagetime").show(); 
					$("#submodepreset").hide();
				 }
				 else if(g_outagememery=="preset")
				 {
					 $("#sbuoutagetime").hide(); 
					 $("#submodepreset").show();
				}

			});
			$(xmlDoc).find("outagetime").each(function(i){ 
				outagetimemin=$(this).attr('min');
				outagetimemax=$(this).attr('max');
				$("#outagetime").val($(this).text())//恢复时间
				$("#fixedoutagetimeTips").html(outagetimemin+"~"+outagetimemax)
			});
			
			$(xmlDoc).find("preset").each(function(i){ 
			  var presetXml= $(this).text();
			   if (typeof(presetXml)!="undefined"){
					s_modepreset=document.getElementById("modepreset")
					for (i=0;i<s_modepreset.length;i++){
					 if(s_modepreset.options[i].value==presetXml){  
						s_modepreset.options[i].selected=true;  
					}
				  };
				} 
			});

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}

function GetUserinfoPTZ(){
	var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/userinfo/"+$.cookie('UserNameLogin')
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
			
			$(xmlDoc).find("powertype").each(function(i,data) {
			    var g_powertype = $(this).text().split(","); 
				
				 $.each(g_powertype, function(i,val){      
					 // if (val=="system")
					  if (val=="ptz")
					  {
						m_ptzporwe=true;
					  }
					  if (val=="system")
					  {
						m_ptzporwesys=true;
					  }
				  }); 
				  if (m_ptzporwe==true  &&  m_ptzporwesys==true)
				  {
					  
					  m_PtzUpradePower=true;
				  }
				  else
				  { 
					  m_PtzUpradePower=false;
				  }
				
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		
	});
};

//云台升级
var nCount = 0;
var bSendPtzPkgSuc = false;
function ptzupgrade(){
	
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips; //请安装插件	
		$("#SetResultTips").html(szRetInfo);
		setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
		return;
	}
	
	 var szFileDownName=document.getElementById("plugin0").eventWebToPlugin("OpenDlg");
   
	  if (szFileDownName==""){
		  return
		}
	  document.getElementById("plugin0").eventWebToPlugin("ptzupgrade","start",camera_hostname,camera_port.toString(),szFileDownName,$.cookie('authenticationinfo'));	
	  window.parent.parent.$('#divUpgradeTable').modal({
	   "close":false   //禁用叉叉和ESC
	  });
	  window.parent.parent.$("#divTitle").html(getNodeValue('Mupgrade'));  //云台升级
	  if (m_PtzUpradePower==true)
	  {
		  window.parent.parent.$("#divUpgradeExplaintips").hide();
	      window.parent.parent.$("#divUpgradeExplain").html(getNodeValue('MInupgrade')+"...");
	      window.parent.parent.$("#UpgradePTZClose").show(); 
	  }
	  else
	  {
		window.parent.parent.$("#divUpgradeExplaintips").hide();
		window.parent.parent.$("#divUpgradeico").hide();
	    window.parent.parent.$("#divUpgradeExplain").html(m_Mauthorization);
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
		return 
	  }
      m_Timercfgup= setInterval("PtzStateQueryFromPlugin()",1000);
	 // m_Timercfgup1= setInterval("m_Timercfgup1()",60000); // 60000秒没有上传文件表示升级失败
	  nCount = 0;
	bSendPtzPkgSuc = false;
	
}
function PtzStateQueryFromPlugin()
{
  nCount ++;
  if(nCount > 120) // 2min钟都还没有上传升级包成功，提示失败
  {
    window.parent.parent.$('#divUpgradeico').hide();
			window.parent.parent.$('#UpgradeClose').hide();
			window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
			window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatefailed'));
    clearInterval(m_Timercfgup);
    return;
  }
  
  var ptzprogress = document.getElementById("plugin0").eventWebToPlugin("ptzupgrade","progress");	
  var ptzstate = ptzprogress.split(",");
	if (ptzstate[0] >= 100 && ptzstate[1] == 0)// 升级包发送成功
	{
		clearInterval(m_Timercfgup);
		nCount = 0;
		m_Timercfgup= setInterval("PTZstatequery()",5000);// 开启定时器从前端查询升级状态
	}
	else if (ptzstate[1] != 0) // 升级包发送错误提示失败
	{
    clearInterval(m_Timercfgup); // 关闭定时器
    if(ptzstate[1] == 1) // 提示升级包错误
    {
      window.parent.parent.$('#divUpgradeico').hide();
			window.parent.parent.$('#UpgradeClose').hide();
			window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
			window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpgradepackageerror'));
		}
		else // 提示升级失败
		{
		  window.parent.parent.$('#divUpgradeico').hide();
			window.parent.parent.$('#UpgradeClose').hide();
			window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
			window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatefailed'));
		}
	}
}

//云台升级状态查询
function PTZstatequery(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/upgrade/statequery"
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
			 var state=$(xmlDoc).find('state').eq(0).text();
			 var progress = $(xmlDoc).find('progress').eq(0).text();
			
			nCount ++;
			if(nCount > 60)
			{
				// 提示升级失败
				window.parent.parent.$('#divUpgradeico').hide();
				window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatefailed'));
				clearInterval(m_Timercfgup);
				window.parent.parent.$('#divUpgradeico').hide();
				window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
				clearInterval(m_Timercfgup);
				return;
			
			}
			 if (state=="prepare"){
				 window.parent.parent.$('#divUpgradeico').hide();
				 window.parent.parent.$('#UpgradeClose').hide();
			     window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",true);
			     window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MReadyupgrade')+"...");	
			  }
			  else if(state=="uploading"){
				 window.parent.parent.$('#divUpgradeico').hide();
				 window.parent.parent.$('#UpgradeClose').hide();
			     window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",true);
			     window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MInupgrade'));	 
			  }
			  else if(state=="success"){
				 window.parent.parent.$('#divUpgradeico').hide();
				 window.parent.parent.$('#UpgradeClose').hide();
			     window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
			     window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatesuccess'));
				 clearInterval(m_Timercfgup);	 
			  }
			  else if(state=="faild"){
				 window.parent.parent.$('#divUpgradeico').hide();
				 window.parent.parent.$('#UpgradeClose').hide();
			     window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
			     window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatefailed'));
				 clearInterval(m_Timercfgup);	 
			  }
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//云台升级进度条
function ptzupgrade_progess(){
	
		var ptzupgrade_progess;
		var cfgdown;
		
	    nCount ++;
		if(nCount > 60)
		{
			// 提示升级失败
			window.parent.parent.$('#divUpgradeico').hide();
			window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatefailed'));
			clearInterval(m_Timercfgup);
			window.parent.parent.$('#divUpgradeico').hide();
			window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
			return;
		
		}
		ptzupgrade_progess =document.getElementById("plugin0").eventWebToPlugin("ptzupgrade","progress");
		cfgdown = ptzupgrade_progess.split(",");
	if (cfgdown[0] >= 100){
		clearInterval(m_Timercfgup);
		setTimeout(function (){
		    window.parent.parent.$('#divUpgradeico').hide();
			window.parent.parent.$('#UpgradeClose').hide();
			window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
			window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatesuccess'));	
		 },60000); 
	}else if (cfgdown[1]==1){
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpgradepackageerror'));
		clearInterval(m_Timercfgup);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}else if(cfgdown[1]==2){
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#divUpgradeExplain').show().html(getNodeValue('MUpdatefailed'));
		clearInterval(m_Timercfgup);
		window.parent.parent.$('#divUpgradeico').hide();
		window.parent.parent.$('#UpgradePTZClose').show().prop("disabled",false);
	}
};
function outagememery(){
	  var mode=$("#outagememery").val();
	  if (mode=="outage"){
			 $("#sbuoutagetime").show(); 
		 	$("#submodepreset").hide();
		 }else if(mode=="preset"){
			 $("#sbuoutagetime").hide(); 
		 	$("#submodepreset").show();
		}
}
function PTZPanSave(obj){
	//CheackServerIDIntNum();
	var scanrate=$("#scanrate").val();
	var enabledepth=$("#enabledepth").val();
	var enableoutage=$("#enableoutage").val();
	var outagememery=$("#outagememery").val();
	var outagetime=$("#outagetime").val();
	var preset=$("#modepreset").val();
	if(!CheackServerIDIntNum(scanrate,'scanratetips','MScanningspeedgrade',Number(scanratemin),Number(scanratemax)))
	{
	    return;
	}
	if (outagememery=="outage")
	{
		 if(!CheackServerIDIntNum(outagetime,'outagetimetips','Mrecoverytime',Number(outagetimemin),Number(outagetimemax)))
		{
			return;
		}
	}
	var szXml = "<ptzbaseinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<scanrate>"+scanrate+"</scanrate>";
  	szXml += "<enabledepth>"+enabledepth+"</enabledepth>";
 	szXml += "<enableoutage>"+enableoutage+"</enableoutage>";
 	szXml += "</ptzbaseinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/base"
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
			 $(xmlDoc).find("statuscode").each(function(i){ 
				 var state= $(this).text();
				 if("0" == state)	//OK
				{
					//szRetInfo = m_szSuccessState+m_szSuccess1;
					maintain();
				}
				else
				{
					szRetInfo=  m_szErrorState+m_szError1;	
					$("#SetResultTips").html(szRetInfo);
					setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
				}
			});
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};
/*
保存自动维护
*/
function maintain(){
	var enabledepth=$("#enabledepth").val();
	var enableoutage=$("#enableoutage").val();
	var outagememery=$("#outagememery").val();
	var outagetime=$("#outagetime").val();
	var preset=$("#modepreset").val();
	var szXml = "<ptzweihuinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enableoutage>"+enableoutage+"</enableoutage>";
	szXml += "<outagememery>"+outagememery+"</outagememery>";
	if ($("#outagememery").val()=="outage")
	{
		szXml += "<outagetime>"+outagetime+"</outagetime>";
	}
	else
	{
		szXml += "<preset>"+preset+"</preset>";
	}
	szXml += "</ptzweihuinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/maintain"
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
			 $(xmlDoc).find("statuscode").each(function(i){ 
				 var state= $(this).text();
				 if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_szSuccess1;
				}
				else
				{
					szRetInfo=  m_szErrorState+m_szError1;	
				}
			});
			$("#SetResultTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
}
//云台恢复升级
function ptzfactory(obj){
	if (confirm(getNodeValue('MConfirmPTZrestorefactory'))){
	   var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<ptzevent>"+obj+"</ptzevent>";
		szXml += "</ptzparam>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
		$.ajax({
			type: "post",
			url:szURL,
			processData: false,//不转换
			data: xmlDoc,
			timeout: 15000,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
			},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		});
	}
};

/*************************************************
Function:		PanTask
Description:	守望设置
*************************************************/
function PanTask() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(PanTask);
pr(PanTask).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "Watchset"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initPanTask();
}
/*************************************************
Function:		initPanTask
Description:	初始化守望设置			
*************************************************/
function initPanTask()
{
	$("#waittimepreset").empty();
	for (i=1;i<=256;i++){
		$("<option value='" + i + "' >" + i + "</option>").appendTo("#waittimepreset");
	}
	GetWatchon();   //获取守望
	autoResizeIframe();
}

/*************************************************
Function:		GetWatchon
Description:	初始化守望获取
*************************************************/
function GetWatchon(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/watchon"
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
			//$(kd_szpresetgetXml).eq(0).find("info").each(function(i){ 
			//使能开关
			if("true" == $(xmlDoc).find('enable').eq(0).text())
		    {
			    $("#enablewatchon").val(true);
				$("#enablewatchon").prop("checked", true)
		    }else{
				$("#enablewatchon").val(false);
				$("#enablewatchon").prop("checked", false);
			}
			//守望模式
			$(xmlDoc).find("mode").each(function(i){ 
		  	 	var k_modexml= $(this).text();
				$("#modeWatchon").empty(); 
				 var k_modexmlopts = $(this).attr('opt').split(",");
				insertOptions2Select(k_modexmlopts, ["close", "hscan", "vscan", "preset", "pathcruise", "framescan","randscan", "fullviewscan", "syncscan"], ["optclose", "opthscan", "optvscan", "optpreset","optpathcruise","optframescan","optrandscan","optfullviewscan","optsyncscan"], "modeWatchon");
				setValueDelayIE6("modeWatchon" ,"","",k_modexml);
			});
			$(xmlDoc).find("waittime").each(function(i){ 
			    waittimevaluemin=$(this).attr('min');
			    waittimevaluemax=$(this).attr('max');
				$("#waittime").val($(this).text()).attr('maxlength' , waittimevaluemax.length); 
			    $("#fixewaittimeTips").html(waittimevaluemin+"~"+waittimevaluemax)
			}); 
			
			//预置位编号
		   $(xmlDoc).find("preset").each(function(i){ 
			  var waittimepreset=$(this).text();
			   var presetvaluemin=$(this).attr('min');
			   var presetvaluemax=$(this).attr('max');
			  $("#waittimepreset").empty();
				for (var i=presetvaluemin;i<=presetvaluemax;i++){
					$("<option value='" + i + "' >" + i + "</option>").appendTo("#waittimepreset");
						var selectCode=document.getElementById("waittimepreset"); 
						if(selectCode.options[i-1].value==waittimepreset){  
							selectCode.options[i-1].selected=true;  
						 } 
					};
			});
			
			$(xmlDoc).find("syncscan").each(function(i){ 
		  	  $("#waittimesyncscan").val($(this).text());
			});
			$(xmlDoc).find("pathcruise").each(function(i){ 
		  	  $("#waittimepathcruise").val($(this).text());
			});
		var modeWatchon=$("#modeWatchon").val();
		if (modeWatchon=="preset"){
			$("#subpreset").show();
			$("#subpathcruise").hide();
			$("#subsyncscan").hide();
		}else if(modeWatchon=="pathcruise"){
			$("#subpreset").hide();
			$("#subpathcruise").show();
			$("#subsyncscan").hide();
		}else if(modeWatchon=="syncscan"){
			$("#subpreset").hide();
			$("#subpathcruise").hide();
			$("#subsyncscan").show();
		}else{
			$("#subpreset").hide();
			$("#subpathcruise").hide();
			$("#subsyncscan").hide();
		}
		}
	});
};
//守望模式下拉
function modeWatchon(){
	var modeWatchon=$("#modeWatchon").val();
	if (modeWatchon=="preset"){
		$("#subpreset").show();
		$("#subpathcruise").hide();
		$("#subsyncscan").hide();
	}else if(modeWatchon=="pathcruise"){
		$("#subpreset").hide();
		$("#subpathcruise").show();
		$("#subsyncscan").hide();
	}else if(modeWatchon=="syncscan"){
		$("#subpreset").hide();
		$("#subpathcruise").hide();
		$("#subsyncscan").show();
	}else{
		$("#subpreset").hide();
		$("#subpathcruise").hide();
		$("#subsyncscan").hide();
	}
}

//守望保存
function PanTaskSave(obj){
	var enable=$("#enablewatchon").val();
	var waittime=$("#waittime").val();
	var mode=$("#modeWatchon").val();
	var preset=$("#waittimepreset").val();
	var pathcruise=$("#waittimepathcruise").val();
	var syncscan=$("#waittimesyncscan").val();
	
	if(!CheackServerIDIntNum(waittime,'waittimetips','MWaitingtime',Number(waittimevaluemin),Number(waittimevaluemax)))
	{
	    return;
	}
	if(mode == "pathcruise")
	{
		if(!CheackServerIDIntNum(pathcruise,'pathcruisetips','jswaittimepathcruise',pathcruisemin, pathcruisemax))
		{
	         return;
		}
	}
	if(mode == "syncscan")
	{
		if(!CheackServerIDIntNum(syncscan,'syncscantips','jswaittimesyncscan',syncscanmin, syncscanmax))
		{
	         return;
		}
	}
	var szXml = "<watchoninfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+enable+"</enable>";
  	szXml += "<mode>"+mode+"</mode>";
	szXml += "<waittime>"+waittime+"</waittime>";
	if (mode=="preset"){
		szXml += "<preset>"+preset+"</preset>";
	}else if(mode=="pathcruise"){
		szXml += "<pathcruise>"+pathcruise+"</pathcruise>";
	}else if(mode=="syncscan"){
	   szXml += "<syncscan>"+syncscan+"</syncscan>";
	}
 	szXml += "</watchoninfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/watchon"
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
			 $(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
				if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_szSuccess1;
				}else{
					szRetInfo=  m_szErrorState+m_szError1;	
				}
				});
			$("#SetResultTipsPanTask").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsPanTask").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
}
/*************************************************
Function:		PresetPoint
Description:	初始化预置点			
*************************************************/
function PresetPoint() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(PresetPoint);
pr(PresetPoint).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "PresetPoint"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
		changePTZLan();
	}, true);
	initPresetPoint();
	
}

function changePTZLan(){
	$(".ptz_auto").attr("title",getNodeValue("MPTZresetTitle"))  //复位
	$(".ptz_zoomIn").attr("title",getNodeValue("MzoomInTitle"))  //拉近
	$(".ptz_zoomOut").attr("title",getNodeValue("MzoomOutTitle"))  //拉远
	$(".ptz_PullAway").attr("title",getNodeValue("MpullAwayTitle"))  //聚近
	$(".ptz_PushIn").attr("title",getNodeValue("MpushInTitle"))  //聚远
	$(".ptz_focusautoPush").attr("title",getNodeValue("MfocusautoPushTitle"))  //自动聚焦
	$(".ptz_irisIn").attr("title",getNodeValue("MirisInTitle"))  //光圈+
	$(".ptz_irisOut").attr("title",getNodeValue("MirisOutTitle"))  //光圈-
	$(".ptz_focusauto").attr("title",getNodeValue("MfocusautoTitle"))  //自动光圈
};

/*************************************************
Function:		initPresetPoint
Description:	初始化预置点			
*************************************************/
function initPresetPoint()
{ // tt();
	   if(document.all)
	   {
			$("#main_PresetPoint").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="plugin_PresetPoint"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#main_PresetPoint").html('<embed id="plugin_PresetPoint" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		Plugin(); 
		if (m_PreviewOCX==null)
		{
			 $("#main_PresetPoint").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
		}
		else
		{
			plugin= top.parent.document.getElementById("IpcCtrl")
		    var plugin_PresetPoint=document.getElementById("plugin_PresetPoint")
		    plugin_PresetPoint.setPluginType("video");
		    plugin_PresetPoint.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);
			plugin_PresetPoint.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
		}
	
	
	$("#PTZPresetNumber").empty();
	for (i=1;i<=256;i++){
		$("<option value='" + i + "' >" + i + "</option>").appendTo("#PTZPresetNumber");
	}
	ptz_hover();
	$("#PTZ_Slider_1").slider({
		  range: "min",
		  value:50,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			$("#PTZ_Slider_value_1").val(ui.value);
		  },
		change: function( event, ui ) {
			$("#PTZ_Slider_value_1").val($( "#PTZ_Slider_1" ).slider( "value" ))
		  }});
		$("#PTZ_Slider_value_1").val($( "#PTZ_Slider_1" ).slider( "value" )).attr('maxlength',3);
		if($.browser.msie) {
			$('#PTZ_Slider_value_1').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#PTZ_Slider_value_1").val()))
					{
						  $("#PTZ_Slider_value_1").val($( "#PTZ_Slider_1" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#PTZ_Slider_value_1").val()) < 0 || parseInt($("#PTZ_Slider_value_1").val()) > 100 ){
						 $("#PTZ_Slider_value_1").val($( "#PTZ_Slider_1" ).slider( "value" ))
					}
					else
					{
						$("#PTZ_Slider_1").slider( "value", $("#PTZ_Slider_value_1").val() );
					}
			  }
			});
		};
		$( "#PTZ_Slider_value_1" ).change(function() {
			if (!CheackOnlyNum($("#PTZ_Slider_value_1").val()))
			{
				  $("#PTZ_Slider_value_1").val($( "#PTZ_Slider_1" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#PTZ_Slider_value_1").val()) < 0 || parseInt($("#PTZ_Slider_value_1").val()) > 100 ){
				 $("#PTZ_Slider_value_1").val($( "#PTZ_Slider_1" ).slider( "value" ))
			}
			else
			{
				$("#PTZ_Slider_1").slider( "value", $("#PTZ_Slider_value_1").val() );
			}
		});
		
		GetPresetPoint();
		autoResizeIframe();  
};
function GetPresetPoint(){
	   var PTZPresetNumber=$("#PTZPresetNumber").val();
	    var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	    var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/preset/"+PTZPresetNumber;
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
			$(xmlDoc).find("presetlist").each(function(i){ 
			  var	Sid=$(this).attr('size')
			  var  szpresetgetXml= $(this).children('presetsn').text();
			   var enableXml= $(this).find('enable').text();
			    $("#PTZname").val($(this).find('name').text());
				if (Sid!=0){
					var szpresetget=document.getElementById("PTZPresetNumber")
					for (i=0;i<szpresetget.length;i++){
					 if(szpresetget.options[i].value==szpresetgetXml){  
						szpresetget.options[i].selected=true;  
						}
					}
					if (enableXml=="true")
					{
						$("#PTZenable").attr("name","Mtrue").val(getNodeValue('Mtrue'));
					}
					else
					{
						$("#PTZenable").attr("name","Mfalse").val(getNodeValue('Mfalse'));
					}
				}else{
					$("#PTZenable").attr("name","Mfalse").val(getNodeValue('Mfalse'));
				}
			});
			$("#preset_set").prop("disabled",false)  // 启用
			$("#preset_remove").prop("disabled",false)  //启用
	        $("#preset_load").prop("disabled",false)  // 启用
	 
		},error: function(xhr, textStatus, errorThrown)
			{
				$("#preset_set").prop("disabled",false)  // 启用
			    $("#preset_remove").prop("disabled",false)  //启用
	            $("#preset_load").prop("disabled",false)  // 启用
				ErrStateTips(xhr);
			}
	});
};

function TurnPTZPresetPointText(iUpnpText)
{
	var szUpnpText = '';
	if('true' == iUpnpText)
	{
		console.log("aaa"+getNodeValue('MtruePreset'))
		szUpnpText = getNodeValue('MtruePreset');    //生效
	}
	else if('false' == iUpnpText)
	{
		szUpnpText = getNodeValue('MfalsePreset');    //未生效
	}
	return szUpnpText;
}

//预置点云台开始
function SetPresetStart(obj){
	m_bStartPTZ = true; 
	var panspeed=$("#PTZ_Slider_value_1").val();
	var tilspeed=$("#PTZ_Slider_value_1").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szPtzXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//预置点云台停止
function SetPresetStop(obj){
	if(m_bStartPTZ == false)
	    return;
	var panspeed=$("#PresetPoint_value").text();
	var tilspeed=$("#PresetPoint_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
/***********************
Function:		presetget
Description:	预置位数据获取
***********************/
function presetget(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/presetget"
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
			$(xmlDoc).find("presetlist").find("info").each(function(i){ 
		  	    Sid=$(this).attr('size');
			    szpresetgetXml= $(this).children('presetsn').text();
			    enableXml= $(this).children('enable').text();
			    $("#PTZname").val($(this).children('name').text());
			});
			if (Sid!=0){
				var szpresetget=document.getElementById("PTZPresetNumber")
				for (i=0;i<szpresetget.length;i++){
				 if(szpresetget.options[i].value==szpresetgetXml){  
					szpresetget.options[i].selected=true;  
					}
				}
				if (enableXml=="true")
				{
					$("#PTZenable").attr("name","Mtrue").val(getNodeValue('Mtrue'));
				}
				else
				{
					$("#PTZenable").attr("name","Mtrue").val(getNodeValue('Mfalse'));
				}
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//预置点编号下拉
function PTZPresetNumber(){
	var PTZPresetNumber=$("#PTZPresetNumber").val();
	var szXml = "<contentroot>";
	szXml +=$.cookie('authenticationinfo');
	szXml += "</contentroot>";
	var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/preset/"+PTZPresetNumber;
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
			$(xmlDoc).find("presetlist").each(function(i){ 
		  	   var Sid=$(this).attr('size');
				
			    szpresetgetXml= $(this).children("info").children('presetsn').text();
			    enableXml= $(this).children("info").children('enable').text();
			    $("#PTZname").val($(this).children("info").children('name').text());
				if (Sid==0){
					$("#PTZenable").attr("name","Mtrue").val(getNodeValue('Mfalse'));
					$("#PTZname").val("")
				}else{
				  var szpresetget=document.getElementById("PTZPresetNumber")
					for (i=0;i<szpresetget.length;i++){
					 if(szpresetget.options[i].value==szpresetgetXml){  
						szpresetget.options[i].selected=true;  
						}
					}
					if (enableXml=="true"){
						$("#PTZenable").attr("name","Mtrue").val(getNodeValue('Mtrue'));
					}else{
						$("#PTZenable").attr("name","Mtrue").val(getNodeValue('Mfalse'));
						}
				
				}
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
/*******预置点设置**********/
function SetPreset(obj){
	var preset=$("#PTZPresetNumber").val();
	var PTZname=$("#PTZname").val();  //使能
	if(!CheckDeviceName(PTZname,'PresetPointTips','jsPTZname',0,32))
	{
		return;	
	}
	$("#preset_set").prop("disabled",true)  // 禁用
	$("#preset_remove").prop("disabled",true)  // 禁用
	$("#preset_load").prop("disabled",true)  // 禁用
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	if (obj=="preset_remove"){
		szXml += "<enable>"+"false"+"</enable>";  //预置点1-256
		}else{
		    szXml += "<preset>"+preset+"</preset>";  //预置点1-256
			if (PTZname!=""){
				szXml += "<name>"+PTZname+"</name>";  //预置点名称
			}	
	}
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			  $(xmlDoc).find("statuscode").each(function(i){ 
				 var state= $(this).text();
				 if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_SetupSuccTips;  //设置成功
				}
				else
				{
					szRetInfo=  m_szErrorState+m_SetupfailedTips;  //设置失败
				}
			});
			$("#PresetPointTips").html(szRetInfo);
			setTimeout(function(){$("#PresetPointTips").html("");},5000);  //5秒后自动清除
			GetPresetPoint();
		},error: function(xhr, textStatus, errorThrown)
			{
				$("#preset_set").prop("disabled",false)  // 启用
			    $("#preset_remove").prop("disabled",false)  //启用
	            $("#preset_load").prop("disabled",false)  // 启用
				ErrStateTips(xhr);
			}
	});
}
//删除预置点
function SetPresetRemove(obj){
	$("#preset_set").prop("disabled",true)  // 禁用
	$("#preset_remove").prop("disabled",true)  // 禁用
	$("#preset_load").prop("disabled",true)  // 禁用
	var preset=$("#PTZPresetNumber").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<preset>"+preset+"</preset>";  //预置点1-256
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 $(xmlDoc).find("statuscode").each(function(i){ 
				 var state= $(this).text();
				 if("0" == state)	//OK
				{
					szRetInfo=  m_szSuccessState+m_szSuccess3;  //删除成功
				}
				else
				{
					szRetInfo=  m_szErrorState+m_DeletefailedTips;  //删除失败
				}
			});
			$("#PresetPointTips").html(szRetInfo);
			setTimeout(function(){$("#PresetPointTips").html("");},5000);  //5秒后自动清除
			GetPresetPoint();
		},error: function(xhr, textStatus, errorThrown)
			{
				$("#preset_set").prop("disabled",false)  // 启用
			    $("#preset_remove").prop("disabled",false)  //启用
	            $("#preset_load").prop("disabled",false)  // 启用
				ErrStateTips(xhr);
			}
	});
};

/*******预置点调用**********/
function SetPresetload(obj){
	
	var preset=$("#PTZPresetNumber").val();
	var PTZname=$("#PTZname").val();  //使能
	if(!CheckDeviceName(PTZname,'PresetPointTips','jsPTZname',0,32))
	{
		return;	
	}
	$("#preset_set").prop("disabled",true)  // 禁用
	$("#preset_remove").prop("disabled",true)  // 禁用
	$("#preset_load").prop("disabled",true)  // 禁用
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	if (obj=="preset_remove"){
		szXml += "<enable>"+"false"+"</enable>";  //预置点1-256
		}else{
		    szXml += "<preset>"+preset+"</preset>";  //预置点1-256
	}
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			  $(xmlDoc).find("statuscode").each(function(i){ 
				 var state= $(this).text();
				 if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_LoadSuccTips;  //调用成功
					$("#preset_set").prop("disabled",false)  // 启用
					$("#preset_remove").prop("disabled",false)  //启用
	        		$("#preset_load").prop("disabled",false)  // 启用
					
				}else{
					szRetInfo=  m_szErrorState+m_LoadfailedTips;  //调用失败
					$("#preset_set").prop("disabled",false)  // 启用
					$("#preset_remove").prop("disabled",false)  //启用
	       			$("#preset_load").prop("disabled",false)  // 启用
				}
			});
			$("#PresetPointTips").html(szRetInfo);
			setTimeout(function(){$("#PresetPointTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				$("#preset_set").prop("disabled",false)  // 启用
			    $("#preset_remove").prop("disabled",false)  //启用
	            $("#preset_load").prop("disabled",false)  // 启用
				ErrStateTips(xhr);
			}
	});
}

/*************************************************/
function Limit() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Limit);
pr(Limit).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "Limit"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
		changePTZLan();
	}, true);
	initLimit();
}
/*************************************************
Function:		
Description:	初始化限位功能				
*************************************************/
function initLimit()
{
	if(document.all)
	   {
			$("#mainpluginLimit").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginLimit"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginLimit").html('<embed id="pluginLimit" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
   Plugin();
   if (m_PreviewOCX==null)
	{
		 $("#mainpluginLimit").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
	}
	else
	{
		plugin= top.parent.document.getElementById("IpcCtrl")
	   var pluginLimit=document.getElementById("pluginLimit")
	   pluginLimit.setPluginType("video");
      pluginLimit.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);
	  pluginLimit.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
	}
	
	$("#PTZLimit").empty();
	for (i=1;i<=256;i++){
		$("<option value='" + i + "' >" + i + "</option>").appendTo("#PTZLimit");
	}
	$("#PTZ_Slider_2").slider({
		  range: "min",
		  value:50,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			$("#PTZ_Slider_value_2").val(ui.value);
		  },
		change: function( event, ui ) {
			$("#PTZ_Slider_value_2").val($( "#PTZ_Slider_2" ).slider( "value" ))
		  }});
		$("#PTZ_Slider_value_2").val($( "#PTZ_Slider_2").slider( "value" )).attr('maxlength',3);
		if($.browser.msie) {
			$('#PTZ_Slider_value_2').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#PTZ_Slider_value_2").val()))
					{
						  $("#PTZ_Slider_value_2").val($( "#PTZ_Slider_2" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#PTZ_Slider_value_2").val()) < 0 || parseInt($("#PTZ_Slider_value_2").val()) > 100 ){
						 $("#PTZ_Slider_value_2").val($( "#PTZ_Slider_2" ).slider( "value" ))
					}
					else
					{
						$("#PTZ_Slider_2").slider( "value", $("#PTZ_Slider_value_2").val() );
					}
			  }
			});
		};
		$( "#PTZ_Slider_value_2" ).change(function() {
			if (!CheackOnlyNum($("#PTZ_Slider_value_2").val()))
			{
				  $("#PTZ_Slider_value_2").val($( "#PTZ_Slider_2" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#PTZ_Slider_value_2").val()) < 0 || parseInt($("#PTZ_Slider_value_2").val()) > 100 ){
				 $("#PTZ_Slider_value_2").val($( "#PTZ_Slider_2" ).slider( "value" ))
			}
			else
			{
				$("#PTZ_Slider_2").slider( "value", $("#PTZ_Slider_value_2").val() );
			}
		});
	
  
	GetLimit();
	autoResizeIframe();
};
/*************************************************
Function:		GetLimit
Description:	获取限位			
*************************************************/
function GetLimit(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/limit"
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
			$(xmlDoc).find("keylimit").each(function(i){ 
		  	 var g_szkeylimit= $(this).text();
			  if (g_szkeylimit=="true"){
			    $("#modekey").val("open");
				$("#modekey").prop("checked", true);
				}else{
				   $("#modekey").val("close");
				   $("#modekey").prop("checked", false);
				};
			}); 
			$(xmlDoc).find("scanlimit").each(function(i){ 
		  	 var g_szscanlimit= $(this).text();
			 	 if (g_szscanlimit=="true"){
			  	    $("#scan").val("open");
					$("#scan").prop("checked", true);
				}else{
				   $("#scan").val("close");
				   $("#scan").prop("checked", false);
				};
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//PTZ限位点击
function SetLimitStart(obj){
	var panspeed=$("#Limit_value").text();
	var tilspeed=$("#Limit_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szPtzXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//PTZ限位弹起
function SetLimitStop(obj){
	var panspeed=$("#Limit_value").text();
	var tilspeed=$("#Limit_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}


//PTZ限位点击
function v5SetLimitStart(obj){
	var panspeed=$("#V5Limit_value").text();
	var tilspeed=$("#V5Limit_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szPtzXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//PTZ限位弹起
function v5SetLimitStop(obj){
	var panspeed=$("#V5Limit_value").text();
	var tilspeed=$("#V5Limit_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}

/**********v5限位***************************************/
function V5Limit() {
	SingletonInheritor.implement(this);
	
}
SingletonInheritor.declare(V5Limit);
pr(V5Limit).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "V5Limit"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
		changePTZLan();
	}, true);
	initV5Limit();
}
/*************************************************
Function:		initV5Limit
Description:	初始化v5限位功能				
*************************************************/
function initV5Limit()
{
		if(document.all)
	   {
			$("#mainpluginV5Limit").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginV5Limit"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginV5Limit").html('<embed id="pluginV5Limit" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		Plugin(); 
		if (m_PreviewOCX==null)
		{
			 $("#mainpluginV5Limit").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
		}
		else
		{
			plugin= top.parent.document.getElementById("IpcCtrl")
	  		 var pluginV5Limit=document.getElementById("pluginV5Limit")
	  		 pluginV5Limit.setPluginType("video");
     		 pluginV5Limit.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);
			 pluginV5Limit.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
		}
		
		$("#PTZ_Slider_3").slider({
		  range: "min",
		  value:50,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			$("#PTZ_Slider_value_3").val(ui.value);
		  },
		change: function( event, ui ) {
			$("#PTZ_Slider_value_3").val($( "#PTZ_Slider_3" ).slider( "value" ))
		  }});
		$("#PTZ_Slider_value_3").val($( "#PTZ_Slider_3" ).slider( "value" )).attr('maxlength',3);
		if($.browser.msie) {
			$('#PTZ_Slider_value_3').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#PTZ_Slider_value_3").val()))
					{
						  $("#PTZ_Slider_value_3").val($( "#PTZ_Slider_3" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#PTZ_Slider_value_3").val()) < 0 || parseInt($("#PTZ_Slider_value_3").val()) > 100 ){
						 $("#PTZ_Slider_value_3").val($( "#PTZ_Slider_3" ).slider( "value" ))
					}
					else
					{
						$("#PTZ_Slider_3").slider( "value", $("#PTZ_Slider_value_3").val() );
					}
			  }
			});
		};
		$( "#PTZ_Slider_value_3" ).change(function() {
			if (!CheackOnlyNum($("#PTZ_Slider_value_3").val()))
			{
				  $("#PTZ_Slider_value_3").val($( "#PTZ_Slider_3" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#PTZ_Slider_value_3").val()) < 0 || parseInt($("#PTZ_Slider_value_3").val()) > 100 ){
				 $("#PTZ_Slider_value_3").val($( "#PTZ_Slider_3" ).slider( "value" ))
			}
			else
			{
				$("#PTZ_Slider_3").slider( "value", $("#PTZ_Slider_value_3").val() );
			}
		});
		
	
	GetV5Limit();
	autoResizeIframe();
};
/*************************************************
Function:		GetV5Limit
Description:	获取V5限位			
*************************************************/
function GetV5Limit(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/limit"
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
		   if("true" == $(xmlDoc).find('keylimit').eq(0).text())
		    {
			    $("#V5modekey").val("open");
				$("#V5modekey").prop("checked", true);
		    }else{
				$("#V5modekey").val("close");
				$("#V5modekey").prop("checked", false);
			}
			
			if("true" == $(xmlDoc).find('scanlimit').eq(0).text())
		    {
			    $("#V5scan").val("open");
				$("#V5scan").prop("checked", true);
		    }else{
				$("#V5scan").val("close");
				$("#V5scan").prop("checked", false);
			}
	
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//PTZ限位点击
function SetLimitStart(obj){
	var panspeed=$("#Limit_value").text();
	var tilspeed=$("#Limit_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szPtzXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//PTZ限位弹起
function SetLimitStop(obj){
	var panspeed=$("#Limit_value").text();
	var tilspeed=$("#Limit_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function checkkey(obj){
	if($(obj).prop("checked")){ //选中
		 m_TimeMode = 1;
		$(obj).val('open');
		SetLimitckeck('manuallimitswitch_set')
		}else{
		m_TimeMode = 0;
		$(obj).val('close');	
		SetLimitckeck('manuallimitswitch_set')
		}
}
function v5checkkey(obj){
	if($(obj).prop("checked")){ //选中
		$(obj).val('open');
		v5SetLimitckeck('manuallimitswitch_set')
		}else{
		$(obj).val('close');	
		v5SetLimitckeck('manuallimitswitch_set')
		}
}
function SetLimitckeck(obj){
	var mode=$("#modekey").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<mode>"+mode+"</mode>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function v5SetLimitckeck(obj){
	var mode=$("#V5modekey").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<mode>"+mode+"</mode>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function checkscan(obj){
	if($(obj).prop("checked")){ //选中
		 m_TimeMode = 1;
		$(obj).val('open');
		SetLimitscan('scanlimitswitch_set')
		}else{
		m_TimeMode = 0;
		$(obj).val('close');	
		SetLimitscan('scanlimitswitch_set')
		}
}
function v5checkscan(obj){
	if($(obj).prop("checked")){ //选中
		$(obj).val('open');
		v5SetLimitscan('scanlimitswitch_set')
		}else{
		$(obj).val('close');	
		v5SetLimitscan('scanlimitswitch_set')
		}
}
function SetLimitscan(obj){
	var mode=$("#scan").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<mode>"+mode+"</mode>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function v5SetLimitscan(obj){
	var mode=$("#V5scan").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<mode>"+mode+"</mode>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}

/*******限位设置**********/
function SetLimit(obj){
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<mode>"+'key'+"</mode>"; 
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 k_szSetPresetXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}

function v5SetLimit(obj){
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 k_szSetPresetXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//扫描限位
function SetScanLimit(obj){
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<mode>"+'scan'+"</mode>";  //预置点1-256
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/*************************************************
Function:		Cruise
Description:	巡航扫描				
*************************************************/

function Cruise() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Cruise);
pr(Cruise).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "Cruise"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
		changePTZLan();
	}, true);
 	initCruise();
	//this.initCSS();	
}
/*************************************************
Function:		initCruise
Description:	初始化巡航扫描			
*************************************************/
function initCruise()
{
	
	if(document.all)
	   {
			$("#mainpluginCruise").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginCruise"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginCruise").html('<embed id="pluginCruise" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
	Plugin();
	if (m_PreviewOCX==null)
	{
		 $("#mainpluginCruise").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
	}
	else
	{
		plugin= top.parent.document.getElementById("IpcCtrl")
	   var pluginCruise=document.getElementById("pluginCruise")
	  pluginCruise.setPluginType("video");
	  pluginCruise.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);
	  pluginCruise.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
	}
	
	var currentStep=0;
	$("#PTZ_Slider_4").slider({
		  range: "min",
		  value:50,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			$("#PTZ_Slider_value_4").val(ui.value);
		  },
		change: function( event, ui ) {
			$("#PTZ_Slider_value_4").val($( "#PTZ_Slider_4" ).slider( "value" ))
			//SetImages()
		  }});
		$("#PTZ_Slider_value_4").val($( "#PTZ_Slider_4" ).slider( "value" )).attr('maxlength',3);
		if($.browser.msie) {
			$('#PTZ_Slider_value_4').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#PTZ_Slider_value_4").val()))
					{
						  $("#PTZ_Slider_value_4").val($( "#PTZ_Slider_4" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#PTZ_Slider_value_4").val()) < 0 || parseInt($("#PTZ_Slider_value_4").val()) > 100 ){
						 $("#PTZ_Slider_value_4").val($( "#PTZ_Slider_4" ).slider( "value" ))
					}
					else
					{
						$("#PTZ_Slider_4").slider( "value", $("#PTZ_Slider_value_4").val() );
					}
			  }
			});
		};
		$( "#PTZ_Slider_value_4" ).change(function() {
			if (!CheackOnlyNum($("#PTZ_Slider_value_4").val()))
			{
				  $("#PTZ_Slider_value_4").val($( "#PTZ_Slider_4" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#PTZ_Slider_value_4").val()) < 0 || parseInt($("#PTZ_Slider_value_4").val()) > 100 ){
				 $("#PTZ_Slider_value_4").val($( "#PTZ_Slider_4" ).slider( "value" ))
			}
			else
			{
				$("#PTZ_Slider_4").slider( "value", $("#PTZ_Slider_value_4").val() );
			}
		});

	
	GetCruise();//获取巡航扫描
	autoResizeIframe();
};



/*************************************************
Function:		GetCruise
Description:	获取巡航扫描			
*************************************************/
function GetCruise(Tid){
	if (typeof Tid=="undefined"){
	  var SelectCruisenum=1;
	}
	else if(Tid=="num"){
	  var SelectCruisenum=$("#SelectCruisenum").val();	
	}
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	  var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/pathcruise/"+SelectCruisenum
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
			 $("#EditCruise").prop("disabled",true)
			 $("#DelCruise").prop("disabled",true)
			 CruiseXml=xmlDoc;
			 RefreshCruiseXML();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//选择巡航路径
function ChangeCruise()
{
	 
	 if (CruiseChange==1)
	 {
		 if (confirm(getNodeValue('MChangeScan')))
		 {
			     CruiseSave("change");
		 }
		 else
		 {
			  GetCruise("num");
		 }
	 }
	 else
	 {
		 GetCruise("num");
	 }
}
//调用巡航路径
function Cruisepath(obj){
	var panspeed=$("#Cruise_value").text();
	var tilspeed=$("#Cruise_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<cruisepath>"+$("#SelectCruisenum").val()+"</cruisepath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			    var xmlDoc = GetparseXmlFromStr(Docxml);
				  $(xmlDoc).find("statuscode").each(function(i){ 
					 var state= $(this).text();
					 if("0" == state)	//OK
					{
						if (obj=="path_cruise_start")
						{
							szRetInfo = m_szSuccessState+m_LoadSuccTips;  //调用成功
						}
						else if(obj=="path_cruise_end")
						{
							szRetInfo = m_szSuccessState+m_StopsuccTips;//停止成功
						}
						
						$('#TbodyCruise tr').each(function(){$(this).css("background-color","#ffffff");}); 
						$("#EditCruise").prop("disabled",true)
						$("#DelCruise").prop("disabled",true)
						currentStep=0;
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
				$("#PathcruiseTips").html(szRetInfo);
				setTimeout(function(){$("#PathcruiseTips").html("");},5000);  //5秒后自动清除
			   
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//巡航路径解析xml
/*************************************************
Function:		RefreshCruiseXML
Description:	解析XML
Input:			无			
Output:			无
return:			无				
*************************************************/
function RefreshCruiseXML(){
			$(CruiseXml).find("cruiselist").each(function(i){ 
			     var k_szcruiselistSize=$(this).attr('size');
				 stoptimemin=$(this).attr('mintime');
				 stoptimemax=$(this).attr('maxtime');
				 $("#CruiseTime").attr('maxlength' , stoptimemax.length);
				 $("#PTZstoptime").html(stoptimemin+"~"+stoptimemax);
				 $("#Cruisestoptime").html(stoptimemin+"~"+stoptimemax)
				 k_szcruiselistmax=$(this).attr('max');
				  $("#SelectCruisenum").empty();
			     $("#TbodyCruise").empty();
				 if($(CruiseXml).find("cruisepath").length > 0){
					var cruisepathindex= $(CruiseXml).find("cruisepath").attr('index');
					Cruiseindex=cruisepathindex;
						for (var i=1;i<=k_szcruiselistmax;i++){
					   $("#SelectCruisenum").append( "<option  name='"+'Mcruisepath'+(i)+"'  value="+i+">" + getNodeValue('Mcruisepath'+(i)) + "</option>")
							var selectCode=document.getElementById("SelectCruisenum"); 
							if(selectCode.options[i-1].value==cruisepathindex){  
								selectCode.options[i-1].selected=true;  
							 } 
						};
					 
					 var  CruisePath=$(this).find('cruisepath').find('preset')
					 k_szcruisepathmax=$(CruiseXml).find('cruisepath').attr('max');
					 for(var j = 1; j <=CruisePath.length; j++)
					{
						var k_szcruiselistpreset=$(CruiseXml).find('preset').eq(j-1).attr('index');
						var staytime = $(CruisePath[j-1]).find('staytime').eq(0).text();
						var CruiseEnable = TurnPTZProperty($(CruisePath[j-1]).find('enable').eq(0).text());
						var Cruisename = $(CruisePath[j-1]).find('name').eq(0).text();
						 $("#TbodyCruise").append("<tr onclick='Cruiselineclick(this)'>"
								 +"<td class='td1'>"+(parseInt(j))+"</td>"
								 +"<td id='CruisePresetWin"+(parseInt(j))+"'>"+k_szcruiselistpreset+"</td>"
								 +"<td id='CruiseTime"+(parseInt(j))+"'>"+staytime+"</td>"
								// +"<td class='bag' id='CruiseEnable"+(parseInt(j))+"'>"+CruiseEnable+"</td>"
								 +"<td class='bag' id='CruiseEnable"+(parseInt(j))+"'><label name='M"+$(CruisePath[j-1]).find('enable').eq(0).text()+"'>"+CruiseEnable+"</label></td>"
								 +"<td class='bag' id='Cruisename"+(parseInt(j))+"'>"+Cruisename+"</td>"
								 +"</tr>");
					}; 
				}
				 var _len = $("#TbodyCruise tr").length; 
				 if (k_szcruisepathmax <= _len)
				 {
				   $("#showAddCruiseAddressWnd").prop("disabled", true);
				}
				else
				{
					$("#showAddCruiseAddressWnd").prop("disabled", false);
				}
			
			});//解析生成表格结束
		 CruiseChange=0;
		 autoResizeIframe();
};

/*************************************************
Function:		TurnPTZProperty
Description:	将英文转换成文字
Input:			iPTZProperty: 属性			
Output:			无
return:			无				
*************************************************/
function TurnPTZProperty(iPTZProperty)
{
	var szPTZProperty = '';
	if('false' == iPTZProperty)
	{
		szPTZProperty = getNodeValue('Mfalse');
	}
	else if('true' == iPTZProperty)
	{
		szPTZProperty = getNodeValue('Mtrue');
	}
	return szPTZProperty;
}

//巡航路径获取值
function GetCruisePresetPoint(obj){
	    var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	    var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/preset/"+obj;
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
			
			$(xmlDoc).find("presetlist").each(function(i){ 
		  	   
				
			   var szpresetgetXml= $(this).find('presetsn').text();
			   var sznameXml= $(this).find('name').text();
			   var szenableXml= $(this).find('enable').text();
			  // console.log("#CruiseTime"+szpresetgetXml)
			   $("#CruiseTime"+szpresetgetXml).html(sznameXml);
			    if (szenableXml=="false")//$("#PTZenable").attr("name","Mtrue").val(getNodeValue('Mtrue'));
			   {
				   $("#CruiseEnable"+szpresetgetXml).html("<label name='Mfalse'>"+getNodeValue("Mfalse")+"</label>");
			   }
			   else
			   {
					$("#CruiseEnable"+szpresetgetXml).html("<label name='Mtrue'>"+getNodeValue("Mtrue")+"</label>");  
			  }
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

/*
删除巡航路径
先发停止指令后在发删除指令
*/
function DelCruisepath(){
	if (!confirm(getNodeValue('AskTipDel')))
	{
		return; 
	}
	var panspeed=$("#Cruise_value").text();
	var tilspeed=$("#Cruise_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+"path_cruise_end"+"</ptzevent>";
	szXml += "<cruisepath>"+$("#SelectCruisenum").val()+"</cruisepath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			   
			    var xmlDoc = GetparseXmlFromStr(Docxml);
				  $(xmlDoc).find("statuscode").each(function(i){ 
					 var state= $(this).text();
					 if("0" == state)	//OK
					{
						szRetInfo = m_szSuccessState+m_szSuccess3;//删除成功
						$('#TbodyCruise tr').each(function(){$(this).css("background-color","#ffffff");}); 
						$("#EditCruise").prop("disabled",true)
						$("#DelCruise").prop("disabled",true)
						currentStep=0;
						
						var SelectCruisenum=$("#SelectCruisenum").val();
						var szXml = "<pathcruiseinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
						  szXml += "<cruiselist>";
						   szXml += "<cruisepath index='"+SelectCruisenum+"'>";
							szXml += "</cruisepath>"; 
						szXml += "</cruiselist>";
						szXml += "</pathcruiseinfo>";
						var xmlDoc = parseXmlFromStr(szXml);
						var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/pathcruise"
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
								  // GetCruise(SelectCruisenum);
								   var szXml = "<contentroot>";
									szXml +=$.cookie('authenticationinfo');
									szXml += "</contentroot>";
								  var xmlDoc = GetparseXmlFromStr(szXml);
								var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/pathcruise/"+SelectCruisenum
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
								  // $("#path_cruise_start").prop("disabled",false)
								  // $("#path_cruise_end").prop("disabled",true) 
										 CruiseXml=xmlDoc;
										 RefreshCruiseXML();
									},error: function(xhr, textStatus, errorThrown)
										{
											ErrStateTips(xhr);
										}
								});
								  
								  
								  
							},error: function(xhr, textStatus, errorThrown)
								{
									ErrStateTips(xhr);
								}
						});
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
					}
				});
				$("#PathcruiseTips").html(szRetInfo);
				setTimeout(function(){$("#PathcruiseTips").html("");},5000);  //5秒后自动清除
			 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});

};

//巡航路径保存
function CruiseSave(obj){
	if (obj=="change")
	{
		var SelectCruisenum=Cruiseindex;
	}
	else
	{
		var SelectCruisenum=$("#SelectCruisenum").val();
	}
	$('#TbodyCruise tr').each(function(){$(this).css("background-color","#ffffff");}); 
	var _len = $("#TbodyCruise tr").length; 
	var szXml = "<pathcruiseinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	  szXml += "<cruiselist size='"+_len+"' >";
	   szXml += "<cruisepath index='"+SelectCruisenum+"'>";
		  for (j=1;j<=_len;j++){
			    szXml += "<preset index='"+$("#CruisePresetWin"+parseInt(j)).html()+"' >";
					szXml += "<staytime >"+$("#CruiseTime"+parseInt(j)).html()+"</staytime>";
			   szXml += "</preset>"; 
			}
		  szXml += "</cruisepath>"; 
	szXml += "</cruiselist>";
 	szXml += "</pathcruiseinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/pathcruise"
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
			  $(xmlDoc).find("statuscode").each(function(i){ 
				 var state= $(this).text();
				 if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_szSuccess1;
					$("#EditCruise").prop("disabled",true);
					$("#DelCruise").prop("disabled",true);
					GetCruise("num");
				}else{
					szRetInfo=  m_szErrorState+m_szError1;
				}
			});
			$("#PathcruiseTips").html(szRetInfo);
			setTimeout(function(){$("#PathcruiseTips").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
	
}
//PTZ巡航扫描开始
function SetCruiseStart(obj){
	var panspeed=$("#Cruise_value").text();
	var tilspeed=$("#Cruise_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//巡航扫描停止
function SetCruiseStop(obj){
	var panspeed=$("#Cruise_value").text();
	var tilspeed=$("#Cruise_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
    
  	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//定位开始
/*************************************************/
function Location() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Location);
pr(Location).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "Location"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
		changePTZLan();
	}, true);
	initLocation();
}
/*************************************************
Function:		initLocation()
Description:	初始化定位功能功能				
*************************************************/
function initLocation()
{
	if(document.all)
	   {
			$("#mainpluginLocation").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginLocation"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginLocation").html('<embed id="pluginLocation" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
   Plugin();
   if (m_PreviewOCX==null)
	{
		 $("#mainpluginLocation").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
	}
	else
	{
		var plugin= top.parent.document.getElementById("IpcCtrl")
	   var pluginLocation=document.getElementById("pluginLocation")
	   pluginLocation.setPluginType("video");
       pluginLocation.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);
	   pluginLocation.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
	}
	
	$("#PTZ_Slider_6").slider({
		  range: "min",
		  value:50,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			$("#PTZ_Slider_value_6").val(ui.value);
		  },
		change: function( event, ui ) {
			$("#PTZ_Slider_value_6").val($( "#PTZ_Slider_6" ).slider( "value" ))
			//SetImages()
		  }});
		$("#PTZ_Slider_value_6").val($( "#PTZ_Slider_6" ).slider( "value" )).attr('maxlength',3);
		if($.browser.msie) {
			$('#PTZ_Slider_value_6').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#PTZ_Slider_value_6").val()))
					{
						  $("#PTZ_Slider_value_6").val($( "#PTZ_Slider_6" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#PTZ_Slider_value_6").val()) < 0 || parseInt($("#PTZ_Slider_value_6").val()) > 100 ){
						 $("#PTZ_Slider_value_6").val($( "#PTZ_Slider_6" ).slider( "value" ))
					}
					else
					{
						$("#PTZ_Slider_6").slider( "value", $("#PTZ_Slider_value_6").val() );
					}
			  }
			});
		};
		$( "#PTZ_Slider_value_6" ).change(function() {
			if (!CheackOnlyNum($("#PTZ_Slider_value_6").val()))
			{
				  $("#PTZ_Slider_value_6").val($( "#PTZ_Slider_6" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#PTZ_Slider_value_6").val()) < 0 || parseInt($("#PTZ_Slider_value_6").val()) > 100 ){
				 $("#PTZ_Slider_value_6").val($( "#PTZ_Slider_6" ).slider( "value" ))
			}
			else
			{
				$("#PTZ_Slider_6").slider( "value", $("#PTZ_Slider_value_6").val() );
			}
		});

	GetLocationCap("position=true");  
	Getcoordinate(); //获取坐标
	autoResizeIframe();
	 m_TimerCoordinate= setInterval("Getcoordinate()",2000);
};
/*************************************************
Function:		GetLocationCap
Description:	定位精准坐标能力集
Input:			无
Output:			无
return:			无				
*************************************************/
function GetLocationCap(obj){
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
			if($(xmlDoc).find("position").length > 0){
				$(xmlDoc).find("position").each(function(i){ 
					if($(this).text()!="true")
					{
						$("#MPrecisepositioning").hide();
					}
					else
					{
						$("#MPrecisepositioning").show();
					}
				});
			};
		}	
	});
}


/*************************************************
Function:		Getcoordinate
Description:	获取获取坐标		
*************************************************/
function Getcoordinate(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/coordinate"
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
		   var mutiple=10;
		   $(xmlDoc).find("x").each(function(i){ 
				  mutiplex=$(this).attr('mutiple');
				 xmin=$(this).attr('min')/Math.pow(mutiple,mutiplex);
				 //xmax=$(this).attr('max')/mutiplex;
				xmax=$(this).attr('max')/Math.pow(mutiple,mutiplex);
			    x=$(this).text()/Math.pow(mutiple,mutiplex);
				//$("#Levelx").attr('maxlength' , ($(this).attr('max')/mutiplex).length); 
		   });
		   $(xmlDoc).find("y").each(function(i){ 
				 mutipley=$(this).attr('mutiple');
				 ymin=$(this).attr('min')/Math.pow(mutiple,mutipley);
				 ymax=$(this).attr('max')/Math.pow(mutiple,mutipley);
				// y=$(this).text()/mutipley;
				 y=$(this).text()/Math.pow(mutiple,mutipley);
				//$("#Verticaly").attr('maxlength' , ($(this).attr('max'))/mutipley.length); 
		   });
		   
		   $("#xy").html("X:"+x+"  "+"Y:"+y )  //x
			
		// $("#xy").html($(xmlDoc).find('y').eq(0).text() )  //x	
	
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/*************************************************
Function:		accMul
Description:    javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
reutnr:    		arg1乘以arg2的精确结果
*************************************************/ 
function accMul(arg1,arg2)  
{  
    var m=0,s1=arg1.toString(),s2=arg2.toString();  
    try{m+=s1.split(".")[1].length}catch(e){}  
    try{m+=s2.split(".")[1].length}catch(e){}  
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)  
}
//水平定位
function panposion_set(obj){
	var Levelx=$("#Levelx").val();
	var Verticaly=$("#Verticaly").val();
	var mutiple=10;  //10的冥次方
	var Levelxtext=accMul(Levelx,(Math.pow(mutiple,mutiplex)));
	var Levelytext=accMul(Verticaly,(Math.pow(mutiple,mutipley)));
	if (obj=="panposion_set"){
		if(!CheackStringLenthPTZ(Levelx,'Levelxtips','jsLevelx',Number(xmin),Number(xmax)))
		{
			return;
		}
		var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<ptzevent>"+obj+"</ptzevent>";
		szXml += "<x mutiple='"+mutiplex+"'>"+Levelxtext+"</x>";
		szXml += "</ptzparam>";
	}
	else if(obj=="tiltposion_set")
	{
		if(!CheackStringLenthPTZ(Verticaly,'Verticalytips','jsVerticaly',Number(ymin),Number(ymax)))
		{
			return;
		}
		var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<ptzevent>"+obj+"</ptzevent>";
		szXml += "<y mutiple='"+mutipley+"'>"+Levelytext+"</y>";
		szXml += "</ptzparam>";
	}else if(obj=="ptposion_set"){
		if(!CheackStringLenthPTZ(Levelx,'Levelxtips','jsLevelx',Number(xmin),Number(xmax)))
		{
			return;
		}
		if(!CheackStringLenthPTZ(Verticaly,'Verticalytips','jsVerticaly',Number(ymin),Number(ymax)))
		{
			return;
		}
		var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		
		szXml += "<ptzevent>"+obj+"</ptzevent>";
		szXml += "<x mutiple='"+mutiplex+"'>"+Levelxtext+"</x>";
		szXml += "<y mutiple='"+mutipley+"'>"+Levelytext+"</y>";
		szXml += "</ptzparam>";
	}else if(obj=="turnto_machinezero"){
		var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		
		szXml += "<ptzevent>"+obj+"</ptzevent>";
		szXml += "</ptzparam>";
	}
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}

//定位定位PTZ限位点击
function LocationSetLimitStart(obj){
	var panspeed=$("#Location_value").text();
	var tilspeed=$("#Location_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//定位PTZ限位弹起
function LocationSetLimitStop(obj){
	var panspeed=$("#Location_value").text();
	var tilspeed=$("#Location_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//定位结束
/*************************************************
Function:		showAddCruiseAddressWnd
Description:	巡航路径弹出窗口
Input:			无		
Output:			无
return:			无				
*************************************************/
function showAddCruiseAddressWnd(obj){
	$("#mainpluginCruise").width(0).height(1);
	$("#CruisePresetWin").empty();
	for (i=1;i<=256;i++){
		$("<option name='MPreset' value='" + i + "' >" + getNodeValue("MPreset")+" "+ i + "</option>").appendTo("#CruisePresetWin");
	}
	setTimeout(function (){
		$('#divAddCruiseTable').modal({
			"close":false,   //禁用叉叉和ESC
			"position":[150]  
		});
		
				if (obj=="add"){
					$("#CruiseTielt").html("<label name='MaddCruise'>"+getNodeValue("MaddCruise")+"</label>");//添加巡航路径
					$("#btnCruiseAdd").show();
					$("#btnCruiseEdit").hide();
					$("#CruiseTime").val(10)
					GetPshowAddCruise();
				}
				else if(obj="edit"){
					$("#CruiseTielt").html("<label name='MEditCruise'>"+getNodeValue("MEditCruise"));//修改巡航路径
					$("#btnCruiseAdd").hide();
					$("#btnCruiseEdit").show();
					var upStep=currentStep;
					var CruisePresetWinEdit=$('#CruisePresetWin'+upStep).html();
					var Select_alarmnum=document.getElementById("CruisePresetWin")
					for (i=0;i<Select_alarmnum.length;i++){
					 if(Select_alarmnum.options[i].value==CruisePresetWinEdit){  
						Select_alarmnum.options[i].selected=true;  
						}
				   }
				   var upCruiseEnable=$('#CruiseEnable'+upStep).text();  //使能
				   var upCruisename=$('#Cruisename'+upStep).html();  //名称
				   var upContent=$('#CruiseTime'+upStep).html();  //停留时间
				   $("#CruiseEnable").val(upCruiseEnable)
				   $("#CruiseName").val(upCruisename)
				   $("#CruiseTime").val(upContent)
				}
	},10)
	
};
//巡航路径弹出窗口修改
function CruiseClickButton(obj){
	  var CruisePreset=$("#CruisePresetWin").val();
	  var CruiseTime=$("#CruiseTime").val();
	  var CruiseEnable=$("#CruiseEnable").val();
	  var CruiseName=$("#CruiseName").val();
	  if(!CheackServerIDIntNum(CruiseTime,'CruiseTimetips','jsCruiseTime',Number(stoptimemin),Number(stoptimemax)))
		{
			return;
		}
	if (obj=='add'){
		   var _len = $("#TbodyCruise tr").length;
		   $("#TbodyCruise").append("<tr onclick='Cruiselineclick(this)'>"
			 +"<td class='td1'>"+(parseInt(_len)+1)+"</td>"
			 +"<td  id='CruisePresetWin"+(parseInt(_len)+1)+"'>"+CruisePreset+"</td>"
			 +"<td id='CruiseTime"+(parseInt(_len)+1)+"'>"+CruiseTime+"</td>"
			 +"<td class='bag' id='CruiseEnable"+(parseInt(_len)+1)+"'>"+CruiseEnable+"</td>"
			 +"<td class='bag' id='Cruisename"+(parseInt(_len)+1)+"'>"+CruiseName+"</td>"
			 +"</tr>");
			 if (k_szcruisepathmax <= _len+parseInt(1)){
			   $("#showAddCruiseAddressWnd").prop("disabled", true);
			}else{
				$("#showAddCruiseAddressWnd").prop("disabled", false);
			}
			CruiseChange=1;
	}
	else if(obj=="edit"){
		
		   if (CruiseTime!=$('#CruiseTime'+currentStep).html())
		   {
			    CruiseChange=1;
		   }
		   if (CruisePreset!= $('#CruisePresetWin'+currentStep).html())
		   {
			    CruiseChange=1;
		   }
		  var _len = $("#TbodyCruise tr").length; 
		   $('#CruisePresetWin'+currentStep).html(CruisePreset);
		   $('#CruiseTime'+currentStep).html(CruiseTime);
		   $('#Cruisename'+currentStep).html(CruiseName);
		   $('#CruiseEnable'+currentStep).html(CruiseEnable);
	}
	$("#EditCruise").prop("disabled",true)
	$("#DelCruise").prop("disabled",true)
	$('#TbodyCruise tr').each(function(){$(this).css("background-color","#ffffff");}); 
	currentStep=0;
	$.modal.impl.close();	
	$("#mainpluginCruise").width("100%").height("100%")
	autoResizeIframe();
}


function GetPshowAddCruise(){
	    var CruisePresetWin=$("#CruisePresetWin").val();
	    var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	    var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/preset/"+CruisePresetWin;
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
			
			  $(xmlDoc).find("presetlist").each(function(i){ 
		  	   
				
			   var szpresetgetXml= $(this).find('presetsn').text();
			   var sznameXml= $(this).find('name').text();
			   var szenableXml= $(this).find('enable').text();
			  // console.log("#CruiseTime"+szpresetgetXml)
			   $("#CruiseName").val(sznameXml);
			   if (szenableXml=="false")
				{
					$("#CruiseEnable").attr("name","Mfalse").val(getNodeValue('Mfalse'));
				}
				else
				{
					$("#CruiseEnable").attr("name","Mtrue").val(getNodeValue('Mtrue'));
				}
			});
	 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//巡航路径点击每行
function Cruiselineclick(line){

  $('#TbodyCruise tr').each(function(){$(this).removeClass().addClass("treven");});
   var seq=$(line).children("td").html();
 //  console.log($(line).children("td").next().html())
   $(line).removeClass().addClass("trOdd").removeAttr("style");
   currentStep=seq;
   $("#DelCruise").prop("disabled", false);
   $("#EditCruise").prop("disabled", false);
   
  
};
//关闭弹出窗口
function Cruiseclose(){
	$.modal.impl.close();
	 $("#mainpluginCruise").width("100%").height("100%")
};

//删除选中行
function tabledel(){
	if(currentStep==0){
    alert('请选择一项!');
	return false;
  }
  $("#TbodyCruise tr").each(
    function(){
	  var seq=parseInt($(this).children("td").html());
	  if(seq==currentStep) $(this).remove();
	  if(seq>currentStep) $(this).children("td").each(function(i){if(i==0){$(this).html(seq-1)}});}
  );
  
  
  var _len = $("#TbodyCruise tr").length; 
	 if (k_szcruisepathmax <= _len){
	   $("#showAddCruiseAddressWnd").prop("disabled", true);
	}else{
		$("#showAddCruiseAddressWnd").prop("disabled", false);
	}
	
	
	$("#TbodyCruise tr").each(function(i,data) {
			    $(this).children("td").next().attr("id","CruisePresetWin"+(i+1));
				$(this).children("td").next().next().attr("id","CruiseTime"+(i+1));
				$(this).children("td").next().next().next().attr("id","CruiseEnable"+(i+1));
				$(this).children("td").next().next().next().next().attr("id","Cruisename"+(i+1));
		});
  currentStep=0;
  $("#EditCruise").prop("disabled", true);
  $("#DelCruise").prop("disabled", true);
  CruiseChange=1;
  autoResizeIframe();
}
//修改巡航路径选择中行
function EditCruise(){
	
	$("#divEditCruiseTable").modal();
	$("#mainpluginCruise").width(0).height(1)
	$("#EditCruisePresetWin").empty();
	for (i=1;i<=256;i++){
		$("<option value='" + i + "' >" + getNodeValue("MPreset")+" "+ i + "</option>").appendTo("#EditCruisePresetWin");
	}
	var upStep=currentStep;
	var CruisePresetWinEdit=$('#CruisePresetWin'+upStep).html();
	
	var Select_alarmnum=document.getElementById("EditCruisePresetWin")
	for (i=0;i<Select_alarmnum.length;i++){
	 if(Select_alarmnum.options[i].value==CruisePresetWinEdit){  
		Select_alarmnum.options[i].selected=true;  
		}
   }
  // alert(Select_alarmnum)
	//console.log(upStep)
	var upContent=$('#CruiseTime'+upStep).html();
	$("#EditCruiseTime").val(upContent)
}
function CruiseEditOKclick(){
  var EditCruisePresetWin=$("#EditCruisePresetWin").val();
  var EditCruiseTime=$("#EditCruiseTime").val();
  
  if(!CheackServerIDIntNum(EditCruiseTime,'EditCruiseTimetips','jsCruiseTime',5,1800))
	{
	    return;
	}
  var _len = $("#TbodyCruise tr").length; 
   $('#CruisePresetWin'+currentStep).html(EditCruisePresetWin);
   $('#CruiseTime'+currentStep).html(EditCruiseTime);
   $("#EditCruise").prop("disabled", true);
   $("#DelCruise").prop("disabled", true);
   currentStep=0;
  $.modal.impl.close();		
	$("#mainpluginCruise").width("100%").height("100%")
};
function Cancelclose(){
	$.modal.impl.close();	
    $("#EditCruise").prop("disabled", true);
    $("#DelCruise").prop("disabled", true);	
	$("#mainpluginCruise").width("100%").height("100%")
}
/*************************************************
Function:		ScanPattern
Description:	花样扫描扫描				
*************************************************/
function ScanPattern() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(ScanPattern);

pr(ScanPattern).update = function() {
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "ScanPattern"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
		changePTZLan();
	}, true);
	initScanPattern();
}
/*************************************************
Function:		initScanPattern
Description:	初始化花样扫描
Input:			无			
Output:			无
return:			无				
*************************************************/
function initScanPattern()
{
	if(document.all)
	   {
			$("#mainpluginScanPattern").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginScanPattern"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginScanPattern").html('<embed id="pluginScanPattern" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
   Plugin();
   if (m_PreviewOCX==null)
	{
		 $("#mainpluginScanPattern").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>");
	}
	else
	{
		plugin= top.parent.document.getElementById("IpcCtrl")
	   var pluginScanPattern=document.getElementById("pluginScanPattern")
	  pluginScanPattern.setPluginType("video");
	  pluginScanPattern.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);
	  pluginScanPattern.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage);
	}
	
	$("#PTZScanPattern").empty();
	for (i=1;i<=256;i++){
		$("<option value='" + i + "' >" + i + "</option>").appendTo("#PTZScanPattern");
	}
	$("#PTZ_Slider_5").slider({
		  range: "min",
		  value:50,
		  min: 0,
		  max: 100,
		  slide: function( event, ui ) {
			$("#PTZ_Slider_value_5").val(ui.value);
		  },
		change: function( event, ui ) {
			$("#PTZ_Slider_value_5").val($( "#PTZ_Slider_5").slider( "value" ))
			//SetImages()
		  }});
		$("#PTZ_Slider_value_5").val($( "#PTZ_Slider_5").slider( "value" )).attr('maxlength',3);
		
		if($.browser.msie) {
			$('#PTZ_Slider_value_5').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#PTZ_Slider_value_5").val()))
					{
						  $("#PTZ_Slider_value_5").val($( "#PTZ_Slider_5" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#PTZ_Slider_value_5").val()) < 0 || parseInt($("#PTZ_Slider_value_5").val()) > 100 ){
						 $("#PTZ_Slider_value_5").val($( "#PTZ_Slider_5" ).slider( "value" ))
					}
					else
					{
						$("#PTZ_Slider_5").slider( "value", $("#PTZ_Slider_value_5").val() );
					}
			  }
			});
		};
		$( "#PTZ_Slider_value_5" ).change(function() {
			if (!CheackOnlyNum($("#PTZ_Slider_value_5").val()))
			{
				  $("#PTZ_Slider_value_5").val($( "#PTZ_Slider_5" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#PTZ_Slider_value_5").val()) < 0 || parseInt($("#PTZ_Slider_value_5").val()) > 100 ){
				 $("#PTZ_Slider_value_5").val($( "#PTZ_Slider_5" ).slider( "value" ))
			}
			else
			{
				$("#PTZ_Slider_5").slider( "value", $("#PTZ_Slider_value_5").val() );
			}
		});

	
	initpatternsinfo();
	autoResizeIframe();
}
//切换时停止
function scanpath(){
	return;  //切换时不停止
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
};

//开始记录
function StartScanPattern(obj, scanpath){
	//var scanpath=$("#scanpath").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<scanpath>"+scanpath+"</scanpath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/patterns/stare"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			
			    $(xmlDoc).find("statuscode").each(function(i){ 
				    var  state=$(this).text();
					if (obj=="syncscan_rec"){
				   
					 if("0" == state)	//OK
						{
							szRetInfo = m_szSuccessState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecording");  //扫描路径记录中
							
						}else{
							szRetInfo=  m_szErrorState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecording");  //记录失败	
						}
					}else if(obj=="syncscan_stoprec"){
						 if("0" == state)	//OK
						{
							szRetInfo = m_szSuccessState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecord2");  //停止记录成功
							
						}else{
							szRetInfo = m_szErrorState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecord7");  //停止记录失败
						}
					}
					
				});
				$("#ScanPatternStartTips").html(szRetInfo);
				setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
			$.cookie('syncscan_rec', 0);   //开始记录
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//停止记录
function StopScanPattern(obj){
	var scanpath=$("#scanpath").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<scanpath>"+scanpath+"</scanpath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			$("#ClearScanPattern").attr('disabled',false)
			$("#PlayScanPattern").attr('disabled',false)
			$.cookie('syncscan_rec',null);   //停止记录
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//记录清除
function ClearScanPattern(obj){
	var scanpath=$("#scanpath").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<scanpath>"+scanpath+"</scanpath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			
			    $(xmlDoc).find("statuscode").each(function(i){ 
				    var state=$(this).text();
					 if("0" == state)	//OK
						{
							szRetInfo = m_szSuccessState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("Mcleanrecord");  //扫描路径清除记录
							
						}else{
							szRetInfo=  m_szErrorState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecord8");   //清除失败	
						}
					
				});
				$("#ScanPatternStartTips").html(szRetInfo);
				setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
			$.cookie('syncscan_rec', 0);   //开始记录
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//预览
function PlayScanPattern(obj){
	var scanpath=$("#scanpath").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<scanpath>"+scanpath+"</scanpath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			   $(xmlDoc).find("statuscode").each(function(i){ 
			       
			      var state=$(this).text();
					if (obj=="syncscan_preview"){
					 if("0" == state)	//OK
						{
							szRetInfo = m_szSuccessState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecord9");  //扫描路径开始预览
							
						}else{
							szRetInfo=  m_szErrorState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecord10");  //	预览失败
						}
					}else if(obj=="syncscan_stoppreview"){
						 if("0" == state)	//OK
						{
							szRetInfo = m_szSuccessState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecord11");  //停止预览成功
							
						}else{
							szRetInfo = m_szErrorState+getNodeValue("Mscanningpath")+scanpath+getNodeValue("MRecord12");  //停止预览失败
						}
					}
				});
				$("#ScanPatternStartTips").html(szRetInfo);
				setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
			//$.cookie('syncscan_preview',0);   //开始预览
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//停止
function PauseScanPattern(obj){
	$("#PauseScanPattern").attr('disabled',"false");//添加disabled属性
	$("#PlayScanPattern").removeAttr('disabled');//移除disabled属性
	var scanpath=$("#scanpath").val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<scanpath>"+scanpath+"</scanpath>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
			 $.cookie('syncscan_preview',null);   //停止预览
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//PTZ花样扫描开始
function SetScanPatternStart(obj){
	var panspeed=$("#ScanPattern_value").text();
	var tilspeed=$("#ScanPattern_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//PTZ花样扫描停止
function SetScanPatternStop(obj){
	var panspeed=$("#ScanPattern_value").text();
	var tilspeed=$("#ScanPattern_value").text();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
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
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function initpatternsinfo(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	   var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/patterns/info"
	  $.ajax({
		type: "post",
		url:szURL,
		async: false,  //同步
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
			  $("#scanpath").empty();
			    $(xmlDoc).find("patternslist").each(function(i,data) {
					  var g_size = $(this).attr('size');
					  for (i=1;i<=g_size;i++){
						$("<option name='"+'Mfigurepath'+(i)+"'  value='" + i + "' >"+getNodeValue('Mfigurepath'+(i))+"</option>").appendTo("#scanpath");
					  }
				});
			  
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

/*************************************************
Function:		patternsinfo
Description:	花样扫描信息获取			
*************************************************/
function patternsinfo(obj){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/patterns/info"
	$.ajax({
		type: "post",
		url:szURL,
		async: false,  //同步
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
			   var scanpath=$("#scanpath").val();
			  //记录 
			   if (obj=="syncscan_rec")
			   {
					var scanindex=$(xmlDoc).find('scanindex').eq(0).text();
					$(xmlDoc).find("state").each(function(i){ 
						 var k_szstate= $(this).text();
						 var bFind = false;
						   //判断是否存在
						   $(xmlDoc).find("patternslist").each(function(i,data) {
									var m_patternslist=$(this).find('pattern')
									for (var j = 1; j <=m_patternslist.length; j++)
									{ 
										var patternopt=$(xmlDoc).find('pattern').eq(j-1).attr('index');  
					 				    var patterntest=$(xmlDoc).find('pattern').eq(j-1).text();  
										if (patternopt==$("#scanpath").val() && patterntest=="true" ){
												bFind = true;
										}		
									}
							});
							
							
							
								
							if(k_szstate == 'set')	//OK
							{
									szRetInfo = m_szSuccessState+getNodeValue("Mfigurescan")+scanindex+getNodeValue("MRecording");    //花样扫描记录中
									$("#ScanPatternStartTips").html(szRetInfo);
									setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
							}
							else if(k_szstate == 'scan')	//OK
							{
									szRetInfo = m_szSuccessState+getNodeValue("Mfigurescan")+scanindex+getNodeValue("Mfigurescan1");//预览中，请求失败
									$("#ScanPatternStartTips").html(szRetInfo);
									setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
							}
				
							else if(bFind==true && k_szstate == 'idel')
							{
								var r = confirm(getNodeValue("Mconfirmask"));  //Mconfirmask花样扫描记录已存在，是否覆盖记录
									if (r==true){
											StartScanPattern(obj,scanpath)  
									}
							} 
							else if(bFind==false)
							{
								StartScanPattern(obj,scanpath);
							}
							
					});
					
			   }
			   else if(obj=="syncscan_stoprec")
			   {
				    var scanindex=$(xmlDoc).find('scanindex').eq(0).text();
					
				   $(xmlDoc).find("state").each(function(i){ 
						 var k_szstate= $(this).text();
							 if(k_szstate != 'set')	//OK
							{
								szRetInfo = m_szSuccessState+getNodeValue("MRecord1");  //MRecord1
								$("#ScanPatternStartTips").html(szRetInfo);
					            setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
							}
							else
							{
								StartScanPattern(obj,scanindex);
							}
					});
					
				 }
				 else if(obj=="syncscan_delete")
				 { //清除记录
						   $(xmlDoc).find("state").each(function(i){ 
								 var k_szstate= $(this).text();
								 var nScanPath=$("#scanpath").val();
								 
								 var bNull = false;
								 $(xmlDoc).find("patternslist").each(function(i,data) {
											var m_patternslist=$(this).find('pattern')
											for (var j = 1; j <=m_patternslist.length; j++)
											{ 
												var patternopt=$(xmlDoc).find('pattern').eq(j-1).attr('index');  
												var patterntest=$(xmlDoc).find('pattern').eq(j-1).text();  
												if (patternopt==$("#scanpath").val() && patterntest=="true" )
												{
													//console.log("000")
													bNull = true;
												}
											}
									});
													
								 
								    if(k_szstate == 'set')	//OK
									{
										szRetInfo = m_szSuccessState+getNodeValue("MScancleanerr");  //MScancleanerr花样扫描记录中，清除失败
										$("#ScanPatternStartTips").html(szRetInfo);
										setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
									}
									else if(k_szstate == 'scan')	//OK
									{
										szRetInfo = m_szSuccessState+getNodeValue("MScancleanerr1");  //MScancleanerr1花样扫描预览中，清除失败
										$("#ScanPatternStartTips").html(szRetInfo);
										setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
									}
									else if(bNull==false)	//
									{
										szRetInfo = m_szSuccessState+getNodeValue("MRecord3");
										$("#ScanPatternStartTips").html(szRetInfo);
										setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
									}
									else
									{
										ClearScanPattern(obj); 
									}
							});
							
				}   
				 ////////////////////////////////////////////////////////////////////////////////////////////////
				 //预览
				// PlayScanPattern(obj)
			     else if (obj=="syncscan_preview")
				 {
							
							
							
							$(xmlDoc).find("state").each(function(i){ 
							     var k_szstate= $(this).text();
								 var bFind = false;
								   //判断是否存在
								   $(xmlDoc).find("patternslist").each(function(i,data) {
											var m_patternslist=$(this).find('pattern')
											for (var j = 1; j <=m_patternslist.length; j++)
											{ 
												var patternopt=$(xmlDoc).find('pattern').eq(j-1).attr('index');  
												var patterntest=$(xmlDoc).find('pattern').eq(j-1).text();  
												if (patternopt==$("#scanpath").val() && patterntest=="true" ){
														bFind = true;
												}		
											}
									});
								   if(k_szstate == 'set')	//OK
									{
										szRetInfo = m_szSuccessState+getNodeValue("MScancleanerr2"); //
										$("#ScanPatternStartTips").html(szRetInfo);
										setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
									}
									else if(bFind!=true)	//OK
									{
										szRetInfo = m_szSuccessState+getNodeValue("MRecord4");
										$("#ScanPatternStartTips").html(szRetInfo);
										setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
									}
									else
									{
										 PlayScanPattern(obj)  
									}
							});
							
				 }
				 else if(obj=="syncscan_stoppreview")
				 {
					 var bFind = false; 
				     $(xmlDoc).find("state").each(function(i){ 
						 var k_szstate= $(this).text();
							if(k_szstate == 'scan')	//OK
							{
								bFind = true;
							}
					  });
					  if(bFind==true)
					  {
						  PlayScanPattern(obj);
					  }
					  else
					  {
						   szRetInfo = m_szSuccessState+getNodeValue("MRecord5");
						   $("#ScanPatternStartTips").html(szRetInfo);
						   setTimeout(function(){$("#ScanPatternStartTips").html("");},5000);  //5秒后自动清除
					  }
				}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}



/*************************************************
Function:		TimingTask
Description:	初始化定时任务			
*************************************************/
function TimingTask() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(TimingTask);
pr(TimingTask).update = function() {
	PTZPluginNull();
	if ($.cookie('syncscan_rec')!=null){
		stopPTZscanpath();
	}
	if ($.cookie('syncscan_preview')!=null){
		stopPTZsyncscan();
	}
	clearInterval(m_TimerCoordinate);
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["ptz", "TimingTask"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initTimingTask();
	autoResizeIframe();
	
}
/*************************************************
Function:		initTimingTask
Description:	初始化定时任务			
*************************************************/
function initTimingTask(){
	GetTimingTask();
}
/*************************************************
Function:		GetTimingTask
Description:	获取定时任务			
*************************************************/
function GetTimingTask()
{
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz/timetask"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/timetask.xml"
	
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
			 kd_TimingTaskXml=xmlDoc
			//启用定时任务
			$(xmlDoc).find("enable").eq(0).each(function(i){ 
			   enableTimingTaskXml=$(this).text()
			  if (enableTimingTaskXml=="true"){
					$("#TimeTaskCheck").val(true);
					$("#TimeTaskCheck").prop("checked", true);
				}else{
					$("#TimeTaskCheck").val(false);
					$("#TimeTaskCheck").prop("checked", false);
				};
			});
			
			//恢复时间
			$(xmlDoc).find("waittime").each(function(i,data) {
				var m_waittime= $(this).text();
				$("#waittimeTask").val(m_waittime);
				 waittimemin=$(this).attr('min');
				 waittimemax=$(this).attr('max');
				 $("#waittimeTaskTips").html(waittimemin+"~"+waittimemax)
			});
			
			AnalyTimeDayInfo(xmlDoc)  //解析XML只能星期一
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
	
}
//PTZ点击
function SetPTZStart(obj,mid){
	 m_bStartPTZ = true; 
	var panspeed=$("#PTZ_Slider_value_"+mid).val();
	var tilspeed=$("#PTZ_Slider_value_"+mid).val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	//szXml +=  $.cookie('authenticationinfo');
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		//async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 g_szSetircutfilterXml =xhr.responseText;
			 if (obj!="ptz_reset"){
				 m_bStartPTZ = true; 
			 }
			
		},error: function(xhr, textStatus, errorThrown)
			{
				m_bStartPTZ = false;
				ErrStateTips(xhr);
				
			}
		
	});
}
//PTZ弹起
function SetPTZStop(obj,mid){
	if(m_bStartPTZ == false)
	    return;
	m_bStartPTZ = false;
	
	var panspeed=$("#PTZ_Slider_value_"+mid).val();
	var tilspeed=$("#PTZ_Slider_value_"+mid).val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	//szXml +=  $.cookie('authenticationinfo');
	szXml += "<ptzevent>"+obj+"</ptzevent>";
	szXml += "<panspeed>"+panspeed+"</panspeed>";
	szXml += "<tilspeed>"+tilspeed+"</tilspeed>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		//async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 g_szSetircutfilterXml =xhr.responseText;
			 m_bStartPTZ = false;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function SetPTZClick(obj,mid){
	var panspeed=$("#PTZ_Slider_value_"+mid).val();
	var tilspeed=$("#PTZ_Slider_value_"+mid).val();
	var szXml = "<ptzparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	//szXml +=  $.cookie('authenticationinfo');
  	szXml += "<ptzevent>"+obj+"</ptzevent>";
 	szXml += "</ptzparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/video/ptz"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		async: false,  //同步
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{ 
			 g_szSetircutfilterXml =xhr.responseText;
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//切换TAB清空插件窗口
function PTZPluginNull(){
   $("#plugin_PresetPoint").html("");
   $("#main_PresetPoint").html("");
   $("#mainpluginLimit").html(""); 
   $("#pluginLimit").html("");
   $("#mainpluginV5Limit").html("");
   $("#pluginV5Limit").html("");
   $("#mainpluginCruise").html("");
   $("#pluginCruise").html("");
   $("#mainpluginLocation").html("");
   $("#pluginLocation").html("");
};
