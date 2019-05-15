//var g_szVideoInfoXml = "";
var m_modeWatchon = 1;//0为未选,1为选中
var g_szautodnsv4="";
//var m_szhotspotlist = new Array(); //热点扫描数组
//var m_szhotspotlist = new Array();
var m_szhotspotlist = new Array();  //热点扫描数组
var m_szwifilist = new Array();  //wifi数组

var tcpip = {
	tabs: null   // IP地址视频配置页面的tabs对象引用
};
/*************************************************

*************************************************/
function TCPIP() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(TCPIP);
pr(TCPIP).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["tcpip", "TcpIPMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initTCPIP();
	//this.initCSS();	
}
/*************************************************
Function:		initTCPIP
Description:	初始化日志页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initTCPIP()
{
	Gettcpip();  //获取IP
	autoResizeIframe();
	//logtype();
};



//ip4自动获取
function checkboxip(obj){
	
	if($(obj).prop("checked")){ //选中
	   //alert("选中")
		  m_modeWatchon = 1;
		   $(obj).val("static");
			$("#IsUseDHCP").prop("checked", true);
			$("#ipAddress").prop("disabled" ,true)
			$("#subnetMask").prop("disabled" ,true)
			$("#DefaultGateway").prop("disabled" ,true)
		  
		}else{
		//	alert("未选")
		  m_modeWatchon = 0;  //未选
		 $(obj).val("dynamic");
		   $("#IsUseDHCP").prop("checked", false);
		   $("#ipAddress").prop("disabled" ,false)
		   $("#subnetMask").prop("disabled" ,false)
			$("#DefaultGateway").prop("disabled" ,false)
		}
}
//切换IP版本
function ChangeIPMode(){
	var IPMode=$("#IPMode").val();
	if (IPMode=="IPv4"){   //IPv4
	            $("#subAutoIp").hide();
	            $("#subAutoIp6").hide();
				$("#ipAddress").show();
				$("#subnetMask").show();
				$("#DefaultGateway").show();
				$("#Multicast").show();
				$("#dnsserver1").show();
				$("#dnsserver2").show();
				
				$("#ipAddress6").hide();
				$("#subnetMask6").hide();
				$("#DefaultGateway6").hide();
				$("#Multicast6").hide();
				$("#dnsserver16").hide();
				$("#dnsserver26").hide();
				$("#subaddresstype").show();
				$("#subseIPv6Mode").hide();
				$("#subaddresstypev6").hide();
				
				$("#subautoDNS").show();
				$("#subautoDNS6").hide();
			}else{
				$("#subAutoIp").hide();
				$("#subAutoIp6").hide();
				$("#ipAddress").hide();
				$("#subnetMask").hide();
				$("#DefaultGateway").hide();
				$("#Multicast").hide();
				$("#dnsserver1").hide();
				$("#dnsserver2").hide();
				
				$("#ipAddress6").show();
				$("#subnetMask6").show();
				$("#DefaultGateway6").show();
				$("#Multicast6").show();
				$("#dnsserver16").show();
				$("#dnsserver26").show();
				 
				$("#subaddresstype").hide();
				$("#subseIPv6Mode").show();
				$("#subaddresstypev6").show();
				
				$("#subautoDNS").hide();
				$("#subautoDNS6").show();
				/*var s_addresstype6=document.getElementById("addresstype")
				for (i=0;i<s_addresstype6.length;i++){
				 if(s_addresstype6.options[i].value==k_szaddresstype6){  
					s_addresstype6.options[i].selected=true;  
					}
				};*/
				
				//alert(k_ipmode)
				
				
				if("true" == autodnsv6)
				{
					$("#autoDNS6").val(true);
					$("#autoDNS6").prop("checked", true);
					$("#dnsserver16").prop("disabled",true)
					$("#dnsserver26").prop("disabled",true)
					
				}else{
					$("#autoDNS6").val(false);
					$("#autoDNS6").prop("checked", false);
					$("#dnsserver16").prop("disabled",false)
					$("#dnsserver26").prop("disabled",false)
				}
				
				
				if (k_szaddresstype6=="auto"){
					$("#autoip6").val(true).prop("checked", true)
					   $("#ipAddress").prop("disabled",true)
					  $("#subnetMask").prop("disabled",true)
					  $("#DefaultGateway").prop("disabled",true)
					 // $("#Motionrec").prop("checked", true);
					 }else{
						$("#autoip6").val(false).prop("checked", false) 
						//$("input[name='DHCPdisabled']").prop("disabled",false)
						 $("#ipAddress").prop("disabled",false)
					}
				var s_seIPv6Mode=document.getElementById("seIPv6Mode")
				for (i=0;i<s_seIPv6Mode.length;i++){
				 if(s_seIPv6Mode.options[i].value==k_szaddresstype6){  
					s_seIPv6Mode.options[i].selected=true;  
					}
				}
				
				
	}
 /* if($("#static").val()=="static"){
	  $("input[name='addresstype'][value='static']").prop("checked",true); 
	  $("input[name='addresstype'][value='dynamic']").prop("checked",false); 
	}else {
	 $("input[name='addresstype'][value='static']").prop("checked",false); 
	  $("input[name='addresstype'][value='dynamic']").prop("checked",true); 
	}*/	
	/*if (k_szaddresstype=="static"){
			  $("input[name='addresstype'][value='static']").prop("checked",true); 
			}else{
				$("input[name='addresstype'][value='dynamic']").prop("checked",true); 
			};
	*/
}

//切换自动获取IP
function CheckBoxAutoIp(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true);
	  $(obj).prop("checked", true);
	  $('#addresstype').attr('value','dynamic');
	  $("#ipAddress").prop("disabled", true);
	  $("#subnetMask").prop("disabled", true);
	  $("#DefaultGateway").prop("disabled", true);
	}else{
	  $(obj).prop("checked", false);
	  $(obj).val(false);
	  $("#ipAddress").prop("disabled", false);
	  $("#subnetMask").prop("disabled", false);
	  $("#DefaultGateway").prop("disabled", false);
	  $('#addresstype').attr('value','static');
	}

}
//切换自动获取DNS
function CheckBoxAutoDNS(obj){
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true).prop("checked", true);
	  $("#dnsserver1").val("").prop("disabled",true)
	  $("#dnsserver2").val("").prop("disabled",true)
	}else{
	  $(obj).val(false).prop("checked", false);
	  $("#dnsserver1").prop("disabled",false)
	  $("#dnsserver2").prop("disabled",false)
	}
}

