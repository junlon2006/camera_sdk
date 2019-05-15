document.charset = "utf-8";
var m_forcheckinfo="";
var Storage = {
	tabs: null	
};

/*************************************************

*************************************************/


/**********存储管理**************************/
function StorageManagement() {
	SingletonInheritor.implement(this);
	//this.initCSS();	
}
SingletonInheritor.declare(StorageManagement);
pr(StorageManagement).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["storage", "StorageManagement"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	
   initStorageManagement();
}
/*************************************************
Function:		initStorageManagement
Description:	存储管理
Input:			无			
Output:			无
return:			无				
*************************************************/
function initStorageManagement()
{
    GetStorageManagement();
	
	autoResizeIframe();
}
function Checkfullmode(obj){
	var szXml = "<storagemanagerinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<fullmode>"+$(obj).val()+"</fullmode>";
 	szXml += "</storagemanagerinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/manager"
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

/*************************************************
Function:		GetStorageManagement
Description:	存储管理
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetStorageManagement(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/manager"
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
			$(xmlDoc).find("fullmode").each(function(i){ 
		     	var k_fullmodeopt1=$(this).attr('opt');
		  	 	var k_fullmodexml= $(this).text();
				$("#fullmode").empty(); 
				 var k_fullmodeopts = k_fullmodeopt1.split(",");
				insertOptions2Select(k_fullmodeopts, ["stop", "over"], ["Mstop", "Mover"], "fullmode");
				setValueDelayIE6("fullmode" ,"","",k_fullmodexml);
			}); 
			
	       $("#TbodyManagement").empty();
		   $(xmlDoc).find("disks").each(function(i){ 
				var k_diskssize=$(this).attr('size');
				var cManagerNodes=$(this).find('disk')
				// console.log(c28181Nodes.length)
				
				 for(var j = 1; j <=k_diskssize; j++)
				{
					
					var disksn = $(cManagerNodes[j-1]).find('sn').eq(0).text();
					var diskdiskcapacity = $(cManagerNodes[j-1]).find('diskcapacity').eq(0).text();
					var diskrisidual = $(cManagerNodes[j-1]).find('risidual').eq(0).text();
					//var diskstate = TurnHardDiskProperty($(cManagerNodes[j-1]).find('state').eq(0).text());
					var diskstate = $(cManagerNodes[j-1]).find('state').eq(0).text();
					var disktype = $(cManagerNodes[j-1]).find('type').eq(0).text();
					var diskatrribute = $(cManagerNodes[j-1]).find('attribute').eq(0).text();
					$("#TbodyManagement").append("<tr align='center'  class='ListTr'>"
					   +"<td class='ListTd' id='disksn"+parseInt(j)+"'><input id='checkboxdisksn"+parseInt(j)+"' value='"+j+"' onclick='forcheckbox(this)' type='checkbox' name='checkboxdisksn' class='checkbox' style='margin-right:10px;' ><span>"+disksn+"</span></td>"
					   +"<td class='ListTd'>"+diskdiskcapacity+'M'+"</td>"
					   +"<td class='ListTd'>"+diskrisidual+'M'+"</td>"
					   //+"<td class='ListTd' id='diskstate"+parseInt(j)+"'>"+diskstate+"</td>"
					   +"<td class='ListTd' id='diskstate"+parseInt(j)+"'>"+"<label name='jstips"+diskstate+"'>"+TurnHardDiskProperty(diskstate)+"</label>"+"</td>"
					   +"<td class='ListTd'>"+"<label name='jstips"+disktype+"'>"+TurnHardDiskProperty(disktype)+"</label>"+"</td>"
					   +"<td class='ListTd' id='diskatrribute"+parseInt(j)+"'>"+"<label name='jstips"+diskatrribute+"'>"+TurnHardDiskProperty(diskatrribute)+"</label>"+"</td>"
						+"<td class='ListTd' id='formatstatus"+parseInt(j)+"'></td>"
				   +"</tr>");
				   if ($(cManagerNodes[j-1]).find('state').eq(0).text()=='null'){
						 $("#checkboxdisksn"+j).prop("disabled", true);  //禁用
					}
					else if($(cManagerNodes[j-1]).find('state').eq(0).text()=="formating"){
						m_FormattingTimerID= setInterval("formatstatus()",2000);
						$("#checkboxdisksn1").prop("checked", true).prop("disabled", true);
						$("#Formatting").prop("disabled", true);
					}
					else{
						$("#checkboxdisksn"+j).prop("disabled", false);  //启用
					}
				}
			});
			//ttclick();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

function forcheckbox(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).prop("checked", true);
	  $("#Formatting").prop("disabled", false);
	  m_forcheckinfo=$(obj).val();
	}else{
	  $(obj).prop("checked",false)
	  $("#Formatting").prop("disabled", true);
	}
}


function ttclick(line){
	 if(m_formatclick==false){
		 return
      }
			 // $('#TbodyManagement tr').click(function() {
					//判断当前是否选中
					var hasSelected=$(this).hasClass('selected');
					//如果选中，则移出selected类，否则就加上selected类
					$(this)[hasSelected?"removeClass":"addClass"]('selected')
						//查找内部的checkbox,设置对应的属性。
						.find(':checkbox').attr('checked',!hasSelected);
						 var _checkbox=$("input[name=checkboxdisksn]:checked").length
						 var _checked=$("input[name=checkboxdisksn]:checked")
						 picinfo="";
						 
						 
						  
						  
						  if (_checkbox>0){
							 $("#Formatting").prop("disabled", false);
							  //for (i =1; i<=_checkbox; i++){
								  picinfo=$(this).children('td').find('span').html();  //ID
								   
								// }
						}else{
							$("#Formatting").prop("disabled", true);
						}
						  
						/* if (_checkbox==1){
							 $("#Formatting").prop("disabled", false);
							 picinfo=$(this).children('td').find('span').html();  //ID
							 $("#checkboxdisksn").prop("checked", false);
						}else{
							$("#Formatting").prop("disabled", true);
						}*/
						
						
			//	}); 
			  $('#TbodyManagement>tr:has(:checked)').addClass('selected');

			  
};

