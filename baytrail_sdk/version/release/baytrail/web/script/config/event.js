document.charset = "utf-8";
var g_oXmlRtspPort;
var g_bIsRestart = true;
var g_oXhr = null;
var g_oSNMPXml = null;  //记录取得的snmp信息
var g_iMTUMin = 500;
var g_iMTUMax = 1500;
var g_Guardtext=null;
var Event = {
	tabs: null	// 保存网络配置页面的tabs对象引用
	
};

/*************************************************
*************************************************/
function Motion() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Motion);
pr(Motion).update = function() {
	EvnetPluginNull();
	var that = this;
	$.ajax({
		url: "params/schedule.htm",
		type: "GET",
		dataType: "html",
		cache:false,
		success: function(msg) {
			$("#TimeScheduleEdit1").html(msg);
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["event", "videoAnalyze"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			}, true);
			g_transStack.push(function() {
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
		}
	});
	$("#Startdrawing").attr("name","Startdrawing");
	initMotion();
};
/*************************************************
Function:		initMotion
Description:	初始化initMotion页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initMotion()
{
    GetMotionplugin();   //插件  
	GetMotion();
	GetEventMotionTimeInfo();   //初始化移动侦测布防时间
	autoResizeIframe();
	
}
function GetMotionplugin(){
	if(document.all)
	   {
			$("#mainplugin").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginMotion"  width="100%" height="100%"></object>')
		   }
	   else
		   {
			$("#mainplugin").html('<embed id="pluginMotion" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		  
   Plugin();
   
    if (m_PreviewOCX!=null){
	   var pluginMotion=document.getElementById("pluginMotion")
	   pluginMotion.setPluginType("motiondetect");
	   if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret=pluginMotion.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),'','',''); //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
			var ret=pluginMotion.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin); //开始播放	
		 //  alert("过用户")
		}
		pluginMotion.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
	  loadBackPlay(document.getElementById("mainplugin"));
	}
	
	for (i=1;i<=256;i++){
		$("#Motionptz_Input").append("<option  value='" + i + "'>" +   i  +"</option>");   //替换下拉菜单里文字
	} 
   
};
function sideMotion(){
	$( "#slider_Motion" ).slider({
		  range: "min",
		  value: detectsider,
		  min: Motionalar_min,
		  max: Motionalar_max,
		  slide: function( event, ui ) {
			$("#Motion_value").val(ui.value);
		  },
		change: function( event, ui ) {
			$("#Motion_value").val($("#slider_Motion" ).slider( "value" ))
		  }
		});
	 if($.browser.msie) {
		$('#Motion_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#Motion_value").val()))
					{
						  $("#Motion_value").val($( "#slider_Motion" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#Motion_value").val()) < parseInt(Motionalar_min) || parseInt($("#Motion_value").val()) > parseInt(Motionalar_max) ){
						 $("#Motion_value").val($( "#slider_Motion" ).slider( "value" ))
					}
					else
					{
						$("#slider_Motion").slider( "value", $("#Motion_value").val() );
					}
			  }
			});
		};
		$( "#Motion_value" ).change(function() {
			if (!CheackOnlyNum($("#Motion_value").val()))
			{
				  $("#Motion_value").val($( "#slider_Motion" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#Motion_value").val()) < parseInt(Motionalar_min) || parseInt($("#Motion_value").val()) > parseInt(Motionalar_max) ){
				 $("#Motion_value").val($( "#slider_Motion" ).slider( "value" ))
			}
			else
			{
				$("#slider_Motion").slider( "value", $("#Motion_value").val() );
			}
		});
};
/*************************************************
Function:		GetMotion
Description:	初始化移动侦测
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetMotion(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/detect/1"
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
		 var str1=Docxml.indexOf("linkmodes")
		  $("#Startdrawing").val(getNodeValue('Startdrawing'))
		  //$("#Startdrawing").attr("name","Startdrawing");
		  if (m_PreviewOCX!=null)
			{
				 var ret = document.getElementById("pluginMotion").eventWebToPlugin("detect","setparam",Docxml.substring (0,str1));  //获取的xml设置给插件
			}
			
			//移动侦侧拖动条
			$(xmlDoc).find("alllevel").each(function(i){ 
				 Motionalar_min=Number($(this).attr('min'));
				 Motionalar_max=Number($(this).attr('max'));
				 detectsider=Number($(this).text());
				 $("#Motion_value").val(detectsider).attr('maxlength',$(this).attr('max').length);
				 sideMotion();
			 });
			
			
			
			//是否启用
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#MotionCheck").val(true).prop("checked", true);
				$("#Startdrawing").prop("disabled",false);
				$("#ClearAll").prop("disabled",false);
				$("#ScheduleEditBtn").prop("disabled",false);
				$("#Motion_value").prop("disabled", false);
				$("#slider_Motion").slider('enable');	 //禁用拖动条
				
		    }else{
				$("#MotionCheck").val(false).prop("checked", false);
				$("#Startdrawing").prop("disabled",true);
				$("#ClearAll").prop("disabled",true);
				$("#ScheduleEditBtn").prop("disabled",true);
				$("#Motion_value").prop("disabled", true);
				$("#slider_Motion").slider('disable')	 //启用拖动条
			}
			
			
			//常规联动能力集
			$(xmlDoc).find("linkmodecaps").each(function(i){
				
				var g_audioout = $(this).find("audioout").eq(0).text();
				var g_uploadcenter = $(this).find("uploadcenter").eq(0).text();
				var g_rec = $(this).find("rec").eq(0).text();
				var g_showosd = $(this).find("showosd").eq(0).text();
				var g_snap = $(this).find("snap").eq(0).text();
				
				var g_normallink = false;
				
				if (g_audioout!="true")   //声音报警
				{
					$("#subMotionaudioout").hide();
				}
				else
				{
					$("#subMotionaudioout").show();
					g_normallink=true;
				}
				
				if (g_uploadcenter!="true") //上传中心
				{ 
					$("#subMotionuploadcenter").hide();
				}
				else
				{
					$("#subMotionuploadcenter").show();
					g_normallink=true;
				}
				
				if (g_rec!="true")  //录像联动
				{  
					$("#subMotionrec").hide();
				}
				else
				{
					$("#subMotionrec").show();
					g_normallink=true;
				}
				
				if (g_showosd!="true")//显示字幕
				{    
					$("#subMotionShowosd").hide();
				}
				else
				{
					$("#subMotionShowosd").show();
					g_normallink=true;
				}
				
				if (g_snap!="true") //抓拍
				{   
					$("#subMotionsnap").hide();
				}
				else{
					$("#subMotionsnap").show();
					g_normallink=true;
				}
				if (g_normallink!=true)
				{
					$("#subMotionNormalLink").hide();
				}
				else
				{
					$("#subMotionNormalLink").show();
				}
				
				
			});
			
			//其它联动能力集
			$(xmlDoc).find("otherlinkmodecaps").each(function(i){
				var g_alarmout = $(this).find("alarmout").eq(0).text();
				var g_ptz = $(this).find("ptz").eq(0).text();
				var g_present = $(this).find("preset").eq(0).text();
				
				var g_otherlink = false;
				
				if (g_alarmout!="true")   //报警输出
				{
					$("#suMotion").hide();
				}
				else
				{
					$("#suMotion").show();
					g_otherlink = true;
				}
				
				if (g_ptz!="true") //PTZ联动
				{ 
					$("#subMotionptz").hide();
				}
				else
				{
					$("#subMotionptz").show();
					g_otherlink = true;
				}
				
				if (g_present!="true")  //预置点序号
				{  
					$("#subMotionptzpresent").hide();
				}
				else
				{
					$("#subMotionptzpresent").show();
					g_otherlink = true;
				}
				
				if (g_otherlink!=true)
				{
					$("#subMotionOtherLink").hide();
				}
				else
				{
					$("#subMotionOtherLink").show();
				}
			});
			
			
			//常规联动
			 $(xmlDoc).find("linkmodes").each(function(i){ 
			      var uploadcenter=$(this).children('uploadcenter').text()
				   if("true" == uploadcenter)
					{
						$("#Motionuploadcenter").val(true).prop("checked", true);
					}else{
						$("#Motionuploadcenter").val(false).prop("checked", false);
					}
					
				  var showosd=$(this).children('showosd').text()
					 if("true" == showosd)
					{
						$("#MotionShowosd").val(true).prop("checked", true);
					}else{
						$("#MotionShowosd").val(false).prop("checked", false);
					}
					
					 var audioout=$(this).children('audioout').text()
					 if("true" == audioout)
					{
						$("#Motionaudioout").val(true).prop("checked", true);
					}else{
						$("#Motionaudioout").val(false).prop("checked", false);
					}
					
					var rec=$(this).children('rec').text()
					 if("true" == rec)
					{
						$("#Motionrec").val(true).prop("checked", true);
					}else{
						$("#Motionrec").val(false).prop("checked", false);
					}
					
					var snap=$(this).children('snap').text()
					 if("true" == snap)
					{
						$("#Motionsnap").val(true).prop("checked", true);
					}else{
						$("#Motionsnap").val(false).prop("checked", false);
					}
					
					var MotionPtz_enable=$(this).find('enable').text()
					if("true" == MotionPtz_enable)
					{
						$("#MotionInputPtz").val(true).prop("checked", true);
					}else
					{
						$("#MotionInputPtz").val(false).prop("checked", false);
					}
					
					var MotionPtz_preset=$(this).find('preset').text()
					var Select_preset=document.getElementById("Motionptz_Input")
						for (i=0;i<Select_preset.length;i++)
						{
						 if(Select_preset.options[i].value==MotionPtz_preset)
							{  
								Select_preset.options[i].selected=true;  
							}
					   }
					
			 });
			 
			
			 //其它联动
			$(xmlDoc).find("otherlinkmode").each(function(i){ 
				var k_szMotionalarSize=$(this).find('a1list').attr('size');
				var k_szMotionalara1=$(this).find('a1')
				$("#MotionAlCheck").empty();
				 for(var j = 1; j <=k_szMotionalarSize; j++)
				{
					var Motionalarenable = $(k_szMotionalara1[j-1]).find('enable').eq(0).text();
					var Motionalareindex = $(k_szMotionalara1[j-1]).find('index').eq(0).text();
					$("#MotionAlCheck").append("<input type='checkbox' class='checkbox' onclick='checkbox(this)' name='Motionalarmoutckboxindex' id='Motionalarmout"+parseInt(j)+"'/>"+"  "+"<label name='aAlarmoutput'>"+getNodeValue('aAlarmoutput')+"</label>"+parseInt(j)+"</br>");
				
					 if("true" == Motionalarenable)
						{
							$("#Motionalarmout"+parseInt(j)).val(true).prop("checked", true);
						}else{
							$("#Motionalarmout"+parseInt(j)).val(false).prop("checked", false);
						}
					
				}
			 });
			
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function checkboxMotion(obj){
	if (m_PreviewOCX==null)
	{
		return;
	}
	if($(obj).prop("checked"))//选中
	{ 
	  $(obj).val(true).prop("checked", true);
	  $("#Startdrawing").prop("disabled",false);
	  $("#ClearAll").prop("disabled",false);
	  $("#ScheduleEditBtn").prop("disabled",false);
	  $("#Motion_value").prop("disabled",false);
	  $("#slider_Motion").slider('enable');	 //禁用拖动条
	}
	else
	{
	  $(obj).prop("checked", false).val(false);
	   $("#Startdrawing").attr("name","Startdrawing").prop("disabled",true).val(getNodeValue('Startdrawing'))
	   $("#ClearAll").prop("disabled",true)
	   $("#ScheduleEditBtn").prop("disabled",true)
	    $("#Motion_value").prop("disabled",true);
	   $("#slider_Motion").slider('disable');	 //启用拖动条
	   document.getElementById("pluginMotion").eventWebToPlugin("detect","stop");
	}
}
/*************************************************
Function:		GetEventMotionTimeInfo
Description:	获取移动侦测布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetEventMotionTimeInfo(){
	var szXml = "<eventtimeparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<eventtype>"+'detect'+"</eventtype>";
 	szXml += "</eventtimeparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/AlarmTine.xml"
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
			//var v_szAlarm =xhr.responseText;
		    //var k_szgbAlarmXml = parseXmlFromStr(v_szAlarm);
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			AnalyTimeDayInfo(xmlDoc)  //解析XML只能星期一
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
	});

}
//开始绘制
function Startdrawing(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsMotion").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsMotion").html("");},5000);  //5秒后自动清除
		return;
	}
	if ($(obj).val()==getNodeValue('Startdrawing'))
	{
        $("#Startdrawing").attr("name","Stopdrawing");		
		$(obj).val(getNodeValue('Stopdrawing'));  //停止绘制
		document.getElementById("pluginMotion").eventWebToPlugin("detect","start");
	}
	else
	{
		$("#Startdrawing").attr("name","Startdrawing");		
		$(obj).val(getNodeValue('Startdrawing'));  //开始绘制
		document.getElementById("pluginMotion").eventWebToPlugin("detect","stop");
	}
}
//清空绘制
function ClearAll(){
	document.getElementById("pluginMotion").eventWebToPlugin("detect","clear");
};
//移动侦测保存
function SaveConfigMotion(obj){
    var ret =document.getElementById("pluginMotion").eventWebToPlugin("detect","save"); 
	//alert(ret)
	/*if (ret.substr(0,5)=="false"){
		alert(ret.substr(5));
		$("#Startdrawing").val("开始绘制");	
		document.getElementById("pluginMotion").eventWebToPlugin("detect","stop");
		return;
	}*/
	var Motionalarmcheckboxindex = $("input[name='Motionalarmoutckboxindex']");
	var szXml = "<detectinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<enabled>"+$("#MotionCheck").val()+"</enabled>";
		szXml += "<alllevel>"+$("#Motion_value").val()+"</alllevel>";
		szXml += ret;
		szXml += "<linkmodes>";
		  szXml += "<uploadcenter>"+$("#Motionuploadcenter").val()+"</uploadcenter>";
		  szXml += "<showosd>"+$("#MotionShowosd").val()+"</showosd>";
		  szXml += "<audioout>"+$("#Motionaudioout").val()+"</audioout>";
		  szXml += "<rec>"+$("#Motionrec").val()+"</rec>";
		  szXml += "<snap>"+$("#Motionsnap").val()+"</snap>";
		szXml += "</linkmodes>";
		

		szXml += "<otherlinkmode>";
		  szXml += "<a1list size='"+Motionalarmcheckboxindex.length+"' >";
			  for (j=1;j<=Motionalarmcheckboxindex.length;j++){
				  szXml += "<a1>";
					szXml += "<enable>"+$("#Motionalarmout"+parseInt(j)).val()+"</enable>";
					szXml += "<index>"+j+"</index>";
				szXml += "</a1>"; 
				}
			szXml += "</a1list>";
		szXml += "</otherlinkmode>";
		szXml += "</detectinfo>";
	
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/detect/1"
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
			$("#SetResultTipsMotion").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsMotion").html("");},5000);  //5秒后自动清除
			GetMotion();
			GetEventMotionTimeInfo();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}