//切换dhcp
function Chagneresstype(){
  var addresstype=$("#addresstype").val();
  if (addresstype=="dynamic"){  //dhcp
	   $("#autoip").val(true).prop("checked", true);
	   $("#ipAddress").prop("disabled",true);
	   $("#subnetMask").prop("disabled",true);
	   $("#DefaultGateway").prop("disabled",true);
	   $("#dnsserver1").prop("disabled",true);
	   $("#dnsserver2").prop("disabled",true);
	   $("#autoDNS").prop("disabled", false); 
		 if (autodnsv4=="true"){
			 $("#autoDNS").val(true).prop("checked", true);
			 $("#dnsserver1").prop("disabled", true);
			 $("#dnsserver2").prop("disabled", true)
		  }else{
			$("#autoDNS").val(false).prop("checked", false);
			$("#dnsserver1").prop("disabled",false)
			$("#dnsserver2").prop("disabled",false)
		  };
	 }else{
		$("#autoDNS").val(false).prop("checked", false).prop("disabled", true); 
		$("#autoip").val(false).prop("checked", false); 
	 	$("#ipAddress").prop("disabled",false);
	 	$("#subnetMask").prop("disabled",false);
	 	$("#DefaultGateway").prop("disabled",false);
		$("#dnsserver1").prop("disabled",false);
	    $("#dnsserver2").prop("disabled",false);
	}
}
//获取IP地址
function Gettcpip(){
   var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/tcpip"
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
		    
			$("#MacAddress").val($(xmlDoc).find('mac').eq(0).text());  //MAC地址
			$("#MTU").val($(xmlDoc).find('mtu').eq(0).text());  //mtu
			
			$(xmlDoc).find("v4").each(function(i){ 
			     ipaddressv4 =$(this).children("ipaddress").text();  //ip4地址
			    $("#ipAddress").val(ipaddressv4);
				 subnetmaskv4 =$(this).children("subnetmask").text();   //ip4子网掩码
				$("#subnetMask").val(subnetmaskv4);
				  defaultgatewayv4 =$(this).children("defaultgateway").text();
			    $("#DefaultGateway").val(defaultgatewayv4);     //默认网关
				$("#Multicast").val($(this).children('multicast').text());  //多播地址
				$("#dnsserver1").val($(this).children('dnsserver1').text());  ////首选DNS
				$("#dnsserver2").val($(this).children('dnsserver2').text());  ////备用DNS
			      
			
				 k_szaddresstype= $(this).children('addresstype').text();  //IP4自动获取
				$("#addresstype").empty(); 
				 var g_addresstypeopt = $(this).children('addresstype').attr('opt').split(",");
				insertOptions2Select(g_addresstypeopt, ["static","dynamic"], ["Mstatic","Mdynamic"], "addresstype");
				setValueDelayIE6("addresstype" ,"","",k_szaddresstype);
			
				 autodnsv4 = $(this).children('autodns').text();  //autoDNS
				if (k_szaddresstype=="dynamic")  //DHCP
				{  
					//$("#autoip").val(true).prop("checked", true);
					$("#ipAddress").prop("disabled", true)
					$("#subnetMask").prop("disabled", true)
					$("#DefaultGateway").prop("disabled", true)
				    if (autodnsv4=="true")
				    {
						 $("#autoDNS").val(true).prop("checked", true);
						 $("#dnsserver1").val("").prop("disabled", true);
						 $("#dnsserver2").val("").prop("disabled", true)
					}
					else
					{
						$("#autoDNS").val(false).prop("checked", false);
						$("#dnsserver1").prop("disabled",false)
						$("#dnsserver2").prop("disabled",false)
					}
				}
				else if(k_szaddresstype=="static")  //静态
				{  
					$("#autoDNS").val(false).prop("checked", false).prop("disabled", true);
					$("#ipAddress").prop("disabled", false);
					$("#subnetMask").prop("disabled", false);
					$("#DefaultGateway").prop("disabled", false);
				}
				
				
		    });//v4结束
			
			$(xmlDoc).find("v6").each(function(i){ 
		  	    k_szaddresstype6= $(this).children('ipmode').text();  //IP6自动获取
				if (k_szaddresstype6=="route"){
					$("#spanroute").show();
				}else if(k_szaddresstype6=="auto"){
					$("#spanroute").hide();
					$("#autoip6").val(true).prop("checked", true);
					$("#ipAddress6").prop("disabled", true)
					$("#subnetMask6").prop("disabled", true)
					$("#DefaultGateway6").prop("disabled", true)
				}
				
			   var s_addresstype6=document.getElementById("seIPv6Mode")
				for (i=0;i<s_addresstype6.length;i++){
				 if(s_addresstype6.options[i].value==k_szaddresstype6){  
					s_addresstype6.options[i].selected=true;  
					}
				}
			  $("#ipAddress6").val($(this).children('ipaddress').text());  //ip6地址
			  $("#subnetMask6").val($(this).children('subnetmask').text());  //ip6子网掩码
			  $("#DefaultGateway6").val($(this).children('defaultgateway').text());  //ip6默认网关
			  $("#Multicast6").val($(this).children('multicast').text());  //多播地址
			  
			  $("#dnsserver16").val($(this).children('dnsserver1').text());  ////首选DNS
			  $("#dnsserver26").val($(this).children('dnsserver1').text());  ////备用DNS
			    autodnsv6 = $(xmlDoc).children('autodns').eq(0).text()
				if("true" == autodnsv6)
				{
					$("#autoDNS6").val(true).prop("checked", true);
					$("#dnsserver16").prop("disabled",true)
					$("#dnsserver26").prop("disabled",true)
					
				}else{
					$("#autoDNS6").val(false).prop("checked", false);
					$("#dnsserver16").prop("disabled",false)
					$("#dnsserver26").prop("disabled",false)
				}
			  
			}); 
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
//选择v6
function ChangeIPv6Mode(){
	var seIPv6Mode=$("#seIPv6Mode").val();
	if (seIPv6Mode=="route"){
		$("#spanroute").show();
		$("#autoip6").val(true).prop("checked", false);
		$("#ipAddress6").prop("disabled", false);
		$("#subnetMask6").prop("disabled", false);
		$("#DefaultGateway6").prop("disabled", false);
		if("true" == autodnsv6)
		{
			$("#autoDNS6").val(true).prop("checked", true);
			$("#dnsserver16").prop("disabled",true)
			$("#dnsserver26").prop("disabled",true)
			
		}else{
			$("#autoDNS6").val(false).prop("checked", false);
			$("#dnsserver16").prop("disabled",false)
			$("#dnsserver26").prop("disabled",false)
		}
	}else if(seIPv6Mode=="auto"){
		$("#spanroute").hide();
		$("#autoip6").val(true).prop("checked", true);
		$("#ipAddress6").prop("disabled", true)
		$("#subnetMask6").prop("disabled", true)
		$("#DefaultGateway6").prop("disabled", true);
		$("#autoDNS6").val(true).prop("checked", true).prop("disabled",true);
		$("#dnsserver16").prop("disabled",true)
		$("#dnsserver26").prop("disabled",true)
		
	}else{
		$("#spanroute").hide();
		$("#autoip6").val(true).prop("checked", false);
		$("#ipAddress6").prop("disabled", false)
		$("#subnetMask6").prop("disabled", false)
		$("#DefaultGateway6").prop("disabled", false)
		if("true" == autodnsv6)
		{
			$("#autoDNS6").val(true).prop("checked", true);
			$("#dnsserver16").prop("disabled",true)
			$("#dnsserver26").prop("disabled",true)
			
		}else{
			$("#autoDNS6").val(false).prop("checked", false);
			$("#dnsserver16").prop("disabled",false)
			$("#dnsserver26").prop("disabled",false)
		}
	}
}
//IP保存
function SaveIPTCP(obj,tab){
	var mac=$("#MacAddress").val();
	var mtu=$("#MTU").val();
	var addresstype=$("#addresstype").val();
	//v4
	var ipaddress=$("#ipAddress").val();
	var subnetmask=$("#subnetMask").val();
	var defaultgateway=$("#DefaultGateway").val();
	var multicast=$("#Multicast").val();
	var dnsserver1=$("#dnsserver1").val();
	var dnsserver2=$("#dnsserver2").val();
	
   //v6
   var ipmode=$("#IPMode").val();
   var ipaddress6=$("#ipAddress6").val()
   var subnetMask6=$("#subnetMask6").val()
   var multicast6=$("#Multicast6").val()
   var defaultgateway6=$("#DefaultGateway6").val()
   
    var dnsserver16=$("#dnsserver16").val();
	var dnsserver26=$("#dnsserver26").val();
   //console.log(ipmode+"   "+"v4"+subnetmask+"   "+"v6"+subnetMask6)
	if(!CheackIDNORange(mtu,'MTUtips','jsMtuParam',500,1500))
	{
	    return;
	}
	//v4
	if (ipmode=="IPv4"){
		if ($("#addresstype").val()=="static"){
			if(!CheckDIPadd(ipaddress,'ipAddresstips','jsipAddress'))
			{
				return;
			}
			if(!CheckMaskIP(subnetmask,'subnetMasktips','MmaskAddress'))
			{
				return;
			}
			if(!CheckIPadd(defaultgateway,'ServerGateWayIPtips','MDefaultGatewayAddress'))
			{
				return;
			}
		}
		if(!CheckMulticastIP(multicast,'Multicasttips','MMulticastAddress'))  //多播地址
		{
			return;
		}
		if ($("#autoDNS").prop("checked")==false)
		{
			if(!CheckIPadd(dnsserver1,'DNSServerIPtips','jsdnsserver1',0))
			{
				return;
			}
			if(!CheckIPadd(dnsserver2,'DNSServer2IPtips','jsdnsserver2',0))
			{
				return;
			}
		}
		else
		{
			//console.log("选中")
		}
		
	}
	else
	{
		if(!CheckIPadd(ipaddress6,'ipAddress6tips','jsipAddressv6'))
		{
	    	return;
		}
		if(!CheckIPadd(subnetMask6,'subnetMask6tips','jsMaskAddress'))
		{
	    	return;
		}
		if(!CheckIPadd(defaultgateway6,'ServerGateWayIPtips','jsDefaultGatewayAddress'))
		{
	    	return;
		}
		if(!CheckIPadd(multicast6,'Multicasttips','jsMulticastAddress'))
		{
	    	return;
		}
		if(!CheckIPadd(dnsserver16,'DNSServerIPtips','jsdnsserver1'))
		{
			return;
		}
		if(!CheckIPadd(dnsserver26,'DNSServer2IPtips','jsdnsserver2'))
		{
			return;
		}
	}
	
	var szXml = "<tcpipinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<mac>"+mac+"</mac>";
	szXml += "<mtu>"+mtu+"</mtu>";
		if (ipmode=="IPv4"){
		szXml += "<v4>";
		szXml += "<addresstype>"+addresstype+"</addresstype>";
		 if ($("#addresstype").val()=="static"){  //DHCP不发送IP地址
			  szXml += "<ipaddress>"+ipaddress+"</ipaddress>";
			  szXml += "<subnetmask>"+subnetmask+"</subnetmask>";
			  szXml += "<defaultgateway>"+defaultgateway+"</defaultgateway>";
		 }
		  if (multicast!="")
		  {
			   szXml += "<multicast>"+multicast+"</multicast>";
		  }
		  szXml += "<autodns>"+$("#autoDNS").val()+"</autodns>";
		  if ($("#autoDNS").val()=="false")
		  {
			  szXml += "<dnsserver1>"+dnsserver1+"</dnsserver1>";
			  szXml += "<dnsserver2>"+dnsserver2+"</dnsserver2>";
		  }
		szXml += "</v4>";
		}else{
		szXml += "<v6>";
		  szXml += "<addresstype >"+addresstype+"</addresstype >";
		  szXml += "<ipaddress>"+ipaddress6+"</ipaddress>";
		  szXml += "<subnetmask>"+subnetMask6+"</subnetmask>";
		  szXml += "<defaultgateway>"+defaultgateway6+"</defaultgateway>";
		  szXml += "<ipmode >"+$("#seIPv6Mode").val()+"</ipmode >";
		  szXml += "<multicast>"+multicast6+"</multicast>";
		  szXml += "<autodns>"+$("#autoDNS6").val()+"</autodns>";
		  szXml += "<dnsserver1>"+dnsserver16+"</dnsserver1>";
		  szXml += "<dnsserver2>"+dnsserver26+"</dnsserver2>";
		szXml += "</v6>";
	  }
 	szXml += "</tcpipinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/tcpip"
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
				 if ($("#addresstype").val()=="static")//静态IP
				   {
						if ($("#ipAddress").val()!=ipaddressv4)
						{
							var  t_URL="http://"+ipaddress+":"+camera_port;
					    	top.location.href= t_URL;
							return;
						}
				   }
				   else  //否则动态IP,页面说明
				   {
					   if ($("#addresstype").val()!=k_szaddresstype)
					  {
							parent.$("#header").hide();
							parent.$("#content").removeClass().addClass("ipeditmain").removeAttr("style").html(getNodeValue('jsnewip2'));
							return;
					  }
					  else
					  {
							szRetInfo=  m_szSuccessState+m_szSuccess1;
							$("#SetResultTipsIPTCP").html(szRetInfo);
							setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
					  }
				   }
				   if (tab=="save")
					{
						szRetInfo=  m_szSuccessState+m_szSuccess1;
						$("#SetResultTipsIPTCP").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
					}
					else if(tab=="down")
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
			   }
				else if("5" == state)	//OK
				{
					
					if ($("#addresstype").val()=="static")//静态IP
					{
						if ($("#ipAddress").val()!=ipaddressv4)
						{
							var  t_URL="http://"+ipaddress+":"+camera_port;
					    	top.location.href= t_URL;
							return;
						}
					}
					else if ($("#addresstype").val()=="dynamic")  //否则动态IP,页面说明
					{
						if ($("#addresstype").val()!=k_szaddresstype)
						{
							parent.$("#header").hide();
							parent.$("#content").removeClass().addClass("ipeditmain").removeAttr("style").html(getNodeValue('jsnewip2'));
							return;
						}
						else
						{
							szRetInfo=  m_szSuccessState+m_szSuccess1;
							$("#SetResultTipsIPTCP").html(szRetInfo);
							setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
						}
							
					}
					if (tab=="save")
					{
						szRetInfo=  m_szSuccessState+m_szSuccess1;
						$("#SetResultTipsIPTCP").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
					}
					else if(tab=="down")
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
				}
				else
				{
					szRetInfo=  m_szErrorState+m_szError1;
					$("#SetResultTipsIPTCP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsIPTCP").html("");},5000);  //5秒后自动清除
				}
			});
			
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,'SaveIP');
		}
	});
};
/*************************************************
Function:		wireless
Description:	初始化无线网络页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function wireless() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(wireless);
pr(wireless).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["tcpip", "WirelessMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initwireless();
}
/*************************************************
Function:		initwireless
Description:	初始化获取无线网络
Input:			无			
Output:			无
return:			无				
*************************************************/
function initwireless()
{
    initWlanGetCap("bluetooth=true&wireless=true");
	//GetBluetooth();  //获取蓝牙
	GetWlanState();  //获取状态
	Getwifilist();    //WIFI连接列表-信息获取  id //all 全部  单个信息
	Gethotspotlist();  //热点扫描信息获取
	autoResizeIframe();
};
/*************************************************
Function:		initWlanGetCap
Description:	获取能力集
Input:			无			
Output:			无
return:			无				
*************************************************/
function initWlanGetCap(obj){
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
			// GetBluetooth();  //初始化蓝牙
				//	蓝牙
				if($(xmlDoc).find("bluetooth").length > 0){
					$(xmlDoc).find("bluetooth").each(function(i){ 
					  if($(this).text()!="true")
						{
							$("#subbluetooth").hide();
						}else{
							$("#subbluetooth").show();
							GetBluetooth();  //初始化蓝牙
						}
					});
			    }
		}
	});
};
/*************************************************
Function:		GetBluetooth
Description:	初始化获取蓝牙
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetBluetooth(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
		
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"//kdsapi/network/1/bluetooth";
	 //var szURL=m_lHttp+camera_hostname+":"+camera_port+"/bluetooth.xml"
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
			var bluetoothkeyhide = false;
			if("true" == $(xmlDoc).find('enable').eq(0).text())
		    {
			    $("#enablebluetooth").val(true).prop("checked", true);
				bluetoothkeyhide=true;
		    }else{
				
				$("#enablebluetooth").val(false).prop("checked", false);
			}
	
			$(xmlDoc).find("bluetoothkey").each(function(i){ 
			    g_bluetoothkeymax=$(this).attr('max');
				g_bluetoothkeytext=$(this).text();
				$("#bluetoothkey").val($(this).text()).attr('maxlength' , g_bluetoothkeymax); 
				if (bluetoothkeyhide==true){
					
					$("#bluetoothkey").prop("disabled",false)
				}
				else
				{
				    $("#bluetoothkey").prop("disabled",true)
				}
			}); 
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/*************************************************
Function:		SaveBluetoothkey
Description:	保存蓝牙
Input:			无			
Output:			无
return:			无				
*************************************************/
function SaveBluetoothkey(obj){
	var g_bluetoothkey = $("#bluetoothkey").val();
	if(!CheckLetterNumber(g_bluetoothkey,'bluetoothkeytips','Mvsipnetpassword',0,Number(g_bluetoothkeymax)))
	{
	    return;
	}
	var szXml = "<bluetoothinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+$("#enablebluetooth").val()+"</enable>";
	szXml += "<bluetoothkey>"+g_bluetoothkey+"</bluetoothkey>";
	szXml += "</bluetoothinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/bluetooth"
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
				$("#SetResultTipsbluetoothkey").html(szRetInfo);
				setTimeout(function(){$("#SetResultTipsbluetoothkey").html("");},5000);  //5秒后自动清除
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});	
};