function checkboxformat(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true);
	  $(obj).prop("checked", true);
	  $("#Formatting").prop("disabled" , false)
	}else{
	  $(obj).prop("checked", false);
	  $(obj).val(false);
	  $("#Formatting").prop("disabled" , true)
	}
}
//格式化
function formatManagement(){
	if (confirm(getNodeValue("jsAskformat"))){//是否格式化
	var szXml = "<storageformatinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<disksn>"+m_forcheckinfo+"</disksn>";
 	szXml += "</storageformatinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/format"
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
			 m_FormattingTimerID= setInterval("formatstatus()",2000);
			 $("#Formatting").prop("disabled",true)
			 $("#checkboxdisksn1").prop("disabled", true);
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		/*error: function(xhr, textStatus, errorThrown)
			{
				var Docxml =xhr.responseText;
				 var xmlDoc = GetparseXmlFromStr(Docxml);
				// alert(Docxml)
				 $(xmlDoc).find("statuscode").each(function(i){ 
					var  state= $(this).text();
					 if("2509" == state)	//OK
						{
							alert("正在录放像无法格式化")
							return;
						}
					});
				}
			*/	
			
	});
   }
};
//格式化进度
function formatstatus(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/formatstatus"
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
			$(xmlDoc).find("isformating").each(function(i){ 
				if ($(this).text()=="false"){
					clearInterval(m_FormattingTimerID);
					//$("#formatstatus1").html("<label name='jstipsformatsucc'>"+getNodeValue("jstipsformatsucc")+"</label>")//格式化完成
					$("#formatstatus1").html("<label name='jstipsformatsucc'>"+getNodeValue("jstipsformatsucc")+"</label>")//格式化完成
					GetStorageManagement();
				}
			}); 
		   $(xmlDoc).find("progress").each(function(i){ 
				var k_progressxml= $(this).text();
				 if (k_progressxml>=100){
					 clearInterval(m_FormattingTimerID);
					 //$("#formatstatus1").html("<label name='jstipsformatsucc'>"+getNodeValue("jstipsformatsucc")+"</label>");
					 $("#formatstatus1").html("<label name='jstipsformatsucc'>"+getNodeValue("jstipsformatsucc")+"</label>");
					 GetStorageManagement();
				}else{
					// $("#diskstate1").html("<label name='jstipsformating'>"+getNodeValue("jstipsformating")+"..."+"</label>");//格式化中
					$("#diskstate1").html("<label name='jstipsformating'>"+getNodeValue("jstipsformating")+"</label>");//格式化中
					 $("#formatstatus1").html(k_progressxml+"%")
				}
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

/*************************************************
Function:		TurnHardDiskProperty
Description:	将硬盘属性转换成文字
Input:			iDiskProperty: 硬盘属性			
Output:			无
return:			无				
*************************************************/
function TurnHardDiskProperty(iDiskProperty)
{
	var szDiskProperty = '';
	if('null' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsnull');
	}
	else if('disker' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsdisker');
	}
	else if('diskrslowish' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsdiskrslowish');
	}
	else if('idel' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsidel');
	}
	else if('noformat' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsnoformat');
	}
	else if('formating' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsformating');
	}
	else if('identifing' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsidentifing');
	}
	else if('local' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipslocal');
	}
	else if('net' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsnet');
	}
	else if('all' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('jstipsall');
	}
	return szDiskProperty;
}


function VideoProgram() {
	SingletonInheritor.implement(this);
	//this.m_bEnablePPPoE = false;
}
SingletonInheritor.declare(VideoProgram);
pr(VideoProgram).update = function() {
	g_transStack.clear();
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
				that.setLxd(parent.translator.getLanguageXmlDoc(["storage", "VideoProgram"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			}, true);
			g_transStack.push(function() {
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
			
			
		for(var i=5;i<=10;i++){
		  $("#schedule"+parseInt(i)).hide();
		}
		}
	});
	
	
	/*g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["storage", "VideoProgram"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	*/
	
	
	initVideoProgram();
	
}
/*************************************************
Function:		initVideoProgram
Description:	初始化录像计划页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initVideoProgram()
{
    GetVideoProgram();
	GetVideoProgramTimeInfo();
	autoResizeIframe();
}
/*************************************************
Function:		GetVideoProgramTimeInfo
Description:	获取录像计划布防时间
return:			无				
*************************************************/
function GetVideoProgramTimeInfo(){
	var szXml = "<eventtimeparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<eventtype>"+'recschedule'+"</eventtype>";
 	szXml += "</eventtimeparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
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

/*************************************************
Function:		GetVideoProgram
Description:	初始化录像计划
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetVideoProgram(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/recordschedule"
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
			//是否启用录像计划
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#VideoProgramenalbled").val(true).prop("checked", true);
		    }else{
				$("#VideoProgramenalbled").val(false).prop("checked", false);
			}
			
			 //码流打包格式
            $(xmlDoc).find("esps").each(function(i){ 
		  	 	 k_espsxml= $(this).text();
				$("#SelectEsPs").empty(); 
				 var k_espsxmls = $(this).attr('opt').split(",");
				insertOptions2Select(k_espsxmls, ["es", "ps"], ["jsesopt", "jspsopt"], "SelectEsPs");
				setValueDelayIE6("SelectEsPs" ,"","",k_espsxml);
			}); 
			
			
          //录像类型
         $(xmlDoc).find("rectype").each(function(i){ 
		     	var k_rectypeopt1=$(this).attr('opt');
		  	 	k_rectypexml= $(this).text();
				$("#Selectrectype").empty(); 
				 var k_rectypeopts = k_rectypeopt1.split(",");
				insertOptions2Select(k_rectypeopts, ["main", "assist", "three", "fourth"], ["StreamTypeInOpt1", "StreamTypeInOpt2", "StreamTypeInOpt3","StreamTypeInOpt4"], "Selectrectype");
				setValueDelayIE6("Selectrectype" ,"","",k_rectypexml);
			}); 

		//预录方式
		$(xmlDoc).find("preparetime").each(function(i){ 
		     	var k_preparetimeopt1=$(this).attr('opt');
		  	 	var k_preparetimexml= $(this).text();
				$("#SelectPrepareTime").empty(); 
				 var k_preparetimeopts = k_preparetimeopt1.split(",");
				insertOptions2Select(k_preparetimeopts, ["none", "5", "10", "15", "20", "25", "30", "infinite"], ["jsnoneopt", "js5opt", "js10opt", "js15opt", "js20opt", "js25opt", "js30opt", "jsinfinite"], "SelectPrepareTime");
				setValueDelayIE6("SelectPrepareTime" ,"","",k_preparetimexml);
			}); 
		
			//录像延时
		 
			$(xmlDoc).find("delaytime").each(function(i){ 
		     	var k_delaytimeopt1=$(this).attr('opt');
		  	 	var k_delaytimexml= $(this).text();
				$("#SelectDelayTime").empty(); 
				 var k_delaytimeopts = k_delaytimeopt1.split(",");
				insertOptions2Select(k_delaytimeopts, ["none", "5", "10", "15", "20", "25", "30", "infinite"], ["jsnonetime", "js5opt", "js10opt", "js15opt", "js20opt", "js25opt", "js30opt", "jsinfinite"], "SelectDelayTime");
				setValueDelayIE6("SelectDelayTime" ,"","",k_delaytimexml);
			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//保存录像计划
function SaveVideoProgram(){
	var esps=$("#SelectEsPs").val();
	if (k_espsxml!=esps){
		if (!confirm(getNodeValue("RestartStreamTips"))){//码流打包格式已修改，系统将自动重启,是否保存
		 return; 
         }
	    }
	var szXml = "<recscheduleinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+$("#VideoProgramenalbled").val()+"</enabled>";
	szXml += "<preparetime>"+$("#SelectPrepareTime").val()+"</preparetime>";
	szXml += "<delaytime>"+$("#SelectDelayTime").val()+"</delaytime>";
	szXml += "<rectype>"+$("#Selectrectype").val()+"</rectype>";
	szXml += "<esps>"+esps+"</esps>";
 	szXml += "</recscheduleinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/recordschedule"
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
			 /*$(xmlDoc).find("statuscode").each(function(i){ 
				var  state= $(this).text();
				 if("0" == state)	//OK
					{
						szRetInfo = m_szSuccessState+"保存成功";
					}else{
						szRetInfo=  m_szErrorState+"操作失败"	
					}
				});
			$("#SetResultTipsVideoProgram").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsVideoProgram").html("");},5000);  //5秒后自动清除
		    */
			
			if (k_espsxml!=esps){
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
						$.cookie('authenticationinfo',null);
						$.cookie('page',null);
						$.cookie('UserNameLogin',null)
						$.cookie('curpage',null);
						top.location.href = "/";
					   
					}
				});
			}
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//手动录像开关
function SatrtRec(obj){
	var szXml = "<startrecinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<startrec>"+obj+"</startrec>";
	 	szXml += "</startrecinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/1/rec"
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




/**********抓拍Screenshot**************************/
function Screenshot() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Screenshot);
pr(Screenshot).update = function() {

	g_transStack.clear();
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
				that.setLxd(parent.translator.getLanguageXmlDoc(["storage", "Screenshot"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			}, true);
			g_transStack.push(function() {
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
			for(var i=5;i<=10;i++){
			  $("#schedule"+parseInt(i)).hide();
			}
		}
		
	});
	initScreenshot();
	
}
/*************************************************
Function:		initScreenshot
Description:	初始化抓图页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initScreenshot()
{
    Getsnappicconfigex();
	GetsnapTimeInfo();   //获取定时抓拍定时时间  
	Getsnappicevent();  //事件抓拍
	Getsnappictime();  //定时抓拍
	autoResizeIframe();
}
/*************************************************
Function:		GetsnapTimeInfo
Description:	获取定时抓拍布防时间
return:			无				
*************************************************/
function GetsnapTimeInfo(){
	var szXml = "<eventtimeparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<eventtype>"+'snappic'+"</eventtype>";
 	szXml += "</eventtimeparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/event/time/1"
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
			AnalyTimeDayInfo(xmlDoc)  //解析XML只能星期一
		}
	});

}

