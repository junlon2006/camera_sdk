/*************************************************

*************************************************/
var currentStepIP=0;
var UserNameLogin = $.cookie('UserNameLogin');
var max_line_numIP=0;
var selIPFilterType=0;
var ArrUserList=new Array();  //用户数组
var blackip=new Array();
var whiteip=new Array();
var xmluserpower="";
function User() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(User);
pr(User).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["usersecurity", "User"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	this.initUserPage();
	if ($.cookie('UserNameLogin')=="admin")
	{
	  $("#UserListContent").show();
	  $("#Usertable").hide();
	}
	else
	{
	  $("#UserListContent").hide();
	  $("#Usertable").show();
	}
	
}

function RTSPAuth() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(RTSPAuth);
pr(RTSPAuth).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["usersecurity", "RTSPAuth"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initRTSPAuth();
	autoResizeIframe();
}
function SafetyService() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(SafetyService);
pr(SafetyService).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["usersecurity", "SafetyService"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initSafetyService();	
}
/*************************************************
Function:		initRTSPAuth
Description:	获取RTSPAuth
Input:			无			
Output:			无
return:			无				
*************************************************/
function initRTSPAuth()
{	
	var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/rtspgs"
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
		    $(xmlDoc).find("type").each(function(i){ 
		     	var k_rtcpgstypeopt1=$(this).attr('opt');
		  	 	var k_szrtcpgs= $(this).text();
				$("#selRTSPAuthType").empty(); 
				var arr = k_rtcpgstypeopt1.split(","); 
				for (i=0;i<arr.length;i++){
				  $("#selRTSPAuthType").append("<option value="+arr[i]+">"+arr[i]+"</option>");
					var selectCode=document.getElementById("selRTSPAuthType"); 
					if(selectCode.options[i].value==k_szrtcpgs){  
						selectCode.options[i].selected=true;  
					 } 
				};
			}); 
			anonymity("rtsp");
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
function CheangeRTSPAuth(){
	var selRTSPAuthType=$("#selRTSPAuthType").val();
	var szXml = "<rtcpgsinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<type>"+selRTSPAuthType+"</type>";
		szXml += "</rtcpgsinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/rtspgs"
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
					initRTSPAuth();
				}else{
					//szRetInfo=  m_szErrorState+m_szError1;	
				}
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};


//IP地址过滤
function IPFilter(){
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(IPFilter);
pr(IPFilter).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["usersecurity", "IPFilter"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initIPFilterData();
	autoResizeIframe();
}
/*************************************************
Function:		initIPFilter
Description:	初始化IP地址过滤
Input:			无		
Output:			无
return:			无				
*************************************************/
function initIPFilterData(){
	blackip=new Array();
    whiteip=new Array();
	var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/ipfilter"
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
		  //$("#TbodyFilterList").empty();
		    var  Docxml =xhr.responseText;
		    var  xmlDoc = GetparseXmlFromStr(Docxml);
			 selIPFilterXML=xmlDoc;
		   
			$(xmlDoc).find("mode").each(function(i){
			    var g_IPFiltermode = $(this).attr('opt').split(",");
				selIPFilterType = $(this).text();
				$("#selIPFilterType").empty(); 
				insertOptions2Select(g_IPFiltermode, ["disable", "black", "white"], ["optdisable", "optblack", "optwhite"], "selIPFilterType");
				setValueDelayIE6("selIPFilterType" ,"","",selIPFilterType);
				//$("#TbodyFilterList").empty(); 
				//解析生成表格
				if (selIPFilterType=="black")
				{
					 $("#btnAddIP").prop("disabled", false);
					 $("#btnCleanIP").prop("disabled", false);	
				}
				else if(selIPFilterType=="white")
				{
					$("#btnAddIP").prop("disabled", false);
					$("#btnCleanIP").prop("disabled", false);	
				
				}else
				{
				   $("#btnAddIP").prop("disabled", true);
				   $("#btnCleanIP").prop("disabled", true);	
				   $("#btnModifyIP").prop("disabled", true);
				   $("#DelDigitalIpBtn").prop("disabled", true);
				}
			});
			//黑名单
			 $(xmlDoc).find("black").each(function(i){ 
				var k_blackOpt=$(xmlDoc).find("black").find('ip').length;
				for(var j = 1; j <=k_blackOpt; j++)
				{
				  blackip[j-1] = $(xmlDoc).find('black').find('ip').eq(j-1).text();
				};
			});
			//白名单
			$(xmlDoc).find("white").each(function(i){ 
				var k_blackOpt=$(this).find('ip').length;
			    for(var j = 1; j <=k_blackOpt; j++)
				{
					whiteip[j - 1] = $(xmlDoc).find('white').find('ip').eq(j-1).text();
				};
			});
			RefreshIPFilterWindow(); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		
	});
	
	
};
function RefreshIPFilterWindow(){
	
	var selectCode=document.getElementById("selIPFilterType");
	for (i=0;i<selectCode.length;i++){
		if(selectCode.options[i].value==selIPFilterType){  
			selectCode.options[i].selected=true;  
			//break;
		}
	}
	
	
	
	$("#TbodyFilterList").empty();
	if (selIPFilterType=="disable")
	{
		$("#btnAddIP").prop("disabled", true);
	    $("#btnCleanIP").prop("disabled", true);	
	    $("#btnModifyIP").prop("disabled", true);
	    $("#DelDigitalIpBtn").prop("disabled", true);
	}else if (selIPFilterType=="black")
	{
		
		$("#btnAddIP").prop("disabled", false);
		$("#btnModifyIP").prop("disabled", true);	
		$("#DelDigitalIpBtn").prop("disabled", true);	
		$("#btnCleanIP").prop("disabled", true);	
		
		var k_blackOpt= blackip.length;	
		for(var j = 1; j <=k_blackOpt; j++)
		{
			$("#TbodyFilterList").append("<tr id='line"+max_line_numIP+(parseInt(j))+"' onclick='lineclicIPk(this)'>"
							     +"<td class='td_user'>"+(parseInt(j))+"</td>"
								 +"<td id='IPList"+parseInt(j)+"'>"+blackip[j-1]+"</td>"
								 +"</tr>");
		};
		var _len = $("#TbodyFilterList tr").length; 
		 if (_len >= 64){
	 	  $("#btnAddIP").prop("disabled", true);
		}else{
		  $("#btnAddIP").prop("disabled", false);
		  $("#btnCleanIP").prop("disabled", false);
		}
	}
	else if(selIPFilterType=="white")
	{
		
		$("#btnAddIP").prop("disabled", false);
		$("#btnModifyIP").prop("disabled", true);	
		$("#DelDigitalIpBtn").prop("disabled", true);	
		$("#btnCleanIP").prop("disabled", true);
		
		var k_blackOpt=whiteip.length;
		for(var j = 1; j <=k_blackOpt; j++)
		{			
				$("#TbodyFilterList").append("<tr  id='line"+max_line_numIP+(parseInt(j))+"' onclick='lineclicIPk(this)'>"
							     +"<td class='td_user'>"+(parseInt(j))+"</td>"
								 +"<td id='IPList"+parseInt(j)+"'>"+whiteip[j-1]+"</td>"
								 +"</tr>");
		}
		var _len = $("#TbodyFilterList tr").length; 
		 if (_len >= 64){
	 	  $("#btnAddIP").prop("disabled", true);
		}else{
		  $("#btnAddIP").prop("disabled", false);
		}
	}
	
	 var _len = $("#TbodyFilterList tr").length; 
		 if (_len > 0){
	 	  $("#btnCleanIP").prop("disabled", false);
		}else{
		  $("#btnCleanIP").prop("disabled", true);
		}
	 
  autoResizeIframe();		   
};

//选择方式
function ChangeselIPFilterType(){
	  // selIPFilterType=$("#selIPFilterType").val();
	   
	   // selIPFilterXML=Docxml;
		  selIPFilterType=$("#selIPFilterType").val();
			//解析生成表格
			$("#TbodyFilterList").empty();
			if (selIPFilterType=="black"){
				 $("#btnAddIP").prop("disabled", false);
			     $("#btnCleanIP").prop("disabled", false);	
				 $(selIPFilterXML).find("black").each(function(i){ 
					//var k_blackOpt=$(selIPFilterXML).find("black").find('ip').length;
					var k_blackOpt=$(this).find('ip').length;
					  for(var j = 1; j <=k_blackOpt; j++)
						{
						  blackip[j-1] = $(selIPFilterXML).find('black').find('ip').eq(j-1).text();
						};
				});//解析生成表格结束
			}else if(selIPFilterType=="white"){
				$("#btnAddIP").prop("disabled", false);
			    $("#btnCleanIP").prop("disabled", false);	
				$(selIPFilterXML).find("white").each(function(i){ 
					var k_whiteOpt=$(this).find('ip').length;
					  for(var j = 1; j <=k_whiteOpt; j++)
						{
							whiteip[j - 1] = $(selIPFilterXML).find('white').find('ip').eq(j-1).text();
						};
				});//解析生成表格结束
			}else{
			   $("#btnAddIP").prop("disabled", true);
			   $("#btnCleanIP").prop("disabled", true);	
			   $("#btnModifyIP").prop("disabled", true);
			   $("#DelDigitalIpBtn").prop("disabled", true);
			} 
	   
	   
	   
	   RefreshIPFilterWindow();
};
/*************************************************
Function:		initSafetyService
Description:	初始化安全服务页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initSafetyService()
{	
	var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	    var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/config"/*"/config.xml"*/;
		
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
				 
				 $(xmlDoc).find("ssh").each(function(i,data) {
					 var ssh =$(this).text();
					 if("true" === ssh)
					 {
						$("#IsEnableSSH").val(true).prop("checked", true);
					}else{
						$("#IsEnableSSH").val(false).prop("checked", false);
					}
				});
				
				$(xmlDoc).find("locklog").each(function(i,data) {
					 var locklog=$(this).text();
					 if("true" === locklog)
					 {
						$("#IsEnableILL").val(true).prop("checked", true);
					}else{
						$("#IsEnableILL").val(false).prop("checked", false);
					}
				});
				 },
				 error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr);
		}
	});
}