/*************************************************
Function:		GetWlanState
Description:	初始化获取状态
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetWlanState(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/wlan/state";
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/state.xml"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
	 	timeout: 30000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			if("true" == $(xmlDoc).find('isconnect').eq(0).text())
		    {
			    $("#wlanisconnect").html("<label name='jsconnect'>"+getNodeValue("jsconnect")+"</label>");
		    }else{
				
				 $("#wlanisconnect").html("<label name='jsNotconnect'>"+getNodeValue("jsNotconnect")+"</label>");
			}
			if($(xmlDoc).find("mode").length > 0){
				 $(xmlDoc).find("mode").each(function(i){ 
					var g_mode= $(this).text()
					if (g_mode=="wifi"){
						$("#wlanstate").html("WIFI");
						//$("#WifiRefresh").attr({"onclick":"WalnOKclick('add')","name":"jsRefresh"}).val(getNodeValue('jsRefresh') );
						$("#WifiRefresh").removeAttr("onclick").attr({"onclick":"WalnApwin('Refresh')","name":"jsRefresh"}).val(getNodeValue('jsRefresh') );
					}
					else if(g_mode=="ap"){
						$("#wlanstate").html("AP");
						$("#WifiRefresh").removeAttr("onclick").attr({"onclick":"WalnApwin('ap')","name":"jsRescan"}).val(getNodeValue('jsRescan') );
					}
				});
			}
		   $("#wlanmac").html($(xmlDoc).find('mac').eq(0).text())
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};


/*************************************************
Function:		Getwifilist
Description:	初始化WIFI连接列表-信息获取
Input:			无			
Output:			无
return:			无				
*************************************************/
function Getwifilist(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/wifilist/all"   //all表示全部
	 //var szURL=m_lHttp+camera_hostname+":"+camera_port+"/wifilist.xml"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
	 	timeout: 30000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			$("#UlWifi").empty();
			$(xmlDoc).find("wifilist").each(function(i){ 
			   var g_wifilistsize=$(this).attr('size');
			   var g_wifilistmax=$(this).attr('max');
			   var g_wifiinfoxml=$(this).find('wifiinfo');
				for (var i=1; i<=g_wifilistsize;i++){
					var g_bssid = $(g_wifiinfoxml).find("bssid").eq(i-1).text();
					var g_ssid = $(g_wifiinfoxml).find("ssid").eq(i-1).text();
					var g_password  =$(g_wifiinfoxml).find("password").eq(i-1).text();
					var g_encrypttype = $(g_wifiinfoxml).find("encrypttype").eq(i-1).text();
					var g_securitytype = $(g_wifiinfoxml).find("securitytype").eq(i-1).text();
					var g_rssi = $(g_wifiinfoxml).find("rssi").eq(i-1).text();
					
					var g_addresstype = $(g_wifiinfoxml).find('v4').find("addresstype").eq(i-1).text();
					var g_ipaddress = $(g_wifiinfoxml).find('v4').find("ipaddress").eq(i-1).text();
					var g_subnetmask =$(g_wifiinfoxml).find('v4').find("subnetmask").eq(i-1).text();
					var g_defaultgateway = $(g_wifiinfoxml).find("defaultgateway").eq(i-1).text();
					var g_autodns = $(g_wifiinfoxml).find("autodns").eq(i-1).text();
					var g_dns1 = $(g_wifiinfoxml).find("dnsserver1").eq(i-1).text();
					var g_dns2 = $(g_wifiinfoxml).find("dnsserver2").eq(i-1).text();
					var g_encrypttypeopt;
					if($(g_wifiinfoxml).find("encrypttype").length > 0){
						 g_encrypttypeopt = $(g_wifiinfoxml).find("encrypttype").eq(i-1).attr('opt').split(",");
					}
					
					var g_securitytypeopt = $(g_wifiinfoxml).find("securitytype").eq(i-1).attr('opt').split(",");
					var g_ipmodeopt = $(g_wifiinfoxml).find("addresstype").eq(i-1).attr('opt').split(",");
					 m_szwifilist[i-1]=new Array(); //声明二维，每一个一维数组里面的一个元素都是一个数组；
					 for(var j=1;j<=g_wifilistsize;j++){ //一维数组里面每个元素数组可以包含的数量j，j也是一个变量；
						  m_szwifilist[i-1][j-1]="";  //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值
						  m_szwifilist[i-1][0]=g_bssid; 
						  m_szwifilist[i-1][1]=g_ssid;
						  m_szwifilist[i-1][2]=g_password;
						  m_szwifilist[i-1][3]=g_encrypttype;
						  m_szwifilist[i-1][4]=g_securitytype;
						  m_szwifilist[i-1][5]=g_addresstype;
						  m_szwifilist[i-1][6]=g_ipaddress;
						  m_szwifilist[i-1][7]=g_subnetmask;
						  m_szwifilist[i-1][8]=g_defaultgateway;
						  m_szwifilist[i-1][9]=g_autodns;
						  m_szwifilist[i-1][10]=g_dns1;
						  m_szwifilist[i-1][11]=g_dns2;
						  m_szwifilist[i-1][12]=g_rssi;
						  m_szwifilist[i-1][13]=g_encrypttypeopt;
						  m_szwifilist[i-1][14]=g_securitytypeopt
						  m_szwifilist[i-1][15]=g_ipmodeopt
					 }
				
					$("<li id='Ulwifi"+i+"' onclick='wificonnect("+i+")'>"
					//$("<li id='Ulwifi"+i+"'>"
					+"<i class='wifi_pass'></i>"
					+"<input id='delicon' type='button' value='X' onclick='delwifi(event,"+i+")' style='display:none;float:right;width:30px;margin-top:10px; height:20px;margin-right:10px;line-height:10px;' />"
					+"<input id='op' type='button' value='op' onclick='WalnTable(event,"+'"wifilist"'+","+i+")' style='display:none;float:right;width:30px;margin-top:10px; height:20px;line-height:10px;' />"
					+"<span class='Ulhotspan'>"
						+"<span class='Ulhotspanblock'>"+m_szwifilist[i-1][1]+"</span>"
						+"<span class='Ulhotspanblock Ulhotspanfont'>"+"<label name='jsThrough'></label>"+g_securitytype+"<label name='jsPasswordprotection'></label>"+"</span>"
					+"</span></li>").appendTo("#UlWifi");
				}
			//	console.log(m_szhotspotlist[0][1]+"  "+m_szhotspotlist[1][1]+"  "+m_szhotspotlist[2][1])
				
				$("#UlWifi").find("li").each(function() {
					$(this).hover(function () {
						   $(this).addClass("trOdd").children("#delicon").show()
						   $(this).children("#op").show()
						  // $("#addico").show();
						},function () {
						   $(this).removeClass("trOdd").children("#delicon").hide();
						   $(this).children("#op").hide();
						  // $("#addico").hide();
						}/*,$(this).bind("dblclick",function(event){    //dblclick双击  click单击
								console.log("点击了事件上"+"   "+$(this))
								event.stopPropagation();    //  阻止事件冒泡
						})*/
					);
				});
				
				
				
			}); 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

/*************************************************
Function:		Gethotspotlist
Description:	初始化获取热点扫描信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function Gethotspotlist(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/wifi/hotspotlist";	
  // var szURL=m_lHttp+camera_hostname+":"+camera_port+"/hotspotlist.xml"
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		data: xmlDoc,
	 	timeout: 30000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			
			//ssid
			$("#Ulhotspotlist").empty();
			$(xmlDoc).find("wifilist").each(function(i){ 
			   var g_wifilistsize=$(this).attr('size');
			   var g_wifilistmax=$(this).attr('max');
			   var g_wifiinfoxml=$(this).find('wifiinfo');
				for (var i=1; i<=g_wifilistsize;i++){
					var g_bssid = $(g_wifiinfoxml).find("bssid").eq(i-1).text();
					var g_ssid = $(g_wifiinfoxml).find("ssid").eq(i-1).text();
					var g_password  = $(g_wifiinfoxml).find("password").eq(i-1).text();
					var g_encrypttype = $(g_wifiinfoxml).find("encrypttype").eq(i-1).text();
					var g_securitytype = $(g_wifiinfoxml).find("securitytype").eq(i-1).text();
					var g_rssi = $(g_wifiinfoxml).find("rssi").eq(i-1).text();
					
					var g_ipmode = $(g_wifiinfoxml).find('v4').find("addresstype").eq(i-1).text();
					var g_ipaddress = $(g_wifiinfoxml).find('v4').find("ipaddress").eq(i-1).text();
					var g_subnetmask = $(g_wifiinfoxml).find('v4').find("subnetmask").eq(i-1).text();
					var g_defaultgateway = $(g_wifiinfoxml).find('v4').find("defaultgateway").eq(i-1).text();
					var g_autodns = $(g_wifiinfoxml).find('v4').find("autodns").eq(i-1).text();
					var g_dns1 = $(g_wifiinfoxml).find('v4').find("dnsserver1").eq(i-1).text();
					var g_dns2 = $(g_wifiinfoxml).find('v4').find("dnsserver2").eq(i-1).text();
					
					var g_encrypttypeopt;
					if($(g_wifiinfoxml).find("encrypttype").length > 0){
						 g_encrypttypeopt = $(g_wifiinfoxml).find("encrypttype").eq(i-1).attr('opt').split(",");
					}
					
					var g_securitytypeopt = $(g_wifiinfoxml).find("securitytype").eq(i-1).attr('opt').split(",");
					var g_ipmodeopt = $(g_wifiinfoxml).find("addresstype").eq(i-1).attr('opt').split(",");
					 m_szhotspotlist[i-1]=new Array(); //声明二维，每一个一维数组里面的一个元素都是一个数组；
					 for(var j=1;j<=g_wifilistsize;j++){ //一维数组里面每个元素数组可以包含的数量j，j也是一个变量；
						  m_szhotspotlist[i-1][j-1]="";  //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值
						  m_szhotspotlist[i-1][0]=g_bssid; 
						  m_szhotspotlist[i-1][1]=g_ssid;
						  m_szhotspotlist[i-1][2]=g_password;
						  m_szhotspotlist[i-1][3]=g_encrypttype;
						  m_szhotspotlist[i-1][4]=g_securitytype;
						  m_szhotspotlist[i-1][5]=g_ipmode;
						  m_szhotspotlist[i-1][6]=g_ipaddress;
						  m_szhotspotlist[i-1][7]=g_subnetmask;
						  m_szhotspotlist[i-1][8]=g_defaultgateway;
						  m_szhotspotlist[i-1][9]=g_autodns;
						  m_szhotspotlist[i-1][10]=g_dns1;
						  m_szhotspotlist[i-1][11]=g_dns2;
						  m_szhotspotlist[i-1][12]=g_rssi;
						  m_szhotspotlist[i-1][13]=g_encrypttypeopt;
						  m_szhotspotlist[i-1][14]=g_securitytypeopt
						  m_szhotspotlist[i-1][15]=g_ipmodeopt
					 }
				if (g_securitytype!=""){
				
					$("<li id='Ulhot"+i+"'>"
					+"<i class='wifi_pass'></i>"
					//+"<i id='addico' class='addico' style='display:none'  onclick='WalnTable("+'"hotspotlist"'+","+i+")'>+</i>"
					+"<input id='addico' type='button' value='+' onclick='WalnTable(event,"+'"hotspotlist"'+","+i+")' style='display:none;float:right;width:30px;margin-top:10px;margin-right:10px; height:20px;line-height:10px;' />"
					+"<span class='Ulhotspan'>"
					+"<span class='Ulhotspanblock'>"+m_szhotspotlist[i-1][1]+"</span>"
					+"<span class='Ulhotspanblock Ulhotspanfont'>"+"通过"+g_securitytype+"密码保护"+"</span>"
					+"</span></li>").appendTo("#Ulhotspotlist");
				  }
				  else
				  {
					 $("<li id='Ulhot"+i+"'>"
					+"<i class='wifiicon'></i>"
					//+"<i id='addico' class='addico' style='display:none'  onclick='WalnTable("+'"hotspotlist"'+","+i+")'>+</i>"
					+"<input id='addico' type='button' value='+' onclick='WalnTable(event,"+'"hotspotlist"'+","+i+")' style='display:none;float:right;width:30px;margin-top:10px;margin-right:10px; height:20px;line-height:10px;' />"
					+"<span class='Ulhotspan'>"
					+"<span class='Ulhotspanblock' style='line-height:40px;'>"+m_szhotspotlist[i-1][0]+"</span>"
					//+"<span class='Ulhotspanblock Ulhotspanfont'>"+"通过"+g_securitytype+"密码保护"+"</span>"
					+"</span></li>").appendTo("#Ulhotspotlist"); 
				  }
				}
			//	console.log(m_szhotspotlist[0][1]+"  "+m_szhotspotlist[1][1]+"  "+m_szhotspotlist[2][1])
				
				$("#Ulhotspotlist").find("li").each(function() {
					$(this).hover(function () {
						   $(this).addClass("trOdd").children("#addico").show();
						  // $("#addico").show();
						},function () {
						   $(this).removeClass("trOdd").children("#addico").hide();
						  // $("#addico").hide();
						}
					);
				});
				
			}); 
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};

/*************************************************
Function:		wificonnect
Description:	双击Wifi连接配置
Input:			无			
Output:			无
return:			无				
*************************************************/
function wificonnect(sid){
	//console.log(sid)
	var szXml = "<wifiinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<bssid>"+m_szwifilist[sid-1][0]+"</bssid>";
  	szXml += "<ssid>"+m_szwifilist[sid-1][1]+"</ssid>";
 	szXml += "<password>"+m_szwifilist[sid-1][2]+"</password>";
	szXml += "<encrypttype>"+m_szwifilist[sid-1][3]+"</encrypttype>";
	szXml += "<securitytype>"+m_szwifilist[sid-1][4]+"</securitytype>";
	szXml += "<v4>"
		szXml += "<addresstype>"+m_szwifilist[sid-1][5]+"</addresstype>";
		szXml += "<ipaddress>"+m_szwifilist[sid-1][6]+"</ipaddress>";
		szXml += "<subnetmask>"+m_szwifilist[sid-1][7]+"</subnetmask>";
		szXml += "<defaultgateway>"+m_szwifilist[sid-1][8]+"</defaultgateway>";
		szXml += "<autodns>"+m_szwifilist[sid-1][9]+"</autodns>";
		szXml += "<dnsserver1>"+m_szwifilist[sid-1][10]+"</dnsserver1>";
		szXml += "<dnsserver2>"+m_szwifilist[sid-1][11]+"</dnsserver2>";
	szXml += "</v4>"
 	szXml += "</wifiinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/wifi/connect"
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
					//$("#SetResultTips").html(szRetInfo);
					//setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
				}
			});
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};