/*********遮挡报警Alarm*************/
function Alarm() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Alarm);
pr(Alarm).update = function() {
	EvnetPluginNull();
	var that = this;
	$.ajax({
		url: "params/schedule.htm",
		type: "GET",
		dataType: "html",
		cache:false,
		success: function(msg) {
			$("#TimeScheduleEdit1").html(msg);
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["event", "videoAnalyze"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			}, true);
			g_transStack.push(function() {
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
		}
	});
    $("#StartdrawingAlarm").attr("name","Startdrawing");	
	initAlarm();
}
/*************************************************
Function:		initAlarm
Description:	初始化initAlarm页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initAlarm()
{
	
	GetAlarm();
	GetEventAlarmTimeInfo();  //获取布防时间
}
/*************************************************
Function:		GetMotion
Description:	初始化遮档报警
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarm(){
  	
  if(document.all)
	   {
			$("#mainpluginAlarm").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginAlarm"  width="100%" height="100%" ></object>')
		   }
	   else
		   {
			$("#mainpluginAlarm").html('<embed id="pluginAlarm" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
		  }
		  
   Plugin();
   
   if (m_PreviewOCX==null)
	{
		 $("#mainpluginAlarm").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>")
	}
    else
	{
		var pluginAlarm=document.getElementById("pluginAlarm")
	   pluginAlarm.setPluginType("tampering");
	   
	   if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			//alert("匿名")
			var ret=pluginAlarm.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),'','',''); //开始播放
			//alert("过插件")
		}else{
			//alert("用户")
		    var ret=pluginAlarm.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);  //开始播放	
		 //  alert("过用户")
		}
		pluginAlarm.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
       loadBackPlay(document.getElementById("pluginAlarm"));
	} 
	for (i=1;i<=256;i++){
		$("#Alarmptz_Input").append("<option  value='" + i + "'>" +   i  +"</option>");   //替换下拉菜单里文字
	} 
    Getshieldalarm()
	
	autoResizeIframe();
}
function shieldalarmside(){
	$( "#slider_sensitivity_Alarm" ).slider({
		  range: "min",
		  value: shieldalarm,
		  min: shieldalarm_min,
		  max: shieldalarm_max,
		  slide: function( event, ui ) {
			$("#sensitivity_Alarm_value").val(ui.value);
		  },
		  change: function( event, ui ) {
			$("#sensitivityt_Alarm_value").text($( "#slider_sensitivity_Alarm" ).slider( "value" ))
		  }
	}); 
	if($.browser.msie) {
			$('#sensitivity_Alarm_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#sensitivity_Alarm_value").val()))
					{
						  $("#sensitivity_Alarm_value").val($( "#slider_sensitivity_Alarm" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#sensitivity_Alarm_value").val()) < parseInt(shieldalarm_min) || parseInt($("#sensitivity_Alarm_value").val()) > parseInt(shieldalarm_max) ){
						 $("#sensitivity_Alarm_value").val($( "#slider_sensitivity_Alarm" ).slider( "value" ))
					}
					else
					{
						$("#slider_sensitivity_Alarm").slider( "value", $("#sensitivity_Alarm_value").val() );
					}
			  }
			});
		};
		$( "#sensitivity_Alarm_value" ).change(function() {
			if (!CheackOnlyNum($("#sensitivity_Alarm_value").val()))
			{
				  $("#sensitivity_Alarm_value").val($( "#slider_sensitivity_Alarm" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#sensitivity_Alarm_value").val()) < parseInt(shieldalarm_min) || parseInt($("#sensitivity_Alarm_value").val()) > parseInt(shieldalarm_max) ){
				 $("#sensitivity_Alarm_value").val($( "#slider_sensitivity_Alarm" ).slider( "value" ))
			}
			else
			{
				$("#slider_sensitivity_Alarm").slider( "value", $("#sensitivity_Alarm_value").val() );
			}
		});

};
function Getshieldalarm(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/shieldalarm/1"
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
		 var StrAlarm=Docxml.indexOf("linkmodes")
		 if (m_PreviewOCX!=null)
		 {
			var ret = document.getElementById("pluginAlarm").eventWebToPlugin("tampering","setparam",Docxml.substring (0,StrAlarm));  //获取的xml设置给插件
		 }
		 
		 $("#StartdrawingAlarm").val(getNodeValue('Startdrawing'))
		//  shieldalarm = $(xmlDoc).find('alllevel').eq(0).text()//遮蔽报警拖动条
		  
		  $(xmlDoc).find("alllevel").each(function(i){ 
			     shieldalarm_min=Number($(this).attr('min'));
				 shieldalarm_max=Number($(this).attr('max'));
			     shieldalarm =Number($(this).text());
				 $("#sensitivity_Alarm_value").val(shieldalarm).attr('maxlength',$(this).attr('max').length);
				 shieldalarmside();
			});
		  
		  
		  
		  if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#CheckAlarm").val(true).prop("checked", true);
				$("#StartdrawingAlarm").prop("disabled",false);
				$("#ClearAllAlarm").prop("disabled",false);
			    $("#ScheduleEditBtnAlarm").prop("disabled",false);
				$("#sensitivity_Alarm_value").prop("disabled",false);
				$("#slider_sensitivity_Alarm").slider('enable');	 //禁用拖动条
		    }else{
				$("#CheckAlarm").val(false).prop("checked", false);
				$("#StartdrawingAlarm").prop("disabled",true);
				$("#ClearAllAlarm").prop("disabled",true);
			    $("#ScheduleEditBtnAlarm").prop("disabled",true);
				$("#sensitivity_Alarm_value").prop("disabled",true);
				$("#slider_sensitivity_Alarm").slider('disable')	 //启用拖动条
			}
			
			//常规联动能力集
			$(xmlDoc).find("linkmodecaps").each(function(i){
				var g_audioout = $(this).find("audioout").eq(0).text();
				var g_uploadcenter = $(this).find("uploadcenter").eq(0).text();
				var g_rec = $(this).find("rec").eq(0).text();
				var g_showosd = $(this).find("showosd").eq(0).text();
				var g_snap = $(this).find("snap").eq(0).text();
				
				var g_normallink = false;
				
				if (g_audioout!="true")   //声音报警
				{
					$("#subAlarmAudioout").hide();
				}
				else
				{
					$("#subAlarmAudioout").show();
					g_normallink=true;
				}
				
				if (g_uploadcenter!="true") //上传中心
				{ 
					$("#subAlarmUploadcenter").hide();
				}
				else
				{
					$("#subAlarmUploadcenter").show();
					g_normallink=true;
				}
				
				if (g_rec!="true")  //录像联动
				{  
					$("#subAlarmrec").hide();
				}
				else
				{
					$("#subAlarmrec").show();
					g_normallink=true;
				}
				
				if (g_showosd!="true")//显示字幕
				{    
					$("#subAlarmshowosd").hide();
				}
				else
				{
					$("#subAlarmshowosd").show();
					g_normallink=true;
				}
				
				if (g_snap!="true") //抓拍
				{   
					$("#subAlarmSnap").hide();
				}
				else{
					$("#subAlarmSnap").show();
					g_normallink=true;
				}
				
				if (g_normallink!=true)
				{
					$("#subAlarmlinkmodecaps").hide();
				}
				else
				{
					$("#subAlarmlinkmodecaps").show();
				}
				
			});
			
			//其它联动能力集
			$(xmlDoc).find("otherlinkmodecaps").each(function(i){
				var g_alarmout = $(this).find("alarmout").eq(0).text();
				var g_ptz = $(this).find("ptz").eq(0).text();
				var g_present = $(this).find("present").eq(0).text();
				
				var g_otherlink = false;
				if (g_alarmout!="true")   //报警输出
				{
					$("#subalarmout").hide();
				}
				else
				{
					$("#subalarmout").show();
					g_otherlink=true;
				}
				
				if (g_ptz!="true") //PTZ联动
				{ 
					$("#subAlarmptz").hide();
				}
				else
				{
					$("#subAlarmptz").show();
					g_otherlink=true;
				}
				
				if (g_present!="true")  //预置点序号
				{  
					$("#subAlarmptzpresent").hide();
				}
				else
				{
					$("#subAlarmptzpresent").show();
					g_otherlink=true;
				}
				
				if (g_otherlink!=true)
				{
					$("#subAlarmOtherLink").hide();
				}
				else
				{
					$("#subAlarmOtherLink").show();
				}
			});
			
			//常规联动
		   $(xmlDoc).find("linkmodes").each(function(i){ 
				var AlarmUploadcenter =$(this).children('uploadcenter').text()
				 if("true" == AlarmUploadcenter)
				{
					$("#AlarmUploadcenter").val(true).prop("checked", true);
				}else
				{
					$("#AlarmUploadcenter").val(false).prop("checked", false);
				}
				
				var Alarmshowosd=$(this).children('showosd').text()
				 if("true" == Alarmshowosd)
				{
					$("#Alarmshowosd").val(true).prop("checked", true);
				}else
				{
					$("#Alarmshowosd").val(false).prop("checked", false);
				}
				
				var AlarmAudioout=$(this).children('audioout').text()
				 if("true" == AlarmAudioout)
				{
					$("#AlarmAudioout").val(true).prop("checked", true);
				}else
				{
					$("#AlarmAudioout").val(false).prop("checked", false);
				}
				
				var Alarmrec=$(this).children('rec').text()
				 if("true" == Alarmrec)
				{
					$("#Alarmrec").val(true).prop("checked", true);
				}else
				{
					$("#Alarmrec").val(false).prop("checked", false);
				}
				
				var AlarmSnap=$(this).children('snap').text()
				 if("true" == AlarmSnap)
				{
					$("#AlarmSnap").val(true).prop("checked", true);
				}else
				{
					$("#AlarmSnap").val(false).prop("checked", false);
				}
				
				var AlarmPtz_enable=$(this).find('enable').text()
				if("true" == AlarmPtz_enable)
				{
					$("#AlarmInputPtz").val(true).prop("checked", true);
				}else{
					$("#AlarmInputPtz").val(false).prop("checked", false);
				}
				var AlarmPtz_preset=$(this).find('preset').text()
				var Select_preset=document.getElementById("Alarmptz_Input")
					for (i=0;i<Select_preset.length;i++)
					{
					 if(Select_preset.options[i].value==AlarmPtz_preset)
					 	{  
							Select_preset.options[i].selected=true;  
						}
				   }
					
			});
			
			//其它联动
			$(xmlDoc).find("otherlinkmode").each(function(i){ 
				var k_szAlarmSize=$(this).attr('size');
				var k_szAlarma1=$(this).find('a1')
				$("#CheckAlarmEnabled").empty();
				 for(var j = 1; j <=k_szAlarma1.length; j++)
				{
					var Alarmchnsenable = $(k_szAlarma1[j-1]).find('enable').eq(0).text();
					var alarmchnsindex = $(k_szAlarma1[j-1]).find('index').eq(0).text();
					$("#CheckAlarmEnabled").append("<input type='checkbox' class='checkbox main_top8' onclick='checkbox(this)' name='Alarmcheckboxindex' id='AlarmChecka"+parseInt(j)+"'/>"+"  "+"<label name='aAlarmoutput'>"+getNodeValue('aAlarmoutput')+"</label>"+parseInt(j)+"</br>");
					//$("#InputChecka"+parseInt(j)).prop("checked", true);
					
					 if("true" == Alarmchnsenable)
						{
							$("#AlarmChecka"+parseInt(j)).val(true);
							$("#AlarmChecka"+parseInt(j)).prop("checked", true);
						}else{
							$("#AlarmChecka"+parseInt(j)).val(false);
							$("#AlarmChecka"+parseInt(j)).prop("checked", false);
						}
					
				}
			 });
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function checkboxAlarm(obj){
	if (m_PreviewOCX==null)
	{
		return;
	}
	if($(obj).prop("checked"))//选中
	{ 
	  $(obj).val(true).prop("checked", true);
	  $("#StartdrawingAlarm").prop("disabled",false);
	  $("#ClearAllAlarm").prop("disabled",false);
	  $("#ScheduleEditBtnAlarm").prop("disabled",false);
	  $("#sensitivity_Alarm_value").prop("disabled",false);
	  $("#slider_sensitivity_Alarm").slider('enable');	 //禁用拖动条 
	}else
	{
	   $(obj).prop("checked", false).val(false);
	   $("#StartdrawingAlarm").attr("name","Startdrawing").prop("disabled",true).val(getNodeValue('Startdrawing'));
	   $("#ClearAllAlarm").prop("disabled",true);
	  $("#ScheduleEditBtnAlarm").prop("disabled",true);
	  $("#sensitivity_Alarm_value").prop("disabled",true);
	  $("#slider_sensitivity_Alarm").slider('disable')	 //启用拖动条
	  document.getElementById("pluginAlarm").eventWebToPlugin("tampering","stop");
	   
	}
}
/*************************************************
Function:		GetEventAlarmTimeInfo
Description:	获取布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetEventAlarmTimeInfo(){
	var szXml = "<eventtimeparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<eventtype>"+'shield'+"</eventtype>";
 	szXml += "</eventtimeparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/AlarmTine.xml"
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
			//var v_szAlarm =xhr.responseText;
		      //var k_szgbAlarmXml = parseXmlFromStr(v_szAlarm);
			 var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
			AnalyTimeDayInfo(xmlDoc)  //解析XML只能星期一
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		*/
	});

}
//遮档报警开始绘制
function StartdAlarm(obj){
	if (m_PreviewOCX==null)
	{
		szRetInfo=  m_szErrorState+m_plugintips;  //安装插件	
		$("#SetResultTipsAlarm").html(szRetInfo);
		setTimeout(function(){$("#SetResultTipsAlarm").html("");},5000);  //5秒后自动清除
		return;
	}
	if ($(obj).val()==getNodeValue('Startdrawing')){
		//$(obj).val("停止绘制");
		$(obj).attr("name","Stopdrawing").val(getNodeValue('Stopdrawing'));	
		document.getElementById("pluginAlarm").eventWebToPlugin("tampering","start");
	}else
	{
		$(obj).attr("name","Startdrawing").val(getNodeValue('Startdrawing'));	
		document.getElementById("pluginAlarm").eventWebToPlugin("tampering","stop");
	}
  	
}
//遮档报警清空绘制
function ClearAllAlarm(){
	document.getElementById("pluginAlarm").eventWebToPlugin("tampering","clear");
};

