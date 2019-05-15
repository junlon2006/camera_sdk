//var g_szVideoInfoXml = "";
var encchnsArr=new Array();
var currentStepgb=0;
var currentStepAlarm=0;
var UserNameLogin = $.cookie('UserNameLogin');
var max_line_numgb=0;
var CruiseGBChange=0;
var CruiseAlarmChange=0;
var accessprotocol = {
	tabs: null   // 接入协议视频配置页面的tabs对象引用
};

/*************************************************

*************************************************/
function AccessProtocol() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(AccessProtocol);
pr(AccessProtocol).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["accessprotocol", "AccessProtocolMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initAccessProtocol();
}



/*************************************************
Function:		initAccessProtocol
Description:	初始化接入协议
Input:			无			
Output:			无
return:			无				
*************************************************/
function initAccessProtocol()
{	
	autoResizeIframe();
}

function VSIP() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(VSIP);
pr(VSIP).update = function() {
	
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["accessprotocol", "VSIPMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initVSIP();	
}
/*************************************************
Function:		initVSIP
Description:	初始化KEDA VSIP
Input:			无			
Output:			无
return:			无				
*************************************************/
function initVSIP()
{	
    
	GetVSIP();
	autoResizeIframe();
}
/*************************************************
Function:		GetVSIP
Description:	获取VSIP
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetVSIP()
{	
     var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/kedavsip"
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
			    $("#checkvsip").val(true);
				$("#checkvsip").prop("checked", true);
		    }else{
				$("#checkvsip").val(false);
				$("#checkvsip").prop("checked", false);
			}
			
			
			
			$(xmlDoc).find("addresstype").each(function(i){ 
		  	 	var k_addresstypexml= $(this).text();
				var selectCode=document.getElementById("vsipaddresstype")
				for (i=0;i<selectCode.length;i++){
				 if(selectCode.options[i].value==k_addresstypexml){  
					selectCode.options[i].selected=true;  
					}
			   };
			   
			   if (k_addresstypexml=="ip"){
				   $("#subplaturl").hide();
		           $("#subplatip4").show();
				 }else{
					$("#subplaturl").show();
		            $("#subplatip4").hide(); 
				}
			});
			
			$("#vsipipaddrv4").val($(xmlDoc).find('ipaddrv4').eq(0).text() )  //IPV4
			$("#vsipurl").val($(xmlDoc).find('url').eq(0).text() )  //URL
			$("#vsipipport").val($(xmlDoc).find('ipport').eq(0).text() )  //端口
			
			
			
			$("#vsipsendnatpac").val($(xmlDoc).find('sendnatpac').eq(0).text() )//发送NAT探测包
			$("#vsipselfnetwork").val($(xmlDoc).find('selfnetwork').eq(0).text() )//支持自动组网NAT探测包
			$("#vsipuuid").val($(xmlDoc).find('uuid').eq(0).text() )//入网设备UUID
			$("#vsipnetpassword").val($(xmlDoc).find('netpassword').eq(0).text() )//入网设备密码
			
			if("true" == $(xmlDoc).find('sendnatpac').eq(0).text())
		    {
			    $("#vsipsendnatpac").val(true);
				$("#vsipsendnatpac").prop("checked", true);
		    }else{
				$("#vsipsendnatpac").val(false);
				$("#vsipsendnatpac").prop("checked", false);
			}
			if("true" == $(xmlDoc).find('selfnetwork').eq(0).text())
		    {
			    $("#vsipselfnetwork").val(true);
				$("#vsipselfnetwork").prop("checked", true);
		    }else{
				$("#vsipselfnetwork").val(false);
				$("#vsipselfnetwork").prop("checked", false);
			}
			
			 
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
}
//平台选择
function Checkplattype(obj){
   	if ($(obj).val()=="plat"){
		$("#subslectipadd").show();
		$("#subplatip4").show();
		//$("#subplatip6").show();
		$("#subplaturl").show();
		$("#subplatport").show();
		$("#subbalanceraddip4").hide();
		//$("#subbalanceraddip6").hide();
		$("#subbalancerpost").hide();
		
		  if ($("#vsipaddresstype").val()=="ip"){
			    $("#subplaturl").hide();
				$("#subplatip4").show();
				//$("#subplatip6").show();
			 }else{
				 $("#subplaturl").show();
			   	 $("#subplatip4").hide();
				// $("#subplatip6").hide();
				}
		
		
	}else{
		$("#subbalanceraddip4").show();
		//$("#subbalanceraddip6").show();
		$("#subbalancerpost").show();
		$("#subslectipadd").hide();
		$("#subplatip4").hide();
		//$("#subplatip6").hide();
		$("#subplaturl").hide();
		$("#subplatport").hide();
	}
}
//切换平台地址
function Checkaddresstype(obj){
	if ($(obj).val()=="ip"){
		$("#subplaturl").hide();
		$("#subplatip4").show();
		//$("#subplatip6").show();
	}else{
		$("#subplaturl").show();
		$("#subplatip4").hide();
		//$("#subplatip6").hide();
	}
};

//保存
function SaveVSIP(obj,tab){
	var enabled=$("#checkvsip").val();
	var plattype=$("#vsipplattype").val();
	var plattype=$("#vsipplattype").val();
	var addresstype=$("#vsipaddresstype").val();
	
	var vsipurl=$("#vsipurl").val();
	var vsipipaddrv4=$("#vsipipaddrv4").val();
	
	
	var vsipipaddrv6=$("#vsipipaddrv6").val();
	var vsipipport=$("#vsipipport").val();
	//var vsipbalanceripaddrv4=$("#vsipbalanceripaddrv4").val();
	var vsipbalanceripaddrv6=$("#vsipbalanceripaddrv6").val();
	//var vsipbalancerpost=$("#vsipbalancerpost").val();
	
	var vsipsendnatpac=$("#vsipsendnatpac").val();
	var vsipselfnetwork=$("#vsipselfnetwork").val();
	var vsipuuid=$("#vsipuuid").val();
	var vsipnetpassword=$("#vsipnetpassword").val();
	
	/*if(!CheckIPadd(vsipbalanceripaddrv4,'vsipbalanceripaddrv4tips','lavsipipv4'))
	{
	    return;
	}*/
	
	/*if(!CheackServerIDIntNum(vsipbalancerpost,'vsipbalancerposttips','lavsippost',0,65535))
	{
	    return;
	}*/
	if (addresstype=="ip"){
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
	
	
	if(!CheackServerIDIntNum(vsipipport,'vsipipporttips','MRplatformpost',1,65535))
	{
	    return;
	}
	
	if(!CheckLetterNumber(vsipuuid,'vsipuuidtips','Mvsipuuid',0,32))
	{
	    return;
	}
	if(!CheckLetterNumber(vsipnetpassword,'vsipnetpasswordtips','Mvsipnetpassword',0,32))
	{
	    return;
	}
	var szXml = "<kedavsipinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enabled>"+enabled+"</enabled>";
	szXml += "<addresstype>"+addresstype+"</addresstype>";
	if (addresstype=="ip"){
		szXml += "<ipaddrv4>"+vsipipaddrv4+"</ipaddrv4>";
	}else{
		szXml += "<url>"+vsipurl+"</url>";
	}
	szXml += "<ipport>"+vsipipport+"</ipport>";
	szXml += "<sendnatpac>"+vsipsendnatpac+"</sendnatpac>";
	szXml += "<selfnetwork>"+vsipselfnetwork+"</selfnetwork>";
	szXml += "<uuid>"+vsipuuid+"</uuid>";
	szXml += "<netpassword>"+vsipnetpassword+"</netpassword>";
 	szXml += "</kedavsipinfo>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/kedavsip"
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
					if (tab=="save")
					{
						szRetInfo=  m_szSuccessState+m_szSuccess1;
						$("#SetResultTipsVSIP").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsVSIP").html("");},5000);  //5秒后自动清除
					}
					else if (tab=="up")
					{
						showmenuconfig("IPAddress","0","FastSetConfig")
						$("#aAccessProtocol").removeClass("current")
						$("#aIPAddress").addClass("current")
						//$.cookie('menu_twomenu','1_0');
					}
					else if(tab=="down")
					{
						if (m_onvif==true)
						{
							$("#mOnvif").click();
							ia(Onvif).update();
						}
						else if(m_gb28181==true)
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
				}
				else
				{
					szRetInfo=  m_szErrorState+m_szError1
					$("#SetResultTipsVSIP").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsVSIP").html("");},5000);  //5秒后自动清除
				}
			});
		},error: function(xhr, textStatus, errorThrown)
		{
			ErrStateTips(xhr,obj,'SaveVsip');
		}
	});
};
function initAccessProtocol()
{	
	autoResizeIframe();
}