/*************************************************
Function:		wificonnecttest
Description:	Wifi连接性测试
Input:			无			
Output:			无
return:			无				
*************************************************/
function wificonnecttest(sid){
	var szXml = "<connecttestparam version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<bssid>"+m_szhotspotlist[sid-1][0]+"</bssid>";
  	szXml += "<ssid>"+m_szhotspotlist[sid-1][1]+"</ssid>";
 	szXml += "<password>"+m_szhotspotlist[sid-1][2]+"</password>";
	szXml += "<encrypttype>"+m_szhotspotlist[sid-1][3]+"</encrypttype>";
	szXml += "<securitytype>"+m_szhotspotlist[sid-1][4]+"</securitytype>";
	szXml += "<ipmode>"+m_szhotspotlist[sid-1][5]+"</ipmode>";
	szXml += "<ipaddress>"+m_szhotspotlist[sid-1][6]+"</ipaddress>";
	szXml += "<subnetmask>"+m_szhotspotlist[sid-1][7]+"</subnetmask>";
	szXml += "<defaultgateway>"+m_szhotspotlist[sid-1][8]+"</defaultgateway>";
	szXml += "<autodns>"+m_szhotspotlist[sid-1][9]+"</autodns>";
	szXml += "<dns1>"+m_szhotspotlist[sid-1][10]+"</dns1>";
	szXml += "<dns2>"+m_szhotspotlist[sid-1][11]+"</dns2>";
 	szXml += "</connecttestparam>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"//kdsapi/network/1/wifi/connecttest"
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
			 $(xmlDoc).find("rssi").each(function(i,data) {
			    var g_rssi =$(this).text();
			});
			
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj);
			}
	});
};