//保存遮档报警
function SaveAlarm(){
	var alllevelside=$("#sensitivity_Alarm_value").val();
	//console.log(ret)
	var Alarmcheckboxindex = $("input[name='Alarmcheckboxindex']");
    var ret = document.getElementById("pluginAlarm").eventWebToPlugin("tampering","save");  //返回的xml结构
	var szXml = "<shieldalarminfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<enabled>"+$("#CheckAlarm").val()+"</enabled>";
	szXml += "<alllevel>"+$("#sensitivity_Alarm_value").val()+"</alllevel>";
	szXml += ret;
	szXml += "<linkmodes>";
	  szXml += "<uploadcenter>"+$("#AlarmUploadcenter").val()+"</uploadcenter>";
	  szXml += "<audioout>"+$("#AlarmAudioout").val()+"</audioout>";
	  szXml += "<snap>"+$("#AlarmSnap").val()+"</snap>";
	szXml += "</linkmodes>";
	
	szXml += "<otherlinkmode>";
	  szXml += "<a1list size='"+Alarmcheckboxindex.length+"' >";
		  for (j=1;j<=Alarmcheckboxindex.length;j++){
			  szXml += "<a1>";
				szXml += "<enable>"+$("#AlarmChecka"+parseInt(j)).val()+"</enable>";
				szXml += "<index>"+j+"</index>";
			szXml += "</a1>"; 
			}
		szXml += "</a1list>";
	szXml += "</otherlinkmode>";
	szXml += "</shieldalarminfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/shieldalarm/1"
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
			
			 
			$("#SetResultTipsAlarm").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsAlarm").html("");},5000);  //5秒后自动清除
			Getshieldalarm()
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
  
};