function checkbox(obj){
	if($(obj).prop("checked")){ //选中
	   //alert("选中")
		   $(obj).val("true"); 
		}else{
		//	alert("未选")
		 $(obj).val("false");
		}
}
/*************************************************
Function:		SaveSafetyService
Description:	保存用户安全信息
Input:			无		
Output:			无
return:			无				
*************************************************/
function SaveSafetyService(obj){
	var szXml = "<configinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	    szXml += "<ssh>"+$("#IsEnableSSH").val()+"</ssh>";
       // szXml += "<telnet>"+$("#IsEnableTelnet").val()+"</telnet>";
		szXml += "<locklog>"+$("#IsEnableILL").val()+"</locklog>";
		//szXml += "<adminalert>"+$("#IsEnableWPF").val()+"</adminalert>";
		szXml += "</configinfo>";
	    var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/config"/*"/config.xml"*/;
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
		  //$("#TbodyFilterList").empty();
		    var  Docxml =xhr.responseText;
		    var  xmlDoc = GetparseXmlFromStr(Docxml);
			 $(xmlDoc).find("statuscode").each(function(i){ 
				var state= $(this).text();
				if("0" == state)	//OK
				{
					szRetInfo = m_szSuccessState+m_szSuccess1;
				}else{
					szRetInfo=  m_szErrorState+m_szError1;	
				}
				});
			  
			$("#SetResultSafetyService").html(szRetInfo);
			setTimeout(function(){$("#SetResultSafetyService").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};
/*************************************************
Function:		Saveipfilter
Description:	保存IP地址过滤
Input:			无		
Output:			无
return:			无				
*************************************************/
function Saveipfilter(obj){
	if (selIPFilterType=="white"){
		if(whiteip.length==0){
			szRetInfo = m_szErrorState+"<label name='jsIPFilterlist'>"+getNodeValue('jsIPFilterlist')+"</label>";
		    $("#SetResultTipsipfilter").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsipfilter").html("");},5000);  //5秒后自动清除
		  return
		}
	}else if(selIPFilterType=="black"){
		if(blackip.length==0){
			szRetInfo = m_szErrorState+"<label name='jsIPFilterlist'>"+getNodeValue('jsIPFilterlist')+"</label>";
		    $("#SetResultTipsipfilter").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsipfilter").html("");},5000);  //5秒后自动清除
		  return
		}
	}
	
	var szXml = "<ipfilterinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	   szXml += "<mode>"+selIPFilterType+"</mode>";
	   szXml += "<black size='"+blackip.length+"'>";
	      for (i = 1; i <= blackip.length; i++){
			  szXml += "<ip>"+blackip[i-1]+"</ip>";
		  }
		szXml += "</black>";
	  szXml += "<white size='"+whiteip.length+"'>";
	      for (i = 1; i <= whiteip.length; i++){
			  szXml += "<ip>"+whiteip[i-1]+"</ip>";
		  }
		szXml += "</white>";
  	szXml += "</ipfilterinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/ipfilter"
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
			  
			$("#SetResultTipsipfilter").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsipfilter").html("");},5000);  //5秒后自动清除
			initIPFilterData();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};

/*************************************************
Function:		showAddIPAddressWnd
Description:	添加IP弹出窗口
Input:			无		
Output:			无
return:			无				
*************************************************/
function showAddIPAddressWnd(obj){
	 $("#divIPFilterTable").modal(
		{
		"close":false,
		 "position":[150]  
		 }
	   );
	 $("#simplemodal-container").height("auto");
	if (obj=="add"){
		$("#divIPFilterTitle").html("<label name='MAddIPAddress'>"+getNodeValue('MAddIPAddress')+"</label>");
		$("#IPFilterAdd").show();
		$("#IPFilterEdit").hide();
	}
	else if(obj=="edit")
	{
		$("#divIPFilterTitle").html("<label name='MEditIPAddress'>"+getNodeValue('MEditIPAddress')+"</label>");
		$("#IPFilterAdd").hide();
		$("#IPFilterEdit").show();
		var upStep=currentStepIP;
		var upContent=$('#IPList'+upStep).html();
		$("#IPaddfil").val(upContent)
		IPEditfiledit=upContent;
		}
};
//清空全部
function deleteAllIPAddress(){
	  if(selIPFilterType=="white")
	  {
		  whiteip.splice(0,whiteip.length);//清空数组 
	  }
	  else if(selIPFilterType=="black")
	  {
		 blackip.splice(0,blackip.length);//清空数组 
	  }
	  RefreshIPFilterWindow();
	  $("#btnModifyIP").prop("disabled", true);
    $("#DelDigitalIpBtn").prop("disabled", true);
  currentStep=0;
  var lenIP = $("#TbodyFilterList tr").length; 
 // console.log(lenIP)
  if(lenIP <= 0){
	 // $("#selIPFilterType")
	  $("#selIPFilterType").val("disable"); 
	  
	  $("#btnAddIP").prop("disabled", true);
	  $("#btnModifyIP").prop("disabled", true);
	  $("#DelDigitalIpBtn").prop("disabled", true);
	   $("#btnCleanIP").prop("disabled", true);
	   selIPFilterType="disable";
	 }
};


//删除IP
function DelIPFilterBtn(){
	  if(selIPFilterType=="white")
	  {
		  whiteip.splice(currentStepIP - 1,1);
	  }
	  else if(selIPFilterType=="black")
	  {
		  blackip.splice(currentStepIP - 1,1);
	  }
	  RefreshIPFilterWindow();
  
    $("#btnModifyIP").prop("disabled", true);
    $("#DelDigitalIpBtn").prop("disabled", true);
  currentStep=0;
  var lenIP = $("#TbodyFilterList tr").length; 
 // console.log(lenIP)
  if(lenIP <= 0){
	 // $("#selIPFilterType")
	  $("#selIPFilterType").val("disable"); 
	  
	  $("#btnAddIP").prop("disabled", true);
	  $("#btnModifyIP").prop("disabled", true);
	  $("#DelDigitalIpBtn").prop("disabled", true);
	   $("#btnCleanIP").prop("disabled", true);
	   selIPFilterType="disable";
	 }
};
//弹出窗口确定
function IPFilterOKclick(obj){
	
	 /*var myArray = $("#IPaddfil").val().split(/\./); 
	
	if($.ip_validate($("#IPaddfil").val()) == false)
	{
		var szTipsInfo = "<img src='../images/config/tips.png' class='imgmiddle'>&nbsp;";
		setTimeout(function(){$("#IPaddfiltips").html("");},3000);  //3秒后自动清除
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue("MAIPAddress");
		$("#IPaddfiltips").html(szTipsInfo); 
		return
	}
    var IPadd=Number(myArray[0])+"."+Number(myArray[1])+"."+Number(myArray[2])+"."+Number(myArray[3]);*/
	 var IPadd=$("#IPaddfil").val();
	 if(!CheckIPFilter(IPadd,'IPaddfiltips','MAIPAddress'))
	{
		return;
	}
	 if (obj=="add"){//CheckIPFilter
		 //if(!CheckIPadd(IPadd,'IPaddfiltips','MAIPAddress'))
		
		if(selIPFilterType=="white")
		{
			len = whiteip.length;
			for (i = 1; i <= len; i++){
				  if (whiteip[i-1] == IPadd){
					 szRetInfo = m_szErrorState+"<label name='jsDataexists'>"+getNodeValue('jsDataexists')+"</label>";
					  $("#btnIPFilterOKTips").html(szRetInfo);
					 setTimeout(function(){$("#btnIPFilterOKTips").html("");},5000);  //5秒后自动清除
					  return false 
					 }
			  }
			whiteip[len] = IPadd;
		}
		else if(selIPFilterType=="black")
		{
			len = blackip.length;
			for (i = 1; i <= len; i++){
				  if (blackip[i-1] == IPadd){
					 szRetInfo = m_szErrorState+"<label name='jsDataexists'>"+getNodeValue('jsDataexists')+"</label>";
					  $("#btnIPFilterOKTips").html(szRetInfo);
					 setTimeout(function(){$("#btnIPFilterOKTips").html("");},5000);  //5秒后自动清除
					  return false 
					 }
			  }
			blackip[len] = IPadd;
		}
	}
	else if(obj=="edit")
	{
		 /*if(!CheckIPaddErr(IPadd,'IPaddfiltips','jsIPFilter'))
		{
			return;
		}*/
		
		if (IPEditfiledit!=IPadd)
		{
			if(selIPFilterType=="white")
			{
				len = blackip.length;
				for (i = 1; i <= len; i++){
					  if (whiteip[i-1] == IPadd){
						 // btnIPFilterOKTips
						 szRetInfo = m_szErrorState+"<label name='jsDataexists'>"+getNodeValue('jsDataexists')+"</label>";
						  $("#btnIPFilterOKTips").html(szRetInfo);
						 setTimeout(function(){$("#btnIPFilterOKTips").html("");},5000);  //5秒后自动清除
						  return false 
						 }
				  }
				whiteip[currentStepIP - 1] = IPadd;
			}
			else if(selIPFilterType=="black")
			{
				len = blackip.length;
				for (i = 1; i <= len; i++){
					  if (blackip[i-1] == IPadd){
						 szRetInfo = m_szErrorState+"<label name='jsDataexists'>"+getNodeValue('jsDataexists')+"</label>";
						  $("#btnIPFilterOKTips").html(szRetInfo);
						 setTimeout(function(){$("#btnIPFilterOKTips").html("");},5000);  //5秒后自动清除
						  return false 
						 }
				  }
			   blackip[currentStepIP - 1] = IPadd;
			}
		}
		
	}
	RefreshIPFilterWindow();
	$.modal.impl.close();
};

function lineclicIPk(line){
   $('#TbodyFilterList tr').each(function(){$(this).removeClass().addClass("treven");});
   var seqIP=$(line).children("td").html();
   $(line).removeClass().addClass("trOdd");
   currentStepIP=seqIP;
   $("#btnModifyIP").prop("disabled", false);
   $("#DelDigitalIpBtn").prop("disabled", false);
   $("#btnCleanIP").prop("disabled", false);
   //console.log(currentStepIP)
}
function remove_line(){ 
  if(currentStepIP==0){
    alert('请选择一项!');
	return false;
  }
  $("#TbodyFilterList tr").each(
    function(){
	  var seqIP=parseInt($(this).children("td").html());
	  if(selIPFilterType=="white")
	  {
		delete whiteip[seqIP - 1];
	  }
	  else if(selIPFilterType=="black")
	  {
		delete blackip[seqIP - 1];
	  }
	  RefreshIPFilterWindow();
	
	 // if(seqIP==currentStepIP) $(this).remove();
	  //if(seqIP>currentStepIP) $(this).children("td").each(function(i){if(i==0)$(this).html(seqIP-1);});
	}
  );
  currentStepIP=0;
}
function modifyIPAddress(){
	$("#divEditMapTable").modal();
	var upStep=currentStepIP;
	//console.log(upStep)
	var upContent=$('#IPList'+upStep).html();
	$("#IPaddfiledit").val(upContent);
};
/*************************************************
Function:		initUserPage
Description:	用户页面初始化
Input:			无		
Output:			无
return:			无				
*************************************************/
User.prototype.initUserPage = function()
{
	/*for (var i=1;i<=5;i++){
		$("#TbodyUserList").append('<tr ><td class="tdbguser widthpx">'+(parseInt(i))+'</td><td class="tdbguser flostUserName">'+'admin'+'</td><td class="tdbguser flost">'+'操作员'+'</td></tr>');
	}*/
	anonymity(); // 是否启用匿名访问
	//GetUserList();//获取用户列表 
	
	setTimeout(function (){
		if ($.cookie('UserNameLogin')=="admin")
		{
			GetUserLists();
		}	
		else
		{
			GetUserinfo();
			///kdsapi/security/userinfo/<username>  
		}
		Getuserpower();        //当前用户权限获取
		autoResizeIframe();
		
	},100);
	
	
}
function GetUserinfo(){
	var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	   // var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/users"
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
			$(xmlDoc).find("username").each(function(i,data) {
			    var g_username =$(this).text();
				$("#UserinfoUserName").val(g_username);
				$("#UserinfoOldUserName").val(g_username);
			});
			$(xmlDoc).find("password").each(function(i,data) {
			    var g_password =$(this).text();
				//$("#UserinfoOldUserPsw").val(g_password);
				//$("#UserinfoOldUserPsw").val(g_password);
			});
			$(xmlDoc).find("userlevel").each(function(i,data) {
			    var g_userlevel =$(this).text();
				 for (i=0;i<3;i++){
					var g_UserInfoSelectUser=document.getElementById("UserInfoSelectUser"); 
					if(g_UserInfoSelectUser.options[i].value==g_userlevel){  
						g_UserInfoSelectUser.options[i].selected=true;  
					 } 
				 }
			});
			$(xmlDoc).find("powertype").each(function(i,data) {
			    var g_powertype = $(this).text().split(","); 
				for (i=0;i<g_powertype.length;i++)
				{
					 if ("view"==g_powertype[i]){
						$("#userinfoview").prop("checked", true);
					 }
					  if ("recandpic"==g_powertype[i]){
						$("#userinforecandpic").prop("checked", true);
					 }
					  if ("ptz"==g_powertype[i]){
						$("#userinfoptz").prop("checked", true);
					 }
					  if ("paramset"==g_powertype[i]){
						$("#userinfoparamset").prop("checked", true);
					 }
					 if ("memory"==g_powertype[i]){
						$("#userinfomemory").prop("checked", true);
					 }
					 if ("reboot"==g_powertype[i]){
						$("#userinforeboot").prop("checked", true);
					 }
					 if ("system"==g_powertype[i]){
						$("#userinfosystem").prop("checked", true);
					 }
					 if ("admin"==g_powertype[i]){
						$("#userinfoadmin").prop("checked", true);
					 }
				};
			});
			autoResizeIframe();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		
	});
};
function SaveUserinfoPass(obj){
	var oldusername=$.rtrim($.ltrim($("#UserinfoOldUserName").val()));
	var oldpassword=$.rtrim($.ltrim($("#UserinfoOldUserPsw").val()));
	var username=$.rtrim($.ltrim($("#UserinfoUserName").val()));
	var password=$.rtrim($.ltrim($("#UserinfoUserPsw").val()));
	var password2=$.rtrim($.ltrim($("#UserinfoUserPsw2").val()));
	var usertype=$("#UserInfoSelectUser").val();
	if(!CheckUserName(username,'UserinfoUserNametips','jsUser',0,32))
	{
		return;	
	}
	
	if(!CheckUserPassword(oldpassword,'UserinfoOldUserPswtips','jsoldUserPsw',0,32))
	{
		return;	
	}
	if(!CheckUserPassword(password,'UserinfoUserPswtips','jsUserPsw',0,32))
	{
		return;	
	}
	
	if (password!=password2)
	{
	   szRetInfo=  m_szErrorState+"<label name='jsPwdCheckMismatch'>"+getNodeValue('jsPwdCheckMismatch')+"</label>";	
		$("#UserinfoUserPsw2tips").html(szRetInfo);
		setTimeout(function(){$("#UserinfoUserPsw2tips").html("");},2000);  //5秒后自动清除
		return;
	}
	var powertype="";
		$('[name=userunfoBaseUser]:checkbox:checked').each(function(){
			powertype+=$(this).val()+",";
		})
	var powertypecheck=powertype.substring(0, powertype.length - 1);  //删除最后一个逗号
	var szXml = "<userupdateinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<oldusername>"+oldusername+"</oldusername>";
		szXml += "<oldpassword >"+oldpassword+"</oldpassword>";
		szXml += "<newusername>"+username+"</newusername>";
		szXml += "<newpassword>"+password+"</newpassword>";
		szXml += "<userlevel>"+usertype+"</userlevel>";
		szXml += "<powertype>"+powertypecheck+"</powertype>";
		szXml += "</userupdateinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/user/update/operator/"+username
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
						    Newauthenticationid();
							
						}else{
							szRetInfo=  m_szErrorState+m_szError1;	
						}
					});
				$("#SetResultTipsUserinfoList").html(szRetInfo);
				setTimeout(function(){$("#SetResultTipsUserinfoList").html("");},5000);  //5秒后自动清除
			},error: function(xhr, textStatus, errorThrown)
				{
					ErrStateTips(xhr,obj,'EditPass');
				}
		});
};
//修改密码后重新获取鉴权
function Newauthenticationid()
{
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
			var xmlDoc = GetparseXmlFromStr(Docxml);
			if($(xmlDoc).find("authenticationid").length > 0){
				$(xmlDoc).find("authenticationid").each(function(i){ 
					var authenticationid = $(this).text();
					NewLogin(authenticationid);
				});
			}
		}
	});
}
//修改密码后重新获取鉴权
function NewLogin(obj)
{
	var Newauthentipassword = $("#UserinfoUserName").val()+","+$("#UserinfoUserPsw").val()+","+obj;
		Newauthentipassword = Base64.encode(hex_md5(Newauthentipassword));
		var Newauthenticationinfo = '<authenticationinfo type="7.0">';
			Newauthenticationinfo += "<username>"+$("#UserinfoUserName").val()+"</username>";
			Newauthenticationinfo += "<password>"+Newauthentipassword+"</password>";
			Newauthenticationinfo += "</authenticationinfo>";
    
	var szXml = "<contentroot version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml +="<authenticationinfo type='7.0'>";
	szXml +="<username>"+$("#UserinfoUserName").val()+"</username>"
	szXml +="<password>"+Newauthentipassword+"</password>"
	szXml += "</authenticationinfo>";
	szXml +="<loginparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>"
	szXml += "</loginparam>";
 	szXml += "</contentroot>";
	var xmlDoc = szXml;
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
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			　if (xhr.readyState == 4) {
		　　			if (xhr.status == 200) {
						$.cookie('UserNameLogin', $("#UserinfoUserName").val());
						$.cookie('UserPassLogin', $("#UserinfoUserPsw").val());
		                $.cookie('authenticationinfo', Newauthenticationinfo);
		　　			}
		　　		}
			
		}
	});
}
//是否启用匿名访问
function anonymity(obj){
	    var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/anonymity"
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
			var anonymityenable=$(xmlDoc).find('enable').eq(0).text();
			//是否启用
			if("true" == anonymityenable)
		    {
			    $("#anonymityinfo").val(true).prop("checked", true);
		    }else{
				$("#anonymityinfo").val(false).prop("checked", false);
			}
 
 			if (obj=="rtsp"){
				if ($("#selRTSPAuthType").val()!="none" && anonymityenable=="true" ){
					$("#RtspTips").show();	
				}
				else
				{
					$("#RtspTips").hide();	
				}
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
function anonymityinfo(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true);
	  $(obj).prop("checked", true);
	}else{
	
	  $(obj).prop("checked", false);
	  $(obj).val(false);
	}
	var szXml = "<anonymityinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+$(obj).val()+"</enable>";
 	szXml += "</anonymityinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/anonymity"
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


//获取用户列表
function GetUserLists(){
	//当前用户列表
	var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	    var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/users"
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
			UsersXmlDoc=xmlDoc;
			$("#UserListTbody").empty();
			$(xmlDoc).find("list").each(function(i){ 
			    var k_gblistopt=$(this).attr('size');
				var k_gblistmax=$(this).attr('max');
				var UserListList=$(this).find('user')

				for(var i = 1; i <=UserListList.length; i++)
				{ 
				var username = $(UserListList[i-1]).find('username').eq(0).text();
				passwordList= $(UserListList[i-1]).find('password').eq(0).text();
				var userlevel = $(UserListList[i-1]).find('userlevel').eq(0).text();
				 PowertypeList = $(UserListList[i-1]).find('powertype').eq(0).text();
				  ArrUserList[i-1] = $(xmlDoc).find('username').eq(i-1).text();
					$("#UserListTbody").append("<tr id='UserListTr"+max_line_numIP+(parseInt(i))+"' onclick='lineclicUserList(this)'>"
					+"<td class='td_user'>"+parseInt(i)+"</td>"
					 +"<td class='td_user2' id='UserNameTd"+parseInt(i)+"'>"+username+"</td>"
					// +"<td class='tdbguser flost' id='UserLevelTd"+parseInt(i)+"'>"+getNodeValue('PriorityOpt'+(i))+"</td>"
					+"<td class='td_user2' id='UserLevelTd"+parseInt(i)+"' style='display:none'>"+userlevel+"</td>"
					+"<td class='td_user2' id='UserLevelTdText"+parseInt(i)+"'>"+"<label name='M"+userlevel+"'>"+TurnUserText(userlevel)+"</label>"+"</td>"
					+"<td class='td_user2' id='UserPowertypeListTd"+parseInt(i)+"' style='display:none'>"+PowertypeList+"</td>"
					+"<td class='td_user2' id='UserpasswordListTd"+parseInt(i)+"' style='display:none'>"+passwordList+"</td>"
				 +"</tr>");
				}
				if (Number(k_gblistopt) >= Number(k_gblistmax)){
				   $("#AddDigitalIpBtn").prop("disabled", true);
				}else{
					$("#AddDigitalIpBtn").prop("disabled", false);
				}
				$("#ModifyUserBtn").prop("disabled", true);
				$("#DelUserBtn").prop("disabled", true);
				autoResizeIframe();
			}); 
		
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

/*************************************************
Function:		TurnUserText
Description:	将用户类型字符串成文字
Output:			无
return:			无				
*************************************************/
function TurnUserText(iText)
{
	var szText = '';
	if('administrator' == iText)
	{
		szText = getNodeValue('Madministrator');    //管理员
	}
	else if('operator' == iText)
	{
		szText = getNodeValue('Moperator');    //操作员
	}
	else if('viewer' == iText)
	{
		szText = getNodeValue('Mviewer');    //普通用户
	}
	return szText;
}
//当前用户获取权限
function Getuserpower(){
	var szXml = "<contentroot>";
	        szXml +=$.cookie('authenticationinfo');
 	        szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/userpower"
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
			if ($.cookie('UserNameLogin')=="admin")
			{
			  	xmluserpower = xmlDoc;
			}
			else
			{
			   RefreshIsAdminXML(xmlDoc)
			}
		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
		*/
	});
};