/*************************************************
Function:		WalnTable
Description:	弹出窗口添加wnal
Input:			无			
Output:			无
return:			无				
*************************************************/
function WalnTable(event,type,sid){
	//$(this).parent().prev()
	/*console.log($(obj))
	console.log($(obj).parent())
	console.log($(obj).parent().find("span").eq(1).html())
	console.log($(obj).parent().prev())
	console.log(sid)
	*/
	$("#divWalnTable").modal(
		{
		"close":false,
		 "position":[100]  
		 }
	    );
	if (type=="add"){
		
	  $("#WalnOKclick").removeAttr("onclick").attr({"onclick":"WalnOKclick('add')","name":"AddDigitalIpBtn"}).val(getNodeValue('AddDigitalIpBtn') );
	   $("#AdvOptWin").show(); 
	   $("#winSSID").prop("disabled",false);
	   $("#checkpasswhow").prop("checked", true);
	 //  onclick="WalnOKclick(this,'add')"
	  // $("#WalnOKclick").prop("onclick","11")
	 // $("#WalnOKclick").removeAttr("onclick"); 
	  //$("#WalnOKclick").removeAttr("onclick").attr("onclick","WalnOKclick('add',"+sid+")");   //多个属性
	  
	  $("#subrssi").hide();
	  $("#SubEncrypttype").show();  //加密类型
	  $("#SubSecuritytype").show();  //加密类型
	  
	  $("#winipaddress").prop("disabled",true);
	  $("#winsubnetmask").prop("disabled",true);
	  $("#windefaultgateway").prop("disabled",true);
	  //$("#WalnOKclick").removeAttr("onclick").attr({"onclick":"WalnOKclick('add',"+sid+")","name":"AddDigitalIpBtn"}).val(getNodeValue('AddDigitalIpBtn') );
	}
	else if(type=="wifilist"){
		event.stopPropagation();    //  阻止事件冒泡
		  $("#WalnOKclick").removeAttr("onclick").attr({"onclick":"WalnOKclick('wifilist',"+sid+")","name":"MSaveConfigLocal"}).val(getNodeValue('MSaveConfigLocal') );
		  $("#winSSID").val(m_szwifilist[sid-1][1]).prop("disabled",true);
		  $("#winpassword").val(m_szwifilist[sid-1][2]);
		  $("#winrssi").html(m_szwifilist[sid-1][12]);
		  //$("#ipmode").val(m_szwifilist[sid-1][3]);m_szwifilist[i-1][14]
		  //加密类型
		 /* $("#winencrypttype").empty(); 
		  for (i=0;i<m_szwifilist[sid-1][13].length;i++){
			$("<option value='" + m_szwifilist[sid-1][13][i] + "' >" + m_szwifilist[sid-1][13][i] + "</option>").appendTo("#winencrypttype");
		  }
		  $("#winencrypttype").val(m_szwifilist[sid-1][3]);
		  */
		  $("#SubEncrypttype").hide();  //加密类型
	      $("#SubSecuritytype").hide();  //加密类型
		  
		  /*$("#winsecuritytype").empty(); 
		  for (i=0;i<m_szwifilist[sid-1][14].length;i++){
			$("<option value='" + m_szwifilist[sid-1][14][i] + "' >" + m_szwifilist[sid-1][14][i] + "</option>").appendTo("#winsecuritytype");
		  }
		  $("#winsecuritytype").val(m_szwifilist[sid-1][4]);
		 */
		 
		  $("#winipmode").empty(); 
		 /* for (i=0;i<m_szwifilist[sid-1][15].length;i++){
			$("<option value='" + m_szwifilist[sid-1][15][i] + "' >" + m_szwifilist[sid-1][15][i] + "</option>").appendTo("#winipmode");
		  }*/
		  //$("#winipmode").val(m_szwifilist[sid-1][5]);
		  
		//  var g_addresstypeopt =m_szwifilist[sid-1][15].split(",");
			insertOptions2Select(m_szwifilist[sid-1][15], ["dynamic","static"], ["Mdynamic","Mstatic"], "winipmode");
			setValueDelayIE6("winipmode" ,"","",m_szwifilist[sid-1][5]);
		  
		  if ($("#winipmode").val()=="dynamic"){//DHCP
			$("#winipaddress").val(m_szwifilist[sid-1][6]).prop("disabled",true);
			$("#winsubnetmask").val(m_szwifilist[sid-1][7]).prop("disabled",true);
			$("#windefaultgateway").val(m_szwifilist[sid-1][8]).prop("disabled",true);
			if (m_szwifilist[sid-1][9]=="true")
			{
				 $("#winautodns").val(true).prop("checked", true);
				 $("#windns1").val("").prop("disabled", true);
				 $("#windns2").val("").prop("disabled", true)
			}
			else
			{
				$("#winautodns").val(false).prop("checked", false);
				$("#windns1").prop("disabled",false)
				$("#windns2").prop("disabled",false)
			}
		  }
		  else if ($("#winipmode").val()=="static"){  //静态
		  	//$("#winautodns").val(false)
			$("#winautodns").val(false).prop("checked", false).prop("disabled", true);
			$("#winipaddress").val(m_szwifilist[sid-1][6]).prop("disabled",false);
			$("#winsubnetmask").val(m_szwifilist[sid-1][7]).prop("disabled",false);
			$("#windefaultgateway").val(m_szwifilist[sid-1][8]).prop("disabled",false);
		  }
		  
		  
		/* // $("#winautodns").val(m_szwifilist[sid-1][9]);
		  if (m_szwifilist[sid-1][9]=="true"){
			 $("#winautodns").prop("checked", true).val(true);
			 //$("#windns1").val(m_szwifilist[sid-1][10]).prop("disabled",true);
		    // $("#windns2").val(m_szwifilist[sid-1][11]).prop("disabled",true);
			$("#windns1").val("").prop("disabled",true);  //自动勾选后值为空
		    $("#windns2").val("").prop("disabled",true);
		  }
		  else
		  {
			 $("#winautodns").prop("checked", false).val(false); 
			 $("#windns1").val(m_szwifilist[sid-1][10]).prop("disabled",false);
		     $("#windns2").val(m_szwifilist[sid-1][11]).prop("disabled",false);
		  }
		 */ 
		  
	}
	else if (type=="hotspotlist"){
		event.stopPropagation();    //  阻止事件冒泡
	  $("#WalnOKclick").removeAttr("onclick").attr({"onclick":"WalnOKclick('hotspotlist',"+sid+")","name":"MSaveConfigLocal"}).val(getNodeValue('MSaveConfigLocal') );
	  // $("#winSSID").val($(obj).parent().find("span").eq(1).html()).prop("disabled",true)  正确得到值
	  $("#winSSID").val(m_szhotspotlist[sid-1][1]).prop("disabled",true);
	  $("#winpassword").val(m_szhotspotlist[sid-1][2]);
	  $("#winrssi").html(m_szhotspotlist[sid-1][12]);
	  //$("#ipmode").val(m_szhotspotlist[sid-1][3]);m_szhotspotlist[i-1][14]
	  
	  /*$("#winencrypttype").empty(); 
	  for (i=0;i<m_szhotspotlist[sid-1][13].length;i++){
		$("<option value='" + m_szhotspotlist[sid-1][13][i] + "' >" + m_szhotspotlist[sid-1][13][i] + "</option>").appendTo("#winencrypttype");
	  }
	  $("#winencrypttype").val(m_szhotspotlist[sid-1][3]);
	  */
	  $("#SubEncrypttype").hide();  //加密类型
	  $("#SubSecuritytype").hide();  //加密类型
	  
	  /*$("#winsecuritytype").empty(); 
	  for (i=0;i<m_szhotspotlist[sid-1][14].length;i++){
		$("<option value='" + m_szhotspotlist[sid-1][14][i] + "' >" + m_szhotspotlist[sid-1][14][i] + "</option>").appendTo("#winsecuritytype");
	  }
	  $("#winsecuritytype").val(m_szhotspotlist[sid-1][4]);
	 */
	  $("#winipmode").empty(); 
	 /* for (i=0;i<m_szhotspotlist[sid-1][15].length;i++){
		$("<option value='" + m_szhotspotlist[sid-1][15][i] + "' >" + m_szhotspotlist[sid-1][15][i] + "</option>").appendTo("#winipmode");
	  }
	  $("#winipmode").val(m_szhotspotlist[sid-1][5]);
	 */
	  insertOptions2Select(m_szhotspotlist[sid-1][15], ["dynamic","static"], ["Mdynamic","Mstatic"], "winipmode");
	  setValueDelayIE6("winipmode" ,"","",m_szhotspotlist[sid-1][5]);
	  
	  $("#winipaddress").val(m_szhotspotlist[sid-1][6]);
	  $("#winsubnetmask").val(m_szhotspotlist[sid-1][7]);
	  $("#windefaultgateway").val(m_szhotspotlist[sid-1][8]);
	  
	  //$("#windns1").val(m_szhotspotlist[sid-1][10]);
	  //$("#windns2").val(m_szhotspotlist[sid-1][11]);
	  if (m_szhotspotlist[sid-1][9]=="true"){
		 $("#winautodns").prop("checked", true).val(true);
		 $("#windns1").val(m_szhotspotlist[sid-1][10]).prop("disabled",true);
		 $("#windns2").val(m_szhotspotlist[sid-1][11]).prop("disabled",true);
	  }
	  else
	  {
		 $("#winautodns").prop("checked", false).val(false); 
		 $("#windns1").val(m_szhotspotlist[sid-1][10]).prop("disabled",false);
		 $("#windns2").val(m_szhotspotlist[sid-1][11]).prop("disabled",false);
	  }
	  
	}
	$("#simplemodal-container").height("auto");
};