/*********警戒线Guard Line*************/
function Guard() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Guard);
pr(Guard).update = function() {
	EvnetPluginNull();
	var that = this;
	$.ajax({
		url: "params/schedule.htm",
		type: "GET",
		dataType: "html",
		cache:false,
		success: function(msg) {
			$("#TimeScheduleEdit1").html(msg);
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["event", "videoAnalyze"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			}, true);
			g_transStack.push(function() {
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
		},complete: function(msg) 
		{ 
			initGuardinfo();
			GetEventTimeInfo('guard');
		}
	});
	
}
/*************************************************
Function:		initGuardinfo
Description:	初始化警戒线
Input:			无			
Output:			无
return:			无				
*************************************************/
function initGuardinfo(){
	if(document.all)
	{
		$("#mainpluginGuard").html('<object classid=clsid:eb3c8939-56ae-5d53-a89a-cb2120cdcd29 id="pluginGuard"  width="100%" height="100%" ></object>')
	}
	else
	{
		$("#mainpluginGuard").html('<embed id="pluginGuard" type="application/x-ipcwebui"  width="100%" height="100%"></embed>')
	}
		  
   Plugin();
   
   if (m_PreviewOCX==null)
	{
		 $("#mainpluginGuard").html("<div class='plagndiv'><A href='javascript:void(0)' onclick='openWin(this)' class='mycls' onfocus='blur()'>"+"<label name='MPlugin'>"+getNodeValue("MPlugin")+"</label>"+"</a></div>")
	}
	else
	{
		var pluginGuard=document.getElementById("pluginGuard")
	   pluginGuard.setPluginType("warningline");
	   
	   if ($.cookie('authenticationinfo')==null || $.cookie('authenticationinfo')==''){
			var ret=pluginGuard.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),'','',''); //开始播放
		}else{
			var ret=pluginGuard.eventWebToPlugin("StartPlay",camera_hostname,camera_port.toString(),$.cookie('authenticationinfo'),UserNameLogin,UserPassLogin);  //开始播放	
		}
		pluginGuard.eventWebToPlugin("changelanguage",parent.translator.szCurLanguage)
	   loadBackPlay(document.getElementById("pluginGuard"));
	};
	$("#SGuard").attr("name","Startdrawing");
	GetGuard();
	autoResizeIframe();
	 
};
/*****获取警戒线********/
function GetGuard(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/1/warningline";
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/warningline.xml";
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
			if (xhr.readyState == 4) 
			{
		　　		if (xhr.status == 200) 
				{
					var Docxml =xhr.responseText;
		  			var xmlDoc = GetparseXmlFromStr(Docxml);
					GetWarningXML = xmlDoc;
					//初始化
					$( "#slider_Guard" ).slider();
					
					
					
					$("#SGuard").val(getNodeValue('Startdrawing'))
					$("#Guardptz_Input").empty(); 
					for (i=1;i<=256;i++){
						$("#Guardptz_Input").append("<option  value='" + i + "'>" +   i  +"</option>");   //替换下拉菜单里文字
					} 
					
					var str1=Docxml.indexOf("linelist")
				  if (m_PreviewOCX!=null)
					{
						 var ret = document.getElementById("pluginGuard").eventWebToPlugin("warningline","setparam",Docxml);  //获取的xml设置给插件
					}
					
					
					
					$(xmlDoc).find("levelminmax").each(function(i){
						 g_Guard_min=Number($(this).find('min').text());
						 g_Guard_max=Number($(this).find('max').text());
						 $("#Guard_value").attr('maxlength',$(this).find('max').text().length);
					 });
					
					
					//是否启用
					if("true" == $(xmlDoc).find('enabled').eq(0).text())
					{
						$("#CheckGuard").val(true).prop("checked", true);
						$("#GuardSelect").prop("disabled",false);
						$("#GuardDirection").prop("disabled",false);
						$("#ScheduleEditBtnGuard").prop("disabled",false);
						$("#Guard_value").prop("disabled", false);
						$("#slider_Guard").slider('enable');	 //禁用拖动条
						$("#SGuard").prop("disabled", false);
						$("#CGuard").prop("disabled", false);
						$("#GuardClearAll").prop("disabled", false);
					   
					}
					else
					{
						$("#CheckGuard").val(false).prop("checked", false);
						$("#GuardSelect").prop("disabled",true);
						$("#GuardDirection").prop("disabled",true);
						$("#ScheduleEditBtnGuard").prop("disabled",true);
						$("#Guard_value").prop("disabled", true);
						$("#slider_Guard").slider('disable')	 //启用拖动条
						$("#SGuard").prop("disabled", true);
						$("#CGuard").prop("disabled", true);
						$("#GuardClearAll").prop("disabled", true);
					   
					}
					
					RefreshWarninglineXML(xmlDoc);
					
					//常规联动能力集 
					$(xmlDoc).find("linkmodecaps").each(function(i){
						var g_audioout = $(this).find("audioout").eq(0).text();
						var g_uploadcenter = $(this).find("uploadcenter").eq(0).text();
						var g_rec = $(this).find("rec").eq(0).text();
						var g_showosd = $(this).find("showosd").eq(0).text();
						var g_snap = $(this).find("snap").eq(0).text();
						
						var g_normallink = false;
						
						if (g_audioout!="true")   //声音报警
						{
							$("#subGuardAudioout").hide();
						}
						else
						{
							$("#subGuardAudioout").show();
							g_normallink=true;
						}
						
						if (g_uploadcenter!="true") //上传中心
						{ 
							$("#subGuardUploadcenter").hide();
						}
						else
						{
							$("#subGuardUploadcenter").show();
							g_normallink=true;
						}
						
						if (g_rec!="true")  //录像联动
						{  
							$("#subGuardrec").hide();
						}
						else
						{
							$("#subGuardrec").show();
							g_normallink=true;
						}
						
						if (g_showosd!="true")//显示字幕
						{    
							$("#subGuardshowosd").hide();
						}
						else
						{
							$("#subGuardshowosd").show();
							g_normallink=true;
						}
						
						if (g_snap!="true") //抓拍
						{   
							$("#subGuardSnap").hide();
						}
						else{
							$("#subGuardSnap").show();
							g_normallink=true;
						}
						if (g_normallink!=true)
						{
							$("#subGuardlinkmodecaps").hide();
						}
						else
						{
							$("#subGuardlinkmodecaps").show();
						}
					});
					//其它联动能力集
					$(xmlDoc).find("otherlinkmodecaps").each(function(i){
						var g_alarmout = $(this).find("alarmout").eq(0).text();
						var g_ptz = $(this).find("ptz").eq(0).text();
						var g_present = $(this).find("preset").eq(0).text();
						
						var g_otherlink = false;
						
						if (g_alarmout!="true")   //报警输出
						{
							$("#subGuardout").hide();
						}
						else
						{
							$("#subGuardout").show();
							g_otherlink = true;
						}
						
						if (g_ptz!="true") //PTZ联动
						{ 
							$("#subGuardptz").hide();
						}
						else
						{
							$("#subGuardptz").show();
							g_otherlink = true;
						}
						
						if (g_present!="true")  //预置点序号
						{  
							$("#suGuardptzpresent").hide();
						}
						else
						{
							$("#suGuardptzpresent").show();
							g_otherlink = true;
						}
						
						if (g_otherlink!=true)
						{
							$("#subGuardOtherLink").hide();
						}
						else
						{
							$("#subGuardOtherLink").show();
						}
					});
					
					
					//常规联动
					 $(xmlDoc).find("linkmodes").each(function(i){ 
						  var uploadcenter=$(this).children('uploadcenter').text();
						  var showosd=$(this).children('showosd').text();
						  var audioout=$(this).children('audioout').text();
						  var rec=$(this).children('rec').text();
						  var snap=$(this).children('snap').text();
						   if("true" == uploadcenter)
							{
								$("#GuardUploadcenter").val(true).prop("checked", true);
							}
							else
							{
								$("#GuardUploadcenter").val(false).prop("checked", false);
							}
						  
							 if("true" == showosd)
							{
								$("#Guardshowosd").val(true).prop("checked", true);
							}
							else
							{
								$("#Guardshowosd").val(false).prop("checked", false);
							}
							
							 if("true" == audioout)
							{
								$("#GuardAudioout").val(true).prop("checked", true);
							}
							else
							{
								$("#GuardAudioout").val(false).prop("checked", false);
							}
							
							if("true" == rec)
							{
								$("#Guardrec").val(true).prop("checked", true);
							}
							else
							{
								$("#Guardrec").val(false).prop("checked", false);
							}
							
							if("true" == snap)
							{
								$("#GuardSnap").val(true).prop("checked", true);
							}
							else
							{
								$("#GuardSnap").val(false).prop("checked", false);
							}
							
							/*var MotionPtz_enable=$(this).find('enable').text()
							if("true" == MotionPtz_enable)
							{
								$("#MotionInputPtz").val(true).prop("checked", true);
							}else
							{
								$("#MotionInputPtz").val(false).prop("checked", false);
							}
							*/
							var MotionPtz_preset=$(this).find('preset').text()
							var Select_preset=document.getElementById("Motionptz_Input")
								for (i=0;i<Select_preset.length;i++)
								{
								 if(Select_preset.options[i].value==MotionPtz_preset)
									{  
										Select_preset.options[i].selected=true;  
									}
							   }
							
					 });
					 //其它联动
					$(xmlDoc).find("otherlinkmode").each(function(i){ 
						var g_otherSize=$(this).find('a1list').attr('size');
						var g_sza1=$(this).find('a1')
						$("#CheckGuardEnabled").empty();
						 for(var j = 1; j <=g_otherSize; j++)
						{
							var g_Guardenable = $(g_sza1[j-1]).find('enable').eq(0).text();
							var g_Guardindex = $(g_sza1[j-1]).find('index').eq(0).text();
							$("#CheckGuardEnabled").append("<input type='checkbox' class='checkbox' onclick='checkbox(this)' name='Guardindex' id='Guardindex"+parseInt(j)+"'/>"+"  "+"<label name='aAlarmoutput'>"+getNodeValue('aAlarmoutput')+"</label>"+parseInt(j)+"</br>");
						
							 if("true" == g_Guardenable)
								{
									$("#Guardindex"+parseInt(j)).val(true).prop("checked", true);
								}
								else
								{
									$("#Guardindex"+parseInt(j)).val(false).prop("checked", false);
								}
							
						}
						if ($(this).find('preset').length > 0)
						{
							var g_preset=$(this).find('preset').text();
							var selectCode=document.getElementById("Guardptz_Input"); 
							if(selectCode.options[i].value==g_preset)
							{  
								selectCode.options[i].selected=true;  
							 } 
						}
						
						
						
					 });
				}//200
			}
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
}

function GuardSelect(obj){
	if (obj=="Select")
	{
		document.getElementById("pluginGuard").eventWebToPlugin("warningline","SwitchLine",$("#GuardSelect").val());   //选择警戒线
		RefreshWarninglineXML(GetWarningXML,"secect")
	}
	else if(obj=="Direction")
	{
		document.getElementById("pluginGuard").eventWebToPlugin("warningline","SwitchDirection",$("#GuardDirection").val());   //选择警戒方向
	}
	
};
/*************************************************
Function:		RefreshWarninglineXML
Description:	解析警戒线绘制区域			
*************************************************/
function RefreshWarninglineXML(xmlInfo,secect){
  $(xmlInfo).find("linelist").each(function(i){
		if (secect!="secect"){
			$("#GuardSelect").empty(); 
			var GuardSelect=Number($(this).attr('max')); 
			for (i=1;i<=GuardSelect;i++){
				$("#GuardSelect").append("<option  value='" + i + "'>" +   i  +"</option>");   //替换下拉菜单里文字
			}
		}
		var _line = $(this).find('line');
		for (var i=0; i<_line.length;i++){
		   if ($(_line).find('index').eq(i).text()==$('#GuardSelect').val()){
				var g_direction= $(this).find("direction").eq(i).text();
				$('#GuardDirection').val(g_direction)
				if ($(_line).find("level").eq(i).length > 0)
				{
					 g_Guardtext=Number($(_line).find('level').eq(i).text());
				}
				if (g_Guardtext!=null)
				{
					$("#Guard_value").val(g_Guardtext);
					SliderEvent("guard");
				} 
				else
				{   
					$("#Guard_value").val(g_Guard_min);
					SliderEvent("guard");
				}
				break;	
		   };
		}
					
  });
};

/*************************************************
Function:		SGuard
Description:	绘制警戒线			
*************************************************/
function SGuard(obj){
   if ($(obj).val()==getNodeValue('Startdrawing')){
		//$(obj).attr("name","Mstopdraw").val(getNodeValue('Mstopdraw'));
		$(obj).attr("name","Stopdrawing").val(getNodeValue('Stopdrawing'));
		document.getElementById("pluginGuard").eventWebToPlugin("warningline","start");   //开始绘制
	}
	else
	{
	    //$(obj).val("绘制警戒线");
		$(obj).attr("name","Startdrawing").val(getNodeValue('Startdrawing'));
		document.getElementById("pluginGuard").eventWebToPlugin("warningline","stop");    //停止绘制
		
	}
	
	//document.getElementById("pluginGuard").eventWebToPlugin("warningline","start");   //开始绘制
}

/*************************************************
Function:		CGuard
Description:	清除警戒线			
*************************************************/
function CGuard(obj){
	if (obj=="CGuard")
	{
		document.getElementById("pluginGuard").eventWebToPlugin("warningline","clear"); 
	}
	else if(obj=="GuardClearAll"){
	   document.getElementById("pluginGuard").eventWebToPlugin("warningline","clearall"); 
	}
	
}