/******解析非admin用户********/
function RefreshIsAdminXML(xmlInfo){
   $(xmlInfo).find("powercaps").each(function(i){
		if ($(this).find('view').text()!="true")
		{
			$("#iUserliview").hide();
		}
		else
		{
			$("#iUserliview").show();
		}
		
		if ($(this).find('recandpic').text()!="true")
		{
			$("#iUserlirecandpic").hide();
		}
		else
		{
			$("#iUserlirecandpic").show();
		}
		
		if ($(this).find('ptz').text()!="true")
		{
			$("#iUserliptz").hide();
		}
		else
		{
			$("#iUserliptz").show();
		}
		
		if ($(this).find('paramset').text()!="true")
		{
			$("#iUserliparamset").hide();
		}
		else
		{
			$("#iUserliparamset").show();
		}
		
		if ($(this).find('memory').text()!="true")
		{
			$("#iUserlimemory").hide();
		}
		else
		{
			$("#iUserlimemory").show();
		}
		
		if ($(this).find('reboot').text()!="true")
		{
			$("#iUserlireboot").hide();
		}
		else
		{
			$("#iUserlireboot").show();
		}
		
		if ($(this).find('system').text()!="true")
		{
			$("#iUserlisystem").hide();
		}
		else
		{
			$("#iUserlisystem").show();
		}
		
		
	});
   $('#span1').height(parseInt($('#IsUserListDiv').height())+parseInt(10));
};