function Onvif() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Onvif);
pr(Onvif).update = function() {
	if ($.cookie('UserNameLogin')=="admin"){
		authmode();
		$("#subauthmode").show();
	}
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["accessprotocol", "OnvifMain"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initOnvif();	
	
}
/*************************************************
Function:		initOnvif
Description:	初始化Onvif
Input:			无			
Output:			无
return:			无				
*************************************************/
function initOnvif()
{	
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/onvif"
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
			
		  	 var k_onvifenable= $(this).text();
			  if (k_onvifenable=="true"){
					$("#checkonvif").val(true);
					$("#checkonvif").prop("checked", true);
				}else{
					$("#checkonvif").val(false);
					$("#checkonvif").prop("checked", false);
				};
			
			});
			$(xmlDoc).find("url").each(function(i){ 
		  	 	$("#Onvifurl").val($(this).text());
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
	autoResizeIframe();
}
//获取鉴权方式
function authmode(){
	var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/authmode"
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
			 var authentication = $(xmlDoc).find('authentication').eq(0).text();
			if (authentication=="ws"){
				$("input[name='authmode'][value='ws']").attr("checked",true);
			}else if(authentication=="none"){
				$("input[name='authmode'][value='none']").attr("checked",true);
			}
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
	});
};
/*************************************************
Function:		SaveOnvif
Description:	保存Onvif
Input:			无			
Output:			无
return:			无				
*************************************************/
function SaveOnvif(obj,tab)
{	
	var enabled=$("#checkonvif").val();
	var Onvifurl=$("#Onvifurl").val();
	if ($.cookie('UserNameLogin')=="admin")
	{
		var szXml = "<onvifinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<enabled>"+enabled+"</enabled>";
		szXml += "</onvifinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/onvif"
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
						Authmode(obj,tab);
					}else{
						szRetInfo=  m_szErrorState+m_szError1
						$("#SetResultTipsOnvif").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除
					}
				});
	          
			},error: function(xhr, textStatus, errorThrown)
			{
				//ErrStateTips(xhr,obj);
				var Docxml =xhr.responseText;
				 var xmlDoc = GetparseXmlFromStr(Docxml);
				 $(xmlDoc).find("statuscode").each(function(i){ 
					 var state= $(this).text();
					 if("11"==state ||  "15"==state || "24"==state){  //11为XML解析错误
						szRetInfo = m_szErrorState + m_szError1;  //保存失败
						$("#SetResultTipsOnvif").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除
					}
					else if("5"==state)
					{
						//szRetInfo = m_szErrorState + m_szError1;  //保存失败
						alert(m_Mauthorization)  //没有权限
					}
				});
			}
		});
	}
	else
	{
		var szXml = "<onvifinfo version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
		szXml += "<enabled>"+enabled+"</enabled>";
		szXml += "</onvifinfo>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/onvif"
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
						//szRetInfo = m_szSuccessState+"保存成功";
						if (tab=="save")
						{
							szRetInfo=  m_szSuccessState+m_szSuccess1;	
							$("#SetResultTipsOnvif").html(szRetInfo);
							setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除
						}
						else if (tab=="up")
						{
						   $("#mVSIP").click();
							ia(VSIP).update();
						}
						else if(tab=="down")
						{
							javascript:ia(GB28181).update()
							$("#mOnvif").removeClass("current")
							$("#mGB28181").addClass("current")
							$("#Onvif").hide();
							$("#divGB28181").show();
							//$.cookie('tabAccessProtocol_curTab','2');	
						}
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
						$("#SetResultTipsOnvif").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除
	
					}
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveOnvif");
			}
		});
	}
	
	
	
}
/*************************************************
Function:		Authmode
Description:	保存Authmode
Input:			无			
Output:			无
return:			无				
*************************************************/
function Authmode(obj,tab)
{	
	var authmode=$("input[name='authmode']:checked").val();
	var szXml = "<authmode version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<authentication>"+authmode+"</authentication>";
 	szXml += "</authmode>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/authmode"
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
					//szRetInfo = m_szSuccessState+"保存成功";
					if (tab=="save")
					{
						szRetInfo=  m_szSuccessState+m_szSuccess1;
						$("#SetResultTipsOnvif").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除
					}
					else if (tab=="up")
					{
						
						if (m_vsip==true)
						{
							$("#mVSIP").click();
							ia(VSIP).update();
						}
						else
						{
							$("#aIPAddress").click();
							showmenuconfig("IPAddress","0","FastSetConfig")
						}
					}
					else if(tab=="down")
					{
						
						if(m_gb28181==true)
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
					
				}else{
					szRetInfo=  m_szErrorState+m_szError1;
					$("#SetResultTipsOnvif").html(szRetInfo);
					setTimeout(function(){$("#SetResultTipsOnvif").html("");},5000);  //5秒后自动清除

				}
			});
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveOnvif");
			}
	});
}