/*************************************************
Function:		GetEventTimeInfo
Description:	获取布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetEventTimeInfo(obj){
	var szXml = "<eventtimeparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	if(obj=="guard")
	{
		szXml += "<eventtype>"+'warningline'+"</eventtype>";
	}
 	szXml += "</eventtimeparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/time.xml"
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
			if (xhr.readyState == 4) 
			{
		　　		if (xhr.status == 200) 
				{
					var Docxml =xhr.responseText;
					var xmlDoc = GetparseXmlFromStr(Docxml);
					AnalyTimeDayInfo(xmlDoc)  //解析XML只能星期一
				}
			}
			
		}
	});
};
/*************************************************
Function:		SliderEvent
Description:	事件相关拖动条
Input:			无			
Output:			无
return:			无				
*************************************************/
function SliderEvent(obj){
	if (obj=="guard") //警戒线
	{
		$("#slider_Guard").slider({
		  range: "min",
		  value: g_Guardtext,
		  min: g_Guard_min,
		  max: g_Guard_max,
		  slide: function( event, ui ) {
			$("#Guard_value").val(ui.value);
		  },
		 stop: function( event, ui ) {
			$("#Guard_value").val($( "#slider_Guard" ).slider( "value" ));
			document.getElementById("pluginGuard").eventWebToPlugin("warningline","level",$("#Guard_value").val()); 
		  }
		}); //灵敏度
		if($.browser.msie) {
			$('#Guard_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#Guard_value").val()))
					{
						  $("#Guard_value").val($( "#slider_Guard" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#Guard_value").val()) < parseInt(g_Guard_min) || parseInt($("#Guard_value").val()) > parseInt(g_Guard_max) ){
						 $("#Guard_value").val($( "#slider_Guard" ).slider( "value" ))
					}
					else
					{
						$("#slider_Guard").slider( "value", $("#Guard_value").val() );
						document.getElementById("pluginGuard").eventWebToPlugin("warningline","level",$("#Guard_value").val()); 
					}
			  }
			});
		};//IE下回车
		$("#Guard_value").change(function() {
			if (!CheackOnlyNum($("#Guard_value").val()))
			{
				  $("#Guard_value").val($( "#slider_Guard" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#Guard_value").val()) < parseInt(g_Guard_min) || parseInt($("#Guard_value").val()) > parseInt(g_Guard_max) ){
				 $("#Guard_value").val($( "#slider_Guard" ).slider( "value" ))
			}
			else
			{
				$("#slider_Guard").slider( "value", $("#Guard_value").val() );
				document.getElementById("pluginGuard").eventWebToPlugin("warningline","level",$("#Guard_value").val()); 
			}
		});  //手动改变值
	}//guard end
	else if(obj=="virtualfocus")
	{
		$("#slider_Virtualfocus").slider({
		  range: "min",
		  value: virtualfocus_text,
		  min: virtualfocus_min,
		  max: virtualfocus_max,
		  slide: function( event, ui ) {
			$("#Virtualfocus_value").val(ui.value);
		  },
		 stop: function( event, ui ) {
			$("#Virtualfocus_value").val($( "#slider_Virtualfocus" ).slider( "value" ));
		  }
		}); //灵敏度
		if($.browser.msie) {
			$('#Virtualfocus_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#Virtualfocus_value").val()))
					{
						  $("#Virtualfocus_value").val($( "#slider_Virtualfocus" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#Virtualfocus_value").val()) < parseInt(virtualfocus_min) || parseInt($("#Virtualfocus_value").val()) > parseInt(virtualfocus_max) ){
						 $("#Virtualfocus_value").val($( "#slider_Virtualfocus" ).slider( "value" ))
					}
					else
					{
						$("#slider_Virtualfocus").slider( "value", $("#Virtualfocus_value").val() );
					}
			  }
			});
		};//IE下回车
		$("#Virtualfocus_value").change(function() {
			if (!CheackOnlyNum($("#Virtualfocus_value").val()))
			{
				  $("#Virtualfocus_value").val($( "#slider_Virtualfocus" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#Virtualfocus_value").val()) < parseInt(virtualfocus_min) || parseInt($("#Virtualfocus_value").val()) > parseInt(virtualfocus_max) ){
				 $("#Virtualfocus_value").val($( "#slider_Virtualfocus" ).slider( "value" ))
			}
			else
			{
				$("#slider_Virtualfocus").slider( "value", $("#Virtualfocus_value").val() );
			}
		});  //手动改变值
	}//virtualfocus end
	else if(obj=="sightchange")
	{
		$("#slider_Scene").slider({
		  range: "min",
		  value: sightchange_value,
		  min: sightchange_min,
		  max: sightchange_max,
		  slide: function( event, ui ) {
			$("#Scene_value").val(ui.value);
		  },
		 stop: function( event, ui ) {
			$("#Scene_value").val($( "#slider_Scene" ).slider( "value" ));
		  }
		}); //灵敏度
		if($.browser.msie) {
			$('#Scene_value').keydown(function(e){
			  if(e.keyCode==13)
			  {
				  if (!CheackOnlyNum($("#Scene_value").val()))
					{
						  $("#Scene_value").val($( "#slider_Scene" ).slider( "value" ))
						  return;
					}
					if (parseInt($("#Scene_value").val()) < parseInt(sightchange_min) || parseInt($("#Scene_value").val()) > parseInt(sightchange_max) ){
						 $("#Scene_value").val($( "#slider_Scene" ).slider( "value" ))
					}
					else
					{
						$("#slider_Scene").slider( "value", $("#Scene_value").val() );
					}
			  }
			});
		};//IE下回车
		$("#Scene_value").change(function() {
			if (!CheackOnlyNum($("#Scene_value").val()))
			{
				  $("#Scene_value").val($( "#slider_Scene" ).slider( "value" ))
				  return;
			}
			if (parseInt($("#Scene_value").val()) < parseInt(sightchange_min) || parseInt($("#Scene_value").val()) > parseInt(sightchange_max) ){
				 $("#Scene_value").val($( "#slider_Scene" ).slider( "value" ))
			}
			else
			{
				$("#slider_Scene").slider( "value", $("#Scene_value").val() );
			}
		});  //手动改变值
	}//sightchange end
	
	
	
};

/*************************************************
Function:		CheckboxEvent
Description:	启用相关
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheckboxEvent(obj){
	if (m_PreviewOCX==null)
	{
		return;
	}
	if (obj=="guard")
	{
		if($("#CheckGuard").prop("checked"))//选中
		{ 
		 	$("#CheckGuard").val(true).prop("checked", true);
			$("#GuardSelect").prop("disabled",false);
			$("#GuardDirection").prop("disabled",false);
			$("#ScheduleEditBtnGuard").prop("disabled",false);
			$("#Guard_value").prop("disabled", false);
			$("#slider_Guard").slider('enable');	 //禁用拖动条
			$("#SGuard").prop("disabled", false);
			$("#CGuard").prop("disabled", false);
			$("#GuardClearAll").prop("disabled", false);
		  
		}
		else
		{
			$("#CheckGuard").val(false).prop("checked", false);
			$("#GuardSelect").prop("disabled",true);
			$("#GuardDirection").prop("disabled",true);
			$("#ScheduleEditBtnGuard").prop("disabled",true);
			$("#Guard_value").prop("disabled", true);
			$("#slider_Guard").slider('disable')	 //启用拖动条
			$("#SGuard").attr("name","Startdrawing").val(getNodeValue('Startdrawing')).prop("disabled", true);
			$("#CGuard").prop("disabled", true);
			$("#GuardClearAll").prop("disabled", true);
			document.getElementById("pluginGuard").eventWebToPlugin("warningline","stop");
		}
	}
};
/*********遮挡报警Alarm*************/
function IntrusionDetection() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(IntrusionDetection);
pr(IntrusionDetection).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Event", "Alarm"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	
	initIntrusionDetection();
}
/*************************************************
Function:		initIntrusionDetection
Description:	初始化入侵侦测页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initIntrusionDetection()
{
	autoResizeIframe();
}

/*********报警输入*************/
function Input() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Input);
pr(Input).update = function() {
	
	var that = this;
	/*g_transStack.clear();
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["event", "Input"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	*/
	$.ajax({
		url: "params/schedule.htm",
		type: "GET",
		dataType: "html",
		cache:false,
		success: function(msg) {
			$("#TimeScheduleEdit1").html(msg);
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["event", "Input"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			}, true);
			g_transStack.push(function() {
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
		}
	});
	Plugin();
	initInput();
}
/*************************************************
Function:		initInput
Description:	初始化报警输入页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initInput()
{
	$("#ptz_Input").empty();
	//$("#LogType").append("<option id='"+'MajorTypeOpt'+(i + 1)+"' name='"+'MajorTypeOpt'+(i + 1)+"' value='"+BigType+"'>"+getNodeValue('MajorTypeOpt'+(i + 1))+"</option>");   //替换下拉菜单里文字
	for (i=1;i<=256;i++){
		//$("<option id='ptz+" + i + "'  name='ptz+" + i + "' value='" + i + "' >" + i + "</option>").appendTo("#ptz_Input");
		$("#ptz_Input").append("<option id='ptz" + i + "'  name='ptz" + i + "' value='" + i + "'>"
		  //+getNodeValue('ptz'+(i))
		 +   i  
		+"</option>");   //替换下拉菜单里文字
	}

    GetInput();
	GetEventInputTimeInfo();  //初始化报警输入布防时间
	autoResizeIframe();
}
/*************************************************
Function:		GetInput
Description:	初始化报警输入
*************************************************/
function GetInput(){
	var SelectAlarmnum=$("#SelectAlarmnum").val()
	$("#Inputcheckboxall").prop("checked", false);
	var szXml = "<alarminparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	
	if (SelectAlarmnum==null){
		szXml += "<alarmnum>"+1+"</alarmnum>";
	}else{
		szXml += "<alarmnum>"+SelectAlarmnum+"</alarmnum>";
	}
 	szXml += "</alarminparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/alarmin/1"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/eventinput.xml"
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
			 
			//是否启用
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#InputEnable").val(true).prop("checked", true);;
				
		    }else{
				$("#InputEnable").val(false).prop("checked", false);;
			}
			
			
			//常规联动能力集
			$(xmlDoc).find("linkmodecaps").each(function(i){
				var g_audioout = $(this).find("audioout").eq(0).text();
				var g_uploadcenter = $(this).find("uploadcenter").eq(0).text();
				var g_rec = $(this).find("rec").eq(0).text();
				var g_showosd = $(this).find("showosd").eq(0).text();
				var g_snap = $(this).find("snap").eq(0).text();
				
				var g_normallink = false;
				if (g_audioout!="true")
				{
					$("#subalarmout").hide();
				}
				else
				{
					$("#subalarmout").show();
					g_normallink=true;
				}
				
				if (g_uploadcenter!="true")
				{
					$("#subInputUploadcenter").hide();
				}
				else
				{
					$("#subInputUploadcenter").show();
					g_normallink=true;
				}
				
				if (g_rec!="true")
				{
					$("#subInputRec").hide();
				}
				else
				{
					$("#subInputRec").show();
					g_normallink=true;
				}
				
				if (g_showosd!="true")
				{
					$("#subInputShowosd").hide();
				}
				else
				{
					$("#subInputShowosd").show();
					g_normallink=true;
				}
				
				if (g_showosd!="true")
				{
					$("#subInputShowosd").hide();
				}
				else
				{
					$("#subInputShowosd").show();
					g_normallink=true;
				}
				
				if (g_snap!="true")
				{
					$("#subInputSnap").hide();
				}
				else
				{
					$("#subInputSnap").show();
					g_normallink=true;
				}
				
				if (g_normallink!=true)
				{
					$("#subInputNormalLink").hide();
				}
				else
				{
					$("#subInputNormalLink").show();
				}
			});
			
			 //异常联动能力集
			$(xmlDoc).find("otherlinkmodecaps").each(function(i){
				var g_alarmout = $(this).find("alarmout").eq(0).text();
				var g_ptz = $(this).find("ptz").eq(0).text();
				var g_present = $(this).find("present").eq(0).text();
				
				var g_otherlink = false;
				if (g_alarmout!="true")
				{
					$("#subInputalarmout").hide();
				}
				else
				{
					$("#subInputalarmout").show();
					g_otherlink=true;
				}
				
				if (g_ptz!="true")
				{
					$("#subInputptz").hide();
				}
				else
				{
					$("#subInputptz").show();
					g_otherlink=true;
				}
				
				if (g_present!="true")
				{
					$("#subInputptzpresent").hide();
				}
				else
				{
					$("#subInputptzpresent").show();
					g_otherlink=true;
				}
				
				if (g_otherlink!=true)
				{
					$("#subInputOtherLink").hide();
				}
				else
				{
					$("#subInputOtherLink").show();
				}
				
			});
			
			
			 $(xmlDoc).find("alarmnum").each(function(i){ 
				 k_szalarmnumopt=$(this).attr('max');
				 if (k_szalarmnumopt <= 1 )
				 {
					 $("#subcopytoalamin").hide();
				 }
				var k_szalarmnumxml=$(this).text();
				$("#SelectAlarmnum").empty();
				for (i=1;i<=k_szalarmnumopt;i++){
					$("<option value='" + i + "' >" + i + "</option>").appendTo("#SelectAlarmnum");
				}
				 var Select_alarmnum=document.getElementById("SelectAlarmnum")
					for (i=0;i<Select_alarmnum.length;i++){
					 if(Select_alarmnum.options[i].value==k_szalarmnumxml){  
						Select_alarmnum.options[i].selected=true;  
						}
				   }
			 });
			 $("#Inputalarmname").val($(xmlDoc).find('alarmname').eq(0).text() )//报警名称
			//报警类型alarmtype
			 $(xmlDoc).find("alarmtype").each(function(i){ 
		     	var k_alarmtypeopt1=$(this).attr('opt');
		  	 	var k_alarmtypexml= $(this).text();
				$("#SelectAlarmtype").empty(); 
				 var k_alarmtypeopts = k_alarmtypeopt1.split(",");
				insertOptions2Select(k_alarmtypeopts, ["open", "close"], ["Maopen", "Maclose"], "SelectAlarmtype");
				setValueDelayIE6("SelectAlarmtype" ,"","",k_alarmtypexml);
			}); 
			//常规联动
			$(xmlDoc).find("linkmodes").each(function(i){ 
				var InputUploadcenter =$(this).children('uploadcenter').text()
				 if("true" == InputUploadcenter)
				{
					$("#InputUploadcenter").val(true);
					$("#InputUploadcenter").prop("checked", true);
				}else{
					$("#InputUploadcenter").val(false);
					$("#InputUploadcenter").prop("checked", false);
				}
				
				var InputShowosd=$(this).children('showosd').text()
				 if("true" == InputShowosd)
				{
					$("#InputShowosd").val(true);
					$("#InputShowosd").prop("checked", true);
				}else{
					$("#InputShowosd").val(false);
					$("#InputShowosd").prop("checked", false);
				}
				
				var InputAudioout=$(this).children('audioout').text()
				 if("true" == InputAudioout)
				{
					$("#InputAudioout").val(true);
					$("#InputAudioout").prop("checked", true);
				}else{
					$("#InputAudioout").val(false);
					$("#InputAudioout").prop("checked", false);
				}
				
				
				var InputRec=$(this).children('rec').text()
				 if("true" == InputRec)
				{
					$("#InputRec").val(true);
					$("#InputRec").prop("checked", true);
				}else{
					$("#InputRec").val(false);
					$("#InputRec").prop("checked", false);
				}
				var InputSnap=$(this).children('snap').text()
				 if("true" == InputSnap)
				{
					$("#InputSnap").val(true);
					$("#InputSnap").prop("checked", true);
				}else{
					$("#InputSnap").val(false);
					$("#InputSnap").prop("checked", false);
				}
				var InputAudioout=$(this).children('audioout').text()
				 if("true" == InputAudioout)
				{
					$("#InputAudioout").val(true);
					$("#InputAudioout").prop("checked", true);
				}else{
					$("#InputAudioout").val(false);
					$("#InputAudioout").prop("checked", false);
				}
				
				var Ptz_enable=$(this).find('enable').text()
				if("true" == Ptz_enable)
				{
					$("#InputPtz").val(true);
					$("#InputPtz").prop("checked", true);
				}else{
					$("#InputPtz").val(false);
					$("#InputPtz").prop("checked", false);
				}
				var Ptz_preset=$(this).find('preset').text()
				 var Select_preset=document.getElementById("ptz_Input")
					for (i=0;i<Select_preset.length;i++){
					 if(Select_preset.options[i].value==Ptz_preset){  
						Select_preset.options[i].selected=true;  
						}
				   }
	
			});
			//其它联动
			$(xmlDoc).find("otherlinkmode").each(function(i){ 
				var k_szInputSize=$(this).attr('size');
				var k_szInputa1=$(this).find('a1')
				$("#InputAlCheck").empty();
				 for(var j = 1; j <=k_szInputa1.length; j++)
				{
					var alarmchnsenable = $(k_szInputa1[j-1]).find('enable').eq(0).text();
					var alarmchnsindex = $(k_szInputa1[j-1]).find('index').eq(0).text();
					$("#InputAlCheck").append("<input type='checkbox' class='checkbox main_top8' onclick='checkbox(this)' name='checkboxindex' id='InputChecka"+parseInt(j)+"'/>"+"  "+"<label name='aAlarmoutput'>"+getNodeValue('aAlarmoutput')+"</label>"+parseInt(j)+"</br>");
					//$("#InputChecka"+parseInt(j)).prop("checked", true);
					
					 if("true" == alarmchnsenable)
						{
							$("#InputChecka"+parseInt(j)).val(true);
							$("#InputChecka"+parseInt(j)).prop("checked", true);
						}else{
							$("#InputChecka"+parseInt(j)).val(false);
							$("#InputChecka"+parseInt(j)).prop("checked", false);
						}
					
				}
			 });
			 autoResizeIframe();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
/*************************************************
Function:		GetEventInputTimeInfo
Description:	获取报警输入布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetEventInputTimeInfo(){
	var SelectAlarmnum=$("#SelectAlarmnum").val()
	var szXml = "<eventtimeparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	
	szXml += "<eventtype>"+'alarmin'+"</eventtype>";
	if (SelectAlarmnum==null){
		szXml += "<alarmnum>"+1+"</alarmnum>";
	}else{
		szXml += "<alarmnum>"+SelectAlarmnum+"</alarmnum>";
	}
 	szXml += "</eventtimeparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/AlarmTine.xml"
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
			//var v_szAlarm =xhr.responseText;
		    //var k_szgbAlarmXml = parseXmlFromStr(v_szAlarm);
			var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
			AnalyTimeDayInfo(xmlDoc)  //解析XML只能星期一
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		*/
	});

}
//选择报警输入号
function ChangeAlarmnum(){
  	GetInput();
	GetEventInputTimeInfo();
}