//修改用户
function lineclicUserList(line){
   $('#UserListTbody tr').each(function(){$(this).removeClass().addClass("treven");});
   var seqUser=$(line).children("td").html();
 //  console.log($(line).children("td").next().html())
   $(line).removeClass().addClass("trOdd");
   currentStepUser=seqUser;
   
   if ($(line).children("td").next().html()=='admin'){
	   $("#ModifyUserBtn").prop("disabled", false);
  	    $("#DelUserBtn").prop("disabled", true);  
	  }else{
		$("#ModifyUserBtn").prop("disabled", false);
  	    $("#DelUserBtn").prop("disabled", false);  
		 }
}
function remove_line(){ 
  if(currentStepUser==0){
    alert('请选择一项!');
	return false;
  }
  $("#UserListTbody tr").each(
    function(){
	  var seqUser=parseInt($(this).children("td").html());
	  if(seqUser==currentStepUser) $(this).remove();
	  if(seqUser>currentStepUser) $(this).children("td").each(function(i){if(i==0)$(this).html(seqUser-1);});
	}
  );
  currentStepUser=0;
}
//修改弹出窗口
function ModifyUserInfo(){
	
	$("#divAddUsetTable").modal();
	$("#UserTitleTips").html(getNodeValue('Medituser'))//修改用户
	$("#btnuserOK").show();
	$("#UserAddOKclick").hide()
	$("#UserAddOKTips").html("")
	//$("#divEditUsetTable").modal();
	var upUserStep=currentStepUser;
	var upUserNameTd=$('#UserNameTd'+upUserStep).html();
	var UserLevelTd=$('#UserLevelTd'+upUserStep).html();
	var UserPowertypeListTd=$('#UserPowertypeListTd'+upUserStep).html()
	var UserpasswordListTd=$('#UserpasswordListTd'+upUserStep).html()
	var EditSelectUser=document.getElementById("SelectUser")
		for (i=0;i<EditSelectUser.length;i++){
		 if(EditSelectUser.options[i].value==UserLevelTd){  
			EditSelectUser.options[i].selected=true;  
			}
		}
	var SelectUser=UserLevelTd;  //得到类型
 // var UserLevelInput='input[name=EditBaseUser]:checkbox:checked'
   var ArrUser = UserPowertypeListTd.split(","); 
   var UserTypeListChrckBox=""
    var checktype1="";
		$('input[name=BaseUser]:checkbox').each(function(){
			checktype1+=$(this).val()+",";
		})
		var checktype=checktype1.substring(0, checktype1.length - 1);  //删除最后一个逗号

	 for (i=0;i<ArrUser.length;i++){
       
		if ("view"==ArrUser[i]){
			$("#view").prop("checked", true);
		 }
		  if ("recandpic"==ArrUser[i]){
			$("#recandpic").prop("checked", true);
		 }
		  if ("ptz"==ArrUser[i]){
			$("#ptz").prop("checked", true);
		 }
		  if ("paramset"==ArrUser[i]){
			$("#paramset").prop("checked", true);
		 }
		 if ("memory"==ArrUser[i]){
			$("#memory").prop("checked", true);
		 }
		 if ("reboot"==ArrUser[i]){
			$("#reboot").prop("checked", true);
		 }
		 if ("system"==ArrUser[i]){
			$("#system").prop("checked", true);
		 }
		 if ("admin"==ArrUser[i]){
			$("#admin").prop("checked", true);
		 }
		 
		
	};
	if (upUserNameTd=="admin"  ){
		$("#UserName").prop("disabled",true);
		$("#SelectUser").prop("disabled",true);
		$("input:[name='BaseUser']").prop("disabled",true);
	}
	$("#OldEditUserName").val(upUserNameTd)  //旧用户名
	$("#OldEditPassword").val(UserpasswordListTd)   //旧密码
	
	$("#UserName").val(upUserNameTd)
	
	$("#UserPsw").val(UserpasswordListTd)
	//console.log(upContent)
};
//修改结束