/*************************************************
Function:		WalnApwin
Description:	弹出重新扫描提示
Input:			无			
Output:			无
return:			无				
*************************************************/
function WalnApwin(type){
	if (type=="Refresh"){
		GetWlanState();  //获取状态
		Getwifilist();    //WIFI连接列表-信息获取  id //all 全部  单个信息
		Gethotspotlist();  //热点扫描信息获取
	}
	else if(type=="ap"){
		Gethotspotlist();
		/*$("#divWalnAp").modal(
		{
		 "close":false,
		 "position":[100]  
		 }
		);
		*/
	}
};
/*************************************************
Function:		checkpasswhow
Description:	密码显示或用星号
Input:			无			
Output:			无
return:			无				
*************************************************/
function checkpasswhow(obj,type){
	
	if($(obj).prop("checked")){ //选中
	  if (type=="showpass"){
		  $("#winpassword").prop("type", "text");
	  }
	  else if(type=="showadv")
	  {
		 $("#AdvOptWin").show(); 
	  }
	}
	else
	{
	  if (type=="showpass"){
		  $("#winpassword").prop("type", "password");
	  }
	  else if(type=="showadv")
	  {
		 $("#AdvOptWin").hide(); 
	  }
	}
};

//关闭弹窗
function WalnCancelClick(){
	$.modal.impl.close(); 
};
/*************************************************
Function:		WalnOKclick
Description:	保存连接
Input:			无			
Output:			无
return:			无				
*************************************************/
function WalnOKclick(obj,sid){
	var g_winSSID =$("#winSSID").val();
	var g_winpassword =$("#winpassword").val();
	var g_winipaddress =$("#winipaddress").val();
	var g_winsubnetmask =$("#winsubnetmask").val();
	var g_windefaultgateway =$("#windefaultgateway").val();
	var g_windns1 =$("#windns1").val();
	var g_windns2 =$("#windns2").val();
	
	if(!CheckTypeA(g_winSSID,'winSSIDtips','jswinssid','',32,0))
	{
		return;	
	}
	if(!CheckTypeB($("#winpassword").val(),'winpasswordtips','jsPassword','',32,0))
	{
		return;	
	}
	
	if ($("#winipmode").val()=="static"){
		if(!CheckDIPadd(g_winipaddress,'winIPAddresstips','jsipAddress'))
		{
			return;	
		}
		if(!CheckMaskIP(g_winsubnetmask,'winsubnetmasktips','MmaskAddress'))
		{
			return;	
		}
		if(!CheckIPadd(g_windefaultgateway,'windefaultgatewaytips','MDefaultGatewayAddress'))
		{
			return;	
		}
		
	}
	
	if ($("#winautodns").val()=="true"){
		if(!CheckIPadd(g_windns1,'winjsdns1tips','MPrimaryDNS',0))
		{
			return;	
		}
		if(!CheckIPadd(g_windns2,'winjsdns2tips','MPrimaryDNS1',0))
		{
			return;	
		}
	}
	var szXml = "<wifiinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		//szXml += "<bssid>"+g_winSSID+"</bssid>";
		szXml += "<ssid>"+g_winSSID+"</ssid>";
		szXml += "<password>"+g_winpassword+"</password>";
		if($("#SubEncrypttype").css("display") !== "none") {
			szXml += "<encrypttype>"+$("#winencrypttype").val()+"</encrypttype>";
		}
		if($("#SubSecuritytype").css("display") !== "none") {
			szXml += "<securitytype>"+$("#winsecuritytype").val()+"</securitytype>";
		}
		szXml += "<v4>"
			szXml += "<addresstype>"+$("#winipmode").val()+"</addresstype>";
		if($("#winipmode").val()=="static"){
		  szXml += "<ipaddress>"+g_winipaddress+"</ipaddress>";
		  szXml += "<subnetmask>"+g_winsubnetmask+"</subnetmask>";
		  szXml += "<defaultgateway>"+g_windefaultgateway+"</defaultgateway>";
	   }
		szXml += "<autodns>"+$("#winautodns").val()+"</autodns>";
		szXml += "<dnsserver1>"+g_windns1+"</dnsserver1>";
		szXml += "<dnsserver2>"+g_windns2+"</dnsserver2>";
	szXml += "</v4>"
 	szXml += "</wifiinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/wifilist/add"
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
					GetWlanState();  //获取状态
					Getwifilist();    //WIFI连接列表-信息获取  id //all 全部  单个信息
					Gethotspotlist();  //热点扫描信息获取
				}
				else
				{
					szRetInfo=  m_szErrorState+m_szError1;	
					//$("#SetResultTips").html(szRetInfo);
					//setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
				}
			});
			
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});
};
/*************************************************
Function:		delwifi
Description:	删除wifi连接列表
Input:			无			
Output:			无
return:			无				
*************************************************/
function delwifi(event,sid){
	event.stopPropagation();    //  阻止事件冒泡
	var szXml = "<wifiinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<bssid>"+m_szwifilist[sid-1][0]+"</bssid>";
  	szXml += "<ssid>"+m_szwifilist[sid-1][1]+"</ssid>";
 	szXml += "</wifiinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/wifilist/delete"
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
					GetWlanState();  //获取状态
					Getwifilist();    //WIFI连接列表-信息获取  id //all 全部  单个信息
					Gethotspotlist();  //热点扫描信息获取
				}
				else
				{
					szRetInfo=  m_szErrorState+m_szError1;	
					//$("#SetResultTips").html(szRetInfo);
					//setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
				}
			});
			
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj);
		}
	});
};
/*************************************************
Function:		CheckWifiDNS
Description:	切换DNS
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheckWifiDNS(obj){
	return;
	if($(obj).prop("checked")){ //选中
	  $(obj).val(true).prop("checked", true);
	  $("#windns1").val("").prop("disabled",true)
	  $("#windns2").val("").prop("disabled",true)
	}else{
	  $(obj).val(false).prop("checked", false);
	  $("#windns1").prop("disabled",false)
	  $("#windns2").prop("disabled",false)
	}
};

/*************************************************
Function:		winaddresstype
Description:	切换IP模式
Input:			无			
Output:			无
return:			无				
*************************************************/
function winaddresstype(obj,type){
	/*if($(obj).prop("checked")){ //选中
	  $(obj).val(true).prop("checked", true);
	  $("#windns1").val("").prop("disabled",true)
	  $("#windns2").val("").prop("disabled",true)
	}else{
	  $(obj).val(false).prop("checked", false);
	  $("#windns1").prop("disabled",false)
	  $("#windns2").prop("disabled",false)
	}*/
	//return;
  var addresstype=$("#winipmode").val();
  if (addresstype=="dynamic"){  //dhcp
	   $("#winipaddress").prop("disabled",true);
	   $("#winsubnetmask").prop("disabled",true);
	   $("#windefaultgateway").prop("disabled",true);
	   
	   $("#winautodns").val(false).prop("checked", false); 
	   
	  $("#windns1").prop("disabled", false);
	  $("#windns2").prop("disabled", false)
		 /*if (autodnsv4=="true"){
			 $("#winautodns").val(true).prop("checked", true);
			 $("#windns1").prop("disabled", true);
			 $("#windns2").prop("disabled", true)
		  }else{
			$("#winautodns").val(false).prop("checked", false);
			$("#windns1").prop("disabled",false)
			$("#windns2").prop("disabled",false)
		  };*/
	 }else{
		 $("#winipaddress").prop("disabled",false);
	     $("#winsubnetmask").prop("disabled",false);
	     $("#windefaultgateway").prop("disabled",false);
		 
		$("#winautodns").val(false).prop("checked", false).prop("disabled", true); 
		$("#windns1").prop("disabled",false);
	    $("#windns2").prop("disabled",false);
	}
};