//保存报警输入
function SaveInput(){
	var alarmname=$.rtrim($.ltrim($("#Inputalarmname").val()));
	if(!CheckDeviceName(alarmname,'AlarmInNametips','JsInputName',0,16))
	{
	    return;
	}
	var plugin= top.parent.document.getElementById("IpcCtrl")
	var videoid=1
	
	plugin.eventWebToPlugin("saveosdpic",camera_hostname,camera_port.toString(),"0",videoid.toString(),$("#SelectAlarmnum").val(),alarmname,$.cookie('authenticationinfo'));
	var checkboxindex = $("input[name='checkboxindex']");
	
	var szXml = "<alarmininfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	    if($("#Inputcheckboxall").attr("checked")=="checked"){
		  szXml += "<copyto>"+"all"+"</copyto>";
		}
		szXml += "<alarmnum>"+$("#SelectAlarmnum").val()+"</alarmnum>";
		szXml += "<alarmname>"+alarmname+"</alarmname>";
		szXml += "<alarmtype>"+$("#SelectAlarmtype").val()+"</alarmtype>";
		szXml += "<linkmodes>";
		   szXml += "<uploadcenter>"+$("#InputUploadcenter").val()+"</uploadcenter>";
		   szXml += "<showosd>"+$("#InputShowosd").val()+"</showosd>";
		   szXml += "<audioout>"+$("#InputAudioout").val()+"</audioout>";
		   szXml += "<rec>"+$("#InputRec").val()+"</rec>";
		   szXml += "<snap>"+$("#InputSnap").val()+"</snap>";
			 szXml += "<ptz>";
				szXml += "<enable>"+$("#InputPtz").val()+"</enable>";
				szXml += "<preset>"+$("#ptz_Input").val()+"</preset>";
			 szXml += "</ptz>";
		szXml += "</linkmodes>";
		szXml += "<otherlinkmode>";
		  szXml += "<a1list size='"+checkboxindex.length+"' >";
			  for (j=1;j<=checkboxindex.length;j++){
				  szXml += "<a1>";
					szXml += "<enable>"+$("#InputChecka"+parseInt(j)).val()+"</enable>";
					szXml += "<index>"+j+"</index>";
				szXml += "</a1>"; 
				}
			szXml += "</a1list>";
		szXml += "</otherlinkmode>";
		szXml += "</alarmininfo>";
	
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/alarmin/1"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		async: false,  //同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
			
			var Docxml =xhr.responseText;
		     var xmlDoc = GetparseXmlFromStr(Docxml);
	       // 
			 /*$(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
				  if("0" == state)	//OK
					{
						szRetInfo = m_szSuccessState+"保存成功";
					}else{
						szRetInfo=  m_szErrorState+"保存失败"	
					}
				});
			$("#SetResultTipsInput").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsInput").html("");},5000);  //5秒后自动清除
		   */
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
}