//添加用户弹出窗口
function AddNewUser(obj){
	 $("#divAddUsetTable").modal(
			{
			"close":false,
			 "position":[150]  
			 }
		   );
	if (obj=="add")
	{
		$("input[name='BaseUser']").prop("checked", false).prop("disabled", true);//不勾选禁用
		$("#UserAddOKTips").html("")
		$("#UserTitleTips").html("<label name='Madduser'>"+getNodeValue('Madduser')+"</label>")
		$("#btnuserOK").hide();
		$("#UserAddOKclick").show()
		
		
		//获取是否支持的能力
		
		 var g_user_support=0;
		 $(xmluserpower).find("powercaps").each(function(i,data){
		     if($(this).find("view").length > 0){
				$(this).find("view").each(function(i){ 
					 if($(this).text()!="true")
					 {
						$("#liview").hide();
					 }
					 else{
						$("#liview").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("recandpic").length > 0){
				$(this).find("recandpic").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#lirecandpic").hide();
					 }
					 else
					 {
						$("#lirecandpic").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("ptz").length > 0){
				$(this).find("ptz").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#liptz").hide();
					 }
					 else
					 {
						$("#liptz").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("paramset").length > 0){
				$(this).find("paramset").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#liparamset").hide();
					 }
					 else
					 {
						$("#liparamset").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("memory").length > 0){
				$(this).find("memory").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#limemory").hide();
					 }
					 else{
						$("#limemory").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("reboot").length > 0){
				$(this).find("reboot").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#lireboot").hide();
					 }
					 else
					 {
						$("#lireboot").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("system").length > 0){
				$(this).find("system").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#lisystem").hide();
					 }
					 else
					 {
						$("#lisystem").show();
						g_user_support+=1;
					 }
				});
			};
			//console.log(g_user_support)
			
			if(g_user_support%2==1)
			{
				$("#UserListDiv").height(((parseInt(g_user_support)+parseInt(1))/2)*parseInt(25)+parseInt(25))
				$("#simplemodal-container").height("auto")
			}
			else
			{
				$("#UserListDiv").height((parseInt(g_user_support)/2)*parseInt(25)+parseInt(25))
				$("#simplemodal-container").height("auto")
			}
		 });
		 var SelectUser=$("#SelectUser").val();
		 $(xmluserpower).find("userpowerinfo").each(function(i,data) {
		    var typeuserNodeslength=$(this).find('user').length;
			for (var i=0;i<typeuserNodeslength;i++)
			{
				var streammodeopt=$(this).find('user').eq(i).attr('type');  //用户类型
				if (streammodeopt == SelectUser)
				{
					var g_powertypeopt=$(this).find('user').find("power").find('powertype').eq(i).attr('opt');
					var g_arrtypeopt = g_powertypeopt.split(",");
					for (var j=0;j<g_arrtypeopt.length;j++)
					{
						 if ("view"==g_arrtypeopt[j])
						 {
							$("#view").prop("disabled", false);
						 }
						 if ("recandpic"==g_arrtypeopt[j])
						 {
							$("#recandpic").prop("disabled", false);
						 }
						 if ("ptz"==g_arrtypeopt[j])
						 {
							$("#ptz").prop("disabled", false);
						 }
						 if ("paramset"==g_arrtypeopt[j])
						 {
							$("#paramset").prop("disabled", false);
						 }
						 if ("memory"==g_arrtypeopt[j])
						 {
							$("#memory").prop("disabled", false);
						 }
						 if ("reboot"==g_arrtypeopt[j])
						 {
							$("#reboot").prop("disabled", false);
						 }
						 if ("system"==g_arrtypeopt[j])
						 {
							$("#system").prop("disabled", false);
						 }
					}//能力集
					
					var g_powertypetext=$(this).find('user').find("power").find('powertype').eq(i).text();
					var g_arrusertext = g_powertypetext.split(",");
					for (k=0;k<g_arrusertext.length;k++){
						 if ("view"==g_arrusertext[k])
						 {
							$("#view").prop("checked", true);
						 }
						 if ("recandpic"==g_arrusertext[k])
						 {
							$("#recandpic").prop("checked", true);
						 }
						 if ("ptz"==g_arrusertext[k])
						 {
							$("#ptz").prop("checked", true);
						 }
						 if ("paramset"==g_arrusertext[k])
						 {
							$("#paramset").prop("checked", true);
						 }
						 if ("memory"==g_arrusertext[k])
						 {
							$("#memory").prop("checked", true);
						 }
						 if ("reboot"==g_arrusertext[k])
						 {
							$("#reboot").prop("checked", true);
						 }
						 if ("system"==g_arrusertext[k])
						 {
							$("#system").prop("checked", true);
						 }
					};
					
				}
			}
		 });
	}
	else if(obj=="edit")
	{
		$("input[name='BaseUser']").prop("checked", false).prop("disabled", true);//不勾选禁用
		
		$("#UserTitleTips").html("<label name='Medituser'>"+getNodeValue('Medituser')+"</label>")
		$("#btnuserOK").show();
		$("#UserAddOKclick").hide()
		$("#UserAddOKTips").html("")
		//获取是否支持的能力
		
		 var g_user_support=0;
		 $(xmluserpower).find("powercaps").each(function(i,data){
		     if($(this).find("view").length > 0){
				$(this).find("view").each(function(i){ 
					 if($(this).text()!="true")
					 {
						$("#liview").hide();
					 }
					 else{
						$("#liview").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("recandpic").length > 0){
				$(this).find("recandpic").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#lirecandpic").hide();
					 }
					 else
					 {
						$("#lirecandpic").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("ptz").length > 0){
				$(this).find("ptz").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#liptz").hide();
					 }
					 else
					 {
						$("#liptz").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("paramset").length > 0){
				$(this).find("paramset").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#liparamset").hide();
					 }
					 else
					 {
						$("#liparamset").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("memory").length > 0){
				$(this).find("memory").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#limemory").hide();
					 }
					 else{
						$("#limemory").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("reboot").length > 0){
				$(this).find("reboot").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#lireboot").hide();
					 }
					 else
					 {
						$("#lireboot").show();
						g_user_support+=1;
					 }
				});
			};
			
			if($(this).find("system").length > 0){
				$(this).find("system").each(function(i){ 
					 
					 if($(this).text()!="true")
					 {
						$("#lisystem").hide();
					 }
					 else
					 {
						$("#lisystem").show();
						g_user_support+=1;
					 }
				});
			};
			//console.log(g_user_support)
			
			if(g_user_support%2==1)
			{
				$("#UserListDiv").height(((parseInt(g_user_support)+parseInt(1))/2)*parseInt(25)+parseInt(25))
				$("#simplemodal-container").height("auto")
			}
			else
			{
				$("#UserListDiv").height((parseInt(g_user_support)/2)*parseInt(25)+parseInt(25))
				$("#simplemodal-container").height("auto")
			}
		 });
		
		
		
		//$("#divEditUsetTable").modal();
		var upUserStep=currentStepUser;
		var upUserNameTd=$('#UserNameTd'+upUserStep).html();
		var UserLevelTd=$('#UserLevelTd'+upUserStep).html();
		var UserPowertypeListTd=$('#UserPowertypeListTd'+upUserStep).html()
		var UserpasswordListTd=$('#UserpasswordListTd'+upUserStep).html()
		var EditSelectUser=document.getElementById("SelectUser")
			for (i=0;i<EditSelectUser.length;i++){
			 if(EditSelectUser.options[i].value==UserLevelTd){  
				EditSelectUser.options[i].selected=true;  
				}
			}
		var SelectUser=UserLevelTd;  //得到类型
		 $(xmluserpower).find("userpowerinfo").each(function(i,data) {
			var typeuserNodeslength=$(this).find('user').length
			for (var i=0;i<typeuserNodeslength;i++)
			{
			   var streammodeopt=$(this).find('user').eq(i).attr('type');  //用户类型
				if (streammodeopt == SelectUser  &&  SelectUser=="administrator")
				{
					var g_powertypeopt=$(this).find('user').find("power").find('powertype').eq(i).attr('opt');
					var g_arrtypeopt = g_powertypeopt.split(",");
					for (var j=0;j<g_arrtypeopt.length;j++)
					{
						 if ("view"==g_arrtypeopt[j])
						 {
							$("#view").prop("disabled", false);
						 }
						 if ("recandpic"==g_arrtypeopt[j])
						 {
							$("#recandpic").prop("disabled", false);
							$("#BaseUser2").show();
						 }
						 if ("ptz"==g_arrtypeopt[j])
						 {
							$("#ptz").prop("disabled", false);
						 }
						 if ("paramset"==g_arrtypeopt[j])
						 {
							$("#paramset").prop("disabled", false);
							$("#BaseUser4").show();
						 }
						 if ("memory"==g_arrtypeopt[j])
						 {
							$("#memory").prop("disabled", false);
							$("#BaseUser5").show().show();
						 }
						 if ("reboot"==g_arrtypeopt[j])
						 {
							$("#reboot").prop("disabled", false);
							$("#BaseUser6").show().show();
						 }
						 if ("system"==g_arrtypeopt[j])
						 {
							$("#system").prop("disabled", false);
							$("#BaseUser7").show();
						 }
						 if ("admin"==g_arrtypeopt[j]){
							$("#admin").prop("disabled", false);
						 }
					}//能力集
				}  //admin
				else if (streammodeopt == SelectUser &&  SelectUser=="operator")
				{
					var g_powertypeopt=$(this).find('user').find("power").find('powertype').eq(i).attr('opt');
					var g_arrtypeopt = g_powertypeopt.split(",");
					for (var j=0;j<g_arrtypeopt.length;j++)
					{
						 if ("view"==g_arrtypeopt[j])
						 {
							$("#view").prop("disabled", false);  //启用
						 }
						 if ("recandpic"==g_arrtypeopt[j])
						 {
							$("#recandpic").prop("disabled", false);
						 }
						 if ("ptz"==g_arrtypeopt[j])
						 {
							$("#ptz").prop("disabled", false).show();
						 }
						 if ("paramset"==g_arrtypeopt[j])
						 {
							$("#paramset").prop("disabled", false);
						 }
						 if ("memory"==g_arrtypeopt[j])
						 {
							$("#memory").prop("disabled", false);
						 }
						 if ("reboot"==g_arrtypeopt[j])
						 {
							$("#reboot").prop("disabled", false);
						 }
						 if ("system"==g_arrtypeopt[j])
						 {
							$("#system").prop("disabled", false);
						 }
						 
					}//能力集
					
				}//操作员
				else if (streammodeopt == SelectUser  &&  SelectUser=="viewer")
				{
					var g_powertypeopt=$(this).find('user').find("power").find('powertype').eq(i).attr('opt');
					var g_arrtypeopt = g_powertypeopt.split(",");
					for (var j=0;j<g_arrtypeopt.length;j++)
					{
						 if ("view"==g_arrtypeopt[j])
						 {
							$("#view").prop("disabled", false);
						 }
						 if ("recandpic"==g_arrtypeopt[j])
						 {
							$("#recandpic").prop("disabled", false);
						 }
						 if ("ptz"==g_arrtypeopt[j])
						 {
							$("#ptz").prop("disabled", false);
						 }
						 if ("paramset"==g_arrtypeopt[j])
						 {
							$("#paramset").prop("disabled", false);
						 }
						 if ("memory"==g_arrtypeopt[j])
						 {
							$("#memory").prop("disabled", false);
						 }
						 if ("reboot"==g_arrtypeopt[j])
						 {
							$("#reboot").prop("disabled", false);
						 }
						 if ("system"==g_arrtypeopt[j])
						 {
							$("#system").prop("disabled", false);
						 }
						
					}//能力集
					
				}//操作员
			}
		});	
		
		 $(UsersXmlDoc).find("userlist").each(function(i,data) 
		 {
			 var g_usersize=$(this).find('list').attr('size');
			 for (var i=0;i<g_usersize;i++)
			 {
			   var g_usertext=$(this).find('user').find('userlevel').eq(i).text();//用户类型
			   if (g_usertext == SelectUser &&  SelectUser=="administrator")
				{
					//var g_powertype=$(this).find('user').find('powertype').eq(i).text();//用户权限
					var g_powertype=UserPowertypeListTd;
					var g_arrusertext = g_powertype.split(",");
					for (k=0;k<g_arrusertext.length;k++){
						 if ("view"==g_arrusertext[k])
						 {
							$("#view").prop("checked", true);
						 }
						 if ("recandpic"==g_arrusertext[k])
						 {
							$("#recandpic").prop("checked", true);
						 }
						 if ("ptz"==g_arrusertext[k])
						 {
							$("#ptz").prop("checked", true);
						 }
						 if ("paramset"==g_arrusertext[k])
						 {
							$("#paramset").prop("checked", true);
						 }
						 if ("memory"==g_arrusertext[k])
						 {
							$("#memory").prop("checked", true);
						 }
						 if ("reboot"==g_arrusertext[k])
						 {
							$("#reboot").prop("checked", true);
						 }
						 if ("system"==g_arrusertext[k])
						 {
							$("#system").prop("checked", true);
						 }
						 if ("admin"==g_arrusertext[k]){
							$("#admin").prop("checked", true);
						 }
					};
					
				}  //admin
				else if (g_usertext == SelectUser &&  SelectUser=="operator")
				{
					//var g_powertype=$(this).find('user').find('powertype').eq(i).text();//用户权限
					var g_powertype=UserPowertypeListTd;
					var g_arrusertext = g_powertype.split(",");
					for (k=0;k<g_arrusertext.length;k++){
						 if ("view"==g_arrusertext[k])
						 {
							$("#view").prop("checked", true);
						 }
						 if ("recandpic"==g_arrusertext[k])
						 {
							$("#recandpic").prop("checked", true);
						 }
						 if ("ptz"==g_arrusertext[k])
						 {
							$("#ptz").prop("checked", true);
						 }
						 if ("paramset"==g_arrusertext[k])
						 {
							$("#paramset").prop("checked", true);
						 }
						 if ("memory"==g_arrusertext[k])
						 {
							$("#memory").prop("checked", true);
						 }
						 if ("reboot"==g_arrusertext[k])
						 {
							$("#reboot").prop("checked", true);
						 }
						 if ("system"==g_arrusertext[k])
						 {
							$("#system").prop("checked", true);
						 }
						 if ("admin"==g_arrusertext[k]){
							$("#admin").prop("checked", true);
						 }
					};
					
				}  //operator
				else if (g_usertext == SelectUser &&  SelectUser=="viewer")
				{
					//var g_powertype=$(this).find('user').find('powertype').eq(i).text();//用户权限
					var g_powertype=UserPowertypeListTd;
					var g_arrusertext = g_powertype.split(",");
					for (k=0;k<g_arrusertext.length;k++){
						 if ("view"==g_arrusertext[k])
						 {
							$("#view").prop("checked", true);
						 }
						 if ("recandpic"==g_arrusertext[k])
						 {
							$("#recandpic").prop("checked", true);
						 }
						 if ("ptz"==g_arrusertext[k])
						 {
							$("#ptz").prop("checked", true);
						 }
						 if ("paramset"==g_arrusertext[k])
						 {
							$("#paramset").prop("checked", true);
						 }
						 if ("memory"==g_arrusertext[k])
						 {
							$("#memory").prop("checked", true);
						 }
						 if ("reboot"==g_arrusertext[k])
						 {
							$("#reboot").prop("checked", true);
						 }
						 if ("system"==g_arrusertext[k])
						 {
							$("#system").prop("checked", true);
						 }
					};
					
				}  //admin
			   
			 }
		 });//解析获取的用户信息
		
		if (upUserNameTd=="admin"  ){
			$("#UserName").prop("disabled",true);
			$("#SelectUser").prop("disabled",true);
			//$("input:[name='BaseUser']").prop("disabled",true);
		}
		$("#OldEditUserName").val(upUserNameTd)  //旧用户名
		$("#OldEditPassword").val(UserpasswordListTd)   //旧密码
		$("#UserName").val(upUserNameTd)
		//$("#UserPsw").val(UserpasswordListTd)
		//$("#UserPsw2").val(UserpasswordListTd)
	}
	
};
//解析权限xml
function xmluser(){
	//xmluserpower
	if (SelectUser=="administrator"){
		$("input[name='BaseUser']").prop("checked", true)
	}else if (SelectUser=="operator"){
		$("input[name='BaseUser']").prop("checked", false)
		$("#quickset").prop("checked", true);
		$("#networkset").prop("checked", true);
		$("#cameraset").prop("checked", true);
		$("#sysset").prop("checked", true);
		$("#userbrowse").prop("checked", true);
		$("#controlptz").prop("checked", true);
		$("#replay").prop("checked", true);
	}else{
		$("input[name='BaseUser']").prop("checked", false)
		$("#userbrowse").prop("checked", true);
		$("#replay").prop("checked", true);
	}
};