function TCPIPpost() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(TCPIPpost);
pr(TCPIPpost).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["tcpip", "TcpIPPost"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initTCPIPpost();
	$("#divHttpsPort").hide();
}
/*************************************************
Function:		initTCPIPpost
Description:	端口
Input:			无			
Output:			无
return:			无				
*************************************************/
function initTCPIPpost()
{
	GetPort();
	autoResizeIframe();
}
/*************************************************
Function:		GetPort
Description:	获取端口			
*************************************************/
function GetPort()
{
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/port"
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
			$(xmlDoc).find("httpport").each(function(i){ 
				httpportvaluemin=$(this).attr('min');
			    httpportvaluemax=$(this).attr('max');
				httpporttext=$(this).text();
				$("#httpport").val($(this).text()).attr('maxlength' , httpportvaluemax.length); 
			    $("#fixedhttpportTips").html(httpportvaluemin+"~"+httpportvaluemax)
				
			});
			$(xmlDoc).find("httpsport").each(function(i){ 
			    httpsportvaluemin=$(this).attr('min');
			    httpsportvaluemax=$(this).attr('max');
				httpsporttext=$(this).text();
				$("#httpsport").val($(this).text()).attr('maxlength' , httpsportvaluemax.length); 
			    $("#fixedhttpsportTips").html(httpsportvaluemin+"~"+httpsportvaluemax)
			}); 
			$(xmlDoc).find("rtspport").each(function(i){ 
			    rtpsportvaluemin=$(this).attr('min');
			    rtpsportvaluemax=$(this).attr('max');
				rtpsporttext=$(this).text();
				$("#rtpsport").val($(this).text()).attr('maxlength' , rtpsportvaluemax.length); 
			    $("#fixedrtpsportTips").html(rtpsportvaluemin+"~"+rtpsportvaluemax)
			}); 

		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//保存端口
function SavePost(obj){
	var httpport=$("#httpport").val();
	var rtpsport =$("#rtpsport ").val();
	var httpsport=$("#httpsport").val();
	if (!CheckTypePort(httpport,"HttpPortTips",'jsHttpPortParam',Number(httpportvaluemin),Number(httpportvaluemax)))
	{
	   return;
	}
	if (!CheckTypePort(rtpsport,"RtspPortTips",'jsRtspPortParam',Number(httpsportvaluemin),Number(httpsportvaluemax)))
	{
	   return;
	}
	if (!CheckTypePort(httpsport,"HttpsPortTips",'jsHttpsPortParam',Number(rtpsportvaluemin),Number(rtpsportvaluemax)))
	{
	   return;
	}
	var szXml = "<networkportinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<httpport>"+httpport+"</httpport>";
	szXml += "<httpsport>"+httpsport+"</httpsport>";
	szXml += "<rtspport>"+rtpsport +"</rtspport>";
	szXml += "</networkportinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/port"
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
					GetPort();
				}
				else if("3" == state){//重启退到登录页
					$.cookie('authenticationinfo',null);
					$.cookie('page',null);
					$.cookie('UserNameLogin',null)
					$.cookie('UserPassLogin',null);
					$.cookie('curpage',null);
					$.cookie('anonymous',null);
					$.cookie('VersionSession',null);
					top.location.href = "/";
					szRetInfo="";
				}
				else if("5" == state)	//OK
				{
					 parent.$("#header").hide();
					 parent.$("#content").removeClass().addClass("ipeditmain").removeAttr("style").html(getNodeValue('jsnewip3'));
					 $.cookie('username',null);
					 $.cookie('page',null);
					 $.cookie('menu_onemenu',null);
					 $.cookie('menu_twomenu',null);
					 $.cookie('tabSystemMaintenance_curTab',null);
					 szRetInfo="";
					 return;
				}
				else if("230" == state)//230 操作失败，设备正在恢复，请稍候重新登录
				{ 
					parent.$("#header").hide();
					parent.$("#content").removeClass().addClass("ipeditmain").removeAttr("style").html(getNodeValue('jsnewip4'));
					$.cookie('authenticationinfo',null);
					$.cookie('page',null);
					$.cookie('UserNameLogin',null)
					$.cookie('UserPassLogin',null);
					$.cookie('curpage',null);
					$.cookie('anonymous',null);
					$.cookie('VersionSession',null);
					szRetInfo="";
					return;
				}
				else
				{
					szRetInfo=  m_szErrorState+m_szError1;
				}
				$("#SetResultTipsPost").html(szRetInfo);
				setTimeout(function(){$("#SetResultTipsPost").html("");},5000);  //5秒后自动清除
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,"SavePort");
			GetPort();
		}
	});
};