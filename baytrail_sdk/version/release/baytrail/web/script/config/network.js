document.charset = "utf-8";
var g_oXmlRtspPort;
var g_bIsRestart = true;
var g_oXhr = null;
var g_oSNMPXml = null;  //记录取得的snmp信息
var dpsstype="";  //dpsp服务器在址类型
//var m_TimerDDNS=null;  //ddns定时状态获取
//var g_iMTUMin = 0;
//var g_iMTUMax = 0;
var Network = {
	tabs: null	// 保存网络配置页面的tabs对象引用
};

function DDNS() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(DDNS);
pr(DDNS).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["network", "DDNS"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initDDNS();
}


function PPPoE() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(PPPoE);
pr(PPPoE).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["network", "PPPoE"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initPPPOE();
}

function SNMP() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(SNMP);
pr(SNMP).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["network", "SNMP"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initSNMP();
}

function P8021x() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(P8021x);
pr(P8021x).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["network", "P8021x"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	init8021x();
}

function QoS() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(QoS);
pr(QoS).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["network", "QoS"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initQos();
}


/*******UPNP********/
function UPNP() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(UPNP);
pr(UPNP).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["network", "UPnP"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	
	initUPNP();
}




















/*************************************************
Function:		initIpconfig
Description:	初始化IpConfig页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initIpConfig()
{
	autoResizeIframe();
}
/*************************************************
Function:		initPortConfig
Description:	初始化IpConfig页面
Input:			无
Output:			无
return:			无				
*************************************************/
function initPortConfig()
{
	autoResizeIframe();//配置页面高度自适应
}
/*************************************************
Function:		getPortInfo
Description:	获取端口号信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getPortInfo()
{
   // getHttpPortInfo();
	//getRtspPortInfo();
}

/*************************************************
Function:		initInsert
Description:	初始化initInsert页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initInsert()
{
	autoResizeIframe();
}
/*************************************************
Function:		initDDNS
Description:	初始化initDDNS页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initDDNS()
{
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/ddns"
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
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#DDNSenabled").val(true).prop("checked", true);
				$("#provider").prop("disabled",false)
				$("#UserNameDDNS").prop("disabled",false)
				$("#PasswordDDNS").prop("disabled",false)
				
				
		    }else{
				$("#DDNSenabled").val(false).prop("checked", false);
				$("#UserNameDDNS").prop("disabled",true)
				$("#PasswordDDNS").prop("disabled",true)
				$("#provider").prop("disabled",true)
			}
			$(xmlDoc).find("provider").each(function(i,data) {
				//$("#dynamicip").val($(this).text()); //动态IP
		     	var k_provideropt1=$(this).attr('opt');
		  	 	var k_szprovider= $(this).text();
			 
				$("#provider").empty(); 
				var arr = k_provideropt1.split(","); 
				for (i=0;i<arr.length;i++){
				  $("#provider").append("<option value="+arr[i]+">"+arr[i]+"</option>");
					var selectCode=document.getElementById("provider"); 
					if(selectCode.options[i].value==k_szprovider){  
						selectCode.options[i].selected=true;  
					 } 
				};
				
				if (k_szprovider=="ORAY"){
					$("#domainName").prop("disabled", true);
				}else{
					$("#domainName").prop("disabled", false);
				}
				
			});
			
			$("#domainName").val($(xmlDoc).find('devurl').eq(0).text() )//设备域名
			//$("#UserName").val($(xmlDoc).find('username').eq(0).text() )//用户名
			$(xmlDoc).find("username").each(function(i,data) {
			    usernameDDNSmax=$(this).attr('max');
				$("#UserNameDDNS").val($(this).text()).attr('maxlength' , usernameDDNSmax); //用户名
			});
			$(xmlDoc).find("password").each(function(i,data) {
			    passwordDDNSmax=$(this).attr('max');
				$("#PasswordDDNS").val($(this).text()).attr('maxlength' , passwordDDNSmax); //密码
			});
			
			ddnsstate();
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
	
   // m_TimerDDNS = setInterval("ddnsstate()",5000);  //五秒获取一次DDNS状态
	autoResizeIframe();
	
}
function checkboxddns(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true);
	  $(obj).prop("checked", true);
	  $("#domainName").prop("disabled",false)
	  $("#provider").prop("disabled",false)
	  $("#UserNameDDNS").prop("disabled",false)
	  $("#PasswordDDNS").prop("disabled",false)
	  
	  if ($("#provider").val()=="ORAY"){
		  $("#domainName").prop("disabled", true);
		 }else{
		  $("#domainName").prop("disabled", false); 
	   }
	  
	}else{
	  $(obj).prop("checked", false);
	  $(obj).val(false);
	  $("#domainName").prop("disabled",true)
	  $("#UserNameDDNS").prop("disabled",true)
	  $("#PasswordDDNS").prop("disabled",true)
	  $("#provider").prop("disabled",true)
	}
}
//选择DDNS类型
function Changeprovider(){
	var k_szprovider=$("#provider").val();
	if (k_szprovider=="ORAY"){
		$("#domainName").prop("disabled", true);
	}else{
		$("#domainName").prop("disabled", false);
	}
};
//保存DDNS
function SaveDDNS(obj){
	var ethernetifid=$("#ethernetifid").val();
	var devurl=$("#domainName").val();
	var UserNameDDNS=$("#UserNameDDNS").val();
	var PasswordDDNS=$("#PasswordDDNS").val();
	
	if ($("#provider").val()=="DYNDNS"  || $("#provider").val()=="NOIP" )
	{
		
		if(!IsURL(devurl,'domainNametips','MDeviceDomain',64))
		{
			return;
		} 
	
	}
	
	if (!CheckUserName(UserNameDDNS, 'UserNametips', 'MDDNSUser',0 ,Number(usernameDDNSmax)))
	{
	   return;
	}
	
	if (!CheckUserPassword(PasswordDDNS, 'Passwordtips', 'MDDNSUserPsw',0, Number(passwordDDNSmax)))
	{
	   return;
	}
	var szXml = "<ddnsinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+$("#DDNSenabled").val()+"</enabled>";
	szXml += "<provider>"+$("#provider").val()+"</provider>";
	szXml += "<devurl>"+devurl+"</devurl>";
	szXml += "<username>"+UserNameDDNS+"</username>";
	szXml += "<password>"+PasswordDDNS+"</password>";
 	szXml += "</ddnsinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/ddns"
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
			       initDDNS();
				}else{
					szRetInfo=  m_szErrorState+m_szError1;	
				}
			});
			$("#SetResultTipsDDNS").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsDDNS").html("");},5000);  //5秒后自动清除
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};
//定时获取状态
function ddnsstate(){
	var szXml = "<contentroot>";
			szXml +=$.cookie('authenticationinfo');
			szXml += "</contentroot>";
			var xmlDoc = GetparseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/ddns/state"
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
			$("#ddnsstate").html($(xmlDoc).find('state').eq(0).text() )//设备域名
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};


/*************************************************
Function:		initPPPOE
Description:	初始化initPPPOE页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initPPPOE()
{
    GetPPPOEInfo();	
	autoResizeIframe();
}
/*************************************************
Function:		GetPPPOEInfo
Description:	获取PPPOE
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetPPPOEInfo(){
	var szXml = "<contentroot>";
		szXml +=$.cookie('authenticationinfo');
		szXml += "</contentroot>";
		var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/pppoe"
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
		  $(xmlDoc).find("enabled").each(function(i,data) {
				var k_enabled= $(this).text();  
				if (k_enabled=="true"){
					$("#PPPOEenabled").val(true);
					$("#PPPOEenabled").prop("checked", true);
					$("#PPPOEUserName").prop("disabled",false)
					$("#PPPOEUserPsw").prop("disabled",false)
					
				}else{
					$("#PPPOEenabled").val(false);
					$("#PPPOEenabled").prop("checked", false);
					$("#PPPOEUserName").prop("disabled",true)
					$("#PPPOEUserPsw").prop("disabled",true)
				};
			});
			
			$(xmlDoc).find("dynamicip").each(function(i,data) {
				$("#dynamicip").val($(this).text()); //动态IP
			});
			$(xmlDoc).find("username").each(function(i,data) {
				usernamePPPOEmax=$(this).attr('max');
				$("#PPPOEUserName").val($(this).text()).attr('maxlength' , usernamePPPOEmax); //用户名
			});
			
			$(xmlDoc).find("password").each(function(i,data) {
				passwordPPPOEmax=$(this).attr('max');
				$("#PPPOEUserPsw").val($(this).text()).attr('maxlength' , passwordPPPOEmax); //密码
			});
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
function checkboxpppoe(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true);
	  $(obj).prop("checked", true);
	  $("#PPPOEUserName").prop("disabled",false)
	  $("#PPPOEUserPsw").prop("disabled",false)
	}else{
	  $(obj).prop("checked", false);
	  $(obj).val(false);
	  $("#PPPOEUserName").prop("disabled",true)
	  $("#PPPOEUserPsw").prop("disabled",true)
	}
}
//保存ppppoe
function Savepppoe(obj){
	var enabled=$("#PPPOEenabled").val();
	var ethernetifid=$("#ethernetifid").val();
	var PPPOEUserName=$("#PPPOEUserName").val();
	var PPPOEUserPsw=$("#PPPOEUserPsw").val();
	var autodial=$("#autodial").val();
	var autodialwaittime=$("#autodialwaittime").val()
	var autodialconnetnum=$("#autodialconnetnum").val()
	if (!CheckUserName(PPPOEUserName, 'PPPOEUserNametips', 'MPPPOEName',0, Number(usernamePPPOEmax)))
	{
	   return;
	}
	if(!CheckUserPassword(PPPOEUserPsw,'PPPOEUserPswtips','MPPPOEPassword',0,Number(passwordPPPOEmax)))
	{
	    return;
	}
	var szXml = "<pppoeinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+enabled+"</enabled>";
	szXml += "<username>"+PPPOEUserName+"</username>";
	szXml += "<password>"+PPPOEUserPsw+"</password>";
 	szXml += "</pppoeinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/pppoe"
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
						GetPPPOEInfo();
					}else{
						szRetInfo=  m_szErrorState+m_szError1;	
					}
				});
			 
			$("#SetResultTipsPPPoE").html(szRetInfo);
			setTimeout(function(){$("#SetResultTipsPPPoE").html("");},5000);  //5秒后自动清除
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr.obj);
			}
	});
};
/*************************************************
Function:		init8021x
Description:	初始化8021x页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function init8021x()
{
	Get8021x();
	autoResizeIframe();
}
function Get8021x(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/8021x"
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
		  $(xmlDoc).find("enabled").each(function(i,data) {
				var k_enabled8021= $(this).text();  
				if (k_enabled8021=="true"){
					 $("#enable8021x").val(true).prop("checked", true);
					 $("#eapolversion").prop("disabled",false)
					 $("#username8021").prop("disabled",false)
					 $("#password8021").prop("disabled",false)
				}else{
					 $("#enable8021x").val(false).prop("checked", false);
					 $("#eapolversion").prop("disabled",true)
					 $("#username8021").prop("disabled",true)
					 $("#password8021").prop("disabled",true)
				};
			});
			

			//协议类型
			$(xmlDoc).find("protocoltype").each(function(i){ 
			   var k_8021opt=$(this).attr('opt');
		  	   var k_szprotocoltype= $(this).text();
			   $("#protocoltype").empty();
				var arr = k_8021opt.split(","); 
				for (i=0;i<arr.length;i++){
				   $("#protocoltype").append( "<option value="+arr[i]+">"+arr[i]+"</option>")
					var s_protocoltype=document.getElementById("protocoltype"); 
					if(s_protocoltype.options[i].value==k_szprotocoltype){  
						s_protocoltype.options[i].selected=true;  
					 } 
				};
			}); 
			
			
			//eapol协议类型
			$(xmlDoc).find("eapolversion").each(function(i){ 
			   var k_eapolversionopt=$(this).attr('opt');
		  	   var  k_szeapolversion= $(this).text();
			  $("#eapolversion").empty();
				var arr = k_eapolversionopt.split(","); 
				for (i=0;i<arr.length;i++){
				   $("#eapolversion").append( "<option value="+arr[i]+">"+arr[i]+"</option>")
					var s_eapolversion=document.getElementById("eapolversion"); 
					if(s_eapolversion.options[i].value==k_szeapolversion){  
						s_eapolversion.options[i].selected=true;  
					 } 
				};
			}); 
			
			$(xmlDoc).find("username").each(function(i,data) {
			    username8021max=$(this).attr('max');
				$("#username8021").val($(this).text()).attr('maxlength' , username8021max); //用户名
			});
			$(xmlDoc).find("password").each(function(i,data) {
				 password8021max=$(this).attr('max');
				$("#password8021").val($(this).text()).attr('maxlength' , password8021max); //密码
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
function checkboxP8021x(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true).prop("checked", true);
	  $("#eapolversion").prop("disabled",false)
	  $("#username8021").prop("disabled",false)
	  $("#password8021").prop("disabled",false)
	}else{
	  $(obj).prop("checked", false).val(false);
	   $("#eapolversion").prop("disabled",true)
	  $("#username8021").prop("disabled",true)
	  $("#password8021").prop("disabled",true)
	}
}
function SaveConfig8021(obj){
	var enable8021x=$("#enable8021x").val();
	var protocoltype=$("#protocoltype").val();
	var eapolversion=$("#eapolversion").val();
	var username8021=$("#username8021").val();
	var password8021=$("#password8021").val();
	
	if (!CheckUserName(username8021, 'Name8021tips', 'MP8021xName',0, Number(username8021max)))
	{
	   return;
	}
	if(!CheckUserPassword(password8021,'password8021tips','MP8021xPassword',0,Number(password8021max)))
	{
	    return;
	}
	var szXml = "<x8021info version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+enable8021x+"</enabled>";
	szXml += "<protocoltype>"+protocoltype+"</protocoltype>";
	szXml += "<eapolversion>"+eapolversion+"</eapolversion>";
	szXml += "<username>"+username8021+"</username>";
	szXml += "<password>"+password8021+"</password>";
 	szXml += "</x8021info>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/8021x"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
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
/*************************************************
Function:		initQos
Description:	初始化QoS页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initQos()
{
    GetQoSInfo();
	autoResizeIframe();
}
/*************************************************
Function:		GetQoSInfo
Description:	获取QoS页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetQoSInfo(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/qos"
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
		$(xmlDoc).find("enabled").each(function(i){ 
			 k_szenabled= $(this).text();
			 if (k_szenabled=="true"){
				$("#dscpenabled").val(true);
				$("#dscpenabled").prop("checked", true);
			}else{
				$("#dscpenabled").val(false);
				$("#dscpenabled").prop("checked", false);
			};
		}); 
		
		$(xmlDoc).find("videodscpvalue").each(function(i){ 
			 videodscpvaluemin=$(this).attr('min');
			 videodscpvaluemax=$(this).attr('max');
			 $("#videodscpvalue").val($(this).text()).attr('maxlength' , videodscpvaluemax.length); 
			 $("#fixedvideodscpvalueQosTips").html(videodscpvaluemin+"~"+videodscpvaluemax)
		});
		
		$(xmlDoc).find("managerdscpvalue").each(function(i){ 
			 managerdscpvaluemin=$(this).attr('min');
			 managerdscpvaluemax=$(this).attr('max');
			 $("#managerdscpvalue").val($(this).text()).attr('maxlength' , managerdscpvaluemax.length); 
			 $("#fixedmanagerdscpvalueQosTips").html(managerdscpvaluemin+"~"+managerdscpvaluemax)
		});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
function SaveConfigQos(obj){
	//var dscpenabled=$("#dscpenabled").val();
	var videodscpvalue=$("#videodscpvalue").val();
	//var alarmdscpvalue=$("#alarmdscpvalue").val();
	var managerdscpvalue=$("#managerdscpvalue").val();
	
	if(!CheackServerIDIntNum(videodscpvalue,'videodscpvaluetips','Mvideodscpvalue',Number(videodscpvaluemin),Number(videodscpvaluemax)))
	{
	    return;
	}
	
	if(!CheackServerIDIntNum(managerdscpvalue,'managerdscpvaluetips','Mmanagerdscpvalue',Number(managerdscpvaluemin),Number(managerdscpvaluemax)))
	{
	    return;
	}
	var szXml = "<qosinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<videodscpvalue>"+videodscpvalue+"</videodscpvalue>";
	szXml += "<managerdscpvalue>"+managerdscpvalue+"</managerdscpvalue>";
 	szXml += "</qosinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/qos"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
		}
	});
}
/*************************************************
Function:		initSNMP
Description:	初始化SNMP页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initSNMP()
{
   GetSNMPInfo();
   autoResizeIframe();
}
function GetSNMPInfo(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/kedasnmp"
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
			$(xmlDoc).find("svrip").each(function(i){ 
				$("#svrip").val($(this).text());
			}); 
			
			$(xmlDoc).find("svrport").each(function(i){ 
				$("#svrport").val($(this).text());
			}); 
			
			$(xmlDoc).find("devadress").each(function(i){ 
				devadressmin=$(this).attr('min');
				devadressmax=$(this).attr('max');
				$("#devadress").val($(this).text()).attr('maxlength' , devadressmax);
				
			});
			$(xmlDoc).find("cpuvpt").each(function(i){ 
				
				cpuvptvaluemin=$(this).attr('min');
				cpuvptvaluemax=$(this).attr('max');
				$("#cpuvpt").val($(this).text()).attr('maxlength' , cpuvptvaluemax.length);
				$("#fixedcpuvptTips").html(cpuvptvaluemin+"~"+cpuvptvaluemax)
			});
			
			$(xmlDoc).find("memeryvpt").each(function(i){ 
				memeryvptvaluemin=$(this).attr('min');
				memeryvptvaluemax=$(this).attr('max');
				$("#memeryvpt").val($(this).text()).attr('maxlength' , memeryvptvaluemax.length);
				$("#fixedmemeryvptTips").html(memeryvptvaluemin+"~"+memeryvptvaluemax)
				
			});
			$(xmlDoc).find("lostvpt").each(function(i){ 
				lostvptvaluemin=$(this).attr('min');
				lostvptvaluemax=$(this).attr('max');
				$("#lostvpt").val($(this).text()).attr('maxlength' , lostvptvaluemax.length);
				$("#fixedlostvptTips").html(lostvptvaluemin+"~"+lostvptvaluemax)
			});		
	  },error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
   });
};
//保存Snmp
function SaveConfigSnmp(obj){
	var svrip=$("#svrip").val();
	var devadress=$("#devadress").val();
	var cpuvpt=$("#cpuvpt").val();
	var memeryvpt=$("#memeryvpt").val();
	var lostvpt=$("#lostvpt").val();
	if(!CheckDIPadd(svrip,'svriptips','MSvripadd'))
	{
	    return;
	}
	
	if(!CheckDeviceNameSnmp(devadress,'devadresstips','MSvripadd',Number(devadressmin),Number(devadressmax),1))
	{
	    return;
	}
	if(!CheackServerIDIntNum(cpuvpt,'cpuvpttips','Mcpuvpt',Number(cpuvptvaluemin),Number(cpuvptvaluemax)))
	{
	    return;
	}
	if(!CheackServerIDIntNum(memeryvpt,'memeryvpttips','Mmemeryvpt',Number(memeryvptvaluemin),Number(memeryvptvaluemax)))
	{
	    return;
	}
	if(!CheackServerIDIntNum(lostvpt,'lostvpttips','Mlostvpt',Number(lostvptvaluemin),Number(lostvptvaluemax)))
	{
	    return;
	}
	var szXml = "<kedasnmpinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<svrip>"+svrip+"</svrip>";
	szXml += "<devadress>"+devadress+"</devadress>";	
	szXml += "<cpuvpt>"+cpuvpt+"</cpuvpt>";
	szXml += "<memeryvpt>"+memeryvpt+"</memeryvpt>";
	szXml += "<lostvpt>"+lostvpt+"</lostvpt>";
 	szXml += "</kedasnmpinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/kedasnmp"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	
	});
};

/*************************************************
Function:		initUPNP
Description:	初始化UPNP页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initUPNP()
{
	GetUPNP();
	autoResizeIframe();
}
/*************************************************
Function:		GetUPNP
Description:	获取UPNP	
*************************************************/
function GetUPNP(){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/upnp"
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
		   xmlDocSet = GetparseXmlFromStr(Docxml);
		 var xmlDoc=xmlDocSet
		if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $("#UPnpEnabled").val(true).prop("checked", true);
				$("#txtUPnPName").prop("disabled",false)
		    }else{
				$("#UPnpEnabled").val(false).prop("checked", false);
				$("#txtUPnPName").prop("disabled",true)
			}
		
		$(xmlDoc).find("name").each(function(i){ 
			 g_upnpnamemix = $(this).attr('min')
			 g_upnpnamemax =  $(this).attr('max')
			$("#txtUPnPName").val($(this).text()).attr('maxlength' , g_upnpnamemax); 
		});
			
		
		$(xmlDoc).find("portmapmode").each(function(i){ 
			 k_szportmapmode= $(this).text();
			$("#portmapmodeType").empty(); 
			 var k_szportmapmodeopts = $(this).attr('opt').split(",");
			insertOptions2Select(k_szportmapmodeopts, ["auto", "manual"], ["Oautomatic", "Omanual"], "portmapmodeType");
			setValueDelayIE6("portmapmodeType" ,"","",k_szportmapmode);
		});
		
         //列表开始
		 $("#UPnpListTbody").empty();
		 $(xmlDoc).find("portmaplist").each(function(i){ 
		  var k_portmaplistsize=$(this).attr('size');
		 
		  var k_portmaplistaddanddel=$(this).attr('addanddel');
	      var portmapNodes=$(this).find('portmap')
		   for(var i = 1; i <=k_portmaplistsize; i++)
			{
				var enabled  = $(portmapNodes[i-1]).find('enabled').eq(0).text();
			 	var enabledupdate  = $(portmapNodes[i-1]).find('enabled').attr('update');
				var protocolname = $(portmapNodes[i-1]).find('protocolname').eq(0).text();
				var protocolnameupdate  = $(portmapNodes[i-1]).find('protocolname').attr('update');
				var mode = $(portmapNodes[i-1]).find('mode').eq(0).text();
				var ip = $(portmapNodes[i-1]).find('ip').eq(0).text();
				var port = $(portmapNodes[i-1]).find('port').eq(0).text();
				//var state = $(portmapNodes[i-1]).find('state').eq(0).text()=="jsValid"?"geNotValid":"jsNotValid";
				var state = $(portmapNodes[i-1]).find('state').eq(0).text();
				$("#UPnpListTbody").append("<tr  id='nndsListTr"+max_line_numIP+(parseInt(i))+"' class='tablethtr'>"
				//onblur="CheackServerIDIntNum(this.value,'RtspPortTips','jsRtspPortParam',1,65535)" onkeydown="CheckKeyDown(event)" maxlength="5"
				   +"<td class='tabletrtd tablethtdwidth01'><input type='checkbox' name='nndsenabled' id='nndsenabled"+parseInt(i)+"' onclick='checkbox(this)'  class='checkbox' /></td>"
				   +"<td class='tabletrtd tablethtdwidth02'><input  disabled='disabled' id='protocolnameTd"+parseInt(i)+"' type='text' value='"+protocolname+"' class='input_config width150'/></td>"
				  // +"<td class='tdbguser flost'><select class='inputwidth selectwidth width152' id='protocolnameTd"+parseInt(i)+"'></select></td>"
				   +"<td class='tabletrtd tablethtdwidth02'><input disabled='disabled' name='nndsinput' id='ipTd"+parseInt(i)+"' maxlength='16' type='text' value='"+ip+"' class='input_config width150' /></td>"
				   +"<td class='tabletrtd tablethtdwidth02'><input name='nndsinput' id='portTd"+parseInt(i)+"' maxlength='5' onkeydown='CheckKeyDown(event)' type='text' value='"+port+"' class='input_config width150'  /></td>"
				   //+"<td class='ListTd flost'><input name='nndsinput' id='stateTd"+parseInt(i)+"' type='text' value='"+state+"' class='input_config width100' /></td>"
				   +"<td class='tabletrtd tablethtdwidth02'><label name='js"+state+"'>"+TurnUpnpText(state)+"</label></td>"
				   +"</tr>");
				   if (enabled=="true"){
						$("#nndsenabled"+parseInt(i)).val(true);
						$("#nndsenabled"+parseInt(i)).prop("checked", true);
					}else{
						$("#nndsenabled"+parseInt(i)).val(false);
						$("#nndsenabled"+parseInt(i)).prop("checked", false);
					};
					
				if (k_szportmapmode=="auto"){
					$("input:[name='nndsenabled']").prop("disabled",true);
			 		$("input:[name='nndsinput']").prop("disabled",true);
				}else{//手动时
				   if (enabledupdate=="true"){
						//$("#nndsenabled"+parseInt(i)).val(true);
						$("#nndsenabled"+parseInt(i)).prop("disabled", true);
					}else{
						//$("#nndsenabled"+parseInt(i)).val(false);
						$("#nndsenabled"+parseInt(i)).prop("disabled", false);
					};
				}
			};
		 });//列表结束
	  },error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