function ChangeSelectUser(){
	$("input[name='BaseUser']").prop("checked", false).prop("disabled", true);//不勾选禁用
    
	var SelectUser=$("#SelectUser").val();   //类型
		 $(xmluserpower).find("userpowerinfo").each(function(i,data) {
			var typeuserNodeslength=$(this).find('user').length
			for (var i=0;i<typeuserNodeslength;i++)
			{
			   var streammodeopt=$(this).find('user').eq(i).attr('type');  //用户类型
				if (streammodeopt == SelectUser  &&  SelectUser=="administrator")
				{
					var g_powertypeopt=$(this).find('user').find("power").find('powertype').eq(i).attr('opt');
					var g_arrtypeopt = g_powertypeopt.split(",");
					for (var j=0;j<g_arrtypeopt.length;j++)
					{
						 if ("view"==g_arrtypeopt[j])
						 {
							$("#view").prop("disabled", false);
						 }
						 if ("recandpic"==g_arrtypeopt[j])
						 {
							$("#recandpic").prop("disabled", false);
						 }
						 if ("ptz"==g_arrtypeopt[j])
						 {
							$("#ptz").prop("disabled", false);
						 }
						 if ("paramset"==g_arrtypeopt[j])
						 {
							$("#paramset").prop("disabled", false);
						 }
						 if ("memory"==g_arrtypeopt[j])
						 {
							$("#memory").prop("disabled", true);
						 }
						 if ("reboot"==g_arrtypeopt[j])
						 {
							$("#reboot").prop("disabled", true);
						 }
						 if ("system"==g_arrtypeopt[j])
						 {
							$("#system").prop("disabled", true);
						 }
					}//能力集
					
					var g_powertypetext=$(this).find('user').find("power").find('powertype').eq(i).text();
					var g_arrusertext = g_powertypetext.split(",");
					for (k=0;k<g_arrusertext.length;k++){
						 if ("view"==g_arrusertext[k])
						 {
							$("#view").prop("checked", true);
						 }
						 if ("recandpic"==g_arrusertext[k])
						 {
							$("#recandpic").prop("checked", true);
						 }
						 if ("ptz"==g_arrusertext[k])
						 {
							$("#ptz").prop("checked", true);
						 }
						 if ("paramset"==g_arrusertext[k])
						 {
							$("#paramset").prop("checked", true);
						 }
						 if ("memory"==g_arrusertext[k])
						 {
							$("#memory").prop("checked", true);
						 }
						 if ("reboot"==g_arrusertext[k])
						 {
							$("#reboot").prop("checked", true);
						 }
						 if ("system"==g_arrusertext[k])
						 {
							$("#system").prop("checked", true);
						 }
						 if ("admin"==g_arrusertext[k]){
							$("#admin").prop("checked", true);
						 }
					};
					
				}  //admin
				else if (streammodeopt == SelectUser &&  SelectUser=="operator")
				{
					var g_powertypeopt=$(this).find('user').find("power").find('powertype').eq(i).attr('opt');
					var g_arrtypeopt = g_powertypeopt.split(",");
					for (var j=0;j<g_arrtypeopt.length;j++)
					{
						 if ("view"==g_arrtypeopt[j])
						 {
							$("#view").prop("disabled", false);  //启用
						 }
						 if ("recandpic"==g_arrtypeopt[j])
						 {
							$("#recandpic").prop("disabled", false);
						 }
						 if ("ptz"==g_arrtypeopt[j])
						 {
							$("#ptz").prop("disabled", false);
						 }
						 if ("paramset"==g_arrtypeopt[j])
						 {
							$("#paramset").prop("disabled", false);
						 }
						 if ("memory"==g_arrtypeopt[j])
						 {
							$("#memory").prop("disabled", false);
						 }
						 if ("reboot"==g_arrtypeopt[j])
						 {
							$("#reboot").prop("disabled", false);
						 }
						 if ("system"==g_arrtypeopt[j])
						 {
							$("#system").prop("disabled", false);
						 }
						
					}//能力集
					
					var g_powertypetext=$(this).find('user').find("power").find('powertype').eq(i).text();
					var g_arrusertext = g_powertypetext.split(",");
					for (k=0;k<g_arrusertext.length;k++){
						 
						 if ("view"==g_arrusertext[k])
						 {
							$("#view").prop("checked", true);  //true勾选 
						 }
						 if ("recandpic"==g_arrusertext[k])
						 {
							$("#recandpic").prop("checked", true);
						 }
						 if ("ptz"==g_arrusertext[k])
						 {
							$("#ptz").prop("checked", true);
						 }
						 if ("paramset"==g_arrusertext[k])
						 {
							$("#paramset").prop("checked", true);
						 }
						 if ("memory"==g_arrusertext[k])
						 {
							$("#memory").prop("checked", true);
						 }
						 if ("reboot"==g_arrusertext[k])
						 {
							$("#reboot").prop("checked", true);
						 }
						 if ("system"==g_arrusertext[k])
						 {
							$("#system").prop("checked", true);
						 }
						 if ("admin"==g_arrusertext[k]){
							$("#admin").prop("checked", true);
						 }
					};
				}//操作员
				else if (streammodeopt == SelectUser  &&  SelectUser=="viewer")
				{
					var g_powertypeopt=$(this).find('user').find("power").find('powertype').eq(i).attr('opt');
					var g_arrtypeopt = g_powertypeopt.split(",");
					for (var j=0;j<g_arrtypeopt.length;j++)
					{
						 if ("view"==g_arrtypeopt[j])
						 {
							$("#view").prop("disabled", false);
						 }
						 if ("recandpic"==g_arrtypeopt[j])
						 {
							$("#recandpic").prop("disabled", false);
						 }
						 if ("ptz"==g_arrtypeopt[j])
						 {
							$("#ptz").prop("disabled", false);
						 }
						 if ("paramset"==g_arrtypeopt[j])
						 {
							$("#paramset").prop("disabled", false);
						 }
						 if ("memory"==g_arrtypeopt[j])
						 {
							$("#memory").prop("disabled", false);
						 }
						 if ("reboot"==g_arrtypeopt[j])
						 {
							$("#reboot").prop("disabled", false);
						 }
						 if ("system"==g_arrtypeopt[j])
						 {
							$("#system").prop("disabled", false);
						 }
						 
					}//能力集
					
					var g_powertypetext=$(this).find('user').find("power").find('powertype').eq(i).text();
					var g_arrusertext = g_powertypetext.split(",");
					for (k=0;k<g_arrusertext.length;k++){
						 if ("view"==g_arrusertext[k])
						 {
							$("#view").prop("checked", true);
						 }
						 if ("recandpic"==g_arrusertext[k])
						 {
							$("#recandpic").prop("checked", true);
						 }
						 if ("ptz"==g_arrusertext[k])
						 {
							$("#ptz").prop("checked", true);
						 }
						 if ("paramset"==g_arrusertext[k])
						 {
							$("#paramset").prop("checked", true);
						 }
						 if ("memory"==g_arrusertext[k])
						 {
							$("#memory").prop("checked", true);
						 }
						 if ("reboot"==g_arrusertext[k])
						 {
							$("#reboot").prop("checked", true);
						 }
						 if ("system"==g_arrusertext[k])
						 {
							$("#system").prop("checked", true);
						 }
					};
				}//操作员
			}
		});	
}
//弹出窗口添加用户确定
function UserAddOKclick(obj,suser){
	var checktypeCheck=$("input[name='BaseUser']:checked");
		if (checktypeCheck.length==0){
			szRetInfo = m_szErrorState+getNodeValue('Mpermissions');
			$("#UserAddOKTips").html(szRetInfo);
			setTimeout(function(){$("#UserAddOKTips").html("");},2000);  //5秒后自动清除
			return;
		}
	var username=$.rtrim($.ltrim($("#UserName").val()));
	var password=$.rtrim($.ltrim($("#UserPsw").val()));
	var password2=$.rtrim($.ltrim($("#UserPsw2").val()));
	
	var userlevel=$("#SelectUser").val();
	if (suser=="add")
	{
		var len=ArrUserList.length;
		for (i = 1; i <= len; i++ ) {
			if (ArrUserList[i-1]==username){
				szRetInfo = m_szErrorState+getNodeValue('jsUserexists');//用户名已存在
				$("#UserAddOKTips").html(szRetInfo);
			   setTimeout(function(){$("#UserAddOKTips").html("");},5000);  //5秒后自动清除
				return false 
			}
		}
		var powertype="";
			$('[name=BaseUser]:checkbox:checked').each(function(){
				powertype+=$(this).val()+",";
			})
			
		if(!CheckUserName(username,'UserNametips','jsUser',0,32))
		{
			return;	
		}
		if(!CheckUserPassword(password,'UserPswtips','jsUserPsw',0,32))
		{
			return;	
		}
		
		if (password!=password2)
	 	{
		   szRetInfo=  m_szErrorState+"<label name='jsPwdCheckMismatch'>"+getNodeValue('jsPwdCheckMismatch')+"</label>";
		    $("#UserPsw2tips").html(szRetInfo);
			setTimeout(function(){$("#UserPsw2tips").html("");},2000);  //5秒后自动清除
			return;
		}
		
		var powertypecheck=powertype.substring(0, powertype.length - 1);  //删除最后一个逗号
		var szXml = "<userinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<username>"+username+"</username>";
		szXml += "<password>"+password+"</password>";
		szXml += "<userlevel>"+userlevel+"</userlevel>";
		szXml += "<powertype>"+powertypecheck+"</powertype>";
		szXml += "</userinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/user/add"
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
							$.modal.impl.close();
					 }
					 else
					 {
							szRetInfo=  m_szErrorState+m_szError1;	
						}
					});
				$("#UserAddOKTips").html(szRetInfo);
				setTimeout(function(){$("#UserAddOKTips").html("");},5000);  //5秒后自动清除
				GetUserLists();
			},error: function(xhr, textStatus, errorThrown)
				{
				ErrStateTips(xhr,obj);
				}
		});
	}
	else if(suser=="edit")
	{
		var oldusername=$("#OldEditUserName").val();
		var oldpassword=$("#OldEditPassword").val();
		var username=$.rtrim($.ltrim($("#UserName").val()));
		var password=$.rtrim($.ltrim($("#UserPsw").val()));
		var userlevel=$("#SelectUser").val();
		var len=ArrUserList.length;
		if (oldusername!=username){
			  for (i = 1; i <= len; i++ ) {
				if (ArrUserList[i-1]==username){
					szRetInfo = m_szErrorState+getNodeValue('jsUserexists');
					$("#UserAddOKTips").html(szRetInfo);
				   setTimeout(function(){$("#UserEditOKTips").html("");},5000);  //5秒后自动清除
					return false 
				}
			}
		}
		var powertype="";
		$('[name=BaseUser]:checkbox:checked').each(function(){
			powertype+=$(this).val()+",";
		})
		if(!CheckUserName(username,'UserNametips','jsUser',0,32))
		{
			return;	
		}
		if (password!="")
		{
			if(!CheckUserPassword(password,'UserPswtips','jsUserPsw',0,32))
			{
				return;	
			}
			if (password!=password2)
			{
			   szRetInfo=  m_szErrorState+"<label name='jsPwdCheckMismatch'>"+getNodeValue('jsPwdCheckMismatch')+"</label>";
				$("#UserPsw2tips").html(szRetInfo);
				setTimeout(function(){$("#UserPsw2tips").html("");},2000);  //5秒后自动清除
				return;
			}
		}
		if (username=="admin")
		{
			powertype+="admin,"
			var powertypecheck=powertype.substring(0, powertype.length - 1);  //删除最后一个逗号
		}
		else
		{
			var powertypecheck=powertype.substring(0, powertype.length - 1);  //删除最后一个逗号
		}
		var szXml = "<userupdateinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		
		szXml += "<oldusername>"+oldusername+"</oldusername>";
		szXml += "<oldpassword>"+oldpassword+"</oldpassword>";
		if (username!="admin")
		{
			szXml += "<newusername>"+username+"</newusername>";
		}
		if (password!="")
		{
			szXml += "<newpassword>"+password+"</newpassword>";
		}
		szXml += "<userlevel>"+userlevel+"</userlevel>";
		szXml += "<powertype>"+powertypecheck+"</powertype>";
		szXml += "</userupdateinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/user/update/admin"
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
				if (username=="admin")
				{
					if (password!="")
					{
						NewAdminauthenticationid();
					}
					else
					{
						GetUserLists();
						autoResizeIframe();
						$.modal.impl.close();
					}
					
				}
				else
				{
				    GetUserLists();
					autoResizeIframe();
					$.modal.impl.close();
				}
				
			},error: function(xhr, textStatus, errorThrown)
				{
					ErrStateTips(xhr,obj,'EditUser');
				}
		});
	}
	//autoResizeIframe();
			
};
function UserCancelClick(){
	$.modal.impl.close();
	GetUserLists();
};
//修改密码后重新获取鉴权
function NewAdminauthenticationid()
{
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
			var xmlDoc = GetparseXmlFromStr(Docxml);
			if($(xmlDoc).find("authenticationid").length > 0){
				$(xmlDoc).find("authenticationid").each(function(i){ 
					var authenticationid = $(this).text();
					NewAdminLogin(authenticationid);
				});
			}
		}
	});
}
//修改密码后重新获取鉴权
function NewAdminLogin(obj)
{
	var username=$.rtrim($.ltrim($("#UserName").val()));
	var password=$.rtrim($.ltrim($("#UserPsw").val()));
	var Newauthentipassword = username+","+password+","+obj;
		Newauthentipassword = Base64.encode(hex_md5(Newauthentipassword));
		var Newauthenticationinfo = '<authenticationinfo type="7.0">';
			Newauthenticationinfo += "<username>"+username+"</username>";
			Newauthenticationinfo += "<password>"+Newauthentipassword+"</password>";
			Newauthenticationinfo += "</authenticationinfo>";
    
	var szXml = "<contentroot version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml +="<authenticationinfo type='7.0'>";
	szXml +="<username>"+username+"</username>"
	szXml +="<password>"+Newauthentipassword+"</password>"
	szXml += "</authenticationinfo>";
	szXml +="<loginparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>"
	szXml += "</loginparam>";
 	szXml += "</contentroot>";
	var xmlDoc = szXml;
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
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			　if (xhr.readyState == 4) {
		　　			if (xhr.status == 200) {
						$.cookie('UserNameLogin', username);
						$.cookie('UserPassLogin', password);
		                $.cookie('authenticationinfo', Newauthenticationinfo);
						GetUserLists();
						autoResizeIframe();
						$.modal.impl.close();
		　　			}
		　　		}
			
		}
	});
}