/*********报警输出*************/
function Output() {
	SingletonInheritor.implement(this);
	//this.m_bEnablePPPoE = false;
}
SingletonInheritor.declare(Output);
pr(Output).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["event", "Output"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initOnput();
}
/*************************************************
Function:		initOutput
Description:	初始化initOutput页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initOnput()
{
    GetOutput();
	autoResizeIframe();
}
/*************************************************
Function:		GetOutput
Description:	初始化报警输出
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetOutput(){
	var szXml = "<alarmoutparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<type>"+'all'+"</type>";
 	szXml += "</alarmoutparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/alarmout/1"
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
			 $(xmlDoc).find("delay").each(function(i){ 
		     	var k_delayopt1=$(this).attr('opt');
		  	 	var k_delayxml= $(this).text();
				$("#SelectDelay").empty(); 
				 var k_delayopts = k_delayopt1.split(",");
				insertOptions2Select(k_delayopts, ["5s", "10s", "30s", "1m", "2m", "5m", "10m", "manual"], ["js5s", "js10s", "js30s", "js1m", "js2m", "js5m", "js10m", "jsmanual"], "SelectDelay");
				setValueDelayIE6("SelectDelay" ,"","",k_delayxml);
			}); 

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//保存报警输出
function SaveOutput(obj){
	var szXml = "<alarmoutinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<type>"+'all'+"</type>";
	szXml += "<delay>"+$("#SelectDelay").val()+"</delay>";
 	szXml += "</alarmoutinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/alarmout/1"
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
			$("#SetResultTipsOutput").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsOutput").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
}

/*********异常*************/
function Abnormal() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Abnormal);
pr(Abnormal).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["event", "Abnormal"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initAbnormal();
}
/*************************************************
Function:		initAbnormal
Description:	初始化initAbnormal页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initAbnormal()
{
	GetAbnormalType();  //获取异常类型
   // GetAbnormal();
	
	autoResizeIframe();
}
/*************************************************
Function:		GetAbnormalType
Description:	获取异常类型
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAbnormalType(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/exception/type"
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
			//异常类型
			$(xmlDoc).find("type").each(function(i){ 
		     	//var k_exceptionopt1=$(this).attr('opt');
		  	 	var k_szquality= $(this).text();
				$("#exceptiontype").empty(); 
				 var k_exceptionops = k_szquality.split(",");
				insertOptions2Select(k_exceptionops, ["diskfull", "diskerr", "disconnect", "iperr", "illegalaccess"], ["Madiskfull", "Madiskerr", "Madisconnect", "Maiperr ", "Maillegalaccess"], "exceptiontype");
				//setValueDelayIE6("exceptiontype" ,"","",k_szquality);
			}); 
			ChangeAbnormal();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
/*************************************************
Function:		ChangeAbnormal
Description:	选择异常
Input:			无			
Output:			无
return:			无				
*************************************************/
function ChangeAbnormal(){
	var szXml = "<exceptionparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<type>"+$("#exceptiontype").val()+"</type>";
 	szXml += "</exceptionparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/exception"
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
		
		 //是否启用
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#AbnormalEnable").val(true).prop("checked", true);;
		    }
			else{
				$("#AbnormalEnable").val(false).prop("checked", false);;
			};
			
		 
		 
		 
		 //异常类型
			$(xmlDoc).find("type").each(function(i){ 
		     	var g_type= $(this).text();
				 var Selec_type=document.getElementById("exceptiontype")
				 for (i=0;i<Selec_type.length;i++){
				 if(Selec_type.options[i].value==g_type){  
					Selec_type.options[i].selected=true;  
					}
		     }	
			});  
		$("#Abnormalptz_Input").empty();
		for (i=1;i<=256;i++){
			$("<option value='" + i + "' >" + i + "</option>").appendTo("#Abnormalptz_Input");
		}
		//常规联动能力集
		$(xmlDoc).find("linkmodecaps").each(function(i){ 
			var g_uploadcenter= $(this).children("uploadcenter").text();  //上传中心
			var g_showosd= $(this).children("showosd").text();            //显示字幕
			var g_audioout= $(this).children("audioout").text();          //声音报警
			var g_rec= $(this).children("rec").text();                    //录像联动
			var g_snap= $(this).children("snap").text();                  //抓拍
			var g_smtp= $(this).children("smtp").text();                  //邮件通知
			var g_ptz= $(this).children("ptz").text();                    //PTZ
		 
			var g_normallink = false;
			 if(g_uploadcenter!="true")   //上传中心
			 {
				$("#subAbnormaluploadcenter").hide();
			 }
			 else
			 {
				$("#subAbnormaluploadcenter").show();
				g_normallink=true
			 }
			if(g_showosd!="true")     //显示字幕
			{
				$("#subAbnormalshowosd").hide();
			}
			else
			{
				$("#subAbnormalshowosd").show();
				g_normallink=true;
			}
			if(g_audioout!="true")     //声音报警
			{
				$("#subAbnormalAudioout").hide();
			}
			else
			{
				$("#subAbnormalAudioout").show();
				g_normallink=true;
			}
			if(g_rec!="true")     //录像联动
			{
				$("#suAbnormalrec").hide();
			}
			else
			{
				$("#suAbnormalrec").show();
				g_normallink=true;
			}
			if(g_snap!="true")     //抓拍
			{
				$("#suAbnormalsnap").hide();
			}
			else
			{
				$("#suAbnormalsnap").show();
				g_normallink=true;
			}
			if(g_smtp!="true")     //邮件通知
			{
				$("#suAbnormalsnap").hide();
			}
			else
			{
				$("#suAbnormalsnap").show();
				g_normallink=true;
			}
			if(g_ptz!="true")     //PTZ
			{
				$("#subAbnormalptz").hide();
			}
			else
			{
				$("#subAbnormalptz").show();
				g_normallink=true;
			}
			
			if (g_normallink!=true)
			{
				$("#subNormalLink").hide();
			}
			else
			{
				$("#subNormalLink").show();
			}
		});
		
		//异常联动能力集
		$(xmlDoc).find("otherlinkmodecaps").each(function(i){ 
			var g_alarmout= $(this).children("alarmout").text(); 
			var g_ptz= $(this).children("ptz").text();           
			var g_preset= $(this).children("preset").text();        
			
			
			var g_other =false;
			 if(g_alarmout!="true")   
			 {
				$("#subAbnormalalarmout").hide();
			 }
			 else
			 {
				$("#subAbnormalalarmout").show();
				g_other=true;
			 }
			if(g_ptz!="true")    
			{
				$("#subAbnormalptz").hide();
			}
			else
			{
				$("#subAbnormalptz").show();
				g_other=true;
			}
			if(g_preset!="true")    
			{
				$("#subAbnormalptzpresent").hide();
			}
			else
			{
				$("#subAbnormalptzpresent").show();
				g_other=true;
			}
			//subNormalLink
			//console.log(g_other)
			if (g_other!=true)
			{
				$("#subotherLink").hide();
			}
			else
			{
				$("#subotherLink").show();
			}
			
			
		});
		
		
		
			
			//常规联动
			$(xmlDoc).find("linkmodes").each(function(i){ 
				var Abnormaluploadcenter =$(this).children('uploadcenter').text()   //上传中心
				 if("true" == Abnormaluploadcenter)
				{
					$("#Abnormaluploadcenter").val(true).prop("checked", true);
				}else{
					$("#Abnormaluploadcenter").val(false).prop("checked", false);
				}
				
				var Abnormalshowosd =$(this).children('showosd').text()   //显示字幕
				 if("true" == Abnormalshowosd)
				{
					$("#Abnormalshowosd").val(true).prop("checked", true);
				}else{
					$("#Abnormalshowosd").val(false).prop("checked", false);
				}
				
				var AbnormaAudioout=$(this).children('audioout').text()  //声音报警
				 if("true" == AbnormaAudioout)
				{
					$("#AbnormalAudioout").val(true).prop("checked", true);
				}else{
					$("#AbnormalAudioout").val(false).prop("checked", false);
				}
				
				var Abnormarec=$(this).children('rec').text()   //录像联动
				 if("true" == Abnormarec)
				{
					$("#subAbnormalrec").val(true).prop("checked", true);
				}else{
					$("#subAbnormalrec").val(false).prop("checked", false);
				}
				
				var Abnormasnap=$(this).children('snap').text()   ////抓拍
				 if("true" == Abnormasnap)
				{
					$("#subAbnormalsnap").val(true).prop("checked", true);
				}else{
					$("#subAbnormalsnap").val(false).prop("checked", false);
				}
				
				var Abnormasmtp=$(this).children('smtp').text()   //邮件通知
				 if("true" == Abnormasmtp)
				{
					$("#subAbnormalsmtp").val(true).prop("checked", true);
				}else{
					$("#subAbnormalsmtp").val(false).prop("checked", false);
				}
				
				var Abnormaptzenable=$(this).children('ptz').children('enable').text()   //PTZ
				var Abnormaptzpreset=$(this).children('ptz').children('preset').text()   //PTZ
				 if("true" == Abnormaptzenable)
				{
					$("#AbnormalInputPtz").val(true).prop("checked", true);
				}else{
					$("#AbnormalInputPtz").val(false).prop("checked", false);
				}
				
				
				
			   /* var Abnormalptzselect=document.getElementById("Abnormalptzselect")
				for (i=0;i<Abnormalptzselect.length;i++){
				 if(Abnormalptzselect.options[i].value==Abnormaptzpreset){  
					Abnormalptzselect.options[i].selected=true;  
					}
				}*/
			

			});
           
			
			$(xmlDoc).find("otherlinkmode").each(function(i){ 
				var k_szAbnormalSize=$(this).find('a1list').attr('size');
				var k_szAbnormala1=$(this).find('a1')
				$("#AbnormaA1").empty();
				 for(var j = 1; j <=k_szAbnormala1.length; j++)
				{
					var Abnormalsenable = $(k_szAbnormala1[j-1]).find('enable').eq(0).text();
					var alarmchnsindex = $(k_szAbnormala1[j-1]).find('index').eq(0).text();
					$("#AbnormaA1").append("<input type='checkbox' class='checkbox main_top8' onclick='checkbox(this)' name='Abnormacheckboxindex' id='AbnormalChecka"+parseInt(j)+"'/>"+"  "+"<label name='aAlarmoutput'>"+getNodeValue('aAlarmoutput')+"</label>"+parseInt(j)+"</br>");
					//$("#InputChecka"+parseInt(j)).prop("checked", true);
					
					 if("true" == Abnormalsenable)
						{
							$("#AbnormalChecka"+parseInt(j)).val(true);
							$("#AbnormalChecka"+parseInt(j)).prop("checked", true);
						}else{
							$("#AbnormalChecka"+parseInt(j)).val(false);
							$("#AbnormalChecka"+parseInt(j)).prop("checked", false);
						}
					
				}
			 });
		
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
	
}