function GB28181(){
	SingletonInheritor.implement(this);
	}
SingletonInheritor.declare(GB28181);
pr(GB28181).update = function() {
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["accessprotocol", "GB28181Main"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	 
	  $("#SelectGB28181").empty();
	 for (i=1;i<=k_Gb28181;i++)
	{
	  $("<option name='"+'MRegistrationplatform'+(i)+"' value='" + i + "' >"+getNodeValue('MRegistrationplatform'+(i))+"</option>").appendTo("#SelectGB28181");
	}
        $("#expand").keydown(function (e) {
            var curKey = e.which;
            if (curKey == 13) {
               // $("#lbtn_JumpPager").click();
                return false;
            }
        });
   
	 $("#subexpand1").toggle(function(){
         $("#subexpand").show();
         $("#MexpandTips").html("<<")
           autoResizeIframe();
       },function(){
         $("#subexpand").hide();
		 $("#MexpandTips").html(">>")
         autoResizeIframe();
       });
    
	initGB28181();
}
/*************************************************
Function:		initGB28181
Description:	初始化GB28181
Input:			无			
Output:			无
return:			无				
*************************************************/
function initGB28181()
{	
   // GB28181GetCap("gb28181=true");//获取国标能力集
	GetGb28181();
}
function GB28181GetCap(obj){
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/getcap?"+obj
	$.ajax({
		type: "post",
		url:szURL,
		processData: false,//不转换
		async: false,  //同步
		data: xmlDoc,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		    var Docxml =xhr.responseText;
		    var xmlDoc = GetparseXmlFromStr(Docxml);
			if($(xmlDoc).find("gb28181").length > 0){
				$(xmlDoc).find("gb28181").each(function(i){ 
				   var k_Gb28181=$(this).text();
				  $("#SelectGB28181").empty();
						for (i=1;i<=k_Gb28181;i++)
						{
							$("<option name='"+'MRegistrationplatform'+(i)+"' value='" + i + "' >"+getNodeValue('MRegistrationplatform'+(i))+"</option>").appendTo("#SelectGB28181");
						}
					
				});
				GetGb28181();
			}

		}/*,error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}*/
	});
};
/*************************************************
Function:		GetGb28181
Description:	获取gb28181
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetGb28181()
{	
	 var g_optGB28181=$("#SelectGB28181").val();
	 var szXml = "<contentroot>";
	    szXml +=$.cookie('authenticationinfo');
 	    szXml += "</contentroot>";
	    var xmlDoc = GetparseXmlFromStr(szXml);
	//var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/gb28181"
	 if (typeof(g_optGB28181)=="undefined")
	 {
		 var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/gb28181/1";
	 }
	 else
	 {
		var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/gb28181/"+g_optGB28181;
	 }
	
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
			$(xmlDoc).find("enable").each(function(i){ 
		  	 var k_gb28181enable= $(this).text();
			   if (k_gb28181enable=="true"){
				$("#checkgb28181").val(true);
				$("#checkgb28181").prop("checked", true);
				}else{
					$("#checkgb28181").val(false);
					$("#checkgb28181").prop("checked", false);
				};
			});
			
			
			$(xmlDoc).find("localport").each(function(i){ 
		  	 	
			    localportvaluemin=$(this).attr('min');
			    localportvaluemax=$(this).attr('max');
				$("#localport").val($(this).text()).attr('maxlength' , localportvaluemax.length);  //本地端口ID
			    $("#fixedlocalportTips").html(localportvaluemin+"~"+localportvaluemax)
			});
			
			$(xmlDoc).find("netid").each(function(i){ 
		  	 	$("#gbnetid").val($(this).text());     //入网ID
			});
			$(xmlDoc).find("devname").each(function(i){ 
		  	 	$("#gbdevname").val($(this).text());     //设备名称
			});
			
			$(xmlDoc).find("platid").each(function(i){ 
		  	 	$("#gbplatid").val($(this).text());     //平台ID
			});
			
			$(xmlDoc).find("plataddrv4").each(function(i){ 
		  	 	$("#gbplataddrv4").val($(this).text());     //ipv4
			});
			
			$(xmlDoc).find("plataddrv6").each(function(i){ 
		  	 	$("#gbplataddrv6").val($(this).text());     //ipv6
			});
			
			$(xmlDoc).find("platport").each(function(i){ 
		  	 	
				platportvaluemin=$(this).attr('min');
			    platportvaluemax=$(this).attr('max');
				$("#gbplatport").val($(this).text()).attr('maxlength' , platportvaluemax.length);  //平台端口
			    $("#fixedgbplatportTips").html(platportvaluemin+"~"+platportvaluemax)
			});
			
			$(xmlDoc).find("username").each(function(i){ 
				 usernamegb28181max=$(this).attr('max');
				$("#gbusername").val($(this).text()).attr('maxlength' , usernamegb28181max); //注册用户名
			});
			
			$(xmlDoc).find("userpassword").each(function(i){ 
		  	 	userpasswordgb28181max=$(this).attr('max');
				$("#gbuserpassword").val($(this).text()).attr('maxlength' , userpasswordgb28181max); //注册密码
			});
			
			$(xmlDoc).find("alarmnum").each(function(i){ 
		  	 	$("#gbalarmnum").val($(this).text());     //告警数目
			});
			
			$(xmlDoc).find("relettime").each(function(i){ 
		  	 	$("#gbrelettime").val($(this).text());     //续租时间
			});
			
			$(xmlDoc).find("heartbeat").each(function(i){ 
		  	 	$("#gbheartbeat").val($(this).text());     //心跳间隔
			});
			
			$(xmlDoc).find("owner").each(function(i){ 
		  	 	$("#owner").val($(this).text());     //设备归属
				
			});
			
			$(xmlDoc).find("civilcode").each(function(i){ 
		  	 	$("#civilcode").val($(this).text());     //行政区域
			});
			
			$(xmlDoc).find("policergn").each(function(i){ 
		  	 	$("#policergn").val($(this).text());     //警区
			});
			
			$(xmlDoc).find("setupaddress").each(function(i){ 
		  	 	$("#setupaddress").val($(this).text());     //安装地址
			});
			
			$(xmlDoc).find("expand").each(function(i){ 
			   var g_expandtext=$(this).text();
			    $("#expandopt").empty();
				var arr = $(this).attr('opt').split(","); 
				for (i=0;i<arr.length;i++){
				   $("#expandopt").append( "<option value="+arr[i]+">"+arr[i]+"</option>")
				};
				 var g_expandtext1=g_expandtext.replace(new RegExp(/(,)/g),'\n');
				 //var g_expandtext2=g_expandtext1.substring(0, g_expandtext1.length - 1);  //删除最后一个逗号
				$("#expand").val(g_expandtext1);     //扩展配置
			}); 
			
		
		//视频编码开始
		
		$(xmlDoc).find("encchns").each(function(i){ 
		    g_gbencchns_size=$(this).attr('size');
			g_gbencchns_max=$(this).attr('max');
			if (g_gbencchns_size==0 && g_gbencchns_max==0){
				$("#TabEncchns").hide(); 
			  	$("#Subencchns").hide();
			}
			else
			{
				 $("#TabEncchns").show();
				 $("#Subencchns").show();
				 $("#TbodyEncchns").empty();
				 var g_encchns=$(this).find('chn');
				 
				 for (i=1;i<=g_gbencchns_size;i++)
				 {
					var encchnsid = $(this).find('id').eq(i-1).text();
					var encchnsname = $(this).find('name').eq(i-1).text();
					var encChange = $(this).find('streamtype').eq(i-1).text();
					$("#TbodyEncchns").append("<tr align='center' onclick='lineclicgb(this)' class='ListTr'>"
					   +"<td class='td1' style='display:none'>"+i+"</td>"
					   +"<td class='ListTd' id='encchnstdid"+parseInt(i)+"'>"+encchnsid+"</td>"
					   +"<td class='ListTd' id='winencchnsname"+parseInt(i)+"' width='200px'>"+encchnsname+"</td>"
					   +"<td class='ListTd' id='winencChange"+parseInt(i)+"'>"+"<label name='StreamTypeInOpt"+parseInt(encChange)+"'>"+getNodeValue('StreamTypeInOpt'+encChange)+"</label>"+"</td>"
					   +"<td class='ListTd' id='StreamTypenone"+parseInt(i)+"'  style='display:none'>"+encChange+"</td>"
				   +"</tr>");
				 }
				 CruiseGBChange=0;
				    var _len = $("#TbodyEncchns tr").length; 
					 if (g_gbencchns_max <= _len)
					 {
					   $("#addencchns").prop("disabled", true);
					}
					else
					{
						$("#addencchns").prop("disabled", false);
					}
			}
		});
		
			//告警开始
			$(xmlDoc).find("alarmchns").each(function(i){ 
			   g_alarmchns_size=$(this).attr('size');
			  
			   g_alarmchns_max=$(this).attr('max');
				if (g_alarmchns_size==0  && g_alarmchns_max==0){
					$("#TabalArmchns").hide(); 
				    $("#SubArmchns").hide(); 
				}
				else{
					$("#TabalArmchns").show(); 
				   $("#SubArmchns").show();
				    $("#TbodyAlarmchns").empty();
				   for (i=1;i<=g_alarmchns_size;i++)
					 {
						var g_alarmchnsindex = $(this).find('index').eq(i-1).text();
						var g_alarmchnsid = $(this).find('id').eq(i-1).text();
						var g_alarmchnsname = $(this).find('name').eq(i-1).text();
						$("#TbodyAlarmchns").append("<tr align='center' onclick='lineclicalarm(this)' class='ListTr'>"
						   +"<td class='td1' style='display:none'>"+g_alarmchnsindex+"</td>"
						   +"<td class='ListTd' id='alarmchnsid"+parseInt(i)+"'>"+g_alarmchnsid+"</td>"
						   +"<td class='ListTd' id='alarmchnsname"+parseInt(i)+"'>"+g_alarmchnsname+"</td>"
					   +"</tr>");
					 };
					CruiseGBChange=0;
					var _len = $("#TbodyAlarmchns tr").length; 
					 if (g_alarmchns_max <= _len)
					 {
					   $("#AddAlarmChns").prop("disabled", true);
					}
					else
					{
						$("#AddAlarmChns").prop("disabled", false);
					}
				}
			});
			
		    autoResizeIframe();
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr);
			}
        
	});
	
};




/*************************************************
Function:		AddGB
Description:	增加国际通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function AddGB(obj){
	//pr(GB28181).update();
	 $("#divWinTable").modal(
		 {
			"close":false,
			"autoResize":true,
			//"position":[150]
			"position":[350]
		 }
     );
	 
	 if (obj=='add'){
		 
		 $("#WinEncchnsTitle").html("<label name='AddDigitalIpBtn'>"+getNodeValue('AddDigitalIpBtn')+"</label>");//添加
		 $("#btnAddencchns").show();
		 $("#btnEditencchns").hide();
		 $("#winStreamType").empty();
		 for (var i = 1; i <= g_gbencchns_max;i++){
			$("<option  name='"+'StreamTypeInOpt'+(i)+"' value='" + i + "' >" + getNodeValue('StreamTypeInOpt'+(i)) + "</option>").appendTo("#winStreamType");
		 };
	 }
	 else
	 {
		 for (i=1;i<=g_gbencchns_max;i++){
			$("<option  name='"+'StreamTypeInOpt'+(i)+"' value='" + i + "' >" + getNodeValue('StreamTypeInOpt'+(i)) + "</option>").appendTo("#winStreamType");
	     }
		 $("#btnAddencchns").hide();
		 $("#btnEditencchns").show();
		$("#WinEncchnsTitle").html("<label name='MdfDigitalIpBtn'>"+getNodeValue('MdfDigitalIpBtn')+"</label>");//修改
		var upStep=currentStepgb;
		var upwinStreamType=$('#winencChange'+upStep).html();  //upwinStreamType  <label name="StreamTypeInOpt1">主码流</label> 
		var upwinStreamType_num=$(upwinStreamType).attr("name").split('StreamTypeInOpt')[1];
		var Select_alarmnum=document.getElementById("winStreamType")
		for (i=0;i<Select_alarmnum.length;i++){
		 if(Select_alarmnum.options[i].value==upwinStreamType_num){  
			Select_alarmnum.options[i].selected=true;  
			}
	   }
	   var upencchnstdid=$('#encchnstdid'+upStep).text();  
	   var upwinencchnsname=$('#winencchnsname'+upStep).text(); 
	   $("#wingbencvideoID").val(upencchnstdid)
	   $("#wingbencvideoname").val(upwinencchnsname)
	 }
	  
};

function wingbOKclick(obj){
   var wingbencvideoID = $('#wingbencvideoID').val();
   var wingbencvideoname = $('#wingbencvideoname').val();
   var _len = $("#TbodyEncchns tr").length; 
    if(!CheackIDIntNumgb(wingbencvideoID, 'wingbencvideoIDtips','MgbencvideoID',0,20,0))
    {
		return;
    }
    if(!checkDeviceNameValidiDevice(wingbencvideoname,'wingbencvideonametips','Mgbencvideoname',32))
    {
		return;
    }
   if (obj=='add')
   {
	   $("#TbodyEncchns").append("<tr align='center' onclick='lineclicgb(this)' class='ListTr'>"
		   +"<td class='td1' style='display:none'>"+(parseInt(_len)+parseInt(1))+"</td>"
		   +"<td class='ListTd' id='encchnstdid"+(parseInt(_len)+parseInt(1))+"'>"+$('#wingbencvideoID').val()+"</td>"
		   +"<td class='ListTd' id='winencchnsname"+(parseInt(_len)+parseInt(1))+"' width='200px'>"+$('#wingbencvideoname').val()+"</td>"
		   +"<td class='ListTd' id='winencChange"+(parseInt(_len)+parseInt(1))+"'>"+"<label name='StreamTypeInOpt"+parseInt($('#winStreamType').val())+"'>"+getNodeValue('StreamTypeInOpt'+$('#winStreamType').val())+"</label>"+"</td>"
		   +"<td class='ListTd' id='StreamTypenone"+(parseInt(_len)+parseInt(1))+"'  style='display:none'>"+$('#winStreamType').val()+"</td>"
	   +"</tr>");
	   CruiseGBChange=1;
   }
   else
   {
	  $('#encchnstdid'+currentStepgb).html($('#wingbencvideoID').val());
	   $('#winencchnsname'+currentStepgb).html($('#wingbencvideoname').val());
	   $('#winencChange'+currentStepgb).html("<label name='StreamTypeInOpt"+parseInt($('#winStreamType').val())+"'>"+getNodeValue('StreamTypeInOpt'+$('#winStreamType').val())+"</label>");
	   $('#StreamTypenone'+currentStepgb).html($('#winStreamType').val());
	 
   }
   
   if (g_gbencchns_max <= $("#TbodyEncchns tr").length)
   {
		  $("#addencchns").prop("disabled", true);
   }
   else
   {
		 $("#addencchns").prop("disabled", false);
   }
    $("#gbencchnsedit").prop("disabled",true)
	$("#Delencchns").prop("disabled",true)
	$('#TbodyEncchns tr').each(function(){$(this).css("background-color","#ffffff");}); 
	currentStepgb=0;
   $.modal.impl.close();
	autoResizeIframe();
};


function lineclicgb(line){
	$('#TbodyEncchns tr').each(function(){$(this).removeClass().addClass("treven");});
    var seqIPclick=$(line).children("td").html();
   $(line).removeClass().addClass("trOdd").removeAttr("style");
   currentStepgb=seqIPclick;
   
   $("#gbencchnsedit").prop("disabled", false);
   $("#Delencchns").prop("disabled", false);
    var _len = $("#TbodyEncchns tr").length; 
   if (g_gbencchns_max <= _len)
	 {
	   $("#addencchns").prop("disabled", true);
	}
	else
	{
		$("#addencchns").prop("disabled", false);
	}
};

function DelGB(){
    $("#TbodyEncchns tr").each(
		function(){
		  var seqtd=parseInt($(this).children("td").html());
		  if(seqtd==currentStepgb) $(this).remove();
		  if(seqtd>currentStepgb) $(this).children("td").each(function(i){if(i==0){$(this).html(seqtd-1)}});}
   );
  
  var _len =  $("#TbodyEncchns tr").length; 
	 if (g_gbencchns_max <= _len)
	 {
	   $("#addencchns").prop("disabled", true);
	}
	else
	{
		$("#addencchns").prop("disabled", false);
	}
	
	$("#TbodyEncchns tr").each(function(i,data) {
		$(this).children("td").next().attr("id","encchnstdid"+(i+1));
		$(this).children("td").next().next().attr("id","winencchnsname"+(i+1));
		$(this).children("td").next().next().next().attr("id","winencChange"+(i+1));
		$(this).children("td").next().next().next().next().attr("id","StreamTypenone"+(i+1));
	});
  currentStepgb=0;
  $("#gbencchnsedit").prop("disabled", true);
  $("#Delencchns").prop("disabled", true);
  CruiseGBChange=1;
  autoResizeIframe();
};




/*****告警*****/
/*************************************************
Function:		winAlarm
Description:	增加编辑告警通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function AlarmChns(obj){
	//pr(GB28181).update();
	 $("#divWinAlarm").modal(
		 {
			"close":false,
			"autoResize":true,
			//"position":[150]
			"position":[350]
		 }
     );
	 
	 if (obj=='add'){
		 
		 $("#WinAlarmTitle").html("<label name='AddDigitalIpBtn'>"+getNodeValue('AddDigitalIpBtn')+"</label>");//修改
		 $("#btnAddAlarm").show();
		 $("#btnEditAlarm").hide();
		 
	 }
	 else
	 {
		$("#WinAlarmTitle").html("<label name='MdfDigitalIpBtn'>"+getNodeValue('MdfDigitalIpBtn')+"</label>");//修改
		 $("#btnAddAlarm").hide();
		 $("#btnEditAlarm").show();
		 var upStep=currentStepAlarm;
	    $("#winAlarmID").val($('#alarmchnsid'+upStep).text())
	    $("#winAlarmName").val($('#alarmchnsname'+upStep).text())
	 }
	  
};

function winAlarm(obj){
   var winAlarmID = $('#winAlarmID').val();
   var winAlarmName = $('#winAlarmName').val();
   var _len = $("#TbodyAlarmchns tr").length; 
    if(!CheackIDIntNumgb(winAlarmID, 'winAlarmIDtips','Mgbalarmchnsid',0,20,0))
    {
		return;
    }
    if(!checkDeviceNameValidiDevice(winAlarmName,'winAlarmNametips','Mgbalarmchnsname',32))
    {
		return;
    }
   if (obj=='add')
   {
	   $("#TbodyAlarmchns").append("<tr align='center' onclick='lineclicalarm(this)' class='ListTr'>"
		   +"<td class='td1' style='display:none'>"+(parseInt(_len)+parseInt(1))+"</td>"
		   +"<td class='ListTd' id='alarmchnsid"+(parseInt(_len)+parseInt(1))+"'>"+$('#winAlarmID').val()+"</td>"
		   +"<td class='ListTd' id='alarmchnsname"+(parseInt(_len)+parseInt(1))+"'>"+$('#winAlarmName').val()+"</td>"
	   +"</tr>");
	   CruiseAlarmChange=1;
   }
   else
   {
	   $('#alarmchnsid'+currentStepAlarm).html($('#winAlarmID').val());
	   $('#alarmchnsname'+currentStepAlarm).html($('#winAlarmName').val());
   }
   
   if (g_alarmchns_max <= $("#TbodyAlarmchns tr").length)
   {
		  $("#AddAlarmChns").prop("disabled", true);
   }
   else
   {
		 $("#AddAlarmChns").prop("disabled", false);
   }
   $("#EditAlarmChns").prop("disabled",true)
	$("#DelAlarmChns").prop("disabled",true)
	$('#TbodyAlarmchns tr').each(function(){$(this).css("background-color","#ffffff");}); 
	currentStepAlarm=0;
   $.modal.impl.close();
	autoResizeIframe();
   
};


function lineclicalarm(line){
	$('#TbodyAlarmchns tr').each(function(){$(this).removeClass().addClass("treven");});
    var seqAlarmclick=$(line).children("td").html();
   $(line).removeClass().addClass("trOdd").removeAttr("style");
   currentStepAlarm=seqAlarmclick;
   
   $("#EditAlarmChns").prop("disabled", false);
   $("#DelAlarmChns").prop("disabled", false);
    var _len = $("#TbodyAlarmchns tr").length; 
   if (g_alarmchns_max <= _len)
	 {
	   $("#AddAlarmChns").prop("disabled", true);
	}
	else
	{
		$("#AddAlarmChns").prop("disabled", false);
	}
};

function DelAlarm(){
    $("#TbodyAlarmchns tr").each(
		function(){
		  var seqtd=parseInt($(this).children("td").html());
		  if(seqtd==currentStepAlarm) $(this).remove();
		  if(seqtd>currentStepAlarm) $(this).children("td").each(function(i){if(i==0){$(this).html(seqtd-1)}});}
   );
  
    var _len =  $("#TbodyAlarmchns tr").length; 
	 if (g_alarmchns_max <= _len)
	 {
	   $("#AddAlarmChns").prop("disabled", true);
	}
	else
	{
		$("#AddAlarmChns").prop("disabled", false);
	}
	
	$("#TbodyAlarmchns tr").each(function(i,data) {
		$(this).children("td").next().attr("id","alarmchnsid"+(i+1));
		$(this).children("td").next().next().attr("id","alarmchnsname"+(i+1));

	});
  currentStepAlarm=0;
  $("#EditAlarmChns").prop("disabled", true);
  $("#DelAlarmChns").prop("disabled", true);
  CruiseAlarmChange=1;
  autoResizeIframe();
};

/*****告警结束*******/
function winClean(obj){
  if (obj=="encchns")
  {
	   
	  var _len =  $("#TbodyEncchns tr").length; 
		 if (g_gbencchns_max <= _len)
		 {
		   $("#addencchns").prop("disabled", true);
		}
		else
		{
			$("#addencchns").prop("disabled", false);
		}
	  $('#TbodyEncchns tr').each(function(){$(this).css("background-color","#ffffff");}); 
	  currentStepgb=0;
	  $("#gbencchnsedit").prop("disabled", true);
	  $("#Delencchns").prop("disabled", true);
	  CruiseGBChange=1;
  }
  else if(obj=="Alarm")
  {
		  var _len =  $("#TbodyAlarmchns tr").length; 
		 if (g_alarmchns_max <= _len)
		 {
		   $("#AddAlarmChns").prop("disabled", true);
		}
		else
		{
			$("#AddAlarmChns").prop("disabled", false);
		}
	  $('#TbodyAlarmchns tr').each(function(){$(this).css("background-color","#ffffff");}); 
	  currentStepAlarm=0;
	  $("#EditAlarmChns").prop("disabled", true);
	  $("#DelAlarmChns").prop("disabled", true);
	  CruiseAlarmChange=1;
  }
  $.modal.impl.close();
}