/*************************************************
Function:		Getsnappicconfigex
Description:	获取抓图
Input:			无			
Output:			无
return:			无				
*************************************************/
function Getsnappicconfigex(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/snappicconfigex"
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
		
		//图片格式	
		$(xmlDoc).find("type").each(function(i){ 
		     var k_typeopt=$(this).attr('opt');
		  	 var k_sztype= $(this).text();
			  $("#pictype").empty();
			   var arr = k_typeopt.split(","); 
				for (i=0;i<arr.length;i++){
				  $("#pictype").append("<option value="+arr[i]+">"+arr[i]+"</option>");
					var selectCode=document.getElementById("pictype"); 
					if(selectCode.options[i].value==k_sztype){  
						selectCode.options[i].selected=true;  
					 } 
				};
			}); 	
			
			//图片分辨率
			$(xmlDoc).find("resolution").each(function(i){ 
		     var k_resolutionopt1=$(this).attr('opt');
		  	 var k_resolutionype1= $(this).text();
			 var k_szresolutionopt=k_resolutionopt1.replace(new RegExp(/(_)/g),'*');  //替换_
		  	 var k_resolutionype=k_resolutionype1.replace(new RegExp(/(_)/g),'*');  //替换_
			  $("#picresolution").empty();
			   var arr = k_szresolutionopt.split(","); 
				for (i=0;i<arr.length;i++){
				  $("#picresolution").append("<option value="+arr[i]+">"+arr[i]+"</option>");
					var selectCode=document.getElementById("picresolution"); 
					if(selectCode.options[i].value==k_resolutionype){  
						selectCode.options[i].selected=true;  
					 } 
				};
			}); 	
			
			//图像质量
			
			$(xmlDoc).find("quality").each(function(i){ 
		     	var k_qualityopt1=$(this).attr('opt');
		  	 	var k_szquality= $(this).text();
				$("#picquality").empty(); 
				 var k_qualityopts = k_qualityopt1.split(",");
				insertOptions2Select(k_qualityopts, ["low", "middle", "hight"], ["Mlow", "Mmiddle", "Mhight"], "picquality");
				setValueDelayIE6("picquality" ,"","",k_szquality);
			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}

/*************************************************
Function:		Getsnappicevent
Description:	事件抓拍
Input:			无			
Output:			无
return:			无				
*************************************************/
function Getsnappicevent(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/snappicevent"
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
		 
		 //是否启用事件抓拍
			if("true" == $(xmlDoc).find('enable').eq(0).text())
		    {
			    $("#checksnapevent").val(true).prop("checked", true);
		    }else{
				$("#checksnapevent").val(false).prop("checked", false);
			}
		
			 $(xmlDoc).find("snapspeed").each(function(i){ 
				 snapspeedmin=$(this).attr('min');
				 snapspeedmax=$(this).attr('max');
				 $("#eventsnapspeed").val($(this).text()).attr('maxlength' , snapspeedmax.length); //事件抓图时间间隔
				 $("#fixedeventsnapspeedTips").html(snapspeedmin+"~"+snapspeedmax)
			});
			
			$(xmlDoc).find("eventsnapnum").each(function(i){ 
				 eventsnapnummin=$(this).attr('min');
				 eventsnapnummax=$(this).attr('max');
				  $("#eventsnapnum").val($(this).text()).attr('maxlength' , eventsnapnummax.length); //事件抓拍数量
				 $("#fixedeventsnapnumTips").html(eventsnapnummin+"~"+eventsnapnummax)
			});
			
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}



/*************************************************
Function:		Getsnappictime
Description:	定时抓拍
Input:			无			
Output:			无
return:			无				
*************************************************/
function Getsnappictime(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/snappictime"
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
		 
		 //是否启用定时抓拍
			if("true" == $(xmlDoc).find('enable').eq(0).text())
		    {
			    $("#checksnappictime").val(true).prop("checked", true);
		    }else{
				$("#checksnappictime").val(false).prop("checked", false);
			}
		
			$(xmlDoc).find("snapspeed").each(function(i){ 
				 snapspeedtimemin=$(this).attr('min');
				 snapspeedtimemax=$(this).attr('max');
				 $("#timesnapspeed").val($(this).text()).attr('maxlength' , snapspeedtimemax.length); //定时抓抓时间间隔
				 $("#fixedtimesnapspeedTips").html(snapspeedtimemin+"~"+snapspeedtimemax)
			});
			
			$(xmlDoc).find("snapnum").each(function(i){ 
				 snapnummin=$(this).attr('min');
				 snapnummax=$(this).attr('max');
				  $("#timesnapnum").val($(this).text()).attr('maxlength' , snapnummax.length); //定时抓拍数量
				 $("#fixedtimesnapnumTips").html(snapnummin+"~"+snapnummax)
			});
			
		
		  //抓拍类型
		   $(xmlDoc).find("snaptype").each(function(i){ 
				$("#selectsnaptype").empty(); 
				var g_snaptype = $(this).text();
				 var g_snaptypeopts = $(this).attr('opt').split(",");
				insertOptions2Select(g_snaptypeopts, ["time", "num"], ["Msnaptime", "Msnapnum"], "selectsnaptype");
				setValueDelayIE6("selectsnaptype" ,"","",g_snaptype);
				
				if (g_snaptype=="time"){
					$("#Subnum").hide();
					$("#Subtime").show();
				}
				else if(g_snaptype=="num")
				{
					$("#Subnum").show();
					$("#Subtime").hide();
				}
			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
/*************************************************
Function:		selectsnaptype
Description:	定时抓拍
Input:			无			
Output:			无
return:			无				
*************************************************/
function selectsnaptype(obj){
	if ($(obj).val()=="time"){
		$("#Subnum").hide();
		$("#Subtime").show();
	}
	else if($(obj).val()=="num")
	{
		$("#Subnum").show();
		$("#Subtime").hide();
	}
};

//保存抓拍
function SaveScreenshot(obj){
	var picresolution1=$("#picresolution").val();
	//var picresolution=picresolution1.replace(new RegExp(/(_)/g),'*');  //替换_
	var picresolution =picresolution1.split("*");
 	var picresolution_arr=picresolution[0]+"_"+picresolution[1]
	var picquality=$("#picquality").val();
	var sanpspid=$("#sanpspid").val();
	var timesnapnum=$("#timesnapnum").val();
	var eventsnapnum=$("#eventsnapnum").val();
	if(!CheackServerIDIntNum(sanpspid,'sanpspidtips','JSsanpspid',Number(snapspidvaluemin),Number(snapspidvaluemax)))
	{
	    return;
	}
	
	if(!CheackServerIDIntNum(timesnapnum,'timesnapnumtips','JStimesnapnum',Number(timesnapnumvaluemin),Number(timesnapnumvaluemax)))
	{
	    return;
	}
	
	if(!CheackServerIDIntNum(eventsnapnum,'eventsnapnumtips','JSeventsnapnum',Number(eventsnapnumvaluemin),Number(eventsnapnumvaluemax)))
	{
	    return;
	}
    if ($("#checkScreenshot").val()=="true"){
		   var szXml = "<contentroot>";
			szXml +=$.cookie('authenticationinfo');
			szXml += "</contentroot>";
			var xmlDoc = GetparseXmlFromStr(szXml);
		 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/state"
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
				$(xmlDoc).find("state").each(function(i){ 
					if ($(this).text()=="null"){
						szRetInfo = m_szErrorState+getNodeValue("Mnocard");//未检测到存储卡，请检查存储卡是否插入
						$("#checkScreenshottips").html(szRetInfo);
						setTimeout(function(){$("#checkScreenshottips").html("");},5000);  //5秒后自动清除
					}
				});
			}
		});	
	}
	var szXml = "<snappicinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<type>"+$("#pictype").val()+"</type>";
	szXml += "<resolution>"+picresolution_arr+"</resolution>";
	szXml += "<quality>"+$("#picquality").val()+"</quality>";
	szXml += "<enabletimesnap>"+$("#checkScreenshot").val()+"</enabletimesnap>";
	szXml += "<snapspid>"+sanpspid+"</snapspid>";
	szXml += "<timesnapnum>"+timesnapnum+"</timesnapnum>";
	szXml += "<eventsnapnum>"+eventsnapnum+"</eventsnapnum>";
 	szXml += "</snappicinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/storage/snappicconfig"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
		}
	});
};