function TurnUpnpText(iUpnpText)
{
	var szUpnpText = '';
	if('valid' == iUpnpText)
	{
		szUpnpText = getNodeValue('jsvalid');    //生效
	}
	else if('invalid' == iUpnpText)
	{
		szUpnpText = getNodeValue('jsinvalid');    //未生效
	}
	return szUpnpText;
}

function checkboxUPnP(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true);
	  $(obj).prop("checked", true);
	  $("#txtUPnPName").prop("disabled",false)
	}else{
	  $(obj).prop("checked", false);
	  $(obj).val(false);
	   $("#txtUPnPName").prop("disabled",true)
	}
}
//选择端口映射方式
function Changeportmapmode(obj){
	   if ($(obj).val()=="auto"){
		//$("input:[name='nndsenabled']").prop("disabled",true);
	    //$("input:[name='nndsinput']").prop("disabled",true);
		
		$("input:[name='nndsenabled']").prop("checked",true).val(true).prop("disabled",true);
		//$("#nndsenabled"+parseInt(i)).val(true);
		//$("#nndsenabled"+parseInt(i)).prop("checked", true);
		$("input:[name='nndsinput']").prop("checked",true).prop("disabled",true);
	    }else{
		 $(xmlDocSet).find("portmaplist").each(function(i){ 
		  var k_portmaplistsize=$(this).attr('size');
		  var k_portmaplistaddanddel=$(this).attr('addanddel');
	      var portmapNodes=$(this).find('portmap')
		  
		   for(var i = 1; i <=k_portmaplistsize; i++)
			{
				
				
				//$("#ipTd"+parseInt(i)).prop("disabled", false);
				$("#portTd"+parseInt(i)).prop("disabled", false);
			 	var enabledupdate  = $(portmapNodes[i-1]).find('enabled').attr('update');
				var protocolnameupdate  = $(portmapNodes[i-1]).find('protocolname').attr('update');
				 if (enabledupdate=="true"){
						$("#nndsenabled"+parseInt(i)).prop("disabled", true);
					}else{
						$("#nndsenabled"+parseInt(i)).prop("disabled", false);
					};
			};
		 });//列表结束
	}
}
//保存Upnp
function SaveUpnp(obj){
	var name =$("#txtUPnPName").val();
	var _len = $("#UPnpListTbody tr").length; 
	var mode="tcp";
	if (!CheckTypeC(name,"spUPnPNameTips",'MAlias',Number(g_upnpnamemix),Number(g_upnpnamemax),0))
	{
	   return;
	}
	for (i=1;i<=_len;i++){
		var szAreaNameInfo = "<img src='../images/config/tips.png'  class='verticalmiddleconfig'>&nbsp;";
		
	//	return
		//if(!CheckIPadd($("#ipTd"+i).val()))
		if(!CheckIPadd($("#ipTd"+i).val(),'SetResultTipsUpnp','jsipAddress'))
		{
			var szErrorTips = szAreaNameInfo + getNodeValue('jsipAddress')+ i ;
			$("#SetResultTipsUpnp").addClass("colortips").html(szErrorTips);
			setTimeout(function(){$("#SetResultTipsUpnp").removeClass("colortips").html("");},5000);  //5秒后自动清除  
			return;
		}
		
		if(!CheackServerIDIntNum($("#portTd"+i).val(),'SetResultTipsUpnp','jsRtspPortParam',0,65535))
		{
			var szErrorTips = szAreaNameInfo + getNodeValue('MExternalPort')+ i + getNodeValue('RangeTips') + "0"+"~"+"65535";
			$("#SetResultTipsUpnp").addClass("colortips").html(szErrorTips);
			setTimeout(function(){$("#SetResultTipsUpnp").removeClass("colortips").html("");},5000);  //5秒后自动清除  
			return;
		}
	}
	var szXml = "<upnpinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+$("#UPnpEnabled").val()+"</enabled>";
	szXml += "<name>"+name+"</name>";
	szXml += "<portmapmode>"+$("#portmapmodeType").val()+"</portmapmode>";
	szXml += "<portmaplist size='"+_len+"'>";
		  for (i=1;i<=_len;i++){
			  szXml += "<portmap>";
				szXml += "<enabled>"+$("#nndsenabled"+i).val()+"</enabled>";
				szXml += "<protocolname>"+$("#protocolnameTd"+i).val()+"</protocolname>";
				szXml += "<mode>"+mode+"</mode>";
				szXml += "<ip>"+$("#ipTd"+i).val()+"</ip>";
				szXml += "<port>"+$("#portTd"+i).val()+"</port>";
				//szXml += "<state>"+$("#stateTd"+i).val()+"</state>";
			szXml += "</portmap>"; 
			}
	szXml += "</portmaplist>";
 	szXml += "</upnpinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/upnp"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		//cache:false, 缓存
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},complete:function(xhr, textStatus)
		{
			SaveStateTips(xhr,obj);
		}
	
	});
}
/*************************************************
Function:		showAddPortmaplistWnd
Description:	显示弹出添加映射表窗口	
*************************************************/
function showAddPortmaplistWnd(){
	//$("#spAddIPAddress").html("<label name='laAddIPAddress'>" + getNodeValue('laAddIPAddress') + "</label>");
	$("#divPortMapTable").modal();
	$("#btnIPFilterOK").unbind().bind("click", function(){
		editIPAddressOK(0);
	});
	//$("#inIPAddress").focus();
};
/*************************************************
Function:		editIPAddressOK
Description:	确认编辑IP地址
Input:			iType   0 - 添加
						1 - 修改
Output:			无
return:			无
*************************************************/
function editIPAddressOK(iType)
{
	
	if(iType == 0) {
		 var _len = $("#TablPortMap tr").length; 
		 var AddportmapmodeType=$("#AddportmapmodeType").val();
		 if (_len<=6){
			  // $("#TablPortMap tbody").append('<tr align="center" class="ListTr" onclick="lineclick(this);"><td class="ListTd">'+_len+'</td><td class="ListTd"><input type="text" value="'+_len+'" class="input_config width100" /></td><td class="ListTd">2</td><td class="ListTd">未生效</td></tr>');	
			  $("#TablPortMap tbody").append('<tr align="center" class="ListTr" onclick="lineclick1(this);"><td class="ListTd"><input type="checkbox" class="checkbox main_top5" id="enableportmap" onclick="checkbox(this)"</td><td class="ListTd">'+AddportmapmodeType+'</td><td class="ListTd"><input type="text" class="input_config width100" /></td><td class="ListTd">未生效</td></tr>');	
			}

	} else {
		alert("错误")
	}
	$.modal.impl.close();
}
//点击每行
function lineclick1(line){
	$('#TablPortMap tr').each(function(){$(this).css("background-color","#ffffff");});
   var seq=$(line).children("td").html();
   $(line).css("background-color","#f9f9f9");
   currentStep=seq;
};
//删除选中行
function tabledeldel(){
	if(currentStep==0){
    	alert('请选择一项!');
	return false;
  }
  $("#TbodyPortMap tr").each(
    function(){
	  var seq=parseInt($(this).children("td").html());
	  if(seq==currentStep) $(this).remove();
	  if(seq>currentStep) $(this).children("td").each(function(i){if(i==0)$(this).html(seq-1);});
	}
  );
  currentStep=0;
}
/*************************************************
Function:		DPSS
Description:	初始化DPSS页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function DPSS() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(DPSS);
pr(DPSS).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["network", "DPSS"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initDPSS();
	autoResizeIframe();
};
/*************************************************
Function:		initDPSS
Description:	初始化DPSS
Input:			无			
Output:			无
return:			无				
*************************************************/
function initDPSS()
{
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/intelligent/dpss"
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
			if("true" == $(xmlDoc).find('enable').eq(0).text())
		    {
			    $("#enabledpss").val(true).prop("checked", true);
		    }else{
				$("#enabledpss").val(false).prop("checked", false);
			}
			$(xmlDoc).find("rcvseveraddr").each(function(i,data) {
		     	//var dpsstype=$(this).attr('type');
		  	 	var g_rcvseveraddrtext= $(this).text();
				/*if (g_rcvseveraddrtype=="url"){
					dpsstype = "url";
				}
				else if(g_rcvseveraddrtype=="ip")
				{
					dpsstype = "ip";
				}*/
				$("#rcvseveraddr").val(g_rcvseveraddrtext)
				
			});
			
			$(xmlDoc).find("devident").each(function(i,data) {
			    //var g_devident=$(this).attr('type');
				
				$("#devident").val($(this).text())
			});
			
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/*************************************************
Function:		SaveDpss
Description:	保存DPSS
Input:			无			
Output:			无
return:			无				
*************************************************/
function SaveDpss(){
	var g_rcvseveraddr=$("#rcvseveraddr").val();
	var g_devident =$("#devident").val();
	
	/*if (addresstype=="ip"){
		if(!CheckIPadd(vsipipaddrv4,'vsipipaddrv4tips','MRplatformipv4'))
		{
			return;
		}
	}else{
		if(!IsURL(vsipurl,'vsipurltips','MRplatformurl',64))
		{
			return;
		} 
	}
	*/
	if(!IsURL(g_rcvseveraddr,'rcvseveraddrtips','Mrcvseveraddr',64))
		{
			return;
		} 
	
	/*if (dpsstype=="ip"){
		if(!CheckDIPadd(g_rcvseveraddr,'rcvseveraddrtips','Mrcvseveraddr'))
		{
	    	return;
		}
	}
	else if(dpsstype=="url")
	{
		if(!CheackStringLenthNull(g_rcvseveraddr,'rcvseveraddrtips','Mrcvseveraddr',64))
		{
	    	return;
		}
	}*/
	if(!CheckTypeA(g_devident,'devidenttips','Mdevident','',32,0))
	{
		return;	
	}
	var szXml = "<dpssinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+$("#enabledpss").val()+"</enable>";
	szXml += "<rcvseveraddr>"+g_rcvseveraddr+"</rcvseveraddr>";
	szXml += "<devident>"+g_devident +"</devident>";
	szXml += "</dpssinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/intelligent/dpss"
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
				$("#SetResultTipsDPSS").html(szRetInfo);
				setTimeout(function(){$("#SetResultTipsDPSS").html("");},5000);  //5秒后自动清除
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});
};