(function($) {
    $.fn.insertContent = function(myValue, t) {
		var $t = $(this)[0];

		if (document.selection) { //ie
			this.focus();
			var sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
			sel.moveStart('character', -l);
			var wee = sel.text.length;
			if (arguments.length == 2) {
				var l = $t.value.length;
				sel.moveEnd("character", wee + t);
				t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
 
				sel.select();
			}
		} else if ($t.selectionStart || $t.selectionStart == '0') {
			var startPos = $t.selectionStart;
			
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			$t.selectionStart = startPos + myValue.length;
			$t.selectionEnd = startPos + myValue.length;
			$t.scrollTop = scrollTop;
			if (arguments.length == 2) {

				$t.setSelectionRange(startPos - t, $t.selectionEnd + t);
				this.focus();
			}
		}
		else {
			this.value += myValue;
			this.focus();
		}       
    };
})(jQuery);
/***增加扩展配置***/
function addexpand(){
	var g_expandopt=$("#expandopt").val();
	var g_expand=$("#expand").val();
	 //var g_expandopt1=g_expandopt.replace(new RegExp(/(,)/g),'\n');
	 //console.log($("#expand").val())
	 //console.log($("expand").val().indexOf(g_expandopt));
	 var str1=g_expand.indexOf(g_expandopt)
	if (str1 != -1)
	{
		//alert("数据已存在");
		$("#addexpandtips").html(getNodeValue('MDataexists'));
		setTimeout(function(){$("#addexpandtips").html("");},5000);  //5秒后自动清除
		return;
	}
	if (g_expand=="")
	{
		$("#expand").insertContent(g_expandopt+"=");
	}
	else
	{
		$("#expand").insertContent('\n'+g_expandopt+"=");  
	}
	
};