//保存用户操作
function SaveUserList(){
	var _len = $("#TbodyUserList tr").length; 
	var _lenArmchns = $("#TbodyUserList tr").length;  
	var username=$("#UserName").val();
	var password=$("#UserPsw").val();
	var userlevel=$("SelectUser").val();
	var szXml = "<userlist version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	
	szXml += "<list size='"+_len+"'>"
	  for (j=1;j<=_len;j++){
		 szXml += "<user>"
		    szXml += "<username>"+username+"</username>";
			szXml += "<password>"+password+"</password>";
			szXml += "<userlevel>"+userlevel+"</userlevel>";
		 szXml += "</user>"
	  }
	szXml += "</list>"
 	szXml += "</userlist>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/users"
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
			$("#SetResultTipsUserList").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsUserList").html("");},5000);  //5秒后自动清除
			GetUserLists();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

//删除用户
function DelUserInfo(){
	if (confirm(m_szAskTip1)){
	var upUserStep=currentStepUser;
	var username=$('#UserNameTd'+upUserStep).html();
	var password=$('#UserpasswordListTd'+upUserStep).html();
	var userlevel=$('#UserLevelTd'+upUserStep).html();
	var powertypecheck=$('#UserPowertypeListTd'+upUserStep).html();
	var szXml = "<userinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	
	szXml += "<username>"+username+"</username>";
	szXml += "<password>"+password+"</password>";
	szXml += "<userlevel>"+userlevel+"</userlevel>";
	szXml += "<powertype>"+powertypecheck+"</powertype>";
 	szXml += "</userinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/security/user/delete"
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
			ArrUserList.splice(upUserStep - 1,1);     //删除指定数组
			GetUserLists(); 
			autoResizeIframe();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,'DelUser');
			}
	});
	$.modal.impl.close();	
  }
};