//保存异常联动
function SaveAbnormal(obj){
	var AbnormalChecka = $("input[name='Abnormacheckboxindex']");
	var szXml = "<exceptioninfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
  	szXml += "<enabled>"+$("#AbnormalEnable").val()+"</enabled>";
	szXml += "<type>"+$("#exceptiontype").val()+"</type>";
	szXml += "<linkmodes>";
	  szXml += "<uploadcenter>"+$("#Abnormaluploadcenter").val()+"</uploadcenter>";  //上传中心
	  szXml += "<showosd>"+$("#Abnormalshowosd").val()+"</showosd>";                 //显示字幕
	  szXml += "<audioout>"+$("#AbnormalAudioout").val()+"</audioout>";              //声音报警
	  szXml += "<rec>"+$("#subAbnormalrec").val()+"</rec>";              //录像联动	
	  szXml += "<snap>"+$("#subAbnormalsnap").val()+"</snap>";              //抓拍
	  szXml += "<smtp>"+$("#subAbnormalsmtp").val()+"</smtp>";              //邮件通知
	  szXml += "<ptz>"
	       szXml += "<enable>"+$("#AbnormalInputPtz").val()+"</enable>";              //PTZ
		   szXml += "<preset>"+$("#Abnormalptz_Input").val()+"</preset>";              //预置点序号
	  szXml += "</ptz>"
	szXml += "</linkmodes>";
	szXml += "<otherlinkmode>";
	  szXml += "<a1list size='"+AbnormalChecka.length+"' >";
		  for (j=1;j<=AbnormalChecka.length;j++){
			  szXml += "<a1>";
				szXml += "<enable>"+$("#AbnormalChecka"+parseInt(j)).val()+"</enable>";
				szXml += "<index>"+j+"</index>";
			szXml += "</a1>"; 
			}
		szXml += "</a1list>";
	szXml += "</otherlinkmode>";
 	szXml += "</exceptioninfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/exception"
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
			  
			$("#SetResultTipsAbnormal").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsAbnormal").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};





//虚焦侦测
function Virtualfocus() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Virtualfocus);
pr(Virtualfocus).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["event", "videoAnalyze"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	
	initVirtualfocus();
	autoResizeIframe();
};
/*
初始化虚焦侦测
*/
function initVirtualfocus(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/1/virtualfocus"
	 //var szURL=m_lHttp+camera_hostname+":"+camera_port+"/virtualfocus.xml"
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
			 //是否启用
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#Virtualfocuscheck").val(true).prop("checked", true);
		    }
			else
			{
				$("#Virtualfocuscheck").val(false).prop("checked", false);
			}
			   
			 
			 //移动侦侧拖动条
			$(xmlDoc).find("level").each(function(i){ 
				 virtualfocus_min=Number($(this).attr('min'));
				 virtualfocus_max=Number($(this).attr('max'));
				 virtualfocus_text=Number($(this).text());
				 $("#Virtualfocus_value").val(virtualfocus_text).attr('maxlength',$(this).attr('max').length);
				 SliderEvent("virtualfocus");
			 });
			
			//常规联动能力集
			$(xmlDoc).find("linkmodecaps").each(function(i)
			{
				var g_uploadcenter = $(this).find("uploadcenter").eq(0).text();
				var g_audioout = $(this).find("audioout").eq(0).text();
				var g_setfocus = $(this).find("setfocus").eq(0).text();
				var g_showosd = $(this).find("showosd").eq(0).text();
				var g_rec = $(this).find("rec").eq(0).text();
				var g_snap = $(this).find("snap").eq(0).text();
				
				var g_virtualfocusnormallink = false;
				
				if (g_uploadcenter!="true") //上传中心
				{ 
					$("#subVirtualUploadcenter").hide();
				}
				else
				{
					$("#subVirtualUploadcenter").show();
					g_virtualfocusnormallink=true;
				}
				
				if (g_audioout!="true")   //声音报警
				{
					$("#subVirtualaudioout").hide();
				}
				else
				{
					$("#subVirtualaudioout").show();
					g_virtualfocusnormallink=true;
				}
				
				if (g_showosd!="true")   //显示字幕
				{
					$("#subVirtualshowosd").hide();
				}
				else
				{
					$("#subVirtualshowosd").show();
					g_virtualfocusnormallink=true;
				}
				
				if (g_rec!="true")   //录像联动
				{
					$("#subVirtualrec").hide();
				}
				else
				{
					$("#subVirtualrec").show();
					g_virtualfocusnormallink=true;
				}
				
				if (g_snap!="true")   //snap
				{
					$("#subVirtualsnap").hide();
				}
				else
				{
					$("#subVirtualsnap").show();
					g_virtualfocusnormallink=true;
				}
				
				if (g_setfocus!="true")//聚焦
				{    
					$("#subVirtualfocus").hide();
				}
				else
				{
					$("#subVirtualfocus").show();
					g_virtualfocusnormallink=true;
				}
				
				
				if (g_virtualfocusnormallink!=true)   //标题显示/隐藏
				{
					$("#subVirtualNormalLink").hide();
				}
				else
				{
					$("#subVirtualNormalLink").show();
				}
				
			});
			
			//其它联动能力集
			$(xmlDoc).find("otherlinkmodecaps").each(function(i){
				var g_alarmout = $(this).find("alarmout").eq(0).text();
				
				var g_virtualfocusotherlink = false;
				if (g_alarmout!="true")   //报警输出
				{
					$("#subVirtualalarmout").hide();
				}
				else
				{
					$("#subVirtualalarmout").show();
					g_virtualfocusotherlink=true;
				}
				
				if (g_virtualfocusotherlink!=true)
				{
					$("#subVirtualOtherLink").hide();
				}
				else
				{
					$("#subVirtualOtherLink").show();
				}
			});
			
			//常规联动
		   $(xmlDoc).find("linkmodes").each(function(i){ 
				var g_Uploadcenter =$(this).children('uploadcenter').text();
				var g_Audioout=$(this).children('audioout').text();
				var g_setfocus=$(this).children('setfocus').text()
				var g_showosd=$(this).children('showosd').text()
				var g_rec=$(this).children('rec').text()
				var g_snap=$(this).children('snap').text()
				
				 if("true" == g_Uploadcenter)
				{
					$("#VirtualUploadcenter").val(true).prop("checked", true);
				}else
				{
					$("#VirtualUploadcenter").val(false).prop("checked", false);
				}
				
			    if("true" == g_Audioout)
				{
					$("#Virtualaudioout").val(true).prop("checked", true);
				}else
				{
					$("#Virtualaudioout").val(false).prop("checked", false);
				}
				
				if("true" == g_setfocus)
				{
					$("#Virtualfocus").val(true).prop("checked", true);
				}else
				{
					$("#Virtualfocus").val(false).prop("checked", false);
				}
				
				if("true" == g_showosd)
				{
					$("#Virtualshowosd").val(true).prop("checked", true);
				}else
				{
					$("#Virtualshowosd").val(false).prop("checked", false);
				}
				
				if("true" == g_rec)
				{
					$("#Virtualrec").val(true).prop("checked", true);
				}else
				{
					$("#Virtualrec").val(false).prop("checked", false);
				}
				
				if("true" == g_snap)
				{
					$("#Virtualsnap").val(true).prop("checked", true);
				}else
				{
					$("#Virtualsnap").val(false).prop("checked", false);
				}
			});
			
			//其它联动
			$(xmlDoc).find("otherlinkmode").each(function(i){ 
				var g_szAlarmSize=$(this).find("a1list").attr('size');
				//var k_szAlarma1=$(this).find('a1')
				$("#VirtualAlCheckEnable").empty();
				for(var j = 1; j <=g_szAlarmSize; j++)
				{
					var Alarmchnsenable = $(this).find('a1').find('enable').eq(j-1).text();
					var alarmchnsindex =  $(this).find('a1').find('index').eq(j-1).text();
					$("#VirtualAlCheckEnable").append("<input type='checkbox' class='checkbox main_top8' onclick='checkbox(this)' name='VirtualCheck' id='VirtualCheck"+parseInt(j)+"'/>"+"  "+"<label name='aAlarmoutput'>"+getNodeValue('aAlarmoutput')+"</label>"+parseInt(j)+"</br>");
					
					 if("true" == Alarmchnsenable)
					{
						$("#VirtualCheck"+parseInt(j)).val(true).prop("checked", true);
					}
					else
					{
						$("#VirtualCheck"+parseInt(j)).val(false).prop("checked", false);
					}
				}
			 });
			 
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
};
/**
保存虚焦侦测
function SaveVirtual
**/
function SaveVirtual(obj){
	var VirtualCheck = $("input[name='VirtualCheck']");
	var szXml = "<virtualfocusinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	  szXml += "<enabled>"+$("#Virtualfocuscheck").val()+"</enabled>";
	  szXml += "<level>"+$("#Virtualfocus_value").val()+"</level>";
	  szXml += "<linkmodes>";
	  szXml += "<uploadcenter>"+$("#VirtualUploadcenter").val()+"</uploadcenter>";  //上传中心
	  szXml += "<audioout>"+$("#Virtualaudioout").val()+"</audioout>";              //声音报警
	  szXml += "<setfocus>"+$("#Virtualfocus").val()+"</setfocus>";              //聚焦	
	  szXml += "<showosd>"+$("#Virtualshowosd").val()+"</showosd>";   
	  szXml += "<rec>"+$("#Virtualrec").val()+"</rec>";
	  szXml += "<snap>"+$("#Virtualsnap").val()+"</snap>";      
	szXml += "</linkmodes>";
	szXml += "<otherlinkmode>";
	  szXml += "<a1list size='"+VirtualCheck.length+"' >";
		  for (j=1;j<=VirtualCheck.length;j++){
			  szXml += "<a1>";
				szXml += "<enable>"+$("#VirtualCheck"+parseInt(j)).val()+"</enable>";
				szXml += "<index>"+j+"</index>";
			szXml += "</a1>"; 
			}
		szXml += "</a1list>";
	szXml += "</otherlinkmode>";
 	szXml += "</virtualfocusinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/1/virtualfocus"
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
			  
			$("#SetResultTipsVirtual").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsVirtual").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};
//场景变更侦测
function Scene() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Scene);
pr(Scene).update = function() {
	var that = this;
	$.ajax({
		url: "params/schedule.htm",
		type: "GET",
		dataType: "html",
		cache:false,
		success: function(msg) {
			$("#TimeScheduleEdit1").html(msg);
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["event", "videoAnalyze"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			}, true);
			g_transStack.push(function() {
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
		}
	});
	initScene();
	GetSightchangeTimeInfo();   //初始化布防时间
	autoResizeIframe();
};
function initScene(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/1/sightchange"
	// var szURL=m_lHttp+camera_hostname+":"+camera_port+"/virtualfocus.xml"
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
			 //是否启用
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#Scenecheck").val(true).prop("checked", true);
		    }
			else
			{
				$("#Scenecheck").val(false).prop("checked", false);
			}
			
			//场景变更拖动条
			$(xmlDoc).find("alllevel").each(function(i){ 
				 sightchange_min=Number($(this).attr('min'));
				 sightchange_max=Number($(this).attr('max'));
				 sightchange_value=Number($(this).text());
				 $("#Scene_value").val(sightchange_value).attr('maxlength',$(this).attr('max').length);
				SliderEvent("sightchange");
			 });
			
			//常规联动能力集
			$(xmlDoc).find("linkmodecaps").each(function(i)
			{
				var g_uploadcenter = $(this).find("uploadcenter").eq(0).text();
				var g_audioout = $(this).find("audioout").eq(0).text();
				var g_rec = $(this).find("rec").eq(0).text();
				var g_snap = $(this).find("snap").eq(0).text();
				var g_showosd = $(this).find("showosd").eq(0).text();
				
				var g_sightchangenormallink = false;
				
				if (g_uploadcenter!="true") //上传中心
				{ 
					$("#subSceneUploadcenter").hide();
				}
				else
				{
					$("#subSceneUploadcenter").show();
					g_sightchangenormallink=true;
				}
				
				if (g_audioout!="true")   //声音报警
				{
					$("#subSceneSoundAlarm").hide();
				}
				else
				{
					$("#subSceneSoundAlarm").show();
					g_sightchangenormallink=true;
				}
				
				if (g_showosd!="true")   //显示字幕
				{
					$("#subSceneShowosdAlarm").hide();
				}
				else
				{
					$("#subSceneShowosdAlarm").show();
					g_sightchangenormallink=true;
				}
				
				if (g_snap!="true")//抓拍
				{    
					$("#subSceneSnap").hide();
				}
				else
				{
					$("#subSceneSnap").show();
					g_sightchangenormallink=true;
				}
				
				if (g_rec!="true")//录像联动
				{    
					$("#subSceneRecLink").hide();
				}
				else
				{
					$("#subSceneRecLink").show();
					g_sightchangenormallink=true;
				}
				
				
				if (g_sightchangenormallink!=true)   //标题显示/隐藏
				{
					$("#subSceneNormalLink").hide();
				}
				else
				{
					$("#subSceneNormalLink").show();
				}
				
			});
			
			//其它联动能力集
			$(xmlDoc).find("otherlinkmodecaps").each(function(i){
				var g_alarmout = $(this).find("alarmout").eq(0).text();
				
				var g_sightchangeotherlink = false;
				if (g_alarmout!="true")   //报警输出
				{
					$("#subsightchangealarmout").hide();
				}
				else
				{
					$("#subsightchangealarmout").show();
					g_sightchangeotherlink=true;
				}
				
				if (g_sightchangeotherlink!=true)
				{
					$("#subsightchangeOtherLink").hide();
				}
				else
				{
					$("#subsightchangeOtherLink").show();
				}
			});
			
			//常规联动
		   $(xmlDoc).find("linkmodes").each(function(i){ 
				var g_Uploadcenter =$(this).children('uploadcenter').text();
				var g_Audioout=$(this).children('audioout').text();
				var g_rec=$(this).children('rec').text();
				var g_snap=$(this).children('snap').text()
				var g_showosd=$(this).children('showosd').text()
				
				 if("true" == g_Uploadcenter)
				{
					$("#SceneUploadcenter").val(true).prop("checked", true);
				}else
				{
					$("#SceneUploadcenter").val(false).prop("checked", false);
				}
				
			    if("true" == g_Audioout)
				{
					$("#SceneSoundAlarm").val(true).prop("checked", true);
				}else
				{
					$("#SceneSoundAlarm").val(false).prop("checked", false);
				}
				
				if("true" == g_showosd)
				{
					$("#SceneShowosdAlarm").val(true).prop("checked", true);
				}else
				{
					$("#SceneShowosdAlarm").val(false).prop("checked", false);
				}
				
				if("true" == g_rec)
				{
					$("#SceneRecLink").val(true).prop("checked", true);
				}else
				{
					$("#SceneRecLink").val(false).prop("checked", false);
				}
				
				if("true" == g_snap)
				{
					$("#SceneSnap").val(true).prop("checked", true);
				}else
				{
					$("#SceneSnap").val(false).prop("checked", false);
				}
			});
			
			//其它联动
			$(xmlDoc).find("otherlinkmode").each(function(i){ 
				var k_szScenealarSize=$(this).find('a1list').attr('size');
				var k_szScenealara1=$(this).find('a1')
				$("#SceneAlCheckEnable").empty();
				 for(var j = 1; j <=k_szScenealarSize; j++)
				{
					var Scenearenable = $(k_szScenealara1[j-1]).find('enable').eq(0).text();
					var Sceneareindex = $(k_szScenealara1[j-1]).find('index').eq(0).text();
					$("#SceneAlCheckEnable").append("<input type='checkbox' class='checkbox' onclick='checkbox(this)' name='SceneIndex' id='Scenearmout"+parseInt(j)+"'/>"+"  "+"<label name='aAlarmoutput'>"+getNodeValue('aAlarmoutput')+"</label>"+parseInt(j)+"</br>");
				
					 if("true" == Scenearenable)
						{
							$("#Scenearmout"+parseInt(j)).val(true).prop("checked", true);
						}else{
							$("#Scenearmout"+parseInt(j)).val(false).prop("checked", false);
						}
					
				}
			 });
			
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
};

/*************************************************
Function:		GetSightchangeTimeInfo
Description:	获取布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetSightchangeTimeInfo(){
	var szXml = "<eventtimeparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<eventtype>"+'sightchange'+"</eventtype>";
 	szXml += "</eventtimeparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/AlarmTine.xml"
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
			//var v_szAlarm =xhr.responseText;
		    //var k_szgbAlarmXml = parseXmlFromStr(v_szAlarm);
			var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			AnalyTimeDayInfo(xmlDoc)  //解析XML只能星期一
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
	});

}
//切换TAB清空插件窗口
function EvnetPluginNull(){
   $("#mainplugin").html("");
   $("#pluginMotion").html("");
   
   $("#mainpluginAlarm").html(""); 
   $("#mainpluginGuard").html(""); 
   
   $("#pluginAlarm").html("");
  };