function subexpand(){
	//$("#subexpand").siblings("#subexpand").toggle();  // 隐藏/显示所谓的子行
	$("#subexpand").toggle(function(){
         $("#subexpand").hide('slow');
       },function(){
         $("#subexpand").show('fast');
       });
};
/*************************************************
Function:		SaveGb28181
Description:	保存Gb28181
Input:			无			
Output:			无
return:			无				
*************************************************/
function SaveGb28181(obj,tab)
{	
	$('#TbodyEncchns tr').each(function(){$(this).css("background-color","#ffffff");}); 
	$('#TbodyAlarmchns tr').each(function(){$(this).css("background-color","#ffffff");}); 
	$('#gbencchnsedit').prop("disabled", true);
	$('#Delencchns').prop("disabled", true);
	$('#EditAlarmChns').prop("disabled", true);
	$('#DelAlarmChns').prop("disabled", true);
	CruiseGBChange=0; 
	CruiseAlarmChange=0;
	$("#Resultgbips").html(""); 
	var g_SelectGB28181=$("#SelectGB28181").val();
	var enable=$("#checkgb28181").val();
	//var packtype=$("#packtype").val();
	var localport=$("#localport").val();
	var gbnetid=$("#gbnetid").val();
	var gbdevname=$.rtrim($.ltrim($("#gbdevname").val()));
	var gbplatid=$("#gbplatid").val();
	var gbplataddrv4=$("#gbplataddrv4").val();
	var gbplataddrv6=$("#gbplataddrv6").val();
	var gbplatport=$("#gbplatport").val();
	var gbusername=$("#gbusername").val();
	var gbuserpassword=$("#gbuserpassword").val();
	//var gbalarmnum=$("#gbalarmnum").val();
	var gbrelettime=$("#gbrelettime").val();
	var gbheartbeat=$("#gbheartbeat").val();
	//var packtype=$("#packtype").val();
	
	var owner=$("#owner").val();
	var civilcode=$("#civilcode").val();
	var policergn=$("#policergn").val();
	var setupaddress=$("#setupaddress").val();
	var expand=$("#expand").val();
	
	
	
	
	//var Checkencchnstdindex = $("input[name='encchnstdindex']:checked");
	//console.log(Checkencchnstdindex.length)
	//var Checkalarmchnstdindex = $("input[name='alarmchnstdindex']:checked");
	
	if(!CheackServerIDIntNum(localport,'locporttips','MLocalport',Number(localportvaluemin),Number(localportvaluemax)))
	{
	    return;
	}
	if(!CheckLetterNumber(gbnetid,'gbnetidtips','Mgbnetid',0,20))
	{
	    return;
	}
	
	if(!CheckDeviceName(gbdevname, 'gbdevnametips','Mgbdevname',0,32))
	{
	    return;
	}
	if(!CheckLetterNumber(gbplatid,'gbplatidtips','Mgbplatid',0,20))
	{
	    return;
	}
	
	
	if(!CheckIPadd(gbplataddrv4,'gbplataddrv4tips','Mgbplataddrv4'))
	{
	    return;
	}
	
	/*if(!CheckIPadd(gbplataddrv4,'gbplataddrv4tips','jsgbplataddrv4'))
	{
	    return;
	}*/
	
	if(!CheackServerIDIntNum(gbplatport,'gbplatporttips','Mplatport',Number(platportvaluemin),Number(platportvaluemax)))
	{
	    return;
	}
	if(!CheckLetterNumber(gbusername,'gbusernametips','Mgbusername',0,Number(usernamegb28181max)))
	{
	    return;
	}
	
	if(!CheckLetterNumber(gbuserpassword,'gbuserpasswordtips','Mgbuserpassword',0,Number(userpasswordgb28181max)))
	{
	    return;
	}
	
	if(!CheackServerIDIntNum(gbrelettime,'gbrelettimetips','Mgbrelettime',30,999999))
	{
	    return;
	}
	
	if(!CheackServerIDIntNum(gbheartbeat,'gbheartbeattips','Mgbheartbeat',10,1000))
	{
	    return;
	}
	
	if(!CheckEditC(owner,'ownertips','Mownership',64))
	{
	    return;
	}

	if(!CheackIDIntNumgb(civilcode,'civilcodetips','Mcivilcode',0,32))
	{
	    return;
	}
	//if(!CheckEditC(policergn,'policergntips','jspolicergntips',32))
	if(!CheackIDIntNumgb(policergn,'policergntips','Mpolicergn',0,32))
	{
	    return;
	}
	if(!CheckEditC(setupaddress,'setupaddresstips','Msetupaddress',64))
	{
	    return;
	}
	
	if(!CheckEditC(expand,'expandtips','jsexpand',1024))
	{
	    return;
	}
	var g_expand=expand.replace(new RegExp(/(\n)/g),',');
	var _len = $("#TbodyEncchns tr").length; 
	var _lenArmchns = $("#TbodyAlarmchns tr").length;  
	var szXml = "<gb28181info version='1.0' xmlns='http://www.kedacom.com/ver10/XMLSchema'>";
	szXml += "<enable>"+enable+"</enable>";
	szXml += "<localport>"+localport+"</localport>";
	szXml += "<netid>"+gbnetid+"</netid>";
	szXml += "<devname>"+gbdevname+"</devname>";
	szXml += "<platid>"+gbplatid+"</platid>";
	szXml += "<plataddrv4>"+gbplataddrv4+"</plataddrv4>";
	szXml += "<plataddrv6>"+gbplataddrv6+"</plataddrv6>";
	szXml += "<platport>"+gbplatport+"</platport>";
	szXml += "<username>"+gbusername+"</username>";
	szXml += "<userpassword>"+gbuserpassword+"</userpassword>";
	//szXml += "<alarmnum>"+gbalarmnum+"</alarmnum>";
	szXml += "<relettime>"+gbrelettime+"</relettime>";
	szXml += "<heartbeat>"+gbheartbeat+"</heartbeat>";
	
	//<![CDATA[owner]]>
	szXml += "<owner><![CDATA[" + owner + "]]></owner>";
	//szXml += "<owner>"+owner+"</owner>";
	szXml += "<civilcode>"+civilcode+"</civilcode>";
	szXml += "<policergn>"+policergn+"</policergn>";
	szXml += "<setupaddress><![CDATA[" + setupaddress + "]]></setupaddress>";
	szXml += "<expand>"+$.brrtrim(g_expand)+"</expand>";
	szXml += "<encchns size='"+_len+"' >";
		  for (j=1;j<=_len;j++){
			  szXml += "<chn>";
				szXml += "<index>"+j+"</index>";
				szXml += "<id>"+$("#encchnstdid"+j).text()+"</id>";
				szXml += "<name>"+$("#winencchnsname"+j).text()+"</name>";
				szXml += "<streamtype>"+$("#StreamTypenone"+j).text()+"</streamtype>";
			szXml += "</chn>"; 
			}
		szXml += "</encchns>";
			
	
	   	szXml += "<alarmchns size='"+_lenArmchns+"'>";
			  for (var k=1;k<=_lenArmchns;k++){
				  szXml += "<chn>";
					szXml += "<index>"+k+"</index>";
					szXml += "<id>"+$("#alarmchnsid"+k).text()+"</id>";
					szXml += "<name>"+$("#alarmchnsname"+k).text()+"</name>";
				szXml += "</chn>"; 
				}
			szXml += "</alarmchns>";
			
	//szXml += "<packtype>"+packtype+"</packtype>";
 	szXml += "</gb28181info>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+camera_hostname+":"+camera_port+"/kdsapi/network/1/gb28181/"+g_SelectGB28181;
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
						//szRetInfo = m_szSuccessState+"保存成功";
						if (tab=="save")
						{
							szRetInfo=  m_szSuccessState+m_szSuccess1;
							$("#SetResultTipsGb28181").html(szRetInfo);
							setTimeout(function(){$("#SetResultTipsGb28181").html("");},5000);  //5秒后自动清除
						}
						else if (tab=="up")
						{
							if (m_onvif==true)
							{
								$("#mOnvif").click();
								ia(Onvif).update();
							}
							else if(m_vsip==true)
							{
								$("#mVSIP").click();
								ia(VSIP).update();
							}
							else
							{
								$("#aIPAddress").click();
								showmenuconfig("IPAddress","0","FastSetConfig")
							}
							
							
						}
						else if(tab=="down")
						{
							$("#aDeviceInformation").click();
							showmenuconfig("deviceinfo","0","FastSetConfig")
						}
						
					}else{
						szRetInfo=  m_szErrorState+m_szError1;
						$("#SetResultTipsGb28181").html(szRetInfo);
						setTimeout(function(){$("#SetResultTipsGb28181").html("");},5000);  //5秒后自动清除
					}
				});
			  
			
		},error: function(xhr, textStatus, errorThrown)
			{
				ErrStateTips(xhr,obj,"SaveGB28181");
			}
	});
